import path from "node:path";

import { MAX_NOTE_NAME_LENGTH } from "./security-limits.js";
import { SafeToolError } from "./tool-errors.js";

export const NOTES_DIRECTORY = path.resolve(process.cwd(), "data");

const NOTE_STEM_PATTERN = /^[\p{L}\p{N}](?:[\p{L}\p{N}_ -]*[\p{L}\p{N}_-])?$/u;
const WINDOWS_RESERVED_STEM_PATTERN = /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;

function rejectPathSyntax(value: string): void {
  if (
    value.includes("\0") ||
    value.includes("/") ||
    value.includes("\\") ||
    value.includes("%") ||
    path.posix.isAbsolute(value) ||
    path.win32.isAbsolute(value)
  ) {
    throw new SafeToolError(
      "NOTE_PATH_NOT_ALLOWED",
      "The requested note path is not allowed.",
    );
  }
}

export function createSafeNoteFileName(noteName: string): string {
  const normalizedName = noteName.trim();

  if (!normalizedName || normalizedName.length > MAX_NOTE_NAME_LENGTH) {
    throw new SafeToolError("INVALID_NOTE_NAME", "Invalid note name.");
  }

  rejectPathSyntax(normalizedName);

  const extension = path.extname(normalizedName);

  if (extension && extension.toLowerCase() !== ".md") {
    throw new SafeToolError(
      "UNSUPPORTED_NOTE_EXTENSION",
      "Only Markdown (.md) notes are allowed.",
    );
  }

  const stem = extension
    ? normalizedName.slice(0, -extension.length)
    : normalizedName;

  if (!NOTE_STEM_PATTERN.test(stem) || stem.includes("..")) {
    throw new SafeToolError("INVALID_NOTE_NAME", "Invalid note name.");
  }

  const safeStem = stem
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  if (WINDOWS_RESERVED_STEM_PATTERN.test(safeStem)) {
    throw new SafeToolError("INVALID_NOTE_NAME", "Invalid note name.");
  }

  const fileName = `${safeStem}.md`;

  if (fileName.length > MAX_NOTE_NAME_LENGTH) {
    throw new SafeToolError("INVALID_NOTE_NAME", "Invalid note name.");
  }

  return fileName;
}

export function createSafeNoteFileNameFromTitle(title: string): string {
  const normalizedTitle = title.trim();

  if (!normalizedTitle || normalizedTitle.length > MAX_NOTE_NAME_LENGTH) {
    throw new SafeToolError("INVALID_NOTE_NAME", "Invalid note title.");
  }

  rejectPathSyntax(normalizedTitle);

  const extension = path.extname(normalizedTitle);

  if (
    extension &&
    /^[.]\p{L}{1,10}$/u.test(extension) &&
    extension.toLowerCase() !== ".md"
  ) {
    throw new SafeToolError(
      "UNSUPPORTED_NOTE_EXTENSION",
      "Only Markdown (.md) notes are allowed.",
    );
  }

  const titleWithoutExtension =
    extension.toLowerCase() === ".md"
      ? normalizedTitle.slice(0, -extension.length)
      : normalizedTitle;

  if (titleWithoutExtension.includes("..")) {
    throw new SafeToolError(
      "NOTE_PATH_NOT_ALLOWED",
      "The requested note path is not allowed.",
    );
  }

  const safeStem = titleWithoutExtension
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}_-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "");

  if (!safeStem || WINDOWS_RESERVED_STEM_PATTERN.test(safeStem)) {
    throw new SafeToolError("INVALID_NOTE_NAME", "Invalid note title.");
  }

  const fileName = `${safeStem}.md`;

  if (fileName.length > MAX_NOTE_NAME_LENGTH) {
    throw new SafeToolError("INVALID_NOTE_NAME", "Invalid note title.");
  }

  return fileName;
}

export function noteNameValidationMessage(noteName: string): string | null {
  try {
    createSafeNoteFileName(noteName);
    return null;
  } catch (error) {
    return error instanceof SafeToolError
      ? error.publicMessage
      : "Invalid note name.";
  }
}

export function noteTitleValidationMessage(title: string): string | null {
  try {
    createSafeNoteFileNameFromTitle(title);
    return null;
  } catch (error) {
    return error instanceof SafeToolError
      ? error.publicMessage
      : "Invalid note title.";
  }
}

export type SafeNotePath = {
  fileName: string;
  filePath: string;
  relativePath: string;
};

export function resolveSafeNotePath(
  noteName: string,
  notesDirectory = NOTES_DIRECTORY,
): SafeNotePath {
  const fileName = createSafeNoteFileName(noteName);
  const allowedDirectory = path.resolve(notesDirectory);
  const filePath = path.resolve(allowedDirectory, fileName);
  const directoryRelativePath = path.relative(allowedDirectory, filePath);

  if (
    !directoryRelativePath ||
    directoryRelativePath === ".." ||
    directoryRelativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(directoryRelativePath)
  ) {
    throw new SafeToolError(
      "NOTE_PATH_NOT_ALLOWED",
      "The requested note path is not allowed.",
    );
  }

  return {
    fileName,
    filePath,
    relativePath: path.posix.join("data", fileName),
  };
}

export function resolveSafeNoteTitlePath(
  title: string,
  notesDirectory = NOTES_DIRECTORY,
): SafeNotePath {
  const fileName = createSafeNoteFileNameFromTitle(title);
  return resolveSafeNotePath(fileName, notesDirectory);
}
