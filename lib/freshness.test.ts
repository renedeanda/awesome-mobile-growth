import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { articles } from "./articles/index.ts";
import { changes } from "./changes.ts";
import { overdueUpcoming, staleChecks } from "./freshness.ts";
import { metricsReviewed } from "./metrics.ts";
import { specsChecked } from "./storeSpecs.ts";

const today = new Date().toISOString().slice(0, 10);

describe("freshness", () => {
  it("finds Upcoming changes past their date and checks older than the window", () => {
    assert.deepEqual(overdueUpcoming([{ slug: "a", date: "2026-01-01", status: "Upcoming" }, { slug: "b", date: "2026-01-01", status: "In effect" }, { slug: "c", date: "2027-01-01", status: "Upcoming" }], "2026-06-01").map((item) => item.slug), ["a"]);
    assert.deepEqual(staleChecks([{ label: "old", checked: "2026-01-01" }, { label: "new", checked: "2026-05-01" }], "2026-08-01").map((item) => item.label), ["old"]);
  });

  it("no change is still Upcoming after it takes effect", () => {
    // Flip its status to "In effect" (and re-check the details) once the date arrives.
    assert.deepEqual(overdueUpcoming(changes, today).map((item) => item.slug), []);
  });

  it("guides, changes and specs were checked within 180 days", () => {
    const stale = staleChecks([
      ...articles.map((article) => ({ label: article.path, checked: article.reviewed })),
      ...changes.map((change) => ({ label: `/changes/${change.slug}/`, checked: change.reviewed })),
      { label: "lib/storeSpecs.ts", checked: specsChecked },
      { label: "lib/metrics.ts", checked: metricsReviewed },
    ], today);
    assert.deepEqual(stale.map((item) => item.label), [], "Re-check these against their sources and update the dates");
  });
});
