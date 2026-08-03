import type { McpServer } from "@modelcontextprotocol/server";

import { readNote } from "../lib/notes.js";
import { readNoteInputSchema } from "../schemas/read-note.js";

export function registerReadNoteTool(server: McpServer): void {
  server.registerTool(
    "read_note",
    {
      description:
        "Read the complete content of a Markdown note from the local data directory.",
      inputSchema: readNoteInputSchema,
    },

    async ({ noteName }) => {
      try {
        const note = await readNote(noteName);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  tool: "read_note",
                  fileName: note.fileName,
                  path: note.relativePath,
                  content: note.content,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        console.error(
          `[read_note] Failed to read "${noteName}": ${errorMessage}`,
        );

        return {
          isError: true,
          content: [
            {
              type: "text",
              text: errorMessage.includes("does not exist")
                ? errorMessage
                : "Could not read the note.",
            },
          ],
        };
      }
    },
  );
}
