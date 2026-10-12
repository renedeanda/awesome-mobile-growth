# Repository setup

One-time GitHub owner settings for a clean public project.

## General

- Description: `Evidence-aware ASO field guide and private browser workbench for thoughtful mobile product builders.`
- Website: `https://mobile.productbuilder.net`
- Topics: `aso`, `app-store-optimization`, `ios`, `google-play`, `mobile-growth`, `indie-apps`, `app-marketing`, `product-development`
- Disable Issues after closing the current promotional backlog.
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

## Old ASO Checklist repository

After the new domain is live and useful material is preserved, remove the stale Pages deployment and `CNAME` from `renedeanda/asochecklist`, add an archival README pointing here, and archive the repository. There is no redirect plan because the old domain is no longer controlled.
