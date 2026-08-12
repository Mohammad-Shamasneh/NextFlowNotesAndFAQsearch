import { appendFile } from "node:fs/promises";

import type { McpServer } from "@modelcontextprotocol/server";

import { getExistingNote } from "../lib/notes.js";
import { MAX_NOTE_FILE_BYTES } from "../lib/security-limits.js";
import {
  createErrorToolResult,
  createJsonToolResult,
  logToolFailure,
  SafeToolError,
} from "../lib/tool-errors.js";
import { appendNoteInputSchema } from "../schemas/append-note.js";

export function registerAppendNoteTool(server: McpServer): void {
  server.registerTool(
    "append_note",
    {
      description:
        "Append content to an existing Markdown note in the local data directory.",
      inputSchema: appendNoteInputSchema,
    },
    async ({ noteName, content }) => {
      try {
        const note = await getExistingNote(noteName);
        const appendedText = `\n${content}\n`;

        if (
          note.size + Buffer.byteLength(appendedText, "utf8") >
          MAX_NOTE_FILE_BYTES
        ) {
          throw new SafeToolError(
            "NOTE_FILE_TOO_LARGE",
            "Appending this content would exceed the allowed note size.",
          );
        }

        await appendFile(note.filePath, appendedText, { encoding: "utf8" });

        return createJsonToolResult({
          success: true,
          tool: "append_note",
          fileName: note.fileName,
          path: note.relativePath,
          message: "Content appended successfully.",
        });
      } catch (error) {
        logToolFailure("append_note", error);
        return createErrorToolResult(error, "Unable to append to the note.");
      }
    },
  );
}
