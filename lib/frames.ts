// Layout for the screenshot frame studio. Pure geometry, so the preview and the export share it.
// Export sizes come only from lib/storeSpecs.ts.
import { appleScreenshotClasses, googlePlayScreenshotPresets } from "./storeSpecs.ts";

export type Size = [number, number];
export type FrameStyle = "dynamic-island" | "face-id" | "home-button" | "ipad" | "mac" | "android" | "none";
export type Rect = { x: number; y: number; w: number; h: number };

export type FrameTarget = {
  id: string;
  store: "apple" | "google-play";
  name: string;
  sizes: Size[];
  /** iPhone and iPad slots accept landscape uploads with the sides swapped. */
  rotatable: boolean;
  maxFrames: number;
  styles: FrameStyle[];
};

export const styleLabels: Record<FrameStyle, string> = {
  "dynamic-island": "iPhone with Dynamic Island",
  "face-id": "iPhone with notch",
  "home-button": "iPhone with Home Button",
  ipad: "iPad",
  mac: "Mac window",
  android: "Android phone",
  none: "No device frame",
};

const stylesFor = (id: string, device: string): FrameStyle[] => {
  if (id.startsWith("iphone-dynamic-island")) return ["dynamic-island", "face-id", "none"];
  if (id.startsWith("iphone-face-id")) return ["face-id", "dynamic-island", "none"];
  if (id.startsWith("iphone-home-button")) return ["home-button", "none"];
  if (device === "iPhone") return ["none", "dynamic-island"];
  if (device === "iPad") return ["ipad", "none"];
  if (device === "Mac") return ["mac", "none"];
  return ["none"];
};

export const frameTargets: FrameTarget[] = [
  // Watch screenshots are captured from the watch face itself; a frame or caption has no room there.
  ...appleScreenshotClasses.filter((spec) => spec.device !== "Apple Watch").map((spec): FrameTarget => ({
    id: spec.id, store: "apple", name: spec.name, sizes: spec.sizes,
    rotatable: spec.device === "iPhone" || spec.device === "iPad", maxFrames: 10, styles: stylesFor(spec.id, spec.device),
  })),
  { id: "google-play", store: "google-play", name: "Google Play phone", sizes: googlePlayScreenshotPresets.map((preset) => preset.size), rotatable: false, maxFrames: 8, styles: ["android", "none"] },
];

export const getTarget = (id: string | null | undefined) => frameTargets.find((target) => target.id === id);
/** The biggest accepted size: Apple scales it down for smaller displays in the same class. */
export const largestSize = (target: FrameTarget) => target.sizes.reduce((best, size) => size[0] * size[1] > best[0] * best[1] ? size : best);

/** Google Play: each side 320–3840 px and the long side at most twice the short side. */
export function playRuleCheck([w, h]: Size) {
  const problems: string[] = [];
  if (Math.min(w, h) < 320 || Math.max(w, h) > 3840) problems.push("Each side must be between 320 and 3840 pixels.");
  if (Math.max(w, h) > 2 * Math.min(w, h)) problems.push("The long side can be at most twice the short side.");
  return problems;
}

const contain = (box: Rect, aspect: number): Rect => {
  const w = Math.min(box.w, box.h * aspect), h = w / aspect;
  return { x: box.x + (box.w - w) / 2, y: box.y + (box.h - h) / 2, w, h };
};

/** Share of a capture cut off when it is drawn to cover a screen of another shape (0 to 1). */
export function cropShare(imageAspect: number, screen: Rect) {
  const screenAspect = screen.w / screen.h;
  return 1 - Math.min(imageAspect, screenAspect) / Math.max(imageAspect, screenAspect);
}

/** Words in a caption; the screenshots guide aims for seven or fewer. */
export const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;

export type Measure = (text: string, fontSize: number) => number;

/** Greedy word wrap; an explicit line break always starts a new line. */
export function wrapCaption(text: string, maxWidth: number, fontSize: number, measure: Measure) {
  const lines: string[] = [];
  for (const paragraph of text.split(/\r?\n/)) {
    let line = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word;
      if (line && measure(next, fontSize) > maxWidth) { lines.push(line); line = word; } else line = next;
    }
    if (line) lines.push(line);
  }
  return lines;
}

/** Shrinks the caption until it fits in three lines with no line wider than the canvas allows. */
export function fitCaption(text: string, [w, h]: Size, measure: Measure) {
  if (!text.trim()) return null;
  const maxWidth = w * 0.84;
  let fontSize = Math.round(Math.min(w, h) * (w > h ? 0.07 : 0.075));
  const minimum = fontSize * 0.55;
  let lines = wrapCaption(text, maxWidth, fontSize, measure);
  while (fontSize > minimum && (lines.length > 3 || lines.some((line) => measure(line, fontSize) > maxWidth))) {
    fontSize = Math.round(fontSize * 0.92);
    lines = wrapCaption(text, maxWidth, fontSize, measure);
  }
  return { lines: lines.slice(0, 3), fontSize, lineHeight: Math.round(fontSize * 1.15) };
}

type Shape = { aspect: number; inset: [number, number, number, number]; body: number; screen: number };
// Portrait screen aspect (width / height), bezel insets [top, right, bottom, left] and corner radii,
// all as fractions of the device body width. Generic shapes, not any one model's exact dimensions.
const shapes: Record<Exclude<FrameStyle, "none">, Shape> = {
  "dynamic-island": { aspect: 1206 / 2622, inset: [0.035, 0.035, 0.035, 0.035], body: 0.15, screen: 0.12 },
  "face-id": { aspect: 1170 / 2532, inset: [0.04, 0.04, 0.04, 0.04], body: 0.15, screen: 0.115 },
  "home-button": { aspect: 750 / 1334, inset: [0.25, 0.065, 0.25, 0.065], body: 0.14, screen: 0 },
  ipad: { aspect: 2064 / 2752, inset: [0.045, 0.045, 0.045, 0.045], body: 0.06, screen: 0.025 },
  mac: { aspect: 16 / 10, inset: [0.035, 0.004, 0.004, 0.004], body: 0.012, screen: 0.004 },
  android: { aspect: 1080 / 2400, inset: [0.03, 0.03, 0.03, 0.03], body: 0.11, screen: 0.085 },
};

export type FrameLayout = {
  caption: { x: number; y: number; lines: string[]; fontSize: number; lineHeight: number } | null;
  /** The device outline, or null when there is no frame. */
  body: Rect | null;
  bodyRadius: number;
  screen: Rect;
  screenRadius: number;
  /** A portrait device drawn on its side for a landscape canvas. */
  rotated: boolean;
};

export function layoutFrame(size: Size, style: FrameStyle, caption: ReturnType<typeof fitCaption>, imageAspect?: number): FrameLayout {
  const [w, h] = size;
  const pad = Math.round(Math.min(w, h) * 0.06);
  const placedCaption = caption && { x: w / 2, y: Math.round(pad * 1.2), ...caption };
  const top = placedCaption ? placedCaption.y + caption.lines.length * caption.lineHeight + pad : pad;
  const box: Rect = { x: pad, y: top, w: w - pad * 2, h: h - top - pad };

  if (style === "none") {
    // With no caption either, this is a plain resize to the store size. A capture that is a different
    // shape (a 1080 × 2400 phone capture for Play's 1080 × 1920) is padded, never silently cropped.
    if (!placedCaption) {
      const fill = { x: 0, y: 0, w, h };
      const screen = imageAspect && Math.abs(imageAspect / (w / h) - 1) > 0.02 ? contain(fill, imageAspect) : fill;
      return { caption: null, body: null, bodyRadius: 0, screen, screenRadius: 0, rotated: false };
    }
    const aspect = imageAspect ?? box.w / box.h;
    const sw = Math.min(box.w, box.h * aspect), sh = sw / aspect;
    return { caption: placedCaption, body: null, bodyRadius: 0, screen: { x: box.x + (box.w - sw) / 2, y: box.y + (box.h - sh) / 2, w: sw, h: sh }, screenRadius: Math.round(sw * 0.04), rotated: false };
  }

  const shape = shapes[style];
  const rotated = style !== "mac" && w > h;
  const aspect = rotated ? 1 / shape.aspect : shape.aspect;
  // Rotating a portrait device 90° clockwise moves its top bezel to the right, right to bottom, and so on.
  const [t, r, b, l] = rotated ? [shape.inset[3], shape.inset[0], shape.inset[1], shape.inset[2]] : shape.inset;
  // The body's width sets every inset, so solve for the largest body that fits the box.
  // In rotated mode the insets are fractions of the device's own (portrait) width, which is the body height.
  let bodyW: number, bodyH: number;
  if (!rotated) {
    bodyW = Math.min(box.w, box.h / ((1 - l - r) / aspect + t + b));
    bodyH = bodyW * (1 - l - r) / aspect + bodyW * (t + b);
  } else {
    bodyH = Math.min(box.h, box.w / ((1 - t - b) * aspect + l + r));
    bodyW = bodyH * (1 - t - b) * aspect + bodyH * (l + r);
  }
  const unit = rotated ? bodyH : bodyW;
  const body: Rect = { x: box.x + (box.w - bodyW) / 2, y: box.y + (box.h - bodyH) / 2, w: bodyW, h: bodyH };
  const screen: Rect = { x: body.x + unit * l, y: body.y + unit * t, w: bodyW - unit * (l + r), h: bodyH - unit * (t + b) };
  return { caption: placedCaption, body, bodyRadius: unit * shape.body, screen, screenRadius: unit * shape.screen, rotated };
}

/** A safe, descriptive file name such as "iphone-dynamic-island-medium-1206x2622-01.png". */
export const frameFileName = (targetId: string, [w, h]: Size, index: number, extension: "png" | "jpg") =>
  `${targetId}-${w}x${h}-${String(index + 1).padStart(2, "0")}.${extension}`;
