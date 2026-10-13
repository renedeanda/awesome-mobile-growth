import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { guideLoaders, guides } from "./content.ts";
import { podcasts } from "./podcasts.ts";
import { resourceGroups } from "./resources.ts";

describe("editorial data", () => {
  it("keeps guide slugs unique", () => assert.equal(new Set(guides.map(({ slug }) => slug)).size, guides.length));
  it("has one MDX loader for every guide", () => assert.deepEqual(Object.keys(guideLoaders).sort(), guides.map(({ slug }) => slug).sort()));
  it("keeps editorial dates and direct answers explicit", () => guides.forEach(({ directAnswer, modified, reviewed }) => { assert.ok(directAnswer.length > 80); assert.match(modified, /^2026-\d{2}-\d{2}$/); assert.match(reviewed, /^2026-\d{2}-\d{2}$/); }));
  it("keeps podcast slugs unique", () => assert.equal(new Set(podcasts.map(({ slug }) => slug)).size, podcasts.length));
  it("records a review date for every podcast", () => podcasts.forEach(({ latestChecked }) => assert.match(latestChecked, /^2026-\d{2}-\d{2}$/)));
  it("uses secure resource URLs", () => resourceGroups.flatMap(({ items }) => items).forEach(({ href }) => assert.match(href, /^https:\/\//)));
});
