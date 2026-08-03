import { access, appendFile } from "node:fs/promises";
import { relative, resolve } from "node:path";

import type { McpServer } from "@modelcontextprotocol/server";

import { appendNoteInputSchema } from "../schemas/append-note.js";

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

export function registerAppendNoteTool(server: McpServer): void {
  server.registerTool(
    "append_note",
    {
      description:
        "Append new content to an existing Markdown note inside the local data directory without replacing its current content.",
      inputSchema: appendNoteInputSchema,
    },

    async ({ noteName, content }) => {
      if (!content.trim()) {
        return {
          content: [
            {
              type: "text",
              text: "The content to append cannot be empty.",
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
              text: "Invalid note name. Do not use paths such as ../ or /.",
            },
          ],
          isError: true,
        };
      }

      const projectRoot = process.cwd();
      const dataFolder = resolve(projectRoot, "data");
      const notePath = resolve(dataFolder, fileName);

      try {
        // Confirm that the note already exists.
        await access(notePath);

        await appendFile(notePath, `\n${content.trim()}\n`, {
          encoding: "utf8",
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  tool: "append_note",
                  fileName,
                  path: relative(projectRoot, notePath),
                  message: "Content appended successfully.",
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
          `[append_note] Failed to append to "${fileName}": ${fileError.message}`,
        );

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
              text: "Could not append content to the note.",
            },
          ],
          isError: true,
        };
      }
    },
  );
}
