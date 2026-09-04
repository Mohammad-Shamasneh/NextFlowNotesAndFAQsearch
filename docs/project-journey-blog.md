# From an Idea to a Working MCP Server: Our Nextflows Academy Journey

Over six weeks in the Nextflows Academy MCP Cohort, we went from learning what the Model Context Protocol (MCP) is to building a complete MCP server that an AI client can actually use.

Our project, **NextFlow Notes & FAQ Search**, became much more than a course assignment. It gave us the opportunity to work through the full process of understanding requirements, designing tools, implementing them, testing and securing the server, documenting our work, and finally connecting it to Claude for an end-to-end demonstration.

## Starting with the Requirements

At the beginning of the cohort, MCP was a new concept for us. Our first step was understanding the basic architecture and the difference between tools, resources, and prompts.

We learned that MCP provides a standard way for an AI application to interact with external tools and data instead of building a separate custom integration for every application.

After understanding the basic concepts, we started planning our own MCP server.

We chose to build **Notes & FAQ Search**, a server that allows an AI assistant to interact with a local collection of Markdown notes. We wanted the project to remain simple enough to understand clearly while still demonstrating useful MCP functionality.

We defined the tools we wanted the AI to use and separated them according to their responsibilities.

Our final server provides seven tools:

- `search_notes`
- `list_notes`
- `read_note`
- `add_note`
- `update_note`
- `append_note`
- `delete_note`

Each tool performs one clear operation on the local Markdown knowledge base.

## Turning the Design into a Working Server

Once the design was ready, we started implementing the server using **TypeScript**.

One of our main goals was to keep the MCP-specific registration code separate from the logic responsible for working with the notes. This made the project easier to understand, test, and maintain.

We moved from initial tool definitions to tools that worked with real Markdown files stored locally in the project.

For example, `search_notes` searches the notes and returns relevant results, `read_note` retrieves the content of a selected note, and the write tools allow notes to be created, updated, appended to, or deleted.

At this point, the project started to feel like a real application rather than a collection of individual exercises.

## Testing with MCP Inspector

Testing was an important part of our development process.

We used **MCP Inspector** throughout the cohort to connect to the server, discover the available tools, provide inputs, and inspect their responses.

We tested the tools individually with real note data and verified both successful and unsuccessful requests.

This was especially useful because it allowed us to see the MCP interaction directly before connecting the server to a full AI client.

As the project developed, testing also helped us identify problems with schemas, inputs, file names, and error handling.

## Validation and Security Hardening

Making the tools work was only one part of the project. We also needed to make sure they handled unsafe or incorrect requests properly.

We used **Zod** to validate tool inputs before processing them.

We also worked on protecting local file access. Since the server reads and modifies files, it was important to prevent unsafe paths and make sure operations remained inside the intended notes directory.

During the hardening stage, we tested cases such as invalid inputs and path-traversal attempts. We also improved the error responses so that the AI receives a short and useful message instead of raw internal errors or stack traces.

This stage changed the way we thought about tool development. A tool is not complete simply because the successful case works; it also needs to behave safely when something goes wrong.

## Documentation and Making the Project Reproducible

Another important goal was making sure someone outside our team could understand and run the project.

We improved the README with the project purpose, requirements, installation instructions, run commands, the MCP Inspector command, the tool table, example prompts, troubleshooting information, and security documentation.

We also maintained example inputs and conversations so that users could understand how the tools were expected to behave.

This helped us think about the project from the perspective of someone seeing the repository for the first time.

## Connecting the Server to Claude

One of the most exciting parts of the project was moving beyond Inspector and connecting our MCP server to **Claude Desktop**.

This step was also one of the more challenging parts of the journey.

Although the server worked in Inspector, connecting it to Claude required us to correctly configure the local stdio server and its paths. When the connection did not initially work as expected, we inspected the logs, checked the working directory and executable paths, and corrected the configuration.

Eventually, Claude was able to discover and call our MCP tools successfully.

That was the point where the complete idea behind MCP became much clearer to us: instead of manually calling a function, we could give the AI a natural-language request and allow it to choose and coordinate the appropriate tools.

## One Prompt, Multiple Tools

One of our final tests demonstrated this clearly.

We asked Claude to find our note about MCP, open the most relevant note, summarize it, and create a new note containing that summary.

From one natural-language request, Claude was able to use multiple tools in sequence: searching the notes, reading the relevant file, and creating a new note with the generated summary.

This was one of the most rewarding moments of the project because it brought together the different pieces we had developed throughout the cohort.

The individual tools were no longer isolated functions. Together, they formed a useful workflow that an AI client could reason about and use.

## Preparing for Demo Day

During the final stage, we focused on making the repository clean, documented, tested, and ready to demonstrate.

We prepared a timed demo, presentation material, example prompts, and a backup plan. We also reviewed the repository from the perspective of someone cloning it for the first time.

Our final demonstration showed both individual tool functionality and a multi-tool workflow through Claude.

By the end of the six weeks, **NextFlow Notes & FAQ Search** had grown into a working MCP server with seven tools, local Markdown data, Zod validation, security protections, documentation, testing, and an end-to-end AI client integration.

## What We Learned

This project gave us practical experience beyond simply learning a new protocol.

We learned how to:

- Design focused tools with clear responsibilities.
- Build an MCP server using TypeScript.
- Validate tool inputs using Zod.
- Work safely with local files.
- Test MCP tools using Inspector.
- Handle errors without exposing unnecessary internal information.
- Debug an MCP integration with an AI client.
- Use Git and GitHub throughout a multi-week team project.
- Document a technical project so another person can run it.
- Collaborate as a team while moving from requirements to a final demonstration.

Most importantly, we learned how the Model Context Protocol can connect AI models with real tools and data in a structured and controlled way.

## Looking Forward

If we continued developing the project, one area we would like to explore is **semantic search**.

Our current note search mainly relies on text matching. Adding embeddings and semantic similarity could allow the server to find relevant information even when the user's query does not contain the exact words used in a note.

We would also continue expanding automated testing and explore additional MCP capabilities as the project grows.

## Final Thoughts

The six-week journey took us from learning the fundamentals of MCP to seeing an AI client successfully use the server we built.

There were challenges along the way, particularly around validation, security, testing, and the final Claude integration, but solving those problems was an important part of the experience.

Seeing Claude successfully coordinate our tools from a natural-language request made the work throughout the cohort come together.

**NextFlow Notes & FAQ Search was built by Nadeen Jaber and Mohammad Shamasneh as part of the Nextflows Academy MCP Cohort.**

We would like to thank our mentor and the Nextflows Academy team for their guidance, feedback, and support throughout the journey.