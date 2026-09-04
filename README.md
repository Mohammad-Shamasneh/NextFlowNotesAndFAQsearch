# Notes & FAQ Search — MCP Server

> Built as part of **[NextFlows Academy](https://nextflows.ai/academy)** — Cohort #1: *Building an MCP for an AI Engine*.
> Academy hub: **https://nextflows.ai/academy**

A local, offline **Model Context Protocol (MCP)** server that lets an AI
assistant (e.g. Claude) search, read, and manage a folder of Markdown
notes. No network access or API keys required — everything runs against
local `.md` files.

## What it does

The server exposes 8 tools over the **stdio** MCP transport:

- Search a collection of local Markdown notes by keyword and get back
  bounded, relevant snippets.
- List and read individual notes.
- Create, update, append to, and delete notes.

All tool inputs are validated with Zod, and file access is restricted to
the local `data/` directory (path-traversal, oversized-input, and
excessive-result-size protections are documented in
[`SECURITY.md`](SECURITY.md) and [`docs/threat-model.md`](docs/threat-model.md)).

## Requirements

- Node.js **20+** — check with `node -v`
- npm — check with `npm -v`
- Git

## Install

```bash
git clone https://github.com/Mohammad-Shamasneh/NextFlowNotesAndFAQsearch.git
cd NextFlowNotesAndFAQsearch
npm install
```

## Run

```bash
npm run dev
```

This starts the MCP server on stdio and waits for a client to connect
(stop with `Ctrl+C`). Run it from the **repo root** — the server resolves
`./data` relative to the current working directory.

## The Inspector command

To manually call the tools during development:

```bash
npm run inspect
```

This opens [MCP Inspector](https://github.com/modelcontextprotocol/inspector)
against the server. Click **Connect**, open the **Tools** tab, pick a
tool, and use the matching file in `examples/*.json` as a starting point
for the input.

## Tools

| Tool | Priority | What it does | Key inputs |
| --- | --- | --- | --- |
| `greet` | utility | Returns a short greeting; useful to confirm the server is running. | `name` |
| `search_notes` | P0 | Searches all notes for a keyword/phrase and returns matching file names, paths, and snippets. | `query`, `limit` (optional) |
| `list_notes` | P0 | Lists every Markdown note in `data/`. | — (no arguments) |
| `read_note` | P0 | Returns the full content of one note. | `noteName` |
| `add_note` | P1 | Creates a new note. | `title`, `body` |
| `update_note` | P1 | Replaces a note's full content. | `noteName`, `newContent` |
| `append_note` | P1 | Appends content to the end of an existing note. | `noteName`, `content` |
| `delete_note` | P1 | Permanently deletes a note. | `noteName` |

## Example prompts

A few natural-language prompts a user might give an AI assistant
connected to this server:

- **"What are the mentor's office hours?"** → the model calls
  `search_notes` (or `read_note` once it knows the file name) and answers
  from the `office-hours.md` content.
- **"What notes do you have access to?"** → the model calls `list_notes`
  and summarizes the file list in plain language.
- **"Add a note reminding me that the Week 5 deadline is Aug 20."** → the
  model calls `add_note` with a short title and the reminder as the body.

See [`examples/conversations.md`](examples/conversations.md) for full,
step-by-step example conversations with the expected tool call sequence
for each.

## Troubleshooting

**1. `Input validation error: ... Unrecognized key: "X"`**
The tool's input schema is strict — it rejects any field it doesn't
expect (for example, `list_notes` takes no arguments at all). Check the
matching file in `examples/*.json` for the exact accepted field names and
remove anything extra.

**2. `"Note not found."` when calling `read_note`, `update_note`,
`append_note`, or `delete_note`**
`noteName` must match a file name exactly as returned by `list_notes`,
including the `.md` extension (e.g. `office-hours.md`, not
`office-hours`). Run `list_notes` first to confirm the exact name.

**3. Inspector can't connect, or the server exits immediately**
This is almost always one of: Node is older than 20 (`node -v` to check),
`npm install` wasn't run first, or the command is being run from the
wrong folder. Always run `npm run dev` / `npm run inspect` from the repo
root so the server can resolve `./data`.

## License

MIT