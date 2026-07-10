import { z } from "zod";

export const createNoteSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(200, "Title is too long"),
    content: z.string().trim().min(1, "Content is required").max(10000, "Content is too long"),
  })
  .strict();

export const updateNoteSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(200, "Title is too long").optional(),
    content: z
      .string()
      .trim()
      .min(1, "Content is required")
      .max(10000, "Content is too long")
      .optional(),
  })
  .strict()
  .refine((data) => data.title !== undefined || data.content !== undefined, {
    message: "At least one of title or content is required",
  });
