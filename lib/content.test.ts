import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { guideLoaders, guides } from "./content.ts";
import { podcasts } from "./podcasts.ts";
import { resourceGroups } from "./resources.ts";
import { applePlatformGuides, appleSources, macScreenshotSizes, platformComparison } from "./applePlatforms.ts";

describe("editorial data", () => {
  it("keeps guide slugs unique", () => assert.equal(new Set(guides.map(({ slug }) => slug)).size, guides.length));
  it("has one MDX loader for every guide", () => assert.deepEqual(Object.keys(guideLoaders).sort(), guides.map(({ slug }) => slug).sort()));
  it("keeps editorial dates and direct answers explicit", () => guides.forEach(({ directAnswer, modified, reviewed }) => { assert.ok(directAnswer.length > 80); assert.match(modified, /^2026-\d{2}-\d{2}$/); assert.match(reviewed, /^2026-\d{2}-\d{2}$/); }));
  it("keeps podcast slugs unique", () => assert.equal(new Set(podcasts.map(({ slug }) => slug)).size, podcasts.length));
  it("records a review date for every podcast", () => podcasts.forEach(({ latestChecked }) => assert.match(latestChecked, /^2026-\d{2}-\d{2}$/)));
  it("uses secure resource URLs", () => resourceGroups.flatMap(({ items }) => items).forEach(({ href }) => assert.match(href, /^https:\/\//)));
  it("keeps Apple launch guide slugs unique", () => assert.equal(new Set(applePlatformGuides.map(({ slug }) => slug)).size, applePlatformGuides.length));
  it("keeps Apple launch guidance substantive", () => applePlatformGuides.forEach(({ answer, description }) => { assert.ok(answer.length > 140); assert.ok(description.length > 120); }));
  it("links every platform claim set to secure Apple sources", () => Object.values(appleSources).forEach(({ href }) => assert.match(href, /^https:\/\/developer\.apple\.com\//)));
  it("records the four accepted Mac screenshot dimensions", () => assert.deepEqual(macScreenshotSizes, ["1280 × 800", "1440 × 900", "2560 × 1600", "2880 × 1800"]));
  it("compares iPhone, iPad, and Mac for every platform row", () => platformComparison.forEach((row) => { assert.ok(row.iphone); assert.ok(row.ipad); assert.ok(row.mac); }));
});
