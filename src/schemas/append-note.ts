import { z } from "zod/v4";

import {
  appendContentInputSchema,
  noteNameInputSchema,
} from "./common.js";

export const appendNoteInputSchema = z
  .object({
    noteName: noteNameInputSchema.describe(
      "Name of the Markdown note to append content to",
    ),
    content: appendContentInputSchema.describe(
      "New content to add at the end of the existing note",
    ),
  })
  .strict();
