# Contributing

Awesome Mobile Growth is an owner-maintained publication. It is intentionally not an open directory.

## Useful corrections

- Precise factual corrections backed by a current Apple or Google primary source
- Accessibility, privacy, security, and broken-link fixes
- Focused code fixes with a clear reproduction
- Resource nominations that disclose the submitter’s relationship and explain a specific practitioner decision; nomination never guarantees inclusion

## Not accepted

- Promotional “add my product” pull requests or issues that do not use the nomination form
- Promotional articles, guest posts, paid placement, affiliate links, or link swaps
- Bulk AI-generated copy or SEO pages
- Claims based on invented search volume, conversion, revenue, or testimonials

To propose a correction, use a maintainer contact on the site’s [About page](https://mobile.productbuilder.net/about/) and include the exact claim, page URL, and current primary source. Pull requests are reserved for the maintainer and invited collaborators so unsolicited promotional branches do not create review or CI work.

If René invites a patch, read `docs/EDITORIAL.md`, keep the change narrow, and run:

```bash
npm install
npx playwright install chromium webkit
npm run verify
```

An invitation does not guarantee inclusion. René retains editorial judgment over this publication.
