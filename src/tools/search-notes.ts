import type { McpServer } from "@modelcontextprotocol/server";

import { searchNotes } from "../lib/notes.js";
import { DEFAULT_SEARCH_RESULT_LIMIT } from "../lib/security-limits.js";
import {
  createErrorToolResult,
  createJsonToolResult,
  logToolFailure,
} from "../lib/tool-errors.js";
import { searchNotesInputSchema } from "../schemas/search-notes.js";

export function registerSearchNotesTool(server: McpServer): void {
  server.registerTool(
    "search_notes",
    {
      description:
        "Search local Markdown notes for a keyword or phrase. Returns matching file names, paths, and bounded snippets.",
      inputSchema: searchNotesInputSchema,
    },
    async ({ query, limit }) => {
      try {
        const results = await searchNotes(
          query,
          limit ?? DEFAULT_SEARCH_RESULT_LIMIT,
        );

        return createJsonToolResult({
          query,
          totalMatches: results.length,
          results,
          message:
            results.length > 0
              ? `Found ${results.length} matching note(s).`
              : `No notes were found for "${query}".`,
        });
      } catch (error) {
        logToolFailure("search_notes", error);
        return createErrorToolResult(error, "Unable to search notes.");
      }
    },
  );
}
