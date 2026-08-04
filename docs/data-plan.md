# Week 3 Data Plan

## Overview

The MCP server uses local Markdown files stored inside:

`./data/`

Each note is stored as a separate `.md` file. This allows the MCP server
to work completely offline without API keys or network access.

## Tool Data Plan

| Priority | Tool | Source | Fixture path | Auth | Rate limits | Failure modes | Example response |
|---|---|---|---|---|---|---|---|
| P0 | `list_notes` | Local Markdown files | `./data/*.md` | none | none | Data folder missing, empty folder, permission error | `{"tool":"list_notes","count":2,"files":[{"name":"git-basics.md","path":"data/git-basics.md"},{"name":"mcp-introduction.md","path":"data/mcp-introduction.md"}]}` |
| P0 | `search_notes` | Local Markdown files | `./data/*.md` | none | none | Data folder missing, unreadable file, empty query, no matches | `{"query":"Git","totalMatches":1,"results":[{"file":"git-basics.md","path":"data/git-basics.md","snippet":"Git is a version control system..."}]}` |
| P0 | `read_note` | Local Markdown file | `./data/<note-name>.md` | none | none | Invalid file name, file missing, unreadable file, permission error | `{"success":true,"tool":"read_note","fileName":"git-basics.md","path":"data/git-basics.md","content":"# Git Basics..."}` |
| P1 | `add_note` | Local Markdown file | `./data/<new-note-name>.md` | none | none | Invalid title, empty content, note already exists, permission error | `{"success":true,"tool":"add_note","fileName":"typescript-basics.md","path":"data/typescript-basics.md","message":"Note created successfully."}` |
| P1 | `update_note` | Local Markdown file | `./data/<note-name>.md` | none | none | Invalid file name, file missing, empty content, permission error | `{"success":true,"tool":"update_note","fileName":"git-basics.md","path":"data/git-basics.md","message":"Note updated successfully."}` |
| P1 | `append_note` | Local Markdown file | `./data/<note-name>.md` | none | none | Invalid file name, file missing, empty content, permission error | `{"success":true,"tool":"append_note","fileName":"git-basics.md","path":"data/git-basics.md","message":"Content appended successfully."}` |
| P1 | `delete_note` | Local Markdown file | `./data/<note-name>.md` | none | none | Invalid file name, file missing, confirmation missing, permission error | `{"success":true,"tool":"delete_note","fileName":"old-note.md","message":"Note deleted successfully."}` |

## Authentication

No authentication is required because the data is stored locally.

## Network Dependency

The tools do not require Wi-Fi or external APIs.

## File Format

Only Markdown files with the `.md` extension will be supported during
this cohort.