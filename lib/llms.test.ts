import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildLlmsFull, buildLlmsIndex } from "./llms.ts";
import { changes } from "./changes.ts";
import { metrics } from "./metrics.ts";
import { specPages } from "./specPages.ts";
import { tools } from "./tools.ts";

describe("llms.txt", () => {
  const index = buildLlmsIndex();
  const full = buildLlmsFull();
  it("links every tool", () => { for (const tool of tools) assert.ok(index.includes(`/tools/${tool.slug}/)`), tool.slug); });
  it("links every screenshot size page", () => { for (const page of specPages) assert.ok(index.includes(`/screenshot-sizes/${page.slug}/)`), page.slug); });
  it("links every metric, change and the ASO primer", () => { for (const path of [...metrics.map(({ slug }) => `/learn/metrics/${slug}/`), ...changes.map(({ slug }) => `/changes/${slug}/`), "/app-store-optimization/"]) assert.ok(index.includes(`${path})`), path); });
  it("answers every size page with a source", () => { for (const page of specPages) assert.ok(full.includes(`## ${page.title}\n`), page.slug); });
  it("never prints empty values", () => { for (const text of [index, full]) assert.doesNotMatch(text, /undefined|\bnull\b/); });
});
