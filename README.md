# Awesome Mobile Growth

**Evidence-aware App Store Optimization, Apple and Google Play launch guidance, private browser tools, and open AI workflows for people building better mobile products.**

[Visit the field guide](https://mobile.productbuilder.net) · [Apple launch desk](https://mobile.productbuilder.net/apple-platforms/) · [Google Play desk](https://mobile.productbuilder.net/google-play/) · [Free tools](https://mobile.productbuilder.net/tools/) · [Open AI skill](https://mobile.productbuilder.net/ai/skills/app-store-growth/)

Awesome Mobile Growth began as a link collection. It is now a maintained field manual: practical guides, current platform sources, a curated mobile podcast shelf, a transparent tool map, and a browser-local workspace for turning strategy into a release brief.

## What is here

- Apple launch guides for iPhone, iPad, Mac, Universal Purchase, and cross-platform delivery requirements
- Platform-specific Apple and Google Play guides spanning launch, metadata, creative, localization, testing, and product outcomes
- Current coverage of Apple’s October 2026 Asset Library, product-page headers, search creative, custom product pages, app tags, analytics, and featuring nominations
- An App Growth Loop connecting acquisition and store conversion to activation, monetization, retention, and advocacy
- A practical ASO checklist from product truth through post-launch learning
- Local-only keyword, metadata, screenshot-reference, experiment, and working-brief tools
- A public App Store Growth AI skill with focused references, a deterministic validator, and strict evidence and permission boundaries
- An editorially selected podcast guide and a maintained resource shelf with retired-product transitions
- Explicit evidence labels, primary-source links, and visible review dates

## Editorial policy

This is an owner-maintained publication, not an open promotional directory. Unsolicited listings, paid placements, affiliate rankings, link swaps, and promotional pull requests are not accepted. Focused factual corrections with current primary sources are welcome. Resource nominations may be considered but never create an obligation to list a product.

Official Apple and Google documentation outranks industry folklore. Observations, experiments, hypotheses, and opinions are labeled. The project does not invent search volume, conversion, revenue, or platform behavior.

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

The production build is a static export in `out/`. Verification includes TypeScript, unit tests, the production export, content/SEO/internal-link/skill-package audits, and Playwright coverage in desktop Chromium and mobile WebKit. On a new machine, install those browsers once with `npx playwright install chromium webkit`.

## Contributing

Corrections and resource nominations should follow the contribution policy. A good correction identifies the exact sentence, explains what changed, and links directly to current Apple or Google documentation. Pull requests are reserved for the maintainer and invited collaborators; please do not open “add my tool” pull requests.

Read [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), and the [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

## About the maintainer

Awesome Mobile Growth is built and edited by [René DeAnda](https://www.linkedin.com/in/renedeanda/). The site’s [About page](https://mobile.productbuilder.net/about/) explains the editorial model and discloses related first-party publishing projects without inserting them into unrelated recommendations.

## License

Code and original editorial material are available under the [MIT License](LICENSE). Third-party names and linked materials remain the property of their respective owners.
