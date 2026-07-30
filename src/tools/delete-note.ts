import { unlink } from "node:fs/promises";
import { relative, resolve } from "node:path";

import type { McpServer } from "@modelcontextprotocol/server";

import { deleteNoteInputSchema } from "../schemas/delete-note.js";

function createSafeFileName(noteName: string): string | null {
  const normalizedName = noteName.trim();

  if (
    normalizedName.includes("..") ||
    normalizedName.includes("/") ||
    normalizedName.includes("\\")
  ) {
    return null;
  }

  const nameWithoutExtension = normalizedName.replace(/\.md$/i, "");

  const safeName = nameWithoutExtension
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}_-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "");

  if (!safeName) {
    return null;
  }

  return `${safeName}.md`;
}

export function registerDeleteNoteTool(server: McpServer): void {
  server.registerTool(
    "delete_note",
    {
      description:
        "Permanently delete an existing Markdown note from the local notes directory. Use only when the user explicitly asks to delete a note.",
      inputSchema: deleteNoteInputSchema,
    },

    async ({ noteName }) => {
      const fileName = createSafeFileName(noteName);

      if (!fileName) {
        return {
          content: [
            {
              type: "text",
              text: "Invalid note name. Do not use paths such as ../ or /.",
            },
          ],
          isError: true,
        };
      }

      const projectRoot = process.cwd();
      const notesFolder = resolve(projectRoot, "notes");
      const notePath = resolve(notesFolder, fileName);

      try {
        await unlink(notePath);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  tool: "delete_note",
                  fileName,
                  path: relative(projectRoot, notePath),
                  message: "Note deleted successfully.",
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        const fileError = error as NodeJS.ErrnoException;

        if (fileError.code === "ENOENT") {
          return {
            content: [
              {
                type: "text",
                text: `The note "${fileName}" does not exist.`,
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `Could not delete the note: ${fileError.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}