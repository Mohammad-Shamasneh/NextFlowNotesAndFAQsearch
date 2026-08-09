# Week 4 Threat Model

## Assets

The main assets that need protection in our MCP server are:

- Markdown and text files stored inside the `./data` directory.
- The host machine's filesystem outside the `./data` directory.
- Note contents returned by `read_note` and `search_notes`.
- The integrity of notes modified by `add_note`, `append_note`, `update_note`, and `delete_note`.
- Environment variables or tokens if external services are added later.

The current project does not require API keys or other secrets.

## Trust Boundaries

The main trust boundaries in the project are:

1. **Model → Tool Arguments**
   - Tool inputs such as `noteName`, `query`, `limit`, `title`, `body`, and `folder` must be treated as untrusted input.

2. **Tool → Filesystem**
   - Several tools read, create, modify, or delete files in `./data`.
   - User-controlled input must never allow access outside this directory.

3. **Tool → Network**
   - The current P0 note tools do not require network access.
   - A shared HTTP helper exists for possible future API-backed tools, so future network requests must use controlled URLs and timeouts.

## Top 5 Risks

### 1. Path Traversal

Tools such as `read_note`, `list_notes`, `update_note`, `append_note`, and `delete_note` interact with local files. A malicious note name such as `../secret.txt` could attempt to access files outside `./data`.

### 2. Unsafe File Modification or Deletion

The write tools can modify or permanently delete local notes. Invalid or manipulated filenames could cause the wrong file to be changed or removed.

### 3. Oversized Inputs and Runaway Responses

Large note bodies, very large files, large search limits, or many search results could produce excessive memory usage or responses that consume too much model context.

### 4. Invalid or Unexpected Tool Inputs

Tool arguments come from the model and cannot be assumed to have the expected format. Empty strings, invalid limits, malformed filenames, or unexpected values could cause incorrect behavior.

### 5. Sensitive Information Leakage

Internal filesystem paths, stack traces, environment variables, or other implementation details could accidentally be exposed through tool responses, logs, or committed files.

## Mitigations This Week

| Risk | Mitigation |
| --- | --- |
| Path traversal | Resolve file paths against `./data`, reject `..`, `/`, and `\` where appropriate, and verify that resolved paths remain inside the allowed directory. |
| Unsafe file modification/deletion | Allow only supported note filenames and extensions and validate targets before write or delete operations. |
| Oversized inputs/responses | Add limits for note content, query length, file size, and number of returned results. |
| Invalid tool inputs | Strengthen Zod schemas with length, range, and format validation before processing tool arguments. |
| Information leakage | Log detailed failures to stderr while returning short, user-friendly error messages without internal paths, stack traces, or secrets. |

Network requests, if introduced, will use the shared HTTP helper with a timeout and controlled destinations.

## Out of Scope

The following areas are outside the scope of Week 4:

- User authentication and authorization, because this is a local student MCP server rather than a multi-user production service.
- Database security, because the project currently uses local Markdown/text fixtures rather than a database.
- Production infrastructure security, deployment hardening, and distributed denial-of-service protection.
- Advanced SSRF protection for arbitrary user-provided URLs, because the current P0 tools do not accept URLs or require external network access.
- Enterprise secret-management systems, because the current project does not require API keys or other production secrets.

These areas may be reconsidered if the project later adds remote APIs, authentication, databases, or production deployment.