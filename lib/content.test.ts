import assert from "node:assert/strict";
import fs from "node:fs";
import { describe, it } from "node:test";
import { articles, doTodaySteps } from "./articles/index.ts";
import { articleLoaders } from "./articles/loaders.ts";
import { changes } from "./changes.ts";
import { metrics } from "./metrics.ts";
import { podcasts } from "./podcasts.ts";
import { resourceGroups } from "./resources.ts";
import { resolveRelated } from "./related.ts";
import { appleScreenshotClasses } from "./storeSpecs.ts";
import { tools } from "./tools.ts";

const isoDate = /^20\d{2}-\d{2}-\d{2}$/;

describe("guides", () => {
  it("have unique paths", () => assert.equal(new Set(articles.map(({ path }) => path)).size, articles.length));
  it("each have exactly one MDX loader", () => assert.deepEqual(Object.keys(articleLoaders).sort(), articles.map(({ section, slug }) => `${section}/${slug}`).sort()));
  it("only link to pages that exist", () => articles.forEach(({ path, related }) => related.forEach((target) => assert.ok(resolveRelated(target), `${path} → ${target}`))));
  it("start with a substantive answer", () => articles.forEach(({ path, answer }) => assert.ok(answer.length > 120, path)));
  it("keep meta descriptions short enough for search results", () => articles.forEach(({ path, description }) => assert.ok(description.length >= 80 && description.length <= 200, `${path}: ${description.length}`)));
  it("keep search titles to 60 characters", () => articles.forEach(({ path, seoTitle }) => assert.ok(seoTitle.length <= 60, `${path}: ${seoTitle.length}`)));
  it("record dates and secure sources", () => articles.forEach(({ path, published, reviewed, sources }) => { assert.match(published, isoDate, path); assert.match(reviewed, isoDate, path); assert.ok(sources.length > 0, path); sources.forEach(({ href }) => assert.match(href, /^https:\/\//)); }));
  it("have at least three sections", () => articles.forEach(({ path, toc }) => assert.ok(toc.length >= 3, path)));
  it("expose their action list as plain-text steps", () => articles.filter(({ slug }) => slug !== "checklist").forEach(({ path, steps }) => { assert.ok(steps.length >= 3, path); steps.forEach((step) => assert.doesNotMatch(step, /\*\*|`|\]\(/, path)); }));
  it("reduce Markdown in action steps to text", () => assert.deepEqual(doTodaySteps("<DoToday>\n\n1. Open **App Analytics** and run the [checker](/tools/x/).\n2. Search for `screenOrientation`.\n\n</DoToday>"), ["Open App Analytics and run the checker.", "Search for screenOrientation."]));
  it("end with an action list, except the checklist itself", () => articles.filter(({ slug }) => slug !== "checklist").forEach(({ path, file }) => assert.ok(fs.readFileSync(`content/${file}`, "utf8").includes("<DoToday>"), path)));
});

describe("reference data", () => {
  it("has unique metric slugs with related metrics that exist", () => { const slugs = new Set(metrics.map(({ slug }) => slug)); assert.equal(slugs.size, metrics.length); metrics.forEach(({ related }) => related.forEach((slug) => assert.ok(slugs.has(slug), slug))); });
  it("lists platform changes newest first, linked to real guides", () => { changes.forEach((change, index) => { if (index) assert.ok(change.date <= changes[index - 1].date, change.slug); change.related.forEach((path) => assert.ok(resolveRelated(path), `${change.slug} → ${path}`)); }); });
  it("keeps metric and change descriptions within search-result length", () => { metrics.forEach(({ slug, seoTitle, description }) => { assert.ok(seoTitle.length <= 60, slug); assert.ok(description.length <= 170, slug); }); changes.forEach(({ slug, summary }) => assert.ok(summary.length <= 170, `${slug}: ${summary.length}`)); });
  it("gives every Apple screenshot class at least one size", () => appleScreenshotClasses.forEach(({ id, sizes }) => assert.ok(sizes.length > 0, id)));
  it("records a review date for every podcast", () => podcasts.forEach(({ latestChecked }) => assert.match(latestChecked, isoDate)));
  it("keeps podcast slugs unique", () => assert.equal(new Set(podcasts.map(({ slug }) => slug)).size, podcasts.length));
  it("uses secure resource URLs", () => resourceGroups.flatMap(({ items }) => items).forEach(({ href }) => assert.match(href, /^https:\/\//)));
  it("keeps browser tool routes unique", () => assert.equal(new Set(tools.map(({ slug }) => slug)).size, tools.length));
});
