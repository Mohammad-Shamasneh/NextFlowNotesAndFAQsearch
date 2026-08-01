import { readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";

import type { McpServer } from "@modelcontextprotocol/server";

import { readNoteInputSchema } from "../schemas/read-note.js";

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

export function registerReadNoteTool(server: McpServer): void {
  server.registerTool(
    "read_note",
    {
      description:
        "Read the complete content of a Markdown note from the local notes directory.",
      inputSchema: readNoteInputSchema,
    },

    async ({ noteName }) => {
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
      const notesFolder = resolve(projectRoot, "data");
      const notePath = resolve(notesFolder, fileName);

      try {
        const noteContent = await readFile(notePath, {
          encoding: "utf8",
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  tool: "read_note",
                  noteName,
                  fileName,
                  path: relative(projectRoot, notePath),
                  content: noteContent,
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
              text: `Could not read the note: ${fileError.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}