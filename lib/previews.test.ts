import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { checkPreview, closestSize } from "./previews.ts";
import { appleScreenshotClasses, appPreviewClasses } from "./storeSpecs.ts";

const byId = (id: string) => appPreviewClasses.find((item) => item.id === id)!;
const status = (rows: ReturnType<typeof checkPreview>, label: string) => rows.find((row) => row.label === label)?.status;

describe("app preview checker", () => {
  it("accepts an iPhone preview at Apple's accepted resolution and length", () => {
    const rows = checkPreview({ width: 886, height: 1920, seconds: 22, fps: 30, bytes: 80_000_000, name: "preview.mov" }, byId("iphone-dynamic-island-medium"));
    assert.equal(status(rows, "Resolution"), "pass");
    assert.equal(status(rows, "Length"), "pass");
    assert.equal(status(rows, "Frame rate"), "pass");
    assert.equal(status(rows, "File type"), "pass");
    assert.equal(status(rows, "Codec and audio"), "check");
  });

  it("rejects a device-resolution capture and names the size to export", () => {
    const rows = checkPreview({ width: 1206, height: 2622, seconds: 20 }, byId("iphone-dynamic-island-medium"));
    assert.equal(status(rows, "Resolution"), "fail");
    assert.match(rows[0].detail, /Export at 886 × 1920/);
  });

  it("flags length, frame rate, size and file type problems", () => {
    const rows = checkPreview({ width: 1920, height: 1080, seconds: 34.2, fps: 60, bytes: 600_000_000, name: "clip.webm" }, byId("mac"));
    assert.deepEqual(["Length", "Frame rate", "File size", "File type"].map((label) => status(rows, label)), ["fail", "fail", "fail", "fail"]);
    assert.equal(status(checkPreview({ width: 1920, height: 1080, seconds: 9 }, byId("mac")), "Length"), "fail");
    assert.equal(status(checkPreview({ width: 1920, height: 1080, seconds: 20 }, byId("mac")), "Frame rate"), "check");
  });

  it("picks the closest accepted size in the video's orientation", () => {
    assert.deepEqual(closestSize(1668, 2388, byId("ipad-11")), [1200, 1600]);
    assert.deepEqual(closestSize(2388, 1668, byId("ipad-11")), [1600, 1200]);
  });

  it("only uses class ids that have a size page", () => {
    const ids = new Set(appleScreenshotClasses.map((item) => item.id));
    assert.deepEqual(appPreviewClasses.filter((item) => !ids.has(item.id)).map((item) => item.id), []);
  });
});
