import { z } from "zod/v4";

export const deleteNoteInputSchema = z.object({
  noteName: z
    .string()
    .min(1)
    .describe("Name of the Markdown note to delete."),
});