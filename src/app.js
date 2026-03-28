import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { socketHandler } from "./sockets/index.js";
import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

socketHandler(io);

app.use("/", authRoutes);
app.use("/", notesRoutes);

server.listen(5000, () => console.log("Server running"));
