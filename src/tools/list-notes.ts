import type { McpServer } from "@modelcontextprotocol/server";

import { loadNotes } from "../lib/notes.js";
import { listNotesInputSchema } from "../schemas/list-notes.js";

export function registerListNotesTool(server: McpServer): void {
  server.registerTool(
    "list_notes",
    {
      description:
        "List available local Markdown and text notes from the data directory.",
      inputSchema: listNotesInputSchema,
    },

    async () => {
      try {
        const files = await loadNotes();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  tool: "list_notes",
                  count: files.length,
                  files: files.slice(0, 10),
                  message:
                    files.length > 0
                      ? `Found ${files.length} note file(s).`
                      : "No note files were found.",
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Unknown file-system error";

        console.error(
          `[list_notes] Failed to list notes: ${errorMessage}`,
        );

        return {
          content: [
            {
              type: "text",
              text: "Could not list notes.",
            },
          ],
          isError: true,
        };
      }
    },
  );
}