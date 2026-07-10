import { prisma } from "../config/db.js";

const getAllNotes = async (req, res) => {
    const notes = await prisma.note.findMany({
        where: { userId: req.user.id },
      });
      res.status(200).json({ status: "success", data: notes });
};

const getNoteById = async (req, res) => {
    try {
        const note = await prisma.note.findUnique({
            where: { id: req.params.id, userId: req.user.id },
          });
          res.status(200).json({ status: "success", data: note }); 
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
 
};

const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const note = await prisma.note.create({
          data: { title, content, userId: req.user.id },
        });
        res.status(201).json({ status: "success", data: note });  
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
 
};

const updateNote = async (req, res) => {
  try {
    const note = await prisma.note.update({
      where: { id: req.params.id, userId: req.user.id },
      data: req.body,
    });
    res.status(200).json({ status: "success", data: note });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export default { getAllNotes, getNoteById, createNote, updateNote };
