import { mkdir, writeFile } from "node:fs/promises";

import type { McpServer } from "@modelcontextprotocol/server";

import {
  NOTES_DIRECTORY,
  resolveSafeNoteTitlePath,
} from "../lib/note-path.js";
import {
  createErrorToolResult,
  createJsonToolResult,
  logToolFailure,
} from "../lib/tool-errors.js";
import { addNoteInputSchema } from "../schemas/add-note.js";

export function registerAddNoteTool(server: McpServer): void {
  server.registerTool(
    "add_note",
    {
      description:
        "Create a new Markdown note inside the local data directory.",
      inputSchema: addNoteInputSchema,
    },
    async ({ title, body }) => {
      try {
        const note = resolveSafeNoteTitlePath(title);

        await mkdir(NOTES_DIRECTORY, { recursive: true });
        await writeFile(note.filePath, `${body}\n`, {
          encoding: "utf8",
          flag: "wx",
        });

        return createJsonToolResult({
          success: true,
          tool: "add_note",
          title,
          fileName: note.fileName,
          path: note.relativePath,
        });
      } catch (error) {
        logToolFailure("add_note", error);
        return createErrorToolResult(error, "Unable to create the note.");
      }
    },
  );
}
