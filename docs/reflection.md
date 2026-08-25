# Cohort Reflection

## Wins

During the six-week Nextflows Academy MCP cohort, our team built and shipped **NextFlow Notes and FAQ Search**, a working MCP server developed with TypeScript.

As a team, we implemented seven working tools:

- `list_notes`
- `search_notes`
- `read_note`
- `add_note`
- `update_note`
- `append_note`
- `delete_note`

We progressed from the initial MCP setup to a complete server backed by real Markdown note data. We tested our tools using MCP Inspector and later connected the local MCP server to Claude Desktop through stdio for an end-to-end demonstration.

Throughout the project, we also improved input validation with Zod, filesystem security, path handling, error responses, testing, documentation, example conversations, and the README. By the end of the cohort, we had a documented and demo-ready MCP project on GitHub.

## Blockers

One of the main challenges our team faced was moving from a server that worked in MCP Inspector to one that also worked correctly with Claude Desktop.

During the Claude Desktop integration, we encountered issues related to the working directory and the path used to start `src/index.ts`. We used the MCP logs to identify the problem and corrected the configuration so Claude Desktop could successfully start and communicate with our local server.

Another challenge was security hardening. We needed to make sure that invalid inputs, path-traversal attempts, oversized inputs, and unsafe file access were rejected cleanly without exposing internal filesystem or stack-trace information.

Testing and documentation were also important challenges because we wanted someone outside our team to be able to clone the repository, follow the README, and successfully run the project.

## Resume Blurb

Collaborated in a team to build and ship **NextFlow Notes and FAQ Search**, a TypeScript-based Model Context Protocol (MCP) server using MCP and Zod. Developed and tested tools for searching, reading, creating, updating, appending, listing, and deleting Markdown notes with secure filesystem handling and model-friendly error responses. Contributed to validation, security hardening, MCP Inspector testing, documentation, and Claude Desktop integration. Delivered a documented GitHub project with seven working tools and an end-to-end MCP demonstration.

## LinkedIn Draft

Over the past six weeks, my team and I worked on building **NextFlow Notes and FAQ Search** as part of the Nextflows Academy MCP cohort.

We developed a TypeScript-based MCP server that allows AI clients to search, read, create, update, append, list, and delete Markdown notes. Throughout the cohort, we moved from the initial MCP setup to real data-backed tools, added Zod validation and security hardening, tested our server using MCP Inspector, and connected it to Claude Desktop for an end-to-end demonstration.

Working on this project gave us hands-on experience with the Model Context Protocol, TypeScript, Zod, tool design, validation, testing, debugging, Git/GitHub workflows, documentation, and teamwork.

I especially valued seeing how individual components developed throughout the cohort came together into a complete MCP server that an AI client could actually use.

## What We Would Improve Next

If we continued developing the project for another two weeks, one concrete improvement we would make is adding **semantic search**.

Currently, note searching mainly depends on text matching. We would explore embeddings and semantic similarity so users could find relevant notes even when their query does not contain the exact words used in the note.

We would also expand automated testing around the complete MCP tool flow to make future development and changes safer.

## Thank You

Thank you to our mentor and the Nextflows Academy team for the guidance, feedback, reviews, and support throughout the six-week cohort.

We also appreciate the teamwork and collaboration that helped us take the project from an initial MCP setup to a complete, tested, and demo-ready server.