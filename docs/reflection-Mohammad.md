# Final Reflection — Mohammad Shamasneh

Project: NextFlow Notes and FAQ Search MCP

## Wins

During the six-week Nextflows Academy MCP cohort, my main contribution was owning the Git/GitHub workflow and the security documentation side of **NextFlow Notes and FAQ Search**, a TypeScript-based MCP server with seven working tools.

I managed the repository end-to-end: setting up the repo, creating and updating pull requests, and handling the full submission-to-feedback cycle with our mentor across multiple weeks (Git kickoff, hardening PR, peer review checklist, and final reflection). I worked on `SECURITY.md`, replacing placeholder mentor contact information with real details, and made sure that our security evidence — Inspector screenshots, before/after attack demonstrations, and tool-level valid/invalid test results — actually lived inside the relevant PRs and issues themselves, not just in separate submission documents. This meant repeatedly reviewing mentor feedback, identifying exactly what evidence was missing or misplaced, and restructuring our documentation (like `docs/review-checklist.md`) so each P0 tool had a clear, verifiable valid-input and attack-input record.

By the end of the cohort, we had a public, documented MCP project on GitHub with clean PR history, a completed security hardening PR, and evidence that a reviewer could verify directly on GitHub without needing external files.

## Blockers

The hardest part for me personally was learning, through several rounds of "changes requested," that evidence needs to be self-contained inside the PR or issue itself — a linked PDF or an external write-up isn't enough for a reviewer to verify quickly. Early on, I submitted screenshots and write-ups as separate documents, and had to go back and re-embed everything directly into the PR body or comments.

Another challenge was coordinating submissions with my teammate under time pressure — making sure ownership of tasks was clear (who updates which file, who runs which test), and untangling situations where a PR got merged before mentor approval, or where our two individual reflections needed clearly separate voices instead of overlapping team language.

## Resume Bullet

Managed the Git/GitHub workflow and security documentation for NextFlow Notes and FAQ Search, a TypeScript-based Model Context Protocol (MCP) server built with Zod, including PR management, `SECURITY.md` hardening, and structuring verifiable MCP Inspector evidence (valid and attack-input tests) across a multi-week review cycle.

## LinkedIn Draft

Over the past six weeks, I worked as part of a two-person team in the Nextflows Academy MCP cohort, building NextFlow Notes and FAQ Search — a TypeScript MCP server with seven tools for managing Markdown notes. My focus was on the GitHub workflow and security documentation: managing pull requests through multiple review cycles, hardening `SECURITY.md`, and making sure our MCP Inspector evidence (valid calls and blocked attacks like path traversal) was clearly documented and verifiable directly inside our PRs. This project gave me hands-on experience with MCP, TypeScript, Zod, Git/GitHub collaboration under real mentor review, and writing evidence-backed technical documentation.

## What I Would Improve Next

If I continued working on this project, I would set up a CI check or PR template that automatically requires Inspector evidence (screenshots, valid/attack test results) to be present in the PR description before it can be merged, instead of relying on manual review and repeated feedback cycles to catch missing evidence.

## Thank You

Thank you to our mentor and the Nextflows Academy team for the detailed, iterative feedback throughout the six-week cohort — it pushed me to understand not just how to build the feature, but how to document and prove it clearly for a reviewer.