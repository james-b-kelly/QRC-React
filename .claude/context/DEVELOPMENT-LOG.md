# Development Log

## 2026-03-29 | Project scaffold setup

TYPE: config
FILES: vite.config.ts, src/main.tsx, src/App.tsx, src/components/Layout.tsx, src/pages/Home.tsx, src/index.css, CLAUDE.md
COMMIT: initial commit
CONTEXT: Set up the QR code generator site project from scratch per QRC-14.
CHANGES:
- Scaffolded React + Vite + TypeScript project
- Configured Tailwind CSS via @tailwindcss/vite plugin
- Added React Router with BrowserRouter, basic route structure
- Created Layout component (header, main outlet, footer)
- Created Home page with hero section and CTA
- Wrote CLAUDE.md with Linear-driven workflow, team state UUIDs, label UUIDs, branching strategy
- Created Linear workflow labels: Ready for AI Evaluation, Ready for User Evaluation, Ready for Implementation, Ready for Code Review, Ready for Testing
DECISIONS:
- Using @tailwindcss/vite (Tailwind v4) instead of PostCSS plugin — simpler config
- Single repo (no separate project/code repos like Savor) — this is a web-only project
- main branch for integration, feature branches for work, production deployment TBD
