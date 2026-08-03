import type { McpServer } from "@modelcontextprotocol/server";

import { searchNotes } from "../lib/notes.js";
import { searchNotesInputSchema } from "../schemas/search-notes.js";

export function registerSearchNotesTool(server: McpServer): void {
  server.registerTool(
    "search_notes",
    {
      description:
        "Search local Markdown and text notes for a keyword or phrase. Returns matching file names, paths, and snippets.",
      inputSchema: searchNotesInputSchema,
    },

    async ({ query, limit }) => {
      try {
        const maximumResults = limit ?? 5;
        const results = await searchNotes(query, maximumResults);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  query,
                  totalMatches: results.length,
                  results,
                  message:
                    results.length > 0
                      ? `Found ${results.length} matching note(s).`
                      : `No notes were found for "${query}".`,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown search error";

        console.error(
          `[search_notes] Search failed: ${errorMessage}`,
        );

        return {
          isError: true,
          content: [
            {
              type: "text",
              text: "Unable to search notes.",
            },
          ],
        };
      }
    },
  );
}