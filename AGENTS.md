# Working in Awesome Mobile Growth

Read `docs/EDITORIAL.md` before changing claims or resources. Use official platform documentation for volatile facts. Label observations, experiments, hypotheses, and opinions. Never invent search volume, conversion, revenue, testimonials, or platform behavior.

The site is a static Next.js export. Keep the workbench browser-local: never transmit draft fields, imported content, or filenames. Run `npm run verify` before shipping. Physical iPhone Safari and VoiceOver remain required manual checks before calling a release complete.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
