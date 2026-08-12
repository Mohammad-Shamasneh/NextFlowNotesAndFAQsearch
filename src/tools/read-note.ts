import type { McpServer } from "@modelcontextprotocol/server";

import { readNote } from "../lib/notes.js";
import {
  createErrorToolResult,
  createJsonToolResult,
  logToolFailure,
} from "../lib/tool-errors.js";
import { readNoteInputSchema } from "../schemas/read-note.js";

export function registerReadNoteTool(server: McpServer): void {
  server.registerTool(
    "read_note",
    {
      description:
        "Read the content of a Markdown note from the local data directory.",
      inputSchema: readNoteInputSchema,
    },
    async ({ noteName }) => {
      try {
        const note = await readNote(noteName);

        return createJsonToolResult({
          success: true,
          tool: "read_note",
          fileName: note.fileName,
          path: note.relativePath,
          content: note.content,
        });
      } catch (error) {
        logToolFailure("read_note", error);
        return createErrorToolResult(error, "Unable to read the note.");
      }
    },
  );
}
