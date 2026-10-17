// Encodes canvas pixels as a 24-bit RGB PNG. canvas.toBlob("image/png") always writes an alpha
// channel, which App Store Connect and Google Play reject even when every pixel is opaque.

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

export function crc32(bytes: Uint8Array, crc = 0xffffffff) {
  for (let i = 0; i < bytes.length; i++) crc = crcTable[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  return crc;
}
export const crc32Final = (bytes: Uint8Array) => (crc32(bytes) ^ 0xffffffff) >>> 0;

async function deflate(data: Uint8Array) {
  // "deflate" in the Compression Streams API is zlib-wrapped, which is what a PNG IDAT chunk holds.
  const stream = new Blob([data as BlobPart]).stream().pipeThrough(new CompressionStream("deflate"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

function chunk(type: string, data: Uint8Array) {
  const out = new Uint8Array(12 + data.length);
  const view = new DataView(out.buffer);
  view.setUint32(0, data.length);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  view.setUint32(8 + data.length, crc32Final(out.subarray(4, 8 + data.length)));
  return out;
}

/** RGBA pixels (as from getImageData) in, RGB PNG bytes out. Alpha is dropped, so composite first. */
export async function encodeRgbPng(rgba: Uint8ClampedArray | Uint8Array, width: number, height: number) {
  if (rgba.length !== width * height * 4) throw new Error("Pixel data does not match the size.");
  const stride = width * 3 + 1;
  const raw = new Uint8Array(stride * height);
  for (let y = 0; y < height; y++) {
    const row = y * stride;
    raw[row] = 1; // Sub filter: each byte stores the difference from the pixel to its left.
    for (let x = 0; x < width; x++) {
      const src = (y * width + x) * 4, dst = row + 1 + x * 3;
      for (let c = 0; c < 3; c++) raw[dst + c] = rgba[src + c] - (x ? rgba[src + c - 4] : 0);
    }
  }
  const header = new Uint8Array(13);
  const view = new DataView(header.buffer);
  view.setUint32(0, width);
  view.setUint32(4, height);
  header.set([8, 2, 0, 0, 0], 8); // 8 bits per channel, color type 2 (RGB), no interlace
  const parts = [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", header), chunk("IDAT", await deflate(raw)), chunk("IEND", new Uint8Array())];
  const out = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  parts.reduce((offset, part) => (out.set(part, offset), offset + part.length), 0);
  return out;
}

/** Width, height, bit depth and color type from a PNG's IHDR chunk. */
export function readPngHeader(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return { width: view.getUint32(16), height: view.getUint32(20), bitDepth: bytes[24], colorType: bytes[25] };
}
