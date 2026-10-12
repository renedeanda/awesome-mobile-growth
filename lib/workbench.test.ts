import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { duplicates, emptyWorkbench, parseLocaleBundle, toMarkdown, utf8Bytes, warnings } from "./workbench.ts";

describe("workbench utilities", () => {
  it("counts UTF-8 bytes", () => assert.equal(utf8Bytes("café"), 5));
  it("finds normalized duplicate tokens", () => assert.deepEqual(duplicates("notes,focus,Notes"), ["notes"]));
  it("flags implementation jargon", () => assert.ok(warnings("Built with SwiftData").length > 0));
  it("imports a locale bundle", () => assert.deepEqual(parseLocaleBundle({ localizations: { "en-US": { name: "Northstar", subtitle: "Plan with confidence" } } }), { appleName: "Northstar", appleSubtitle: "Plan with confidence", applePromotional: "", appleDescription: "", appleKeywords: "", appleWhatsNew: "" }));
  it("exports markdown", () => { const data = emptyWorkbench(); data.fields.appleName = "Example"; assert.match(toMarkdown(data), /\*\*Name:\*\* Example/); });
});
