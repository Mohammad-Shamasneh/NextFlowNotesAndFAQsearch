import { z } from "zod/v4";

export const updateNoteInputSchema = z.object({
  noteName: z
    .string()
    .min(1)
    .describe("Name of the Markdown note to update."),

  newContent: z
    .string()
    .min(1)
    .describe("New content that will replace the current note content."),
});