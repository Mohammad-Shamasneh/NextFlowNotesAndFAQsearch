import { readdir } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";

import type { McpServer } from "@modelcontextprotocol/server";

import { listNotesInputSchema } from "../schemas/list-notes.js";

export function registerListNotesTool(server: McpServer): void {
  server.registerTool(
    "list_notes",
    {
      description:
        "List available local Markdown and text notes inside the notes folder.",
      inputSchema: listNotesInputSchema,
    },

    async ({ folder }) => {
      const projectRoot = process.cwd();
      const notesRoot = resolve(projectRoot, "data");

      // If the user does not provide a folder, use notes/
      const requestedFolder = folder ?? "notes";
      const targetFolder = resolve(projectRoot, requestedFolder);

      // Prevent access outside notes/
      const pathFromNotesRoot = relative(notesRoot, targetFolder);

      const isOutsideNotes =
        pathFromNotesRoot === ".." ||
        pathFromNotesRoot.startsWith(`..${sep}`) ||
        isAbsolute(pathFromNotesRoot);

      if (isOutsideNotes) {
        return {
          content: [
            {
              type: "text",
              text: "The folder must be inside the notes directory.",
            },
          ],
          isError: true,
        };
      }

      try {
        // Read the folder
        const entries = await readdir(targetFolder, {
          withFileTypes: true,
        });

        // Keep only .md and .txt files
        const files = entries
          .filter((entry) => {
            const fileName = entry.name.toLowerCase();

            return (
              entry.isFile() &&
              (fileName.endsWith(".md") || fileName.endsWith(".txt"))
            );
          })
          .map((entry) => {
            return {
              name: entry.name,
              path: relative(
                projectRoot,
                resolve(targetFolder, entry.name),
              ),
            };
          })
          .sort((first, second) =>
            first.name.localeCompare(second.name),
          );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  tool: "list_notes",
                  folder: relative(projectRoot, targetFolder),
                  count: files.length,
                  files,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unknown file-system error";

        return {
          content: [
            {
              type: "text",
              text: `Could not list notes: ${message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
