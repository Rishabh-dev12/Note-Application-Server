import express from "express";
import { createNote, getNotes, updateNote, deleteNote } from "../controllers/noteController.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/createNote", verifyToken, authorizeRoles("admin", "editor"), createNote);
router.post("/getNotes", getNotes);
router.post("/updateNote/:id", verifyToken, authorizeRoles("admin", "editor"), updateNote);
router.post("/deleteNote/:id", verifyToken, authorizeRoles("admin", "editor"), deleteNote);

export default router;
