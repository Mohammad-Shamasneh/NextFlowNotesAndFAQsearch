import type { McpServer } from "@modelcontextprotocol/server";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { searchNotesInputSchema } from "../schemas/search-notes.js";

type SearchResult = {
  file: string;
  path: string;
  snippet: string;
};

/**
 * Recursively finds all Markdown and text files inside a directory.
 */
async function getNoteFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, {
    withFileTypes: true,
  });

  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      const nestedFiles = await getNoteFiles(fullPath);
      files.push(...nestedFiles);
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();

    if (extension === ".md" || extension === ".txt") {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Creates a short snippet around the first matching query.
 */
function createSnippet(content: string, query: string): string {
  const normalizedContent = content.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  const matchIndex = normalizedContent.indexOf(normalizedQuery);

  if (matchIndex === -1) {
    return "";
  }

  const snippetLength = 180;
  const start = Math.max(0, matchIndex - 60);
  const end = Math.min(
    content.length,
    matchIndex + normalizedQuery.length + snippetLength,
  );

  const snippet = content
    .slice(start, end)
    .replace(/\s+/g, " ")
    .trim();

  return `${start > 0 ? "..." : ""}${snippet}${
    end < content.length ? "..." : ""
  }`;
}

export function registerSearchNotesTool(server: McpServer): void {
  server.registerTool(
    "search_notes",
    {
      description:
        "Search local Markdown and text notes for a keyword or phrase. Returns matching file names, paths, and snippets.",
      inputSchema: searchNotesInputSchema,
    },

    async ({ query, limit }) => {
      const maximumResults = limit ?? 5;

      // Notes are stored in the data directory at the project root.
      const dataDirectory = path.join(process.cwd(), "data");

      try {
        const noteFiles = await getNoteFiles(dataDirectory);
        const results: SearchResult[] = [];

        for (const filePath of noteFiles) {
          const content = await readFile(filePath, "utf-8");

          // Search both the file name and its content.
          const fileNameMatches = path
            .basename(filePath)
            .toLowerCase()
            .includes(query.toLowerCase());

          const contentMatches = content
            .toLowerCase()
            .includes(query.toLowerCase());

          if (!fileNameMatches && !contentMatches) {
            continue;
          }

          results.push({
            file: path.basename(filePath),
            path: path.relative(dataDirectory, filePath),
            snippet:
              createSnippet(content, query) ||
              content.replace(/\s+/g, " ").trim().slice(0, 200),
          });

          if (results.length >= maximumResults) {
            break;
          }
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  query,
                  totalMatches: results.length,
                  results,
                  message:
                    results.length > 0
                      ? `Found ${results.length} matching note(s).`
                      : `No notes were found for "${query}".`,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown search error";

        console.error(
          `[search_notes] Search failed in data directory: ${errorMessage}`,
        );

        return {
          isError: true,
          content: [
            {
              type: "text",
              text: "Unable to search notes.",
            },
          ],
        };
      }
    },
  );
}
