# QR Code Generator Site

Pay-per-use custom QR code generator website. Users design styled QR codes (colors, dot shapes, rounded corners, logos) and purchase them for $1.99 each. No subscription. No user accounts required.

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Vercel hosting
- Stripe payments (one-time $1.99 per QR code)
- Client-side QR generation (qrcode npm package for matrix + custom SVG rendering)

## Voice Transcription Input

The user often dictates messages via iOS voice transcription, which produces garbled text. Always interpret the intent rather than the literal text. Common patterns:
- **Duplicated first word**: "okokay" = "okay", "letlet's" = "let's", "cancan" = "can"
- **Garbled words**: sound out phonetically to figure out the intended word
- **Missing spaces/punctuation**: run words together or miss capitals
- Never ask "did you mean...?" for obvious transcription errors — just understand and respond naturally.
- **Exception**: If the interpreted message sounds destructive, confirm with the user before acting.

## ABSOLUTE RULE: Plans Are NOT Implementation Requests

**DO NOT IMPLEMENT plans, specs, or design documents when they are shared with you.** This is non-negotiable.

### How to detect a plan document

If the user's message contains ANY of these, it is a PLAN DOCUMENT:
- Markdown headers like `## WU-1`, `## Context`, `## Changes`, `## Work Unit`
- Structured lists of file changes (New/Modify/Delete with file paths)
- Dependency graphs between work units
- The words "plan", "spec", "gap analysis", "design document" in a title header
- More than 2 paragraphs of structured technical content describing future changes

### What to do when you detect a plan document

1. **STOP.** Do not create tasks. Do not start coding.
2. **WRITE** the plan to the Linear ticket description (or create a ticket if none exists).
3. **Apply `Ready for AI Evaluation`** and proceed with evaluation, then apply `Ready for User Evaluation`.

### The ONLY thing that means "write code"

The ticket must have the `Ready for Implementation` label AND the user must give an explicit instruction like "start coding WU-1" or "implement the next work unit". Even then, confirm scope first.

## Multi-Agent Collaboration

**This project may be developed by multiple AI agents** sharing the same repo, Linear workspace, and ways-of-working.

### Core Principles

1. **You will encounter unfamiliar work.** Commits, branches, Linear updates, and file changes you didn't make are expected. Never overwrite, revert, or delete another agent's work without user confirmation.
2. **Linear is the coordination layer.** Check ticket assignees and status before claiming work.
3. **Pull before you push.** Always `git pull` before starting work to pick up changes.
4. **Feature branches provide isolation.** Each agent works on its own feature branch.

### Practical Rules

- **Starting a session**: `git fetch origin`. Check if `main` has moved since your last interaction.
- **Starting a feature branch**: Always branch from `origin/main`.
- **Discovering unexpected changes**: Investigate, don't delete.
- **Claude Active = hands off** — NEVER action a ticket with the `Claude Active` label.

## Ways of Working — Linear-Driven Workflow

**Linear is the single source of truth for all planning, tracking, and work coordination.**

### "Let's Get to Work" — Auto-Queue from Linear

When the user says "let's get to work", "let's work", "get to work", or similar — **automatically check Linear for actionable QR tickets**. Filter to the **QR team only**. Check for any active feature branches ahead of main and report them. Query by label in **`In Progress`** and **`Todo`** states (ignore Backlog/Done). Search labels in priority order: `Ready for Code Review` > `Ready for Implementation` > `Ready for AI Evaluation` > `Ready for Refinement` > `Ready for Planning`. **Skip any ticket that has the `Claude Active` label.** Prioritize In Progress over Todo, then by Linear priority. Present findings and immediately start on the top ticket.

### Linear State Names (exact values for MCP queries)

| State | UUID | Type |
|-------|------|------|
| `Backlog` | `e9e552ec-d020-4c9c-8afd-55a07a92e535` | backlog |
| `Todo` | `b4727324-7523-438d-9722-6b6cc130481e` | unstarted |
| `In Progress` | `1754f101-ebd7-42c8-9ae6-6127c098a1c5` | started |
| `In Review` | `7f0386f9-9044-4552-b76c-fcef5208a20d` | started |
| `Done` | `7cb36895-3d43-4134-b378-c54481237b42` | completed |
| `Canceled` | `d03d34d3-2e56-470d-be6c-409ed70a4875` | canceled |
| `Duplicate` | `f91dd7dc-725c-4b8d-9ee5-052a9a1acbf1` | canceled |

**CRITICAL**: Use these exact state names when querying Linear MCP. `Todo` has NO space.

### Workflow Label UUIDs

| Label | UUID |
|-------|------|
| `Ready for Planning` | `8f24202a-b151-4738-b501-f4b685974c51` |
| `Ready for AI Evaluation` | `528ce4f4-d4cf-4ad6-973e-732b86fe0ddd` |
| `Ready for User Evaluation` | `98ada359-bc3c-4f02-a95d-3111b91ec48a` |
| `Ready for Refinement` | `d1861868-8e59-4f0c-afa6-978b6753d96a` |
| `Ready for Implementation` | `27f41380-ff75-4b0a-8f9a-5f9bfc340403` |
| `Ready for Code Review` | `e65070a6-8504-46c2-bed8-a555fe653213` |
| `Ready for Testing` | `62c8ea3b-d69a-485d-ad2b-5086df7967d0` |
| `Fast Track` | `ae3070e8-9e3d-4cfc-a26e-173a6ae8133a` |
| `Claude Active` | `58ff9510-6be0-4411-b2d3-107d4c36ce12` |
| `Blocked` | `6fef503f-ae02-4d80-8e72-a25c276e6b2f` |
| `Feature` | `2a276ef5-eb06-4cb2-ac3b-ff32be112f3b` |
| `Bug` | `87766c29-bd77-4e1e-b7c6-1448653e8432` |
| `Improvement` | `36672e2e-ddf4-4798-934e-802f1e9b57c9` |
| `Tech debt` | `8446160d-5476-4b6e-9d82-1cf04e034120` |

### Key Rules (Quick Reference)

- **MANDATORY: Update Linear at every transition** — label changes, state changes, and assignee changes.
- **Assignees** — assign to Claude (`0968980b-b42d-4af7-b9bb-c2296b7de350`) when starting work, assign to James Kelly (`340f8b9f-882d-4e3b-9cf1-ecdac322f006`) at user gates (Ready for User Evaluation, Ready for Testing, In Review, Blocked).
- **Feature branches** — ALL code work happens on feature branches (`qrc-{number}-{slug}`), never directly on `main`.
- **Labels drive actions** — Claude drives transitions up to `Ready for Testing`; user drives after that.
- **What to test** — when moving a ticket to `Ready for Testing` / `In Review`, prepend: `**What to test:** <summary>` followed by `---` separator.
- **Code review loop** — after implementation, Claude runs the code-reviewer agent (up to 3 iterations) before offering `Ready for Testing`.
- **Fast Track** — one-shot tickets where Claude drives the entire workflow autonomously.
- **Ticket lookups** — when instructed to work on ticket numbers (e.g. "QRC-15"), use Linear MCP.
- **Ticket creation** — always set assignee and labels. Workflow labels pair with assigning to Claude. If assigned to James Kelly, no workflow label needed.
- **Plans** go in Linear ticket descriptions, **work units** become child tickets.
- **State IDs** — always use UUIDs when setting Linear issue state via MCP.
- **Ticket description formatting** — use actual multi-line content. **NEVER use `\n` escape sequences** — MCP double-escapes them.

## Context Continuation

When a session ends and work needs to continue in a fresh context, the continuation prompt is saved to `.claude/context/NEXT-PROMPT.md`.

**When ending a session**: Write a detailed prompt that includes everything a fresh context needs.

**When starting a session**: If the user says "continue" or similar — read `.claude/context/NEXT-PROMPT.md` and follow it. Delete the file after reading.

## Branching Strategy

- **Feature branches for every ticket**: All code work happens on a feature branch named `qrc-{number}-{brief-slug}` (e.g., `qrc-15-editor-ui`). **Never commit code directly to `main`**.
- **`main`**: The integration branch. Feature branches are merged here after code review.
- **Merge protocol**: After code review passes, `git fetch origin && git checkout main && git pull origin main`, then merge the feature branch (`--no-ff`), push, and delete the feature branch.

## Git

- Prefix commit messages with ticket number: `QRC-XX: Brief description`
- Keep messages short, single-lined, high level only.
- Commit ALL uncommitted files unless something looks unrelated (confirm with user).
- When asked to log and commit, log BEFORE staging and committing.

## Development Log Maintenance

**AUTOMATIC BEHAVIOR**: Claude Code automatically maintains development logs.

### File Structure

- **Active log**: `.claude/context/DEVELOPMENT-LOG.md`
- **Archive**: `.claude/context/log-archive/`

### When to Read the Active Log

- **Session start**: If the user says "continue" or references prior work
- **Missing context**: If the user discusses something not in current conversation
- When user references external service code, check `.claude/context/EXTERNAL-SERVICES.md`

### When to Write to the Active Log

Automatically add entries after completing: feature implementations, bug fixes, refactoring, architectural decisions, configuration changes, any work resulting in a commit.

### Entry Format

```
## YYYY-MM-DD | Brief title

TYPE: feature|bug|refactor|config|architecture|etc
FILES: path/to/file1, path/to/file2
COMMIT: hash (if applicable)
CONTEXT: Why this was needed (1-2 sentences)
CHANGES:
- Bullet list of what changed
- Technical details, function names, key code patterns
DECISIONS:
- Key architectural/implementation decisions made
- Trade-offs chosen
```

### Log Rotation

- **Max 250 lines** in the active log
- Before adding, check line count. If exceeding 250 lines, archive oldest entries to `.claude/context/log-archive/DEVELOPMENT-LOG-YYYY-MM-DD.md`.

## Project Structure

```
qr/
├── src/
│   ├── components/     # Shared UI components
│   ├── pages/          # Route-level page components
│   ├── main.tsx        # App entry point
│   ├── App.tsx         # Router configuration
│   └── index.css       # Tailwind imports
├── public/             # Static assets
├── .claude/
│   ├── context/        # Dev log, external services, continuation prompts
│   └── plans/          # Implementation plans
├── notes/              # Product notes, research
├── index.html          # Vite entry HTML
├── vite.config.ts      # Vite + Tailwind config
└── CLAUDE.md           # This file
```

## Linear Context

- **Team**: QR (ID: `01acd6f2-f182-4783-9ed8-a7c245e8160d`)
- **Project**: QR Code Generator Site (ID: `e91107df-1db9-4db1-86b5-0dc05b0bb6c1`)
- **User (James Kelly)**: `340f8b9f-882d-4e3b-9cf1-ecdac322f006`
- **Claude**: `0968980b-b42d-4af7-b9bb-c2296b7de350`
