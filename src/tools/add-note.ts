import { mkdir, writeFile } from "node:fs/promises";
import { relative, resolve } from "node:path";

import type { McpServer } from "@modelcontextprotocol/server";

import { addNoteInputSchema } from "../schemas/add-note.js";

/**
 * Convert the note title into a safe Markdown file name.
 */
function createSafeFileName(title: string): string | null {
  const titleWithoutExtension = title
    .trim()
    .replace(/\.md$/i, "");

  // Reject paths such as ../secret or notes/file
  if (
    titleWithoutExtension.includes("..") ||
    titleWithoutExtension.includes("/") ||
    titleWithoutExtension.includes("\\")
  ) {
    return null;
  }

  const safeName = titleWithoutExtension
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

export function registerAddNoteTool(server: McpServer): void {
  server.registerTool(
    "add_note",
    {
      description:
        "Create a new Markdown note inside the local notes directory.",
      inputSchema: addNoteInputSchema,
    },

    async ({ title, body }) => {
      if (!body.trim()) {
        return {
          content: [
            {
              type: "text",
              text: "The note body cannot be empty.",
            },
          ],
          isError: true,
        };
      }

      const fileName = createSafeFileName(title);

      if (!fileName) {
        return {
          content: [
            {
              type: "text",
              text: "Invalid title. Do not use paths such as ../ or / in the title.",
            },
          ],
          isError: true,
        };
      }

      const projectRoot = process.cwd();
      const notesFolder = resolve(projectRoot, "data");
      const notePath = resolve(notesFolder, fileName);

      try {
        // Create notes/ if it does not exist
        await mkdir(notesFolder, {
          recursive: true,
        });

        // wx prevents replacing an existing file
        await writeFile(notePath, `${body.trim()}\n`, {
          encoding: "utf8",
          flag: "wx",
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  tool: "add_note",
                  title,
                  fileName,
                  path: relative(projectRoot, notePath),
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        const fileError = error as NodeJS.ErrnoException;

        console.error(
          `[add_note] Failed to create "${fileName}": ${fileError.message}`,
        );

        if (fileError.code === "EEXIST") {
          return {
            content: [
              {
                type: "text",
                text: `A note named "${fileName}" already exists.`,
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: "text",
              text: "Could not create the note.",
            },
          ],
          isError: true,
        };
      }
    },
  );
}
