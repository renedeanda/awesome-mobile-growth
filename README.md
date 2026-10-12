# Awesome Mobile Growth

**A practical, evidence-aware field guide and private-by-default ASO workbench for people building better mobile products.**

[Visit the field guide](https://mobile.productbuilder.net) · [Open the workbench](https://mobile.productbuilder.net/workbench/) · [Use the checklist](https://mobile.productbuilder.net/aso-checklist/)

Awesome Mobile Growth began as a link collection. It is now René DeAnda’s maintained operating system for App Store Optimization: opinionated guides, primary sources, reusable briefs, and a browser-local workspace for metadata and experiments.

## What is here

- An iOS-first, Android-aware ASO field guide
- A practical checklist from product truth through post-launch learning
- A local-only metadata workbench with Apple and Google Play limits
- JSON and Markdown export, plus Kindling/iBootstrap locale import
- Explicit evidence labels and visible review dates
- A deliberately small resource shelf with first-party relationships disclosed

## Editorial policy

This is an owner-maintained publication, not an open promotional directory. Unsolicited product listings, paid placements, affiliate rankings, link swaps, and promotional pull requests are not accepted. Factual corrections with primary sources are welcome by email or a focused patch from an established collaborator.

Official platform documentation outranks industry folklore. Observations, experiments, hypotheses, and opinions are labeled. No search-volume estimate, conversion claim, or performance result is presented as fact without evidence.

Read [the full editorial policy](docs/EDITORIAL.md).

## Develop locally

Requires Node 22–24.

```bash
npm install
npm run dev
```

Run the complete verification suite:

```bash
npm run verify
```

The production build is a static export in `out/`.

The full verification command includes TypeScript, unit tests, the production export, content/SEO/internal-link audits, and Playwright coverage in desktop Chromium and mobile WebKit. On a new machine, install those browsers once with `npx playwright install chromium webkit`.

## Connected projects

- [Productbuilder](https://www.productbuilder.net) — field notes and systems for building products
- [makr.io mobile tools](https://www.makr.io/design/mobile) — useful design utilities for app makers
- [Kindling](https://github.com/renedeanda/kindling) — a reusable starter for shipping thoughtful apps
- [Delightful Apps](https://delightfulapps.com) — René’s independent app studio

These are René’s own projects and are labeled as first-party throughout the site.

## License

Code and original editorial material are available under the [MIT License](LICENSE). Third-party names and linked materials remain the property of their respective owners.

Please read [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), and the [Code of Conduct](CODE_OF_CONDUCT.md) before participating.
