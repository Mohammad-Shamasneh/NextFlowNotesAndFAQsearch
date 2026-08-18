# Example Conversations

These examples show the expected interaction between a user, a model, and the NextFlow Notes and FAQ Search MCP server.

The conversations describe the tool calls a model should make when the MCP server is connected to a compatible host. They are documentation examples and do not represent a live Claude integration.

---

## Conversation A - List Available Notes

### User Prompt

> What notes do I have available?

### Expected Tool Sequence

1. Call `list_notes`

**Key arguments:**

```json
{}
```

### Good Final Answer

You currently have 8 notes available, including `course-faq.md`, `git-and-github.md`, `mcp-basics.md`, `nodejs.md`, `office-hours.md`, `project-faq.md`, `typescript.md`, and `week-3.md`.

---

## Conversation B - Search the Knowledge Base

### User Prompt

> Search my notes for information about Git.

### Expected Tool Sequence

1. Call `search_notes`

**Key arguments:**

```json
{
  "query": "Git",
  "limit": 5
}
```

### Good Final Answer

I found two notes that mention Git. `git-and-github.md` explains Git and common commands such as clone, pull, push, status, and add. `course-faq.md` also mentions using GitHub when submitting the project.

---

## Conversation C - Find and Read a Note

### User Prompt

> Find my note about MCP and tell me what it says.

### Expected Tool Sequence

1. Call `search_notes`

**Key arguments:**

```json
{
  "query": "MCP",
  "limit": 5
}
```

2. After identifying the relevant note, call `read_note`

**Key arguments:**

```json
{
  "noteName": "mcp-basics.md"
}
```

### Good Final Answer

The MCP basics note explains that Model Context Protocol allows AI assistants to interact with external tools and data sources. It identifies the main components as Host, Client, Server, Tools, Resources, and Prompts.

---

## Coverage Summary

| Conversation | Tool(s) | Purpose |
| --- | --- | --- |
| A | `list_notes` | Discover available notes |
| B | `search_notes` | Find information by keyword |
| C | `search_notes` -> `read_note` | Find a relevant note and read its contents |

These examples demonstrate how plain-language user requests can be translated into MCP tool calls and then converted into clear, user-facing answers.