// One page per screenshot class, generated from lib/storeSpecs.ts so the numbers have a single source.
import { appleScreenshotClasses, appleScreenshotRules, formatSize, googlePlayGraphics, specsChecked, type ScreenshotClass } from "./storeSpecs.ts";

const short: Record<string, string> = {
  "iphone-duo": "iPhone Duo",
  "iphone-dynamic-island-large": "iPhone Dynamic Island (large)",
  "iphone-dynamic-island-medium": "iPhone Dynamic Island (medium)",
  "iphone-face-id-large": "iPhone Face ID (large)",
  "iphone-face-id-medium": "iPhone Face ID (medium)",
  "iphone-home-button-large": "iPhone Home Button (large)",
  "iphone-home-button-medium": "iPhone Home Button (medium)",
  "ipad-13": "iPad 13-inch",
  "ipad-11": "iPad 11-inch",
  "mac": "Mac",
  "apple-tv": "Apple TV",
  "vision-pro": "Apple Vision Pro",
  "watch": "Apple Watch",
};

export type Orientation = "both" | "landscape" | "fixed";
export type SpecPage = {
  slug: string;
  store: "apple" | "google-play";
  device: string;
  short: string;
  title: string;
  seoTitle: string;
  description: string;
  answer: string;
  orientation: Orientation;
  spec?: ScreenshotClass;
};

const orientationOf = (spec: ScreenshotClass): Orientation => spec.device === "iPhone" || spec.device === "iPad" ? "both" : spec.device === "Apple Watch" ? "fixed" : "landscape";
const list = (sizes: string[]) => sizes.length <= 2 ? sizes.join(" or ") : `${sizes.slice(0, -1).join(", ")} or ${sizes.at(-1)}`;

// Search results show about 160 characters of a description; add the closing phrase only when it fits.
const withTail = (text: string, tail: string) => (text.length + tail.length <= 160 ? text + tail : text);

function applePage(spec: ScreenshotClass): SpecPage {
  const name = short[spec.id];
  const sizes = list(spec.sizes.map(formatSize));
  const orientation = orientationOf(spec);
  const shape = orientation === "both" ? " pixels in portrait (swap them for landscape)" : orientation === "landscape" ? " pixels, landscape" : " pixels";
  const brief = spec.sizes.length > 3 ? `${spec.sizes.slice(0, 2).map(formatSize).join(", ")} and ${spec.sizes.length - 2} more` : sizes;
  const required = spec.required?.replace(/^Yes, /, "").replace(/ \(see note\)$/, "");
  const status = required ? `Required ${required[0].toLowerCase()}${required.slice(1)}.` : "Optional.";
  return {
    slug: spec.id, store: "apple", device: spec.device, short: name,
    title: `${spec.name} screenshot size`,
    seoTitle: `${name} App Store screenshot size`,
    description: withTail(`${name} App Store screenshots: ${brief} pixels${orientation === "landscape" ? ", landscape" : ""}. ${status.replace(" (large display)", " (large)")}`, " Formats, limits and fallbacks."),
    answer: `Upload ${sizes}${shape}. ${status} ${spec.note ?? ""}`.trim(),
    orientation, spec,
  };
}

export const googlePlayPage: SpecPage = {
  slug: "google-play", store: "google-play", device: "Google Play", short: "Google Play",
  title: "Google Play screenshot and graphic sizes",
  seoTitle: "Google Play screenshot and feature graphic sizes",
  description: `Google Play phone and tablet screenshot limits, the 1024 × 500 feature graphic, the 512 × 512 icon and preview video rules, checked ${specsChecked}.`,
  answer: "Upload 2 to 8 phone screenshots in JPEG or 24-bit PNG, each side between 320 and 3,840 pixels, with the long side at most twice the short side. Add a 1024 × 500 feature graphic and a 512 × 512 icon. For large-screen recommendations, upload at least 4 tablet screenshots at 1080 pixels or more.",
  orientation: "both",
};

export const specPages: SpecPage[] = [...appleScreenshotClasses.map(applePage), googlePlayPage];
export const getSpecPage = (slug: string) => specPages.find((page) => page.slug === slug);
export const specPath = (slug: string) => `/screenshot-sizes/${slug}/`;
export { appleScreenshotRules, googlePlayGraphics, specsChecked };

const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
/** "16:10" when the ratio reduces to small numbers, otherwise "1 : 2.17". */
export function aspectRatio([w, h]: [number, number]) {
  const d = gcd(w, h);
  if (w / d <= 21 && h / d <= 21) return `${w / d}:${h / d}`;
  return w < h ? `1 : ${(h / w).toFixed(2)}` : `${(w / h).toFixed(2)} : 1`;
}
