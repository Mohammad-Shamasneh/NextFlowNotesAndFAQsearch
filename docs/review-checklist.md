# Week 4 Peer Review Checklist

## Review Information

- **Project:** NextFlow Notes and FAQ Search MCP
- **Repository:** https://github.com/Mohammad-Shamasneh/NextFlowNotesAndFAQsearch
- **Peer Reviewer:** Zaina Abusamra
- **Review Type:** Week 4 On-Site Peer Review
- **Reviewed PR:** `harden: validations + errors + SECURITY.md` (PR #3)

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

## What Worked Well

According to the peer review:

- Path traversal protection was implemented correctly and file access is restricted to the intended data directory.
- Symlink protection was implemented to prevent unsafe filesystem access.
- HTTP security includes HTTPS and host allowlisting.
- Security tests cover important cases including path traversal, oversized files, symlinks, and HTTP allowlisting.
- The project showed good overall progress in applying the Week 4 security hardening requirements.

## Issues Found

The peer reviewer identified the following items:

1. The hardening PR was missing before/after MCP Inspector screenshots showing a security attack being blocked.

2. `SECURITY.md` still contained the `<MENTOR_EMAIL>` placeholder and needed to be updated with the correct mentor contact information.

3. The `folder` field in `src/schemas/list-notes.ts` needed to be reviewed because it may not be used by the `list_notes` handler. It should either be used consistently or removed if it is unnecessary.

## Recommended Fixes

Based on the peer review, the following fixes were recommended:

- Add before/after MCP Inspector screenshots to the hardening PR to clearly demonstrate that unsafe input is rejected after the security changes.
- Replace the `<MENTOR_EMAIL>` placeholder in `SECURITY.md` with the correct mentor contact information.
- Review the `folder` field in `src/schemas/list-notes.ts`. If the field is required, make sure the `list_notes` handler uses it correctly; otherwise, remove it to keep the schema consistent with the implementation.

## Action Items

| Action Item | Owner | Due Date | Status |
| --- | --- | --- | --- |
| Add before/after MCP Inspector screenshots showing the security attack being rejected to the hardening PR. | Nadeen Jaber | ASAP – before Week 4 submission | Open |
| Replace `<MENTOR_EMAIL>` in `SECURITY.md` with the correct mentor contact information. | Mohammad Shamasneh | ASAP – before Week 4 submission | Open |
| Review the `folder` field in `src/schemas/list-notes.ts` and either use it correctly in the handler or remove it if unnecessary. | Nadeen Jaber | ASAP – before Week 4 submission | Open |

## Review Conclusion

The peer review confirmed that the main Week 4 security hardening measures are implemented, including path traversal protection, symlink protection, HTTP allowlisting, and security testing.

A small number of follow-up items were identified before the Week 4 submission is finalized. These items are documented above and will be addressed before the hardening work is considered complete.

**Peer Reviewer:** Zaina Abusamra

**Current Status:** Follow-up fixes required before final confirmation and merge.