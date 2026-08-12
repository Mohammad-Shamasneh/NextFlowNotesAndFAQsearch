import { z } from "zod/v4";

import {
  noteContentInputSchema,
  noteNameInputSchema,
} from "./common.js";

export const updateNoteInputSchema = z
  .object({
    noteName: noteNameInputSchema.describe(
      "Name of the Markdown note to update",
    ),
    newContent: noteContentInputSchema.describe(
      "New content that will replace the current note content",
    ),
  })
  .strict();
