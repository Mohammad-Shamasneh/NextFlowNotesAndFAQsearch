import { appendFile } from "node:fs/promises";
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
        "Add new content to the end of an existing Markdown note without replacing its current content.",
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
      const notesFolder = resolve(projectRoot, "notes");
      const notePath = resolve(notesFolder, fileName);

      try {
        await appendFile(notePath, `\n${content.trim()}\n`, {
          encoding: "utf8",
          flag: "a",
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

        return {
          content: [
            {
              type: "text",
              text: `Could not append to the note: ${fileError.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}