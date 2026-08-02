import { readdir } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";

import type { McpServer } from "@modelcontextprotocol/server";

import { listNotesInputSchema } from "../schemas/list-notes.js";

export function registerListNotesTool(server: McpServer): void {
  server.registerTool(
    "list_notes",
    {
      description:
        "List available local Markdown and text notes inside the data directory.",
      inputSchema: listNotesInputSchema,
    },

    async ({ folder }) => {
      const projectRoot = process.cwd();
      const dataRoot = resolve(projectRoot, "data");

      // If the user does not provide a folder, use data/
      const requestedFolder = folder ?? "data";
      const targetFolder = resolve(projectRoot, requestedFolder);

      // Prevent access outside data/
      const pathFromDataRoot = relative(dataRoot, targetFolder);

      const isOutsideData =
        pathFromDataRoot === ".." ||
        pathFromDataRoot.startsWith(`..${sep}`) ||
        isAbsolute(pathFromDataRoot);

      if (isOutsideData) {
        return {
          content: [
            {
              type: "text",
              text: "The folder must be inside the data directory.",
            },
          ],
          isError: true,
        };
      }

      try {
        const entries = await readdir(targetFolder, {
          withFileTypes: true,
        });

        const files = entries
          .filter((entry) => {
            const fileName = entry.name.toLowerCase();

            return (
              entry.isFile() &&
              (fileName.endsWith(".md") || fileName.endsWith(".txt"))
            );
          })
          .map((entry) => ({
            name: entry.name,
            path: relative(
              projectRoot,
              resolve(targetFolder, entry.name),
            ),
          }))
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
                  message:
                    files.length > 0
                      ? `Found ${files.length} note file(s).`
                      : "No note files were found.",
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Unknown file-system error";

        console.error(
          `[list_notes] Failed to list notes: ${errorMessage}`,
        );

        return {
          content: [
            {
              type: "text",
              text: "Could not list notes.",
            },
          ],
          isError: true,
        };
      }
    },
  );
}
