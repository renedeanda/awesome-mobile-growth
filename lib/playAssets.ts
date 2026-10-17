// Checks a Google Play listing image locally. The icon rules come from developer.android.com; the feature
// graphic and screenshot rules come from googlePlayGraphics, whose primary source couldn't be opened here.
import { playRuleCheck } from "./frames.ts";
import type { CheckRow } from "./previews.ts";
import { googlePlayIcon } from "./storeSpecs.ts";

export type PlayAssetKind = "icon" | "feature-graphic" | "screenshot";
export type ImageFacts = { width: number; height: number; format: "png" | "jpeg" | "other"; alpha?: boolean; bitDepth?: number; bytes: number };

export const playAssetLabels: Record<PlayAssetKind, string> = { icon: "App icon", "feature-graphic": "Feature graphic", screenshot: "Screenshot" };

/** Guesses what an image is for from its size, so a dropped file is checked against the right rules. */
export const guessKind = ({ width, height }: { width: number; height: number }): PlayAssetKind =>
  width === height && width <= 1024 ? "icon" : width / height > 2 ? "feature-graphic" : "screenshot";

/** Reads the facts the checks need from a file's first bytes. Dimensions for JPEG come from the browser. */
export function imageFormat(bytes: Uint8Array): Pick<ImageFacts, "format" | "alpha" | "bitDepth"> & { width?: number; height?: number } {
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const colorType = bytes[25];
    // Color types 4 and 6 carry an alpha channel; a tRNS chunk can add transparency to the others.
    const hasTrns = new TextDecoder().decode(bytes.subarray(0, Math.min(bytes.length, 4096))).includes("tRNS");
    return { format: "png", width: view.getUint32(16), height: view.getUint32(20), bitDepth: bytes[24], alpha: colorType === 4 || colorType === 6 || hasTrns };
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return { format: "jpeg", alpha: false };
  return { format: "other" };
}

const px = (w: number, h: number) => `${w} × ${h}`;

export function checkPlayAsset(kind: PlayAssetKind, image: ImageFacts): CheckRow[] {
  const rows: CheckRow[] = [];
  const kb = Math.round(image.bytes / 1024);
  if (kind === "icon") {
    const { size, maxKilobytes } = googlePlayIcon;
    rows.push({ label: "Size", status: image.width === size && image.height === size ? "pass" : "fail", detail: `${px(image.width, image.height)}. Google Play asks for ${px(size, size)}.` });
    const rgba = image.format === "png" && image.alpha && image.bitDepth === 8;
    rows.push({ label: "Format", status: rgba ? "pass" : "fail", detail: rgba ? "32-bit PNG (8-bit RGBA)." : `Export as a 32-bit PNG (8-bit RGBA). This file is ${image.format === "png" ? `a PNG without an 8-bit alpha channel` : image.format === "jpeg" ? "a JPEG" : "not a PNG"}.` });
    rows.push({ label: "File size", status: kb <= maxKilobytes ? "pass" : "fail", detail: `${kb} KB. The limit is ${maxKilobytes} KB.` });
    rows.push({ label: "Shape and color", status: "check", detail: "Use a full square in sRGB. Google Play applies the rounded mask itself, so don't round the corners or add a shadow." });
    return rows;
  }
  const noAlpha = image.format === "jpeg" || (image.format === "png" && !image.alpha);
  const formatRow: CheckRow = { label: "Format", status: noAlpha ? "pass" : "fail", detail: noAlpha ? `${image.format === "jpeg" ? "JPEG" : "PNG"} without transparency.` : image.format === "png" ? "This PNG has transparency. Export a 24-bit PNG or a JPEG with no alpha channel." : "Use a JPEG or a 24-bit PNG." };
  if (kind === "feature-graphic") {
    rows.push({ label: "Size", status: image.width === 1024 && image.height === 500 ? "pass" : "fail", detail: `${px(image.width, image.height)}. The feature graphic is ${px(1024, 500)}.` });
    rows.push(formatRow);
    return rows;
  }
  const problems = playRuleCheck([image.width, image.height]);
  rows.push({ label: "Size", status: problems.length ? "fail" : "pass", detail: problems.length ? `${px(image.width, image.height)}. ${problems.join(" ")}` : `${px(image.width, image.height)} is within Google Play's limits.` });
  rows.push(formatRow);
  return rows;
}
