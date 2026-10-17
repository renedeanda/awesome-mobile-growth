import assert from "node:assert/strict";
import { describe, it } from "node:test";
import vm from "node:vm";
import { PLATFORM_SCRIPT } from "./platformDetect.ts";

function run(navigator: object) {
  const attributes: Record<string, string> = {};
  const document = { documentElement: { setAttribute: (name: string, value: string) => { attributes[name] = value; } } };
  vm.runInNewContext(PLATFORM_SCRIPT, { navigator, document });
  return attributes["data-platform"];
}

describe("platform detection script", () => {
  it("marks iPhone Safari as Apple", () => assert.equal(run({ userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1" }), "apple"));
  it("marks iPadOS, which reports a Mac, as Apple", () => assert.equal(run({ userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15", maxTouchPoints: 5 }), "apple"));
  it("prefers client hints on Chromium", () => assert.equal(run({ userAgentData: { platform: "macOS" }, userAgent: "Mozilla/5.0" }), "apple"));
  it("marks Android Chrome as Android", () => assert.equal(run({ userAgentData: { platform: "Android" }, userAgent: "Mozilla/5.0 (Linux; Android 16; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Mobile Safari/537.36" }), "android"));
  it("marks Android without client hints as Android", () => assert.equal(run({ userAgent: "Mozilla/5.0 (Android 16; Mobile; rv:143.0) Gecko/143.0 Firefox/143.0" }), "android"));
  it("leaves Windows and Linux desktops on the default design", () => {
    assert.equal(run({ userAgentData: { platform: "Windows" }, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }), "other");
    assert.equal(run({ userAgent: "Mozilla/5.0 (X11; Linux x86_64)" }), "other");
  });
  it("falls back to other when navigator throws", () => assert.equal(run(Object.defineProperty({}, "userAgent", { get() { throw new Error("blocked"); } })), "other"));
});
