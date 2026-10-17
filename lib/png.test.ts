import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { crc32Final, encodeRgbPng, readPngHeader } from "./png.ts";
import { unzipStored, zip } from "./zip.ts";

describe("24-bit PNG encoder", () => {
  it("matches the standard CRC-32 check value", () => assert.equal(crc32Final(new TextEncoder().encode("123456789")), 0xcbf43926));
  it("writes an RGB PNG with no alpha channel and the original pixels", async () => {
    const rgba = new Uint8Array([255, 0, 0, 255, 0, 255, 0, 128, 0, 0, 255, 255, 10, 20, 30, 0]);
    const png = await encodeRgbPng(rgba, 2, 2);
    assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    assert.deepEqual(readPngHeader(png), { width: 2, height: 2, bitDepth: 8, colorType: 2 });
    const view = new DataView(png.buffer, png.byteOffset);
    const idatLength = view.getUint32(33);
    assert.equal(new TextDecoder().decode(png.subarray(37, 41)), "IDAT");
    assert.equal(view.getUint32(41 + idatLength), crc32Final(png.subarray(37, 41 + idatLength)));
    const inflated = new Uint8Array(await new Response(new Blob([png.subarray(41, 41 + idatLength)]).stream().pipeThrough(new DecompressionStream("deflate"))).arrayBuffer());
    // Undo the Sub filter row by row.
    const pixels: number[] = [];
    for (let y = 0; y < 2; y++) {
      const row = inflated.subarray(y * 7, y * 7 + 7);
      assert.equal(row[0], 1);
      const out = [...row.subarray(1)];
      for (let i = 3; i < out.length; i++) out[i] = (out[i] + out[i - 3]) & 255;
      pixels.push(...out);
    }
    assert.deepEqual(pixels, [255, 0, 0, 0, 255, 0, 0, 0, 255, 10, 20, 30]);
  });
  it("rejects pixel data of the wrong size", async () => assert.rejects(encodeRgbPng(new Uint8Array(4), 2, 2)));
});

describe("stored ZIP", () => {
  it("round-trips entries in order", async () => {
    const entries = [{ name: "a-01.png", data: new Uint8Array([1, 2, 3]) }, { name: "a-02.png", data: new Uint8Array([4, 5]) }];
    const bytes = new Uint8Array(await zip(entries).arrayBuffer());
    assert.deepEqual(unzipStored(bytes).map((entry) => [entry.name, [...entry.data]]), [["a-01.png", [1, 2, 3]], ["a-02.png", [4, 5]]]);
    // End of central directory records the entry count.
    assert.equal(new DataView(bytes.buffer).getUint16(bytes.length - 12, true), 2);
  });
});
