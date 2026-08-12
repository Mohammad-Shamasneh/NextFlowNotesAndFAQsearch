# Security Policy

## Supported Versions

Security support applies to the current state of this repository. The project
does not currently publish versioned releases.

## Reporting a Vulnerability

Report suspected vulnerabilities privately to the academy mentor at
`<MENTOR_EMAIL>`. Replace this placeholder with the mentor's real address before
submission. Do not disclose sensitive vulnerability details in a public GitHub
Issue.

## Security Controls Implemented

- Strict, bounded Zod schemas validate every MCP tool input.
- Centralized path resolution confines filename-only note access to `./data`.
- Only regular, non-symbolic-link Markdown (`.md`) note files are allowed.
- Note inputs, file reads, searches, listings, appends, and tool outputs have
  explicit size or count caps.
- Tool failures return short messages without raw errors, stack traces, absolute
  paths, or secrets; stderr logs contain only bounded error codes.
- Secret-bearing `.env` files are ignored while `.env.example` remains
  trackable. The current local-only tools require no secrets.
- Registered MCP tools make no network requests, so runtime host allowlisting
  and network timeout controls are currently not applicable. The unused shared
  HTTP helper requires HTTPS, an explicit caller-provided host allowlist,
  bounded responses, and a timeout for any future use.
