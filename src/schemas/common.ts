import { z } from "zod/v4";

import {
  noteNameValidationMessage,
  noteTitleValidationMessage,
} from "../lib/note-path.js";
import {
  MAX_APPEND_CONTENT_BYTES,
  MAX_APPEND_CONTENT_LENGTH,
  MAX_NOTE_CONTENT_BYTES,
  MAX_NOTE_CONTENT_LENGTH,
  MAX_NOTE_NAME_LENGTH,
} from "../lib/security-limits.js";

export const noteNameInputSchema = z
  .string()
  .trim()
  .min(1, "Note name is required.")
  .max(MAX_NOTE_NAME_LENGTH, "Note name is too long.")
  .superRefine((noteName, context) => {
    const validationMessage = noteNameValidationMessage(noteName);

    if (validationMessage) {
      context.addIssue({
        code: "custom",
        message: validationMessage,
      });
    }
  });

export const noteTitleInputSchema = z
  .string()
  .trim()
  .min(1, "Note title is required.")
  .max(MAX_NOTE_NAME_LENGTH, "Note title is too long.")
  .superRefine((title, context) => {
    const validationMessage = noteTitleValidationMessage(title);

    if (validationMessage) {
      context.addIssue({
        code: "custom",
        message: validationMessage,
      });
    }
  });

function limitedContentSchema(
  fieldName: string,
  maximumCharacters: number,
  maximumBytes: number,
) {
  return z
    .string()
    .trim()
    .min(1, `${fieldName} cannot be empty.`)
    .max(
      maximumCharacters,
      `${fieldName} exceeds the allowed character limit.`,
    )
    .refine(
      (content) => Buffer.byteLength(content, "utf8") <= maximumBytes,
      `${fieldName} exceeds the allowed byte-size limit.`,
    )
    .refine(
      (content) => !content.includes("\0"),
      `${fieldName} contains an unsupported null character.`,
    );
}

export const noteContentInputSchema = limitedContentSchema(
  "Note content",
  MAX_NOTE_CONTENT_LENGTH,
  MAX_NOTE_CONTENT_BYTES,
);

export const appendContentInputSchema = limitedContentSchema(
  "Append content",
  MAX_APPEND_CONTENT_LENGTH,
  MAX_APPEND_CONTENT_BYTES,
);
