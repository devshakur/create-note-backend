import { prisma } from "../config/db.js";
import { asyncHandler, AppError } from "../middlewares/errorHandler.js";

const getAllNotes = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const skip = (page - 1) * limit;

  const [notes, total] = await Promise.all([
    prisma.note.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.note.count({ where: { userId: req.user.id } }),
  ]);

  res.status(200).json({
    status: "success",
    results: notes.length,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
    data: notes,
  });
});

const getNoteById = asyncHandler(async (req, res) => {
  const note = await prisma.note.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
  });

  if (!note) {
    throw new AppError("Note not found", 404);
  }

  res.status(200).json({ status: "success", data: note });
});

const createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const note = await prisma.note.create({
    data: {
      title,
      content,
      userId: req.user.id,
    },
  });

  res.status(201).json({ status: "success", data: note });
});

const updateNote = asyncHandler(async (req, res) => {
  const existing = await prisma.note.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
  });

  if (!existing) {
    throw new AppError("Note not found", 404);
  }

  const note = await prisma.note.update({
    where: { id: existing.id },
    data: {
      ...(req.body.title !== undefined && { title: req.body.title }),
      ...(req.body.content !== undefined && { content: req.body.content }),
    },
  });

  res.status(200).json({ status: "success", data: note });
});

const deleteNote = asyncHandler(async (req, res) => {
  const existing = await prisma.note.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
  });

  if (!existing) {
    throw new AppError("Note not found", 404);
  }

  await prisma.note.delete({ where: { id: existing.id } });

  res.status(200).json({ status: "success", message: "Note deleted successfully" });
});

export default { getAllNotes, getNoteById, createNote, updateNote, deleteNote };
