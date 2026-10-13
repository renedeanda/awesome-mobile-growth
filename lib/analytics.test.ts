import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cleanPath, pageContext, sanitizedDestination, trackEvent } from "./analytics.ts";

describe("privacy-safe analytics", () => {
  it("removes queries and fragments", () => {
    assert.equal(cleanPath("/workbench/?template=secret#draft"), "/workbench/");
    assert.deepEqual(pageContext("/guides/metadata/?q=private"), { page_path: "/guides/metadata/", content_area: "guides" });
  });
  it("keeps only sanitized external destinations", () => {
    assert.deepEqual(sanitizedDestination("https://developer.apple.com/help?q=private#secret"), { destination_host: "developer.apple.com", destination_path: "/help" });
    assert.equal(sanitizedDestination("/guides/"), null);
    assert.equal(sanitizedDestination("mailto:test@example.com"), null);
  });
  it("rejects invalid events and removes unsafe property values", () => {
    assert.equal(trackEvent("tool_started"), false);
    const calls: unknown[][] = [];
    globalThis.window = { location: { pathname: "/tools/test/" }, gtag: (...args: unknown[]) => calls.push(args) } as unknown as Window & typeof globalThis;
    assert.equal(trackEvent("tool_started", { tool_id: "metadata-validator", missing: undefined, invalid: Number.NaN, long_value: "x".repeat(120) }), true);
    assert.equal(trackEvent("Invalid event"), false);
    assert.deepEqual(calls[0], ["event", "tool_started", { page_path: "/tools/test/", content_area: "tools", tool_id: "metadata-validator", long_value: "x".repeat(100) }]);
    delete (globalThis as { window?: Window }).window;
  });
});
