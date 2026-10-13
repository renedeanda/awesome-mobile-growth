# Working in Awesome Mobile Growth

Read `docs/EDITORIAL.md` before changing claims or resources. Use official platform documentation for volatile facts. Label observations, experiments, hypotheses, and opinions. Never invent search volume, conversion, revenue, testimonials, or platform behavior.

The site is a static Next.js export. Keep the workbench browser-local: never transmit draft fields, imported content, or filenames. Run `npm run verify` before shipping. Physical iPhone Safari and VoiceOver remain required manual checks before calling a release complete.

## Keep the public repository public

Everything committed here is for visitors, contributors, or people running the open source project. Before adding a tracked file, comment, example, checklist, or documentation section, ask: **does a member of the public need this to understand, use, verify, contribute to, secure, or deploy the project?** If the answer is no, do not add it.

Never commit:

- maintainer-only launch plans, post-deployment reminders, search-console chores, private roadmaps, personal to-do lists, or review notes;
- private project names or links, unreleased product details, internal strategy, personal customer data, credentials, account identifiers, analytics exports, or local machine paths;
- conversation transcripts, agent scratchpads, generated plans, handoff notes, or workflow documentation that exists only for the repository owner;
- public copy that promotes the maintainer’s other work unless it is directly relevant, useful to the reader, and disclosed under the editorial policy.

Public operational documentation is welcome when it is reproducible and useful to any maintainer or contributor: local setup, verification, architecture, deployment mechanics, contribution rules, security reporting, and editorial standards. Phrase it for the public role, never for one person’s private account or workflow.

Public agent skills are also welcome when the skill itself is a visitor-facing artifact. Keep the canonical package under `skills/`, make its instructions inspectable on the site, include only generic examples, and run the skill audit before shipping. Never copy a private skill verbatim: clean-room the reusable method and remove portfolio details, identifiers, paths, credentials, private schemas, internal voice rules, and owner-only operations.

If a task produces useful private follow-up, report it to the maintainer in the conversation instead of writing it into this repository. If a private destination has not been explicitly provided, stop there; do not invent one and do not copy material into another repository.

Before shipping, inspect `git diff` and search new tracked prose for private paths, owner-only instructions, unpublished product details, and accidental self-promotion. The content audit should remain a backstop, not the first time this boundary is considered.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
