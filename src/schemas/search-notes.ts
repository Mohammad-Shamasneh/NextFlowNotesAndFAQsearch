import { z } from "zod/v4";

import {
  MAX_SEARCH_QUERY_LENGTH,
  MAX_SEARCH_RESULT_LIMIT,
} from "../lib/security-limits.js";

export const searchNotesInputSchema = z
  .object({
    query: z
      .string()
      .trim()
      .min(1, "Search query is required.")
      .max(MAX_SEARCH_QUERY_LENGTH, "Search query is too long.")
      .refine(
        (query) => !/[\u0000-\u001f\u007f]/u.test(query),
        "Search query contains unsupported control characters.",
      )
      .describe("Keyword or phrase to search for inside Markdown notes"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(MAX_SEARCH_RESULT_LIMIT)
      .optional()
      .describe("Maximum number of matching snippets to return (default 5)"),
  })
  .strict();
