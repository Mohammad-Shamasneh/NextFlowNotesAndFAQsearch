import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";

import { registerSearchNotesTool } from "./tools/search-notes.js";
import { registerListNotesTool } from "./tools/list-notes.js";
import { registerAddNoteTool } from "./tools/add-note.js";
import { registerReadNoteTool } from "./tools/read-note.js";
import { registerUpdateNoteTool } from "./tools/update-note.js";
import { registerAppendNoteTool } from "./tools/append-note.js";
import { registerDeleteNoteTool } from "./tools/delete-note.js";

import { registerStaticResources } from "./resources/static-resources.js";

/**
 * Factory used by stdio (and later HTTP) so every connection gets a fresh server.
 * Register all tools inside this function — never on a shared global instance.
 */
function createServer(): McpServer {
  const server = new McpServer({
    name: "mcprepo",
    version: "0.1.0",
  });

  // Register project tools.
  registerSearchNotesTool(server);
  registerListNotesTool(server);
  registerAddNoteTool(server);
  registerReadNoteTool(server);
  registerUpdateNoteTool(server);
  registerAppendNoteTool(server);
  registerDeleteNoteTool(server);

  registerStaticResources(server);

  return server;
}

void serveStdio(createServer);

console.error("mcprepo MCP server running on stdio");