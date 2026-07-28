import { z } from "zod/v4";

// Input schema for the add_note tool
export const addNoteInputSchema = z.object({
  title: z
    .string()
    .min(1)
    .describe("Short title used as the note file name stem"),
  body: z
    .string()
    .min(1)
    .describe("Content that will be written inside the note"),
});
