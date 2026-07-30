# Design doc — Week 2

> Mandatory for mentor review. Open a GitHub Issue linking to this file before Week 3.

**Student:** Nadeen Jaber , Mohammad-Shamasneh
**Repo:** NextFlowNotesAndFAQsearch  
**Branch:** `week-2-design`  
**GitHub Issue:** (https://github.com/Mohammad-Shamasneh/NextFlowNotesAndFAQsearch)

---

## 1. Pitch

The Notes & FAQ Search MCP Server is an offline Model Context Protocol (MCP) server that helps users quickly find information stored in their personal notes and FAQ documents. Instead of manually searching through multiple files, users can ask natural language questions, and the AI assistant retrieves the most relevant content using MCP tools. This project is designed for students, learners, and anyone who manages local notes and wants a faster, more organized way to access information.

## 2. Demo Day user story

Describe a 2–3 minute live demo:

1. The MCP Host and Inspector are started successfully.
2. The user asks: *"Do I have any notes about Git?"*
3. The model calls the `search_notes` tool to search all available notes. After finding a matching note, it calls the `read_note` tool to display its content. If the user asks *"Show me all my notes,"* the model calls the `list_notes` tool.
4. The audience sees the list of notes, the matching search results, and the full content of the selected note returned by the MCP server.

## 3. Tool inventory (4–7 tools)

Mark exactly **three** tools as **P0** (must work for Demo Day). Others can be P1 stubs.

| Priority | Tool name (`verb_noun`) | Description (for the model) | Inputs | Outputs |
| --- | --- | --- | --- | --- |
| P0 | `list_notes` | Lists all available notes stored in the notes folder. | Optional folder name | Array of note titles |
| P0 | `search_notes` | Searches notes for a keyword or phrase and returns matching results. | Search keyword | Matching note titles with short snippets |
| P0 | `read_note` | Reads the complete content of a selected note. | Note name | Full note content |
| P1 | `add_note` | Creates a new note in the notes folder. | Title, content | Success confirmation |
| P1 | `update_note` | Updates the content of an existing note. | Note name, new content | Success confirmation |
| P1 | `append_note` | Adds content to the end of an existing note without replacing its current content. | Note name, content | Success confirmation |
| P1 | `delete_note` | Permanently deletes an existing note when explicitly requested by the user. | Note name | Success confirmation |

## 4. Out of scope

List what you will **not** build in this cohort (auth, paid APIs, mobile UI, etc.).

- User authentication and account management.
- Cloud storage or online synchronization.
- Mobile or web user interface.
- Paid APIs or external AI services.
- Real-time collaboration between multiple users.

## 5. Success criteria

You succeed on Demo Day if:

- [ ] The MCP server starts successfully and connects through MCP Inspector.
- [ ] The `search_notes` tool returns relevant results from sample notes.
- [ ] The `read_note` tool displays the full content of the selected note.

## 6. Top risks

| Risk | Likelihood | Mitigation |
| --- | --- | --- |
| Search results are inaccurate or incomplete. | Medium | Start with simple keyword matching before adding more advanced search methods. |
| File format differences cause reading errors. | Medium | Support only Markdown (`.md`) and text (`.txt`) files during this cohort. |
| Limited development time. | Low | Prioritize implementing the three P0 tools before working on optional P1 features. |

## 7. Evidence for Week 2

- [ ] `docs/project-choice.md` filled
- [ ] ≥3 Zod schemas under `src/schemas/`
- [ ] Tools registered (stubs OK)
- [ ] `examples/<tool>.json` for each registered tool
- [ ] Inspector screenshots attached to the GitHub Issue

## Mentor decision

- Status: pending / approved / changes requested
- Comments: