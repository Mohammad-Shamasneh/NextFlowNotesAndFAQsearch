# From "What's an MCP?" to Shipping One: Building NextFlowNotesAndFAQsearch

*A NextFlows Academy Cohort #1 project story — by Mohammad Shamasneh (with teammate Nadeen Jaber)*

Six weeks ago, if you had asked me what a Model Context Protocol server was, I
would have given you a blank look. Today, my teammate Nadeen and I have a working
MCP server live on GitHub — one that lets an AI assistant like Claude search,
read, and manage a folder of my own notes, completely offline. This is the story
of how we got there, from the first line of requirements to the final commit.

## Week 1 — Starting from zero

The program didn't assume we knew anything, and honestly that was the right call.
The first week was about getting set up: Node.js, Git, GitHub, and the shape of a
real repository. We cloned the academy starter repo and got the sample `greet`
tool running. It does almost nothing — it just returns a short greeting — but the
first time I connected the MCP Inspector, clicked **Connect**, opened the **Tools**
tab, and saw the server actually respond, something clicked. This wasn't a
tutorial anymore. It was a program I could talk to.

The lesson from Week 1 was simple but important: an MCP server is just a program
that exposes a set of **tools** to an AI over a transport (we used stdio). Once I
understood that mental model, everything after it made more sense.

## Week 2 — Deciding what to actually build

This is where the project became *ours*. We had to pick an idea and write a
design document before writing real code — and I'm glad we were forced to.

We chose **Notes & FAQ Search**: an offline server that helps you find
information buried in your personal Markdown notes without opening every file
by hand. You ask a natural-language question, the model picks the right tool, and
the answer comes back from your own files.

Writing the design doc meant answering hard questions up front. What is the
2–3 minute Demo Day story? Which tools are absolutely required? We settled on a
tool inventory and marked three as **P0** — the ones that *must* work:

- `list_notes` — list every note
- `search_notes` — search notes by keyword and return snippets
- `read_note` — return the full content of one note

Everything else (`add_note`, `update_note`, `append_note`, `delete_note`) was
P1 — nice to have, but not allowed to block the core experience. We also wrote
down what we would **not** build: no authentication, no cloud sync, no mobile UI,
no paid APIs. Deciding what to leave out was as valuable as deciding what to
include.

## Week 3 — Connecting the tools to real data

In Week 3 the stubs turned into something real. We wired the tools to an actual
`data/` folder full of Markdown files and validated every single tool input with
**Zod** schemas. This was my first time really appreciating schema validation:
instead of trusting whatever the model sends, each tool declares exactly the
fields it accepts and rejects anything else. `list_notes`, for example, takes no
arguments at all — and now it *enforces* that.

Watching `search_notes` return real snippets from real notes, and then having
`read_note` open the full file, was the moment the project felt genuinely useful.

## Week 4 — Making it safe and reliable

Anyone can write code that works when everything goes right. Week 4 was about
what happens when things go wrong — or when someone tries to make them go wrong.

Because the tools touch the file system, the biggest risk was **path traversal**:
a crafted `noteName` trying to escape the `data/` folder and read something it
shouldn't. So we centralized all path resolution so that filename-only access is
confined to `./data`, and we only allow regular, non-symlink `.md` files.

We didn't stop there. We added explicit **size and count caps** everywhere —
maximum note name length, maximum search query length, maximum file size,
maximum number of results, maximum tool output. If something is too big, it's
refused instead of eating memory. And when a tool fails, it returns a short,
clean message — no stack traces, no absolute paths, no leaking internal details.
We documented all of this in `SECURITY.md` and a threat model. This week changed
how I think about writing code: security isn't a feature you add at the end, it's
a set of decisions you make on every tool.

## Week 5 — Tests and docs people can actually follow

A project nobody can run is a project nobody will use. Week 5 was about testing
the security controls and writing documentation a stranger could follow.

We wrote tests for the security limits, and I put real effort into the README:
what the server does, exact requirements, install and run steps, a full table of
all eight tools with their inputs, example prompts, and — the part I'm proudest
of — a **Troubleshooting** section covering the three mistakes I actually made
myself during the cohort (strict schema errors, wrong note names, and running the
server from the wrong folder). Writing docs forced me to see my own project
through a beginner's eyes.

## Week 6 — Shipping it

The final week was about polish and Demo Day. We cleaned up the repo, added a
`LICENSE`, a landing page (`MCP-web.html`), and example conversations showing the
exact tool-call sequence for each scenario. Then we shipped it on GitHub:

**https://github.com/Mohammad-Shamasneh/NextFlowNotesAndFAQsearch**

## What I actually walked away with

The tools list is nice, but the real takeaways are bigger than the code:

- **A mental model for MCP** — a server is just tools exposed to an AI, and once
  you have that, the whole ecosystem opens up.
- **Design before code** — the Week 2 design doc saved us from scope creep and
  gave every later week a clear target.
- **Security as a habit** — validation, path confinement, and size caps are now
  the first things I think about, not the last.
- **Documentation is part of the product** — if someone can't run it, it doesn't
  exist.

Six weeks ago this was a blank repository and a lot of question marks. Now it's a
real, working MCP server I can demo in an interview and point to with pride. Huge
thanks to NextFlows Academy and our mentor for structuring a program that pushed
us to *ship*, not just study.

*Want to see the code? It's all here:
[NextFlowNotesAndFAQsearch on GitHub](https://github.com/Mohammad-Shamasneh/NextFlowNotesAndFAQsearch).
Learn more about the program at [NextFlows Academy](https://nextflows.ai/academy).*