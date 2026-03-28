import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./config/db.js";
import { socketHandler } from "./sockets/index.js";
import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "https://note-application-client.vercel.app",
    credentials: true,
  }),
);

app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://note-application-client.vercel.app",
  },
});

socketHandler(io);

app.use("/", authRoutes);
app.use("/", notesRoutes);

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Database connected & tables ready");
  } catch (err) {
    console.error("DB Error", err);
  }
};

const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initDB();
});
