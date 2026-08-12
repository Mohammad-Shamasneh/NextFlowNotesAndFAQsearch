import {
  DEFAULT_HTTP_RESPONSE_BYTES,
  DEFAULT_HTTP_TIMEOUT_MS,
  MAX_HTTP_RESPONSE_BYTES,
  MAX_HTTP_TIMEOUT_MS,
  MIN_HTTP_TIMEOUT_MS,
} from "./security-limits.js";
import { SafeToolError } from "./tool-errors.js";

type FetchJsonOptions = {
  allowedHosts: readonly string[];
  timeoutMs?: number;
  maxResponseBytes?: number;
};

function validateRequestUrl(
  rawUrl: string,
  allowedHosts: readonly string[],
): URL {
  let url: URL;

  try {
    url = new URL(rawUrl);
  } catch {
    throw new SafeToolError(
      "INVALID_NETWORK_URL",
      "The external request URL is invalid.",
    );
  }

  if (!Array.isArray(allowedHosts)) {
    throw new SafeToolError(
      "INVALID_NETWORK_ALLOWLIST",
      "The external request destination is not allowed.",
    );
  }

  const normalizedAllowedHosts = new Set(
    allowedHosts
      .filter((host): host is string => typeof host === "string")
      .map((host) => host.trim().toLowerCase())
      .filter(Boolean),
  );

  if (
    url.protocol !== "https:" ||
    url.username !== "" ||
    url.password !== "" ||
    !normalizedAllowedHosts.has(url.hostname.toLowerCase())
  ) {
    throw new SafeToolError(
      "NETWORK_DESTINATION_NOT_ALLOWED",
      "The external request destination is not allowed.",
    );
  }

  return url;
}

function validateBoundedInteger(
  value: number,
  minimum: number,
  maximum: number,
  code: string,
): void {
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new SafeToolError(code, "Invalid external request limits.");
  }
}

async function readBoundedResponse(
  response: Response,
  maximumBytes: number,
): Promise<string> {
  const declaredLength = response.headers.get("content-length");

  if (declaredLength && Number(declaredLength) > maximumBytes) {
    throw new SafeToolError(
      "NETWORK_RESPONSE_TOO_LARGE",
      "The external response exceeds the allowed size.",
    );
  }

  if (!response.body) {
    return "";
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let totalBytes = 0;
  let text = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    totalBytes += value.byteLength;

    if (totalBytes > maximumBytes) {
      await reader.cancel();
      throw new SafeToolError(
        "NETWORK_RESPONSE_TOO_LARGE",
        "The external response exceeds the allowed size.",
      );
    }

    text += decoder.decode(value, { stream: true });
  }

  return text + decoder.decode();
}

export async function fetchJson(
  rawUrl: string,
  {
    allowedHosts,
    timeoutMs = DEFAULT_HTTP_TIMEOUT_MS,
    maxResponseBytes = DEFAULT_HTTP_RESPONSE_BYTES,
  }: FetchJsonOptions,
): Promise<unknown> {
  const url = validateRequestUrl(rawUrl, allowedHosts);
  validateBoundedInteger(
    timeoutMs,
    MIN_HTTP_TIMEOUT_MS,
    MAX_HTTP_TIMEOUT_MS,
    "INVALID_NETWORK_TIMEOUT",
  );
  validateBoundedInteger(
    maxResponseBytes,
    1,
    MAX_HTTP_RESPONSE_BYTES,
    "INVALID_NETWORK_RESPONSE_LIMIT",
  );

  try {
    const response = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) {
      throw new SafeToolError(
        "NETWORK_RESPONSE_ERROR",
        "The external request failed.",
      );
    }

    const responseText = await readBoundedResponse(response, maxResponseBytes);

    try {
      return JSON.parse(responseText) as unknown;
    } catch {
      throw new SafeToolError(
        "INVALID_NETWORK_RESPONSE",
        "The external service returned an invalid response.",
      );
    }
  } catch (error) {
    if (error instanceof SafeToolError) {
      throw error;
    }

    throw new SafeToolError(
      "NETWORK_REQUEST_FAILED",
      "The external request failed.",
    );
  }
}
