import { lstat, readFile } from "node:fs/promises";
import { resolve } from "node:path";

import type { McpServer } from "@modelcontextprotocol/server";

import { MAX_TOOL_OUTPUT_CHARACTERS } from "../lib/security-limits.js";
import { logToolFailure, SafeToolError } from "../lib/tool-errors.js";

async function readStaticMarkdown(
  resourceName: string,
  filePath: string,
): Promise<string> {
  try {
    const fileStats = await lstat(filePath);

    if (
      !fileStats.isFile() ||
      fileStats.isSymbolicLink() ||
      fileStats.size > MAX_TOOL_OUTPUT_CHARACTERS
    ) {
      throw new SafeToolError(
        "RESOURCE_NOT_ALLOWED",
        "The requested resource is not available.",
      );
    }

    const text = await readFile(filePath, "utf8");

    if (text.length > MAX_TOOL_OUTPUT_CHARACTERS) {
      throw new SafeToolError(
        "RESOURCE_TOO_LARGE",
        "The requested resource is too large.",
      );
    }

    return text;
  } catch (error) {
    logToolFailure(resourceName, error);

    if (error instanceof SafeToolError) {
      throw error;
    }

    throw new SafeToolError(
      "RESOURCE_READ_FAILED",
      "Unable to read the requested resource.",
    );
  }
}

export function registerStaticResources(server: McpServer): void {
  server.registerResource(
    "project-faq",
    "notes://faq",
    {
      title: "Project FAQ",
      description:
        "Frequently asked questions about the Notes and FAQ MCP project.",
      mimeType: "text/markdown",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/markdown",
          text: await readStaticMarkdown(
            "resource_project_faq",
            resolve(process.cwd(), "data", "project-faq.md"),
          ),
        },
      ],
    }),
  );

  server.registerResource(
    "mcp-basics",
    "notes://mcp-basics",
    {
      title: "MCP Basics",
      description: "A short introduction to Model Context Protocol.",
      mimeType: "text/markdown",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/markdown",
          text: await readStaticMarkdown(
            "resource_mcp_basics",
            resolve(process.cwd(), "data", "mcp-basics.md"),
          ),
        },
      ],
    }),
  );

  server.registerResource(
    "project-design",
    "docs://design",
    {
      title: "Project Design",
      description: "The design document for the Notes and FAQ MCP server.",
      mimeType: "text/markdown",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/markdown",
          text: await readStaticMarkdown(
            "resource_project_design",
            resolve(process.cwd(), "docs", "design.md"),
          ),
        },
      ],
    }),
  );
}
