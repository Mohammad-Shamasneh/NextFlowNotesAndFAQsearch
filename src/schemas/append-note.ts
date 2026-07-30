import { z } from "zod/v4";

export const appendNoteInputSchema = z.object({
  noteName: z
    .string()
    .min(1)
    .describe("Name of the Markdown note to append content to."),

  content: z
    .string()
    .min(1)
    .describe("New content to add at the end of the existing note."),
});