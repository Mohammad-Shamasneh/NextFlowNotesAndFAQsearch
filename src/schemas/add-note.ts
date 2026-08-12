import { z } from "zod/v4";

import {
  noteContentInputSchema,
  noteTitleInputSchema,
} from "./common.js";

export const addNoteInputSchema = z
  .object({
    title: noteTitleInputSchema.describe(
      "Short title used as the Markdown note file name stem",
    ),
    body: noteContentInputSchema.describe(
      "Content that will be written inside the note",
    ),
  })
  .strict();
