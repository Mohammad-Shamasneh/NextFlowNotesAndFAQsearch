import { z } from "zod/v4";

import { noteNameInputSchema } from "./common.js";

export const deleteNoteInputSchema = z
  .object({
    noteName: noteNameInputSchema.describe(
      "Name of the Markdown note to delete",
    ),
  })
  .strict();
