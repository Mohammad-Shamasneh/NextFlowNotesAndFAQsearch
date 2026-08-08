import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import type { McpServer } from "@modelcontextprotocol/server";

export function registerStaticResources(server: McpServer): void {
  // Resource 1: Project FAQ
  server.registerResource(
    "project-faq",
    "notes://faq",
    {
      title: "Project FAQ",
      description:
        "Frequently asked questions about the Notes and FAQ MCP project.",
      mimeType: "text/markdown",
    },
    async (uri) => {
      const filePath = resolve(
        process.cwd(),
        "data",
        "project-faq.md",
      );

      const text = await readFile(filePath, "utf8");

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text,
          },
        ],
      };
    },
  );

  // Resource 2: MCP Basics
  server.registerResource(
    "mcp-basics",
    "notes://mcp-basics",
    {
      title: "MCP Basics",
      description:
        "A short introduction to Model Context Protocol.",
      mimeType: "text/markdown",
    },
    async (uri) => {
      const filePath = resolve(
        process.cwd(),
        "data",
        "mcp-basics.md",
      );

      const text = await readFile(filePath, "utf8");

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text,
          },
        ],
      };
    },
  );

  // Resource 3: Project Design
  server.registerResource(
    "project-design",
    "docs://design",
    {
      title: "Project Design",
      description:
        "The design document for the Notes and FAQ MCP server.",
      mimeType: "text/markdown",
    },
    async (uri) => {
      const filePath = resolve(
        process.cwd(),
        "docs",
        "design.md",
      );

      const text = await readFile(filePath, "utf8");

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text,
          },
        ],
      };
    },
  );
}