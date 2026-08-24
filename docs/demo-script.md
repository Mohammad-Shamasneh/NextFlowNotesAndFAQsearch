# Demo Script — Notes & FAQ Search MCP Server

**Presenters:** Mohammad Shamasneh, Nadeen Jaber
**Total time:** 5:00 (hard limit)
**Format:** 5 slides + live MCP Inspector demo

---

## Timing

| Segment | Time | Content |
| --- | --- | --- |
| Problem | 0:00–0:40 | The problem we're solving |
| Architecture | 0:40–1:10 | How the server works (1 slide) |
| Live demo | 1:10–3:30 | Two live tool calls via MCP Inspector |
| What's next | 3:30–4:30 | Planned improvements |
| Q&A | 4:30–5:00 | Open floor |

---

## 0:00–0:40 — The Problem

Talking points:
- Course notes, FAQs, and setup docs pile up as scattered Markdown files.
- An AI assistant can't answer questions about them unless it can search and read them directly.
- We built an MCP server that gives any compatible AI client structured, offline access to a local notes folder — no cloud upload, no external API calls.

## 0:40–1:10 — Architecture (1 slide)

Talking points:
- Node.js + TypeScript, built on the official MCP SDK, communicates over stdio.
- All input validated with Zod (`.strict()` schemas — no silent extra fields).
- Reads/writes Markdown files under `data/` on disk. Fully offline; no network calls in the tool layer.
- 7 tools: `search_notes`, `list_notes`, `read_note`, `add_note`, `update_note`, `append_note`, `delete_note`.
- Hardened against path traversal, secret leaks, and runaway responses (see `SECURITY.md` / `docs/threat-model.md`).

## 1:10–3:30 — Live Tool Calls

Open MCP Inspector, confirm **Connected**, then run:

### Live Prompt 1 — Discover notes

> "What notes do I have available?"

**Tool call:** `list_notes`
```json
{}
```

**Expected answer:** "You currently have 8 notes available, including `course-faq.md`, `git-and-github.md`, `mcp-basics.md`, `nodejs.md`, `office-hours.md`, `project-faq.md`, `typescript.md`, and `week-3.md`."

### Live Prompt 2 — Search then read

> "Find my note about MCP and tell me what it says."

**Tool call 1:** `search_notes`
```json
{ "query": "MCP", "limit": 5 }
```

**Tool call 2:** `read_note`
```json
{ "noteName": "mcp-basics.md" }
```

**Expected answer:** "The MCP basics note explains that Model Context Protocol allows AI assistants to interact with external tools and data sources. It identifies the main components as Host, Client, Server, Tools, Resources, and Prompts."

### Backup Prompt (use only if Live Prompt 1 or 2 fails)

> "Search my notes for information about Git."

**Tool call:** `search_notes`
```json
{ "query": "Git", "limit": 5 }
```

**Expected answer:** "I found two notes that mention Git. `git-and-github.md` explains Git and common commands such as clone, pull, push, status, and add. `course-faq.md` also mentions using GitHub when submitting the project."

## 3:30–4:30 — What's Next

Talking points:
- Explore HTTP transport for remote deployment beyond a single machine.
- Add a `docs/review-checklist.md`-driven contribution flow for future notes.
- Possible: prompts/resources layer on top of the existing tools.

## 4:30–5:00 — Q&A

Be ready to answer:
- "What happens on a path traversal attempt?" → point to `SECURITY.md` + the before/after Inspector screenshot in PR #4.
- "Why Zod?" → runtime input validation; `.strict()` rejects unexpected fields instead of silently ignoring them.
- "Tools vs. resources?" → tools perform actions/return computed results; resources expose static/readable content.

---

## Offline Fallback Plan

The server never makes network calls — it only reads/writes local files under `data/`. If Wi-Fi drops, the demo is unaffected: run it exactly as rehearsed, no fixtures needed.

---

## Slide Outline (5 max)

1. Title — project name, names, one-line pitch
2. The Problem
3. Architecture diagram (client → MCP server (stdio) → local `data/` files)
4. Tools table (7 tools, one-line purpose each)
5. What's Next

**Slides link:** `docs/demo-slides.pdf` (committed to this repo — GitHub renders PDFs inline, so the file itself is the link once pushed: `https://github.com/Mohammad-Shamasneh/NextFlowNotesAndFAQsearch/blob/main/docs/demo-slides.pdf`). Swap this for a Google Slides link instead if you'd rather present from there.