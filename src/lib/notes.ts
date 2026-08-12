import { lstat, opendir, readFile } from "node:fs/promises";
import path from "node:path";

import {
  NOTES_DIRECTORY,
  resolveSafeNotePath,
} from "./note-path.js";
import {
  MAX_DIRECTORY_ENTRIES,
  MAX_NOTE_CONTENT_LENGTH,
  MAX_NOTE_FILE_BYTES,
  MAX_SCANNED_NOTES,
  MAX_TOTAL_SEARCH_BYTES,
} from "./security-limits.js";
import { SafeToolError } from "./tool-errors.js";

export type NoteSummary = {
  fileName: string;
  relativePath: string;
};

export type NoteSearchResult = {
  fileName: string;
  relativePath: string;
  snippet: string;
};

export type ExistingNote = {
  fileName: string;
  filePath: string;
  relativePath: string;
  size: number;
};

async function findNoteFiles(
  directory = NOTES_DIRECTORY,
): Promise<ExistingNote[]> {
  const files: ExistingNote[] = [];
  let entryCount = 0;
  const directoryHandle = await opendir(directory);

  for await (const entry of directoryHandle) {
    entryCount += 1;

    if (entryCount > MAX_DIRECTORY_ENTRIES) {
      throw new SafeToolError(
        "DIRECTORY_ENTRY_LIMIT_EXCEEDED",
        "The notes directory contains too many entries to process safely.",
      );
    }

    if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== ".md") {
      continue;
    }

    const note = await getExistingNote(entry.name, directory);
    files.push(note);

    if (files.length > MAX_SCANNED_NOTES) {
      throw new SafeToolError(
        "NOTE_SCAN_LIMIT_EXCEEDED",
        "There are too many notes to process safely.",
      );
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

export async function getExistingNote(
  noteName: string,
  notesDirectory = NOTES_DIRECTORY,
): Promise<ExistingNote> {
  const safePath = resolveSafeNotePath(noteName, notesDirectory);

  let fileStats;

  try {
    fileStats = await lstat(safePath.filePath);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      throw new SafeToolError("NOTE_NOT_FOUND", "Note not found.");
    }

    throw error;
  }

  if (!fileStats.isFile() || fileStats.isSymbolicLink()) {
    throw new SafeToolError(
      "NOTE_TYPE_NOT_ALLOWED",
      "The requested note is not an allowed file.",
    );
  }

  return {
    ...safePath,
    size: fileStats.size,
  };
}

export async function readExistingNote(note: ExistingNote): Promise<string> {
  if (note.size > MAX_NOTE_FILE_BYTES) {
    throw new SafeToolError(
      "NOTE_FILE_TOO_LARGE",
      "The note exceeds the allowed size.",
    );
  }

  const content = await readFile(note.filePath, "utf8");

  if (
    content.length > MAX_NOTE_CONTENT_LENGTH ||
    Buffer.byteLength(content, "utf8") > MAX_NOTE_FILE_BYTES
  ) {
    throw new SafeToolError(
      "NOTE_FILE_TOO_LARGE",
      "The note exceeds the allowed size.",
    );
  }

  return content;
}

export async function loadNotes(): Promise<NoteSummary[]> {
  const files = await findNoteFiles();

  return files
    .map(({ fileName, relativePath }) => ({ fileName, relativePath }))
    .sort((a, b) => a.fileName.localeCompare(b.fileName));
}

export async function searchNotes(
  query: string,
  limit: number,
): Promise<NoteSearchResult[]> {
  const files = await findNoteFiles();
  const normalizedQuery = query.toLowerCase();
  const results: NoteSearchResult[] = [];
  let searchedBytes = 0;

  for (const note of files) {
    searchedBytes += note.size;

    if (searchedBytes > MAX_TOTAL_SEARCH_BYTES) {
      throw new SafeToolError(
        "SEARCH_SIZE_LIMIT_EXCEEDED",
        "The notes collection is too large to search safely.",
      );
    }

    const content = await readExistingNote(note);
    const fileNameMatches = note.fileName
      .toLowerCase()
      .includes(normalizedQuery);
    const contentMatches = content.toLowerCase().includes(normalizedQuery);

    if (!fileNameMatches && !contentMatches) {
      continue;
    }

    results.push({
      fileName: note.fileName,
      relativePath: note.relativePath,
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
  const note = await getExistingNote(noteName);
  const content = await readExistingNote(note);

  return {
    fileName: note.fileName,
    relativePath: note.relativePath,
    content,
  };
}
