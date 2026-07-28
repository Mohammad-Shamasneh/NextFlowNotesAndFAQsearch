import { z } from "zod/v4";

// Input schema for the list_notes tool
export const listNotesInputSchema = z.object({
  folder: z
    .string()
    .min(1)
    .optional()
    .describe("Relative folder to list (default: notes)"),
});
