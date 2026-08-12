import { z } from "zod/v4";

export const listNotesInputSchema = z
  .object({
    folder: z
      .enum(["data"])
      .optional()
      .describe("Allowed local note folder (default: data)"),
  })
  .strict();
