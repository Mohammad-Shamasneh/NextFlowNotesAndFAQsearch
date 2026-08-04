# Week 3 — Data Sources and Data Plan

## Overview

During Week 3, we connected the Notes & FAQ Search MCP project to real local data.

The project now uses Markdown files stored directly inside:

```text
./data/
```

Each note is stored as a separate `.md` file. This keeps the project simple, free, and fully functional without Wi-Fi or external APIs.

## What We Completed

- Reviewed the P0 and P1 tools defined in `docs/design.md`.
- Selected local Markdown files as the data source.
- Created the `data/` directory.
- Added sample `.md` note files to use as fixtures.
- Created `docs/data-plan.md`.
- Added the source, fixture path, authentication, rate limits, failure modes, and example response for every tool.
- Set authentication and rate limits to `none`.
- Confirmed that the project can work completely offline.
- Updated the tools to use the new data location.

## Tools Covered

### P0 Tools

- `list_notes`
- `search_notes`
- `read_note`

### P1 Tools

- `add_note`
- `update_note`
- `append_note`
- `delete_note`

All tools use the same data source:

```text
./data/
```

## Main Project Change

Before Week 3, the note files were stored directly inside:

```text
./notes/
```

The tools were also reading and writing files using that path.

During Week 3, we moved the note files into the required data directory:

```text
./data/
```

Because the old path was written inside the tool handlers, moving the files caused the tools to stop finding the note files.

For example, the tools previously used paths similar to:

```ts
resolve(process.cwd(), "notes");
```

The paths were updated to use:

```ts
resolve(process.cwd(), "data");
```

## Problems We Faced

### 1. Tools could not find the data directory

After moving the note files into `data/`, the tools were still searching in the old `notes/` location.

This affected all tools that read, create, update, append, or delete note files.

### 2. The path was repeated in multiple tools

Each tool had its own path definition. Therefore, changing the folder structure required updating several files instead of changing one shared value.

### 3. Response paths became inconsistent

Some responses returned paths such as:

```text
git-basics.md
```

while others returned:

```text
data/git-basics.md
```

The response paths needed to be reviewed so they followed the same format.

### 4. Keeping file access safe

The tools must only access files inside `data/`. We needed to keep the existing validation that prevents paths such as:

```text
../secret.md
```

from accessing files outside the data directory.

## How We Solved the Problems

- Updated the data directory path in every tool.
- Used `data/` as the single data location for both P0 and P1 tools.
- Reviewed the returned relative paths to keep responses consistent.
- Kept file-name validation and path-traversal protection.
- Tested the tools using local Markdown fixture files.
- Kept the data source offline with no authentication or external API dependency.

## Final Folder Structure

```text
NextFlowNotesAndFAQsearch/
├── data/
│   ├── course-faq.md
│   ├── git-and-github.md
│   ├── mcp-basics.md
│   ├── nodejs.md
│   ├── office-hours.md
│   ├── project-faq.md
│   └── typescript.md
├── docs/
│   ├── design.md
│   ├── data-plan.md
│   └── WEEK-3.md
├── src/
│   ├── lib/
│   ├── resources/
│   ├── schemas/
│   ├── tools/
│   └── index.ts
└── README.md
```

## Result

The project now has a clear local data source and can work without Wi-Fi.

The P0 and P1 tools use Markdown files from the same directory, and the Week 3 data plan documents the expected inputs, outputs, and failure cases.

## What We Learned

- File structure changes can affect every tool that uses a hard-coded path.
- Data paths should be defined consistently.
- Local fixture files make testing and Demo Day more reliable.
- Failure cases should be planned before completing the handlers.
- A shared data directory makes the project easier to understand and maintain.
