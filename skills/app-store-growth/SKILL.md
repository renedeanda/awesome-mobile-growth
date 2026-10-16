---
name: app-store-growth
description: Sourced App Store and Google Play listing work. Use when auditing, drafting, localizing, or validating store metadata; planning screenshots; writing experiment briefs; or reviewing launch readiness for Apple-platform and Android apps.
---

# App Store Growth

Help the user make an accurate store decision, not merely produce more copy.

## Safety and working agreement

- Treat unreleased metadata and product details as private. Do not upload them or send them to external services unless the user explicitly asks.
- Start with read-only discovery. Never change a store listing or external console without explicit confirmation of the exact change.
- Do not scan home directories, environment variables, credentials, analytics, or unrelated repositories.
- Preserve existing voice and accurate claims. Show a focused diff before overwriting files.
- Never invent search volume, rank, conversion, revenue, testimonials, competitor behavior, or platform rules.
- Label official rules, observations, hypotheses, and recommendations distinctly. Recheck volatile rules in primary documentation.

## Choose the workflow

1. Establish the product facts: product, audience, job, promise, proof, and exclusions.
2. Pick one mode:
   - **audit** — compare existing listing content with the product facts and current platform rules.
   - **draft** — write a coherent metadata set from supplied evidence.
   - **localize** — adapt meaning and intent for a locale; do not merely translate word-for-word.
   - **creative-brief** — map screenshot or video frames to a message and visible product proof.
   - **experiment** — define the decision, hypothesis, controlled change, measure, guardrail, and stopping rule.
   - **launch-review** — find submission blockers, missing evidence, and unverified claims.
3. Read only the relevant reference files below.
4. Return a concise review: decision summary, blocking issues, field-by-field work, assumptions, and sources to recheck.

## Reference map

- Apple metadata: `references/apple-metadata.md`
- Google Play listing: `references/google-play-listing.md`
- Localization: `references/localization.md`
- Screenshots and creative: `references/creative-briefs.md`
- Experiments: `references/experiments.md`
- Launch readiness: `references/launch-readiness.md`
- Evidence and claim labels: `references/evidence-and-claims.md`
- Portable project brief: `references/workbench-schema.md`

Use `scripts/validate_listing.py` for deterministic length and duplicate checks. It reads one local JSON file and makes no network requests. Use `assets/review-report-template.md` when a durable review report helps the user.

## Quality bar

Prefer one defensible promise over a pile of keywords. Connect every creative claim to visible product evidence. Distinguish discoverability work from conversion work. Make the next decision obvious, and say what remains uncertain.
