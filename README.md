# Awesome Mobile Growth

**Practical, sourced guides for launching and growing apps on the App Store and Google Play, with free private tools and an open AI agent skill.**

[Visit the site](https://mobile.productbuilder.net) · [Launch](https://mobile.productbuilder.net/launch/) · [Store page](https://mobile.productbuilder.net/store-page/) · [Grow](https://mobile.productbuilder.net/grow/) · [Tools](https://mobile.productbuilder.net/tools/) · [Changes](https://mobile.productbuilder.net/changes/)

Awesome Mobile Growth began as a link collection. It is now a maintained set of guides, specs and tools for people shipping mobile apps.

## What is here

- **Launch:** guides for iPhone, iPad, Mac and Google Play, Universal Purchase, a requirements reference and an interactive launch checklist
- **Store page:** metadata, keywords, screenshots, Apple's header and search assets, localization, testing and custom pages
- **Grow:** the growth loop, onboarding, subscriptions, ratings, web-to-app, paid and organic, App Store Connect and choosing tools
- **Changes:** dated App Store and Google Play changes, each with actions and official sources (also in the RSS feed)
- **Learn:** an App Store Connect metrics glossary, AI for ASO, a podcast list and an independent resource list
- **Tools:** browser-local keyword, metadata, screenshot-size and experiment tools, a workbench, and the open App Store Growth skill for AI agents

Every guide links to Apple's and Google's own documentation, shows when its sources were last checked, and ends with a short "Do this today" list.

## Editorial policy

This is an owner-maintained publication, not an open promotional directory. Unsolicited listings, paid placements, affiliate rankings, link swaps, and promotional pull requests are not accepted. Focused factual corrections with current primary sources are welcome. Resource nominations may be considered but never create an obligation to list a product.

Apple's and Google's own documentation comes first. Observations, experiments and opinions are labeled. The project does not invent search volume, conversion, revenue or platform behavior. Copy follows the voice rules in the editorial policy, and the build fails on banned phrases.

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

The production build is a static export in `out/`. Verification includes TypeScript, unit tests, the production export, content (voice, read times), SEO, internal-link and redirect, and skill-package audits, and Playwright coverage in desktop Chromium and mobile WebKit. `npm run audit:external` checks every external link and runs in CI.

Guides are MDX files in `content/<section>/`, registered in `lib/articles/`. Create one with `npm run content:new -- --section store-page --slug your-slug`. On a new machine, install those browsers once with `npx playwright install chromium webkit`.

## Contributing

Corrections and resource nominations should follow the contribution policy. A good correction identifies the exact sentence, explains what changed, and links directly to current Apple or Google documentation. Pull requests are reserved for the maintainer and invited collaborators; please do not open “add my tool” pull requests.

Read [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), and the [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

## About the maintainer

Awesome Mobile Growth is built and edited by [René DeAnda](https://www.linkedin.com/in/renedeanda/). The site’s [About page](https://mobile.productbuilder.net/about/) explains the editorial model and discloses related first-party publishing projects without inserting them into unrelated recommendations.

## License

Code and original editorial material are available under the [MIT License](LICENSE). Third-party names and linked materials remain the property of their respective owners.
