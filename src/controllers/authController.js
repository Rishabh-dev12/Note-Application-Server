import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const userRole = role || "viewer";

  const hashed = await bcrypt.hash(password, 10);

  const user = await pool.query(
    "INSERT INTO users VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [uuidv4(), name, email, hashed, userRole, new Date().toISOString()],
  );

  res.json(user.rows[0]);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query("SELECT * FROM users WHERE email=$1", [email]);

  if (!user.rows.length) return res.status(400).json({ msg: "User not found" });

  const valid = await bcrypt.compare(password, user.rows[0].password);

  if (!valid) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign(user.rows[0], "secret");

  res.json({ token });
};

export const logout = async (req, res) => {
  res.json({ msg: "Logged out successfully" });
};

