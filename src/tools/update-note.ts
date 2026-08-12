import { open } from "node:fs/promises";

import type { McpServer } from "@modelcontextprotocol/server";

import { getExistingNote } from "../lib/notes.js";
import {
  createErrorToolResult,
  createJsonToolResult,
  logToolFailure,
} from "../lib/tool-errors.js";
import { updateNoteInputSchema } from "../schemas/update-note.js";

export function registerUpdateNoteTool(server: McpServer): void {
  server.registerTool(
    "update_note",
    {
      description:
        "Replace the content of an existing Markdown note in the local data directory.",
      inputSchema: updateNoteInputSchema,
    },
    async ({ noteName, newContent }) => {
      try {
        const note = await getExistingNote(noteName);
        const noteHandle = await open(note.filePath, "r+");

        try {
          await noteHandle.truncate(0);
          await noteHandle.writeFile(`${newContent}\n`, "utf8");
        } finally {
          await noteHandle.close();
        }

        return createJsonToolResult({
          success: true,
          tool: "update_note",
          noteName,
          fileName: note.fileName,
          path: note.relativePath,
          message: "Note updated successfully.",
        });
      } catch (error) {
        logToolFailure("update_note", error);
        return createErrorToolResult(error, "Unable to update the note.");
      }
    },
  );
}
