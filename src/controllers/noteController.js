import { pool } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const createNote = async (req, res) => {
  const { title, content } = req.body;

  const note = await pool.query(
    "INSERT INTO notes (id, title, content, owner_id) VALUES ($1,$2,$3,$4) RETURNING *",
    [uuidv4(), title, content, req.user.id]
  );

  res.json(note.rows[0]);
};

export const getNotes = async (req, res) => {
  const { search } = req.body;

  try {
    let query = `
      SELECT n.*, u.name AS owner_name 
      FROM notes n 
      JOIN users u ON n.owner_id = u.id
    `;
    let params = [];

    if (search) {
      query += ` WHERE n.title ILIKE $1 OR n.content ILIKE $1`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY n.created_at DESC`;

    const notes = await pool.query(query, params);
    res.json(notes.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const { role, id: userId } = req.user;

  try {
    let query;
    let params;

    if (role === "admin") {
      query = "UPDATE notes SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *";
      params = [title, content, id];
    } else {
      query = "UPDATE notes SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND owner_id = $4 RETURNING *";
      params = [title, content, id, userId];
    }

    const updatedNote = await pool.query(query, params);

    if (updatedNote.rowCount === 0) {
      return res.status(404).json({ msg: "Note not found or unauthorized" });
    }

    res.json(updatedNote.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteNote = async (req, res) => {
  const { id } = req.params;
  const { role, id: userId } = req.user;

  try {
    let query;
    let params;

    if (role === "admin") {
      query = "DELETE FROM notes WHERE id = $1 RETURNING *";
      params = [id];
    } else {
      query = "DELETE FROM notes WHERE id = $1 AND owner_id = $2 RETURNING *";
      params = [id, userId];
    }

    const deletedNote = await pool.query(query, params);

    if (deletedNote.rowCount === 0) {
      return res.status(404).json({ msg: "Note not found or unauthorized" });
    }

    res.json({ msg: "Note deleted successfully", note: deletedNote.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};