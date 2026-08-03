import * as z from "zod/v4";

export const noteFileSchema = z.object({
  fileName: z
    .string()
    .min(1)
    .max(200)
    .describe("Name of the Markdown note file"),

  content: z
    .string()
    .max(100_000)
    .describe("Markdown content read from the note file"),
});