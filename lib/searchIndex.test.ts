import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { search, terms } from "./search.ts";
import { buildSearchIndex } from "./searchIndex.ts";

const index = buildSearchIndex();

describe("site search", () => {
  it("indexes every page once", () => assert.equal(new Set(index.map((entry) => entry.path)).size, index.length));
  it("folds accents and case", () => assert.deepEqual(terms("Café  KEYWORDS"), ["cafe", "keywords"]));
  it("finds the keyword guide first for 'keywords'", () => assert.equal(search(index, "keywords")[0]?.path, "/store-page/keywords/"));
  it("finds a device size page", () => assert.ok(search(index, "iphone duo").some((entry) => entry.path === "/screenshot-sizes/iphone-duo/")));
  it("requires every term to match", () => assert.deepEqual(search(index, "keywords zzzzqx"), []));
  it("returns nothing for an empty query", () => assert.deepEqual(search(index, "  "), []));
});
