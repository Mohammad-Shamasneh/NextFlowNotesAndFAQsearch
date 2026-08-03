import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export type NoteSummary = {
  fileName: string;
  relativePath: string;
};

export type NoteSearchResult = {
  fileName: string;
  relativePath: string;
  snippet: string;
};

const DATA_DIRECTORY = path.resolve(process.cwd(), "data");

async function findNoteFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, {
    withFileTypes: true,
  });

  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findNoteFiles(fullPath)));
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();

    if (extension === ".md" || extension === ".txt") {
      files.push(fullPath);
    }
  }

  return files;
}

function createSnippet(content: string, query: string): string {
  const normalizedContent = content.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  const matchIndex = normalizedContent.indexOf(normalizedQuery);

  if (matchIndex === -1) {
    return content.replace(/\s+/g, " ").trim().slice(0, 200);
  }

  const start = Math.max(0, matchIndex - 60);
  const end = Math.min(
    content.length,
    matchIndex + normalizedQuery.length + 180,
  );

  const snippet = content
    .slice(start, end)
    .replace(/\s+/g, " ")
    .trim();

  return `${start > 0 ? "..." : ""}${snippet}${
    end < content.length ? "..." : ""
  }`;
}

export async function loadNotes(): Promise<NoteSummary[]> {
  const files = await findNoteFiles(DATA_DIRECTORY);

  return files
    .map((filePath) => ({
      fileName: path.basename(filePath),
      relativePath: path.relative(DATA_DIRECTORY, filePath),
    }))
    .sort((a, b) => a.fileName.localeCompare(b.fileName));
}

export async function searchNotes(
  query: string,
  limit = 5,
): Promise<NoteSearchResult[]> {
  const files = await findNoteFiles(DATA_DIRECTORY);
  const normalizedQuery = query.toLowerCase();
  const results: NoteSearchResult[] = [];

  for (const filePath of files) {
    const content = await readFile(filePath, "utf8");

    const fileNameMatches = path
      .basename(filePath)
      .toLowerCase()
      .includes(normalizedQuery);

    const contentMatches = content
      .toLowerCase()
      .includes(normalizedQuery);

    if (!fileNameMatches && !contentMatches) {
      continue;
    }

    results.push({
      fileName: path.basename(filePath),
      relativePath: path.relative(DATA_DIRECTORY, filePath),
      snippet: createSnippet(content, query),
    });

    if (results.length >= limit) {
      break;
    }
  }

  return results;
}

export async function readNote(noteName: string): Promise<{
  fileName: string;
  relativePath: string;
  content: string;
}> {
  const safeFileName = path.basename(noteName);
  const notePath = path.resolve(DATA_DIRECTORY, safeFileName);
  const relativePath = path.relative(DATA_DIRECTORY, notePath);

  if (
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error("Unsafe note path.");
  }

  const content = await readFile(notePath, "utf8");

  return {
    fileName: safeFileName,
    relativePath,
    content,
  };
}