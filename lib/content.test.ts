import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { guides } from "./content.ts";
import { podcasts } from "./podcasts.ts";
import { resourceGroups } from "./resources.ts";

describe("editorial data", () => {
  it("keeps guide slugs unique", () => assert.equal(new Set(guides.map(({ slug }) => slug)).size, guides.length));
  it("keeps podcast slugs unique", () => assert.equal(new Set(podcasts.map(({ slug }) => slug)).size, podcasts.length));
  it("records a review date for every podcast", () => podcasts.forEach(({ latestChecked }) => assert.match(latestChecked, /^2026-\d{2}-\d{2}$/)));
  it("uses secure resource URLs", () => resourceGroups.flatMap(({ items }) => items).forEach(({ href }) => assert.match(href, /^https:\/\//)));
});
