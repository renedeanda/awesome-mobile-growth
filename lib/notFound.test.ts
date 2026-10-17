import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { searchableQuery, suggestPages, wordsFromPath } from "./notFound.ts";
import type { SearchEntry } from "./search.ts";

const page = (path: string, title: string, text = ""): SearchEntry => ({ path, title, kind: "Guide", summary: "", text });
const index = [
  page("/screenshot-sizes/ipad-13/", "iPad 13-inch screenshot sizes", "ipad pro"),
  page("/screenshot-sizes/ipad-11/", "iPad 11-inch screenshot sizes", "ipad air"),
  page("/screenshot-sizes/iphone-6-9/", "iPhone 6.9-inch screenshot sizes"),
  page("/store-page/keywords/", "Keywords", "keyword field 100 bytes"),
  page("/launch/checklist/", "Launch checklist"),
];

describe("404 suggestions", () => {
  it("reads words from a mistyped path", () => {
    assert.deepEqual(wordsFromPath("/screenshot-size/ipad/"), ["screenshot", "size", "ipad"]);
    assert.deepEqual(wordsFromPath("/store%20page/index.html"), ["store"]);
  });

  it("suggests the iPad size pages for a singular, misspelled URL", () => {
    const paths = suggestPages(index, "/screenshot-size/ipad/").map((entry) => entry.path);
    assert.deepEqual(paths.sort(), ["/screenshot-sizes/ipad-11/", "/screenshot-sizes/ipad-13/"]);
  });

  it("falls back to the rarer words when no page matches every word", () => {
    assert.deepEqual(suggestPages(index, "/aso/keywords-guide/").map((entry) => entry.path), ["/store-page/keywords/"]);
  });

  it("searches only for words that still find a page", () => {
    assert.equal(searchableQuery(index, "/aso/keywords-guide/"), "keywords guide");
    assert.equal(searchableQuery(index, "/zzz/qqq/"), "");
  });

  it("returns nothing for a path with no usable words", () => {
    assert.deepEqual(suggestPages(index, "/"), []);
  });
});
