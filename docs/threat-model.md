# Week 4 Threat Model

## Assets

The main assets that need protection in our MCP server are:

- Markdown files stored inside the `./data` directory.
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

Tools such as `read_note`, `update_note`, `append_note`, and `delete_note` interact with local files. A malicious note name such as `../secret.txt` could attempt to access files outside `./data`.

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
| Path traversal | Resolve filename-only note paths against `./data`, reject Unix, Windows, absolute, and encoded path syntax, and verify that resolved paths remain inside the allowed directory. |
| Unsafe file modification/deletion | Allow only regular, non-symbolic-link Markdown files and validate targets before write or delete operations. |
| Oversized inputs/responses | Enforce centralized limits for note content, query length, file size, directory scans, aggregate search size, result counts, and returned output. |
| Invalid tool inputs | Use strict Zod schemas with trimming, length, range, enum, and format validation before processing tool arguments. |
| Information leakage | Return short safe messages and log bounded error codes to stderr without raw errors, inputs, paths, stack traces, or secrets. |

Registered tools make no network requests. If networking is introduced, the shared HTTP helper requires HTTPS, a caller-provided host allowlist, bounded response sizes, and a bounded timeout.

## Out of Scope

The following areas are outside the scope of Week 4:

- User authentication and authorization, because this is a local student MCP server rather than a multi-user production service.
- Database security, because the project currently uses local Markdown/text fixtures rather than a database.
- Production infrastructure security, deployment hardening, and distributed denial-of-service protection.
- Tool-specific SSRF controls, because the current tools do not accept URLs or require external network access.
- Enterprise secret-management systems, because the current project does not require API keys or other production secrets.

These areas may be reconsidered if the project later adds remote APIs, authentication, databases, or production deployment.
