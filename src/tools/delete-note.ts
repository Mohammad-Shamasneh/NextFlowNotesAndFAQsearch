import { unlink } from "node:fs/promises";

import type { McpServer } from "@modelcontextprotocol/server";

import { getExistingNote } from "../lib/notes.js";
import {
  createErrorToolResult,
  createJsonToolResult,
  logToolFailure,
} from "../lib/tool-errors.js";
import { deleteNoteInputSchema } from "../schemas/delete-note.js";

export function registerDeleteNoteTool(server: McpServer): void {
  server.registerTool(
    "delete_note",
    {
      description:
        "Permanently delete an existing Markdown note from the local data directory. Use only when the user explicitly asks to delete a note.",
      inputSchema: deleteNoteInputSchema,
    },
    async ({ noteName }) => {
      try {
        const note = await getExistingNote(noteName);
        await unlink(note.filePath);

        return createJsonToolResult({
          success: true,
          tool: "delete_note",
          fileName: note.fileName,
          path: note.relativePath,
          message: "Note deleted successfully.",
        });
      } catch (error) {
        logToolFailure("delete_note", error);
        return createErrorToolResult(error, "Unable to delete the note.");
      }
    },
  );
}
