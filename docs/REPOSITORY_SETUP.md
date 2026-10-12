# Repository setup

One-time GitHub owner settings for a clean public project.

## General

- Description: `Evidence-aware ASO field guide and private browser workbench for thoughtful mobile product builders.`
- Website: `https://mobile.productbuilder.net`
- Topics: `aso`, `app-store-optimization`, `ios`, `google-play`, `mobile-growth`, `app-marketing`, `product-development`, `app-store-connect`
- Keep Issues enabled with blank issues disabled. The repository includes forms for sourced corrections and editorial resource nominations.
- Create labels named `correction` and `resource-review` so the forms route cleanly.
- Close promotional backlog items with a short pointer to the editorial policy; do not debate listing decisions issue by issue.
- Keep Discussions off unless there is a real moderation plan.
- Enable private vulnerability reporting.
- Disable Wikis and Projects unless they become actively useful.

## Ruleset for `main`

- Require a pull request before merging.
- Require the `verify` status check.
- Require conversation resolution.
- Block force pushes and deletions.
- Require linear history.
- Allow repository administrators to bypass for emergencies.

For a solo-maintained project, requiring an approving review can deadlock normal work. Leave the approval count at zero unless another trusted maintainer joins.

## Merge and release

- Prefer squash merge and delete merged branches automatically.
- Connect Vercel to `main`; use pull-request previews and production only from `main`.
- Add `mobile.productbuilder.net` in Vercel, then verify HTTPS, canonical tags, sitemap, robots, feed, and the generated social image.
- Submit `https://mobile.productbuilder.net/sitemap.xml` in Google Search Console after the domain is live.

## Launch-day repository pass

- Confirm the About link and social preview appear in the repository header.
- Pin the refreshed README and remove any stale release or deployment badges.
- Review every open issue and pull request: keep a sourced correction, close pure promotion, and add a neutral label where future follow-up is useful.
- Turn on branch deletion after merge and verify the `verify` check is required by the `main` ruleset.
- Confirm private vulnerability reporting is enabled under Security settings.

## Old ASO Checklist repository

After the new domain is live and useful material is preserved, remove the stale Pages deployment and `CNAME` from `renedeanda/asochecklist`, add an archival README pointing here, and archive the repository. There is no redirect plan because the old domain is no longer controlled.
