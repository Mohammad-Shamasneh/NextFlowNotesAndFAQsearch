import { z } from "zod/v4";

import {
  MAX_NOTE_CONTENT_LENGTH,
  MAX_NOTE_NAME_LENGTH,
} from "../lib/security-limits.js";

export const noteFileSchema = z
  .object({
    fileName: z
      .string()
      .trim()
      .min(1)
      .max(MAX_NOTE_NAME_LENGTH)
      .endsWith(".md")
      .describe("Name of the Markdown note file"),
    content: z
      .string()
      .max(MAX_NOTE_CONTENT_LENGTH)
      .describe("Markdown content read from the note file"),
  })
  .strict();
