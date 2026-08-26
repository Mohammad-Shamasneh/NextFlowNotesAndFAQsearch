# Final Reflection — Nadeen Jaber

## Wins

During the six-week Nextflows Academy MCP cohort, I contributed to the development, testing, documentation, and final preparation of **NextFlow Notes and FAQ Search**, a TypeScript-based MCP server.

One of my main contributions was testing the MCP tools throughout the project. I used MCP Inspector to verify successful tool calls as well as invalid and security-related inputs. I also worked on documenting the testing results and preparing evidence for the different project milestones.

I worked on connecting our local MCP server to Claude Desktop through stdio. After resolving the configuration issues, I tested the tools directly through Claude and verified that Claude could use multiple MCP tools from a single natural-language prompt. For example, Claude was able to search for an MCP note, read it, summarize its content, and create a new summary note.

By the end of the cohort, I had contributed to delivering a public and documented MCP project with seven working tools:
`list_notes`, `search_notes`, `read_note`, `add_note`, `update_note`, `append_note`, and `delete_note`.

## Blockers

One of the hardest parts for me was connecting the MCP server to Claude Desktop. The server was already working correctly in MCP Inspector, but Claude Desktop initially failed to locate `src/index.ts`.

I checked the MCP logs and discovered that the server was being started from the wrong location. I also checked the `npx` path on my Mac and updated the Claude Desktop MCP configuration with the correct absolute paths. After debugging these issues, I was able to get the server connected and the tools available inside Claude.

Another challenge for me was security testing. Instead of testing only successful requests, I had to understand how to deliberately test invalid inputs, path-traversal attempts, and other failure cases. This helped me understand why validation and safe error handling are important when exposing tools to an AI client.

## Resume Blurb

Contributed to the development and delivery of **NextFlow Notes and FAQ Search**, a TypeScript-based Model Context Protocol (MCP) server using MCP and Zod. Tested and validated seven MCP tools through MCP Inspector, including successful, invalid, and security-related scenarios, and contributed to secure filesystem handling and model-friendly error responses. Integrated and tested the local stdio MCP server with Claude Desktop, including multi-tool workflows from natural-language prompts. Contributed to project documentation, Git/GitHub workflows, testing evidence, and Demo Day preparation for a public, working MCP project.

## LinkedIn Draft

Over the past six weeks, I participated in the **Nextflows Academy MCP cohort**, where I worked with my teammate on building **NextFlow Notes and FAQ Search** using TypeScript, Zod, and the Model Context Protocol.

My contributions included testing MCP tools with Inspector, validating security and error cases, preparing project documentation and evidence, and connecting our local MCP server to Claude Desktop. One of the most interesting moments for me was seeing Claude take a single natural-language request and coordinate multiple tools to search for a note, read it, summarize it, and create a new note with the result.

This project gave me practical experience with MCP architecture, TypeScript, Zod validation, tool design, security testing, debugging, Git/GitHub workflows, and integrating AI clients with external tools and data.

## What I Would Improve Next

If I continued working on the project for another two weeks, I would improve the note search functionality by adding **semantic search**.

The current search mainly relies on text matching. I would experiment with embeddings and semantic similarity so that users could retrieve relevant notes based on meaning, even when their query does not contain the exact words used in the note.

This would make the MCP server more useful when working with larger note collections and knowledge bases.

## Thank You

I would like to thank our mentor and the Nextflows Academy team for their guidance, feedback, and reviews throughout the cohort. The feedback during each stage helped me understand how to improve the project, test it more carefully, and prepare it for a real end-to-end demonstration.