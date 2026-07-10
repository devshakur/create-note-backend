import express from "express";
import notesController from "../controllers/notesController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateMiddleware } from "../middlewares/validateMiddleware.js";
import { createNoteSchema, updateNoteSchema } from "../validators/notesValidator.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/all-notes", notesController.getAllNotes);
router.get("/note/:id", notesController.getNoteById);
router.post("/create-note", validateMiddleware(createNoteSchema), notesController.createNote);
router.put("/update-note/:id", validateMiddleware(updateNoteSchema), notesController.updateNote);
router.delete("/delete-note/:id", notesController.deleteNote);

export default router;
