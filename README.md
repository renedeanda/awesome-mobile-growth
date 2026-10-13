# Awesome Mobile Growth

**A current, evidence-aware field guide and private-by-default ASO workbench for people building better mobile products.**

[Visit the field guide](https://mobile.productbuilder.net) · [Read the guides](https://mobile.productbuilder.net/guides/) · [Use the checklist](https://mobile.productbuilder.net/aso-checklist/) · [Open the workbench](https://mobile.productbuilder.net/workbench/)

Awesome Mobile Growth began as a link collection. It is now a maintained field manual: practical guides, current platform sources, a curated mobile podcast shelf, a transparent tool map, and a browser-local workspace for turning strategy into a release brief.

## What is here

- Nine iOS-first, Android-aware guides spanning metadata, creative, testing, App Store Connect, tooling, and retention
- Current coverage of Apple’s October 2026 Asset Library, product-page headers, search creative, custom product pages, app tags, analytics, and featuring nominations
- A focused Google Play companion covering listing fields, custom listings, and experiment constraints
- A practical ASO checklist from product truth through post-launch learning
- A local-only metadata workbench with Apple and Google Play limits, JSON import/export, and Markdown export
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

The production build is a static export in `out/`. Verification includes TypeScript, unit tests, the production export, content/SEO/internal-link audits, and Playwright coverage in desktop Chromium and mobile WebKit. On a new machine, install those browsers once with `npx playwright install chromium webkit`.

## After deployment

These owner-only steps cannot be encoded safely in the public site:

- Verify `mobile.productbuilder.net` in Google Search Console and Bing Webmaster Tools, then submit `https://mobile.productbuilder.net/sitemap.xml`.
- Inspect the homepage, the ASO cornerstone guide, and one guide URL after each substantial release; request re-indexing only for important changes.
- Confirm the generated social card with LinkedIn Post Inspector and any networks you actively use.
- Keep GitHub branch protection and required quality checks enabled for `main`. Public repositories cannot fully prevent fork-based pull requests, so close unsolicited promotional PRs without merging or running untrusted changes locally.
- Review the dated platform claims and podcast activity on a regular cadence. A visible review date is useful only when it reflects a real review.

## Contributing

Corrections and resource nominations should follow the contribution policy. A good correction identifies the exact sentence, explains what changed, and links directly to current Apple or Google documentation. Pull requests are reserved for the maintainer and invited collaborators; please do not open “add my tool” pull requests.

Read [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), and the [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

## About the maintainer

Awesome Mobile Growth is built and edited by [René DeAnda](https://www.linkedin.com/in/renedeanda/). The site’s [About page](https://mobile.productbuilder.net/about/) explains the editorial model and discloses related first-party publishing projects without inserting them into unrelated recommendations.

## License

Code and original editorial material are available under the [MIT License](LICENSE). Third-party names and linked materials remain the property of their respective owners.
