# QR Code Generator Site — Project Setup

## What This Is

You are setting up a brand new project from scratch: a pay-per-use custom QR code generator website. Users design styled QR codes (colors, dot shapes, rounded corners, logos) and purchase them for $1.99 each. No subscription. Competitors charge $40+/month.

## Your Task

Set up this project with the same quality of Claude Code ways-of-working as the Savor project (`/Users/jamiekelly/Projects/savor/`). This means:

### 1. Git repo init
- `git init` in `/Users/jamiekelly/Projects/qr/`
- Create a GitHub repo (use `gh repo create`) — private, under `james-b-kelly` org
- Push initial commit

### 2. React + Vite + Tailwind project scaffold
- Vite with React + TypeScript template
- Tailwind CSS
- Basic routing (React Router)
- Same proven stack as the Shoyu website

### 3. `.claude/CLAUDE.md` — ways of working
Model this closely on `/Users/jamiekelly/Projects/savor/CLAUDE.md` but adapted for this project. Key things to include:
- **Linear-driven workflow** with the **QR team** (`01acd6f2-f182-4783-9ed8-a7c245e8160d`)
- Label-driven gated workflow (same pattern as Savor: Ready for Planning → AI Evaluation → User Evaluation → Refinement → Implementation → Code Review → Testing)
- Linear state UUIDs for the QR team (query these — they'll be different from Savor's)
- Git conventions (commit message format with ticket prefix `QRC-XX:`, feature branches)
- Development log maintenance (same format as Savor)
- Multi-agent collaboration rules
- Context continuation via `.claude/context/NEXT-PROMPT.md`
- Voice transcription interpretation (user dictates via iOS)
- Plan ≠ implement rules
- The user is James Kelly (ID: `340f8b9f-882d-4e3b-9cf1-ecdac322f006`), Claude is `0968980b-b42d-4af7-b9bb-c2296b7de350`

### 4. Context files
- `.claude/context/DEVELOPMENT-LOG.md` — empty template ready for entries
- `.claude/context/EXTERNAL-SERVICES.md` — document Stripe, Vercel, Linear connections

### 5. Memory system
- Set up `/Users/jamiekelly/.claude/projects/-Users-jamiekelly-Projects-qr/memory/` with MEMORY.md
- Seed with initial project memory (what the product is, the Linear project, tech stack)

### 6. Notes structure
- Create a `notes/` folder for product notes, research, etc.

### 7. Vercel project
- Set up Vercel project and link to the repo
- Configure `main` branch for preview, `release-production` for production (or just `main` → production for now since it's early)

## Linear Context

- **Team**: QR (ID: `01acd6f2-f182-4783-9ed8-a7c245e8160d`)
- **Project**: QR Code Generator Site (ID: `e91107df-1db9-4db1-86b5-0dc05b0bb6c1`)
- **Existing tickets**: QRC-13 through QRC-20 (competitive research, project setup, generation engine, editor UI, Stripe, landing page, branding, file delivery)
- The ticket for THIS work is **QRC-14** (Project setup: React + Vite + Tailwind + Vercel)

## Product Summary

- Pay-per-use QR code generator — $1.99 per code, no subscription
- Full styling: dot shapes (rounded, dots, classy), corner styles, colors, gradients, logo embedding
- Tech: React + Vite + Tailwind, Vercel hosting, Stripe payments
- Client-side QR generation (proven approach — we built a custom SVG QR renderer for Shoyu using the `qrcode` npm package for matrix generation + custom SVG rendering)
- No user accounts needed — pure transactional

## Reference

- Savor's CLAUDE.md for ways-of-working patterns: `/Users/jamiekelly/Projects/savor/CLAUDE.md`
- Savor's implementation protocol: `/Users/jamiekelly/Projects/savor/.claude/IMPLEMENTATION-PROTOCOL.md`
- Savor's architecture principles: `/Users/jamiekelly/Projects/savor/.claude/ARCHITECTURE-PRINCIPLES.md`
- Savor's SwiftUI guidelines are NOT relevant (this is a web project)

## After Setup

Once the project is scaffolded and ways-of-working are configured, update QRC-14 in Linear to mark it done. Then save a continuation prompt for the next session to start on the editor MVP (QRC-15 + QRC-16).
