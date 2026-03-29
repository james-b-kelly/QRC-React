# Development Log

## 2026-03-29 | QR code generation engine

TYPE: feature
FILES: src/lib/qr-engine/types.ts, matrix.ts, dots.ts, corners.ts, svg-renderer.ts, export.ts, formatters.ts, index.ts
COMMIT: 3385a27
CONTEXT: Core QR engine for QRC-15 — generates styled QR codes client-side with custom SVG rendering.
CHANGES:
- Matrix generation wrapper around `qrcode` npm package with finder pattern detection
- 5 dot styles: square, rounded, dots, classy, classy-rounded (SVG path generators)
- 4 corner square styles + 2 corner dot styles with proper evenodd fill-rule for cutouts
- SVG renderer with solid/gradient colors, background, margin, logo embedding
- Logo quiet zone clearing + auto error correction bump (Q for small logos, H for >10%)
- PNG export via canvas drawImage from SVG blob
- Data type formatters: URL, WiFi, vCard, email, phone, SMS
- Public API: generateQRCode(options) => { svg, toPNG }
DECISIONS:
- Build SVG strings directly (no DOM) for performance — no dependency on browser for generation
- Use evenodd fill-rule on corner square paths so all winding directions produce correct cutouts
- Removed shape-rendering="crispEdges" — breaks anti-aliasing on rounded/dot styles
- gradientUnits="userSpaceOnUse" on gradients so corners share same gradient sweep as data dots

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
