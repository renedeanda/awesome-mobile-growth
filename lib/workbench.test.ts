import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { LIMITS, duplicates, emptyWorkbench, migrateWorkbench, parseLocaleBundle, toMarkdown, utf8Bytes, warnings } from "./workbench.ts";

describe("workbench utilities", () => {
  it("counts UTF-8 bytes", () => assert.equal(utf8Bytes("café"), 5));
  it("finds normalized duplicate tokens", () => assert.deepEqual(duplicates("notes,focus,Notes"), ["notes"]));
  it("flags implementation jargon", () => assert.ok(warnings("Built with SwiftData").length > 0));
  it("imports a locale bundle without blanking fields it doesn't have", () => assert.deepEqual(parseLocaleBundle({ localizations: { "en-US": { name: "Northstar", subtitle: "Plan with confidence" } } }), { appleName: "Northstar", appleSubtitle: "Plan with confidence" }));
  it("refuses JSON with no metadata", () => { for (const input of [{ foo: 1 }, [1, 2], null, "text"]) assert.throws(() => parseLocaleBundle(input), /no App Store metadata|metadata object/); });
  it("exports markdown", () => { const data = emptyWorkbench(); data.fields.appleName = "Example"; assert.match(toMarkdown(data), /\*\*Name:\*\* Example/); });
  it("migrates older drafts without losing listing fields", () => { const data = migrateWorkbench({ version: 1, updatedAt: "2026-01-01", fields: { appleName: "Legacy" }, keywordMap: "notes" }); assert.equal(data.version, 3); assert.equal(data.fields.appleName, "Legacy"); assert.equal(data.brief.product, ""); assert.equal(data.monthlyReview, ""); });
});

describe("in-app event draft", () => {
  it("uses Apple's in-app event limits", () => {
    assert.deepEqual([LIMITS.appleEventReference, LIMITS.appleEventName, LIMITS.appleEventShort, LIMITS.appleEventLong], [64, 30, 50, 120]);
  });

  it("keeps a badge for older saved drafts and exports the event", () => {
    const migrated = migrateWorkbench({ version: 3, fields: { appleEventName: "Golden Hour Week" } });
    assert.equal(migrated.eventBadge, "Special Event");
    assert.match(toMarkdown(migrated), /## In-app event[\s\S]*\*\*Event name:\*\* Golden Hour Week/);
  });
});
