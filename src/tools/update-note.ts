import { writeFile } from "node:fs/promises";
import { relative, resolve } from "node:path";

import type { McpServer } from "@modelcontextprotocol/server";

import { updateNoteInputSchema } from "../schemas/update-note.js";

/**
 * Validate and normalize the requested Markdown file name.
 */
function createSafeFileName(noteName: string): string | null {
  const normalizedName = noteName.trim();

  // Reject paths such as ../secret or notes/file
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

export function registerUpdateNoteTool(server: McpServer): void {
  server.registerTool(
    "update_note",
    {
      description:
        "Update the complete content of an existing Markdown note in the local notes directory.",
      inputSchema: updateNoteInputSchema,
    },

    async ({ noteName, newContent }) => {
      if (!newContent.trim()) {
        return {
          content: [
            {
              type: "text",
              text: "The new note content cannot be empty.",
            },
          ],
          isError: true,
        };
      }

      const fileName = createSafeFileName(noteName);

      if (!fileName) {
        return {
          content: [
            {
              type: "text",
              text: "Invalid note name. Do not use paths such as ../ or / in the note name.",
            },
          ],
          isError: true,
        };
      }

      const projectRoot = process.cwd();
      const notesFolder = resolve(projectRoot, "notes");
      const notePath = resolve(notesFolder, fileName);

      try {
        // r+ prevents creating a new file if the note does not exist
        await writeFile(notePath, `${newContent.trim()}\n`, {
          encoding: "utf8",
          flag: "r+",
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  tool: "update_note",
                  noteName,
                  fileName,
                  path: relative(projectRoot, notePath),
                  message: "Note updated successfully.",
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
              text: `Could not update the note: ${fileError.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}