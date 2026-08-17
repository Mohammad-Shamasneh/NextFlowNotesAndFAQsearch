# Week 4 Peer Review Checklist

## Review Information

- **Project:** NextFlow Notes and FAQ Search MCP
- **Repository:** https://github.com/Mohammad-Shamasneh/NextFlowNotesAndFAQsearch
- **Peer Reviewer:** Zaina Abusamra
- **Review Type:** Week 4 On-Site Peer Review
- **Reviewed PR:** `harden: validations + errors + SECURITY.md` (PR #4)

## Review Scope

The peer review covered:

- Zod schemas and input validation
- Error handling
- Filesystem and path traversal protection
- Symlink protection
- HTTP security and host allowlisting
- Secrets and `SECURITY.md`
- Security tests
- MCP Inspector evidence
- P0 tool hardening
- Valid and invalid P0 tool calls in MCP Inspector

## What Worked Well

According to the peer review:

- Path traversal protection was implemented correctly and file access is restricted to the intended data directory.
- Symlink protection was implemented to prevent unsafe filesystem access.
- HTTP security includes HTTPS and host allowlisting.
- Security tests cover important cases including path traversal, oversized files, symlinks, and HTTP allowlisting.
- P0 tools return real data from the local fixtures rather than stub responses.
- Invalid and unsafe inputs are rejected with clear validation messages.
- The project showed good overall progress in applying the Week 4 security hardening requirements.

## Issues Found

The peer reviewer identified the following items:

1. The hardening PR was missing before/after MCP Inspector screenshots showing a security attack being blocked.

2. `SECURITY.md` still contained the `<MENTOR_EMAIL>` placeholder and needed to be updated with the correct mentor contact information.

3. The `folder` field in `src/schemas/list-notes.ts` needed to be reviewed because it was not used by the `list_notes` handler. It should either be used consistently or removed if unnecessary.

4. The peer review checklist needed explicit MCP Inspector evidence showing valid and invalid/attack cases for the P0 tools.

## Recommended Fixes

Based on the peer review, the following fixes were recommended:

- Add before/after MCP Inspector screenshots to the hardening PR to clearly demonstrate that unsafe input is rejected after the security changes.
- Replace the `<MENTOR_EMAIL>` placeholder in `SECURITY.md` with the correct mentor contact information.
- Remove the unused `folder` field from `src/schemas/list-notes.ts` so that the schema matches the implementation.
- Run the three P0 tools in MCP Inspector and document valid and invalid/attack cases and their results.

## P0 Tool Inspector Tests

The three P0 tools defined in `docs/design.md` are `list_notes`, `search_notes`, and `read_note`.

### 1. `list_notes`

#### Valid Input

```json
{}
```

**Result:** PASS

The tool successfully returned 8 real Markdown note files from the local data directory.

Example result:

```json
{
  "tool": "list_notes",
  "count": 8,
  "message": "Found 8 note file(s)."
}
```

#### Invalid Input Review

After hardening, `list_notes` accepts no tool arguments. MCP Inspector therefore exposes no input fields for this tool.

The input schema is strict and the tool operates only on the fixed local data directory. The previously unused `folder` argument was removed so that the schema matches the handler.

**Result:** PASS

---

### 2. `search_notes`

#### Valid Input

```json
{
  "query": "Git",
  "limit": 5
}
```

**Result:** PASS

The tool successfully searched the local fixtures and returned 2 matching notes:

- `course-faq.md`
- `git-and-github.md`

The response included matching snippets from the real note content.

#### Invalid Input

An empty search query was tested in MCP Inspector.

```text
query = [empty]
```

The input was rejected by the validation rules because the search query must contain at least one non-whitespace character.

The schema also enforces a maximum search result limit of 20. MCP Inspector prevents a value greater than this configured maximum from being submitted through the generated input form.

**Result:** PASS

---

### 3. `read_note`

#### Valid Input

```json
{
  "noteName": "mcp-basics.md"
}
```

**Result:** PASS

The tool successfully returned the real contents of `data/mcp-basics.md`.

The response confirmed:

```json
{
  "success": true,
  "tool": "read_note",
  "fileName": "mcp-basics.md",
  "path": "data/mcp-basics.md"
}
```

#### Invalid / Attack Input

A path-traversal attempt was tested:

```json
{
  "noteName": "../etc/passwd"
}
```

MCP Inspector rejected the request with:

```text
Tool Error
Input validation error: Invalid arguments for tool read_note:
noteName: The requested note path is not allowed.
```

No file outside the allowed data directory was accessed.

**Result:** PASS

## Inspector Test Summary

| P0 Tool | Valid Test | Invalid / Attack Test | Status |
| --- | --- | --- | --- |
| `list_notes` | Returned 8 real notes | No unsupported input fields exposed after hardening | PASS |
| `search_notes` | `Git` returned 2 matching notes | Empty query rejected by validation | PASS |
| `read_note` | Read `mcp-basics.md` successfully | `../etc/passwd` rejected | PASS |

## Action Items

| Action Item | Owner | Due Date | Status |
| --- | --- | --- | --- |
| Add before/after MCP Inspector screenshots showing the security attack being rejected to the hardening PR. | Nadeen Jaber | ASAP – before Week 4 submission | Fixed |
| Replace `<MENTOR_EMAIL>` in `SECURITY.md` with the correct mentor contact information. | Mohammad Shamasneh | ASAP – before Week 4 submission | Fixed |
| Review the `folder` field in `src/schemas/list-notes.ts` and either use it correctly in the handler or remove it if unnecessary. | Nadeen Jaber | ASAP – before Week 4 submission | Fixed |
| Document valid and invalid/attack Inspector results for all three P0 tools. | Nadeen Jaber | ASAP – before final Week 4 review | Fixed |

## Review Conclusion

The peer review confirmed that the main Week 4 security hardening measures are implemented, including path traversal protection, symlink protection, HTTP allowlisting, bounded inputs and outputs, and safe error handling.

The three P0 tools were also reviewed through MCP Inspector. `list_notes` returned the expected local fixtures, `search_notes` successfully returned real search results and rejected invalid input, and `read_note` successfully read an allowed note while rejecting a path-traversal attack.

All identified peer review action items have now been addressed.

**Peer Reviewer:** Zaina Abusamra

**Current Status:** All peer review action items have been addressed. Awaiting final peer/mentor confirmation before merge.