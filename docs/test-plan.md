# Week 5 Test Plan

This test plan covers the three P0 tools in the NextFlow Notes and FAQ Search MCP server: `list_notes`, `search_notes`, and `read_note`.

The test cases are written before execution. The `result` and `evidence` columns will be completed after running the tests in MCP Inspector.

## Manual Test Cases

| id | tool | setup | input | expected | result | evidence |
| --- | --- | --- | --- | --- | --- | --- |
| T01 | list_notes | Keep the normal Markdown fixtures in `data/`. | Use the valid input from `examples/list_notes.json`. | Returns a structured list of the available Markdown notes from `data/` without errors. | PASS | Fixed in commit `8e6bb9a` (updated `examples/list_notes.json` to `{}`) |
| T02 | search_notes | Keep the normal Markdown fixtures in `data/`. | Use the valid input from `examples/search_notes.json`. | Returns matching note results and snippets while respecting the configured result limit. | PASS | `docs/screenshots/t02-search-notes-input.png`, `docs/screenshots/t02-search-notes-result.png` |
| T03 | read_note | Keep the normal fixtures in `data/` and make sure the requested note exists. | Use the valid input from `examples/read-note.json`. | Returns the complete content of the requested note without accessing files outside `data/`. | PASS | — |
| T04 | list_notes | Start the MCP server normally with the standard fixtures. | Send an unexpected input field such as `{ "folder": "other" }`. | Rejects the unsupported input and the server remains running. | PASS | — |
| T05 | search_notes | Start the MCP server normally with the standard fixtures. | `{ "query": "" }` | Rejects the empty search query through input validation and returns a clean validation error. | PASS | `docs/screenshots/t05-search-notes-empty-input.png`, `docs/screenshots/t05-search-notes-validation-error.png` |
| T06 | read_note | Start the MCP server normally with the standard fixtures. | `{ "noteName": "../etc/passwd" }` | Rejects the unsafe path-traversal input and does not access any file outside `data/`. | PASS | — |
| T07 | list_notes | Temporarily move or rename the Markdown fixtures so that `data/` contains no note files. Restore all fixtures after the test. | `{}` | Returns an empty file list with a short message and does not crash. | PASS | `docs/screenshots/t07-list-notes-empty-result.png` |
| T08 | read_note | Simulate unavailable local data by temporarily renaming or moving the requested fixture, then restore it after the test. | Request the normally valid note while its fixture is unavailable. | Returns a short user-facing error indicating that the note cannot be read or found, while the MCP server remains running. | PASS | — |

## Fixture Reset Notes

- The normal test fixtures are stored in `./data`.
- Before happy-path tests, make sure all standard Markdown fixtures are present.
- For T07, temporarily move or rename the note fixtures and restore them immediately after the test.
- For T08, temporarily make the requested fixture unavailable and restore it immediately after the test.
- Do not permanently delete or modify the committed fixtures while performing the manual tests.

## Execution Notes

The tests will be executed manually using MCP Inspector in the next section.

The `result` column will be filled with `PASS` or `FAIL` after each test is executed.

The `evidence` column will contain the relevant screenshot or evidence reference for cases that require evidence, especially any case that initially fails and requires a fix.