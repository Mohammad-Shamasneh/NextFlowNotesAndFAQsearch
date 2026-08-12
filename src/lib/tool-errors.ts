import { MAX_TOOL_OUTPUT_CHARACTERS } from "./security-limits.js";

export class SafeToolError extends Error {
  public constructor(
    public readonly code: string,
    public readonly publicMessage: string,
  ) {
    super(publicMessage);
    this.name = "SafeToolError";
  }
}

function nodeErrorCode(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }

  return undefined;
}

export function logToolFailure(toolName: string, error: unknown): void {
  const failureCode =
    error instanceof SafeToolError
      ? error.code
      : (nodeErrorCode(error) ?? "UNEXPECTED_ERROR");

  // Deliberately omit raw messages, inputs, paths, stacks, and environment data.
  console.error(`[${toolName}] ${failureCode}`);
}

export function safeErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (error instanceof SafeToolError) {
    return error.publicMessage;
  }

  switch (nodeErrorCode(error)) {
    case "EEXIST":
      return "A note with that name already exists.";
    case "EACCES":
    case "EPERM":
      return "The note cannot be accessed.";
    default:
      return fallbackMessage;
  }
}

export function createErrorToolResult(
  error: unknown,
  fallbackMessage: string,
) {
  return {
    isError: true,
    content: [
      {
        type: "text" as const,
        text: safeErrorMessage(error, fallbackMessage),
      },
    ],
  };
}

export function createJsonToolResult(payload: unknown) {
  const text = JSON.stringify(payload, null, 2);

  if (text.length > MAX_TOOL_OUTPUT_CHARACTERS) {
    throw new SafeToolError(
      "OUTPUT_TOO_LARGE",
      "The requested output exceeds the allowed size.",
    );
  }

  return {
    content: [
      {
        type: "text" as const,
        text,
      },
    ],
  };
}
