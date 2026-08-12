import assert from "node:assert/strict";
import { mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { fetchJson } from "../src/lib/http.js";
import {
  createSafeNoteFileName,
  createSafeNoteFileNameFromTitle,
  resolveSafeNotePath,
} from "../src/lib/note-path.js";
import {
  getExistingNote,
  readExistingNote,
} from "../src/lib/notes.js";
import {
  MAX_APPEND_CONTENT_LENGTH,
  MAX_NOTE_CONTENT_LENGTH,
  MAX_NOTE_FILE_BYTES,
  MAX_SEARCH_QUERY_LENGTH,
} from "../src/lib/security-limits.js";
import {
  createErrorToolResult,
  SafeToolError,
} from "../src/lib/tool-errors.js";
import { addNoteInputSchema } from "../src/schemas/add-note.js";
import { appendNoteInputSchema } from "../src/schemas/append-note.js";
import { deleteNoteInputSchema } from "../src/schemas/delete-note.js";
import { greetInputSchema } from "../src/schemas/greet.js";
import { listNotesInputSchema } from "../src/schemas/list-notes.js";
import { readNoteInputSchema } from "../src/schemas/read-note.js";
import { searchNotesInputSchema } from "../src/schemas/search-notes.js";
import { updateNoteInputSchema } from "../src/schemas/update-note.js";

test("valid Markdown note names resolve inside the allowed directory", () => {
  const allowedDirectory = path.join(tmpdir(), "allowed-notes");
  const resolved = resolveSafeNotePath("Office Hours.md", allowedDirectory);

  assert.equal(resolved.fileName, "office-hours.md");
  assert.equal(
    resolved.filePath,
    path.join(path.resolve(allowedDirectory), "office-hours.md"),
  );
  assert.equal(resolved.relativePath, "data/office-hours.md");
});

test("path traversal and absolute paths are rejected", () => {
  const attacks = [
    "../secret.txt",
    "../../something.md",
    "..\\..\\secret.md",
    "/etc/passwd",
    "C:\\Windows\\system.ini",
    "%2e%2e%2fsecret.md",
  ];

  for (const attack of attacks) {
    assert.throws(
      () => resolveSafeNotePath(attack),
      (error: unknown) =>
        error instanceof SafeToolError &&
        error.publicMessage === "The requested note path is not allowed.",
      attack,
    );
  }
});

test("unsupported note extensions are rejected", () => {
  assert.throws(
    () => createSafeNoteFileName("secret.txt"),
    (error: unknown) =>
      error instanceof SafeToolError &&
      error.publicMessage === "Only Markdown (.md) notes are allowed.",
  );
});

test("add-note titles preserve useful slug behavior while rejecting paths", () => {
  assert.equal(
    createSafeNoteFileNameFromTitle("Today's Week 4 Plan!"),
    "todays-week-4-plan.md",
  );
  assert.throws(
    () => createSafeNoteFileNameFromTitle("../private"),
    (error: unknown) =>
      error instanceof SafeToolError &&
      error.publicMessage === "The requested note path is not allowed.",
  );
});

test("schemas reject empty, malformed, and oversized inputs without throwing", () => {
  assert.equal(readNoteInputSchema.safeParse({ noteName: "   " }).success, false);
  assert.equal(
    readNoteInputSchema.safeParse({ noteName: "../../secret.md" }).success,
    false,
  );
  assert.equal(
    searchNotesInputSchema.safeParse({
      query: "q".repeat(MAX_SEARCH_QUERY_LENGTH + 1),
    }).success,
    false,
  );
  assert.equal(
    addNoteInputSchema.safeParse({
      title: "valid-note",
      body: "x".repeat(MAX_NOTE_CONTENT_LENGTH + 1),
    }).success,
    false,
  );
  assert.equal(
    appendNoteInputSchema.safeParse({
      noteName: "valid-note.md",
      content: "x".repeat(MAX_APPEND_CONTENT_LENGTH + 1),
    }).success,
    false,
  );
  assert.equal(
    listNotesInputSchema.safeParse({ folder: "../data" }).success,
    false,
  );
  assert.equal(
    searchNotesInputSchema.safeParse({ query: "valid", unexpected: true })
      .success,
    false,
  );
  assert.equal(greetInputSchema.safeParse({ name: "\0" }).success, false);
  assert.equal(
    deleteNoteInputSchema.safeParse({ noteName: "note.md", extra: true })
      .success,
    false,
  );
  assert.equal(
    updateNoteInputSchema.safeParse({
      noteName: "note.md",
      newContent: "valid",
      extra: true,
    }).success,
    false,
  );

  assert.equal(
    searchNotesInputSchema.safeParse({ query: "still valid", limit: 5 })
      .success,
    true,
  );
});

test("a missing note produces a short safe error", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "mcp-notes-missing-"));

  try {
    await assert.rejects(
      getExistingNote("missing.md", directory),
      (error: unknown) =>
        error instanceof SafeToolError &&
        error.publicMessage === "Note not found.",
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("oversized and symbolic-link note files are rejected before reading", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "mcp-notes-caps-"));
  const outsideFile = path.join(tmpdir(), `outside-note-${process.pid}.md`);

  try {
    await writeFile(
      path.join(directory, "large.md"),
      "x".repeat(MAX_NOTE_FILE_BYTES + 1),
    );
    const largeNote = await getExistingNote("large.md", directory);

    await assert.rejects(
      readExistingNote(largeNote),
      (error: unknown) =>
        error instanceof SafeToolError &&
        error.publicMessage === "The note exceeds the allowed size.",
    );

    await writeFile(outsideFile, "private");
    await symlink(outsideFile, path.join(directory, "linked.md"));

    await assert.rejects(
      getExistingNote("linked.md", directory),
      (error: unknown) =>
        error instanceof SafeToolError &&
        error.publicMessage ===
          "The requested note is not an allowed file.",
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
    await rm(outsideFile, { force: true });
  }
});

test("safe error responses never expose raw internal error details", () => {
  const result = createErrorToolResult(
    new Error("failed at /private/path with sensitive details"),
    "Unable to read the note.",
  );

  assert.equal(result.content[0]?.text, "Unable to read the note.");
  assert.equal(result.content[0]?.text.includes("/private/path"), false);
  assert.equal(result.content[0]?.text.includes("sensitive details"), false);
});

test("HTTP helper rejects non-HTTPS and non-allowlisted destinations", async () => {
  await assert.rejects(
    fetchJson("http://example.com/data", { allowedHosts: ["example.com"] }),
    (error: unknown) =>
      error instanceof SafeToolError &&
      error.publicMessage ===
        "The external request destination is not allowed.",
  );

  await assert.rejects(
    fetchJson("https://example.com/data", { allowedHosts: [] }),
    (error: unknown) =>
      error instanceof SafeToolError &&
      error.publicMessage ===
        "The external request destination is not allowed.",
  );
});
