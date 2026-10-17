import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { checkPlayAsset, guessKind, imageFormat } from "./playAssets.ts";

const status = (rows: ReturnType<typeof checkPlayAsset>) => Object.fromEntries(rows.map((row) => [row.label, row.status]));
const png = (width: number, height: number, colorType: number) => {
  const bytes = new Uint8Array(33);
  bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
  const view = new DataView(bytes.buffer);
  view.setUint32(16, width); view.setUint32(20, height);
  bytes[24] = 8; bytes[25] = colorType;
  return bytes;
};

describe("Google Play asset checker", () => {
  it("reads PNG size, bit depth and alpha, and recognizes JPEG", () => {
    assert.deepEqual(imageFormat(png(512, 512, 6)), { format: "png", width: 512, height: 512, bitDepth: 8, colorType: 6, alpha: true });
    assert.equal(imageFormat(png(1024, 500, 2)).alpha, false);
    assert.deepEqual(imageFormat(new Uint8Array([0xff, 0xd8, 0xff])), { format: "jpeg", alpha: false });
  });

  it("guesses the asset from its shape", () => {
    assert.equal(guessKind({ width: 512, height: 512 }), "icon");
    assert.equal(guessKind({ width: 1024, height: 500 }), "feature-graphic");
    assert.equal(guessKind({ width: 1080, height: 1920 }), "screenshot");
  });

  it("passes a 512 × 512 32-bit icon and rejects a JPEG or oversize one", () => {
    assert.deepEqual(status(checkPlayAsset("icon", { width: 512, height: 512, format: "png", alpha: true, bitDepth: 8, colorType: 6, bytes: 200_000 })), { Size: "pass", Format: "pass", "File size": "pass", "Shape and color": "check" });
    // Palette and grayscale PNGs can be transparent but aren't 32-bit.
    for (const colorType of [3, 4]) assert.equal(status(checkPlayAsset("icon", { width: 512, height: 512, format: "png", alpha: true, bitDepth: 8, colorType, bytes: 1 })).Format, "fail");
    assert.deepEqual(status(checkPlayAsset("icon", { width: 1024, height: 1024, format: "jpeg", alpha: false, bytes: 2_000_000 })), { Size: "fail", Format: "fail", "File size": "fail", "Shape and color": "check" });
  });

  it("rejects transparency in a feature graphic and bad screenshot proportions", () => {
    assert.deepEqual(status(checkPlayAsset("feature-graphic", { width: 1024, height: 500, format: "png", alpha: true, bitDepth: 8, bytes: 1 })), { Size: "pass", Format: "fail" });
    assert.deepEqual(status(checkPlayAsset("screenshot", { width: 1080, height: 2400, format: "jpeg", alpha: false, bytes: 1 })), { Size: "fail", Format: "pass" });
    assert.deepEqual(status(checkPlayAsset("screenshot", { width: 1080, height: 1920, format: "png", alpha: false, bitDepth: 8, bytes: 1 })), { Size: "pass", Format: "pass" });
  });
});
