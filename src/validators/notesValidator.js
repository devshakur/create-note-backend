import { z } from "zod";

export const createNoteSchema = z.object({
    // id: z.string().uuid('Invalid id'),
    title: z.string("Title is required"),
    content: z.string("Content is required"),
}).strict();