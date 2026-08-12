import type { McpServer } from "@modelcontextprotocol/server";

import { loadNotes } from "../lib/notes.js";
import { MAX_LISTED_NOTES } from "../lib/security-limits.js";
import {
  createErrorToolResult,
  createJsonToolResult,
  logToolFailure,
} from "../lib/tool-errors.js";
import { listNotesInputSchema } from "../schemas/list-notes.js";

export function registerListNotesTool(server: McpServer): void {
  server.registerTool(
    "list_notes",
    {
      description:
        "List available local Markdown notes from the data directory.",
      inputSchema: listNotesInputSchema,
    },
    async () => {
      try {
        const files = await loadNotes();
        const listedFiles = files.slice(0, MAX_LISTED_NOTES);

        return createJsonToolResult({
          tool: "list_notes",
          count: files.length,
          files: listedFiles,
          truncated: files.length > listedFiles.length,
          message:
            files.length > 0
              ? `Found ${files.length} note file(s).`
              : "No note files were found.",
        });
      } catch (error) {
        logToolFailure("list_notes", error);
        return createErrorToolResult(error, "Unable to list notes.");
      }
    },
  );
}
