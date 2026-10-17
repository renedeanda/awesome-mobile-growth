// Store asset specifications in one place, so guides, tools and /data/store-specs.json agree.
// Apple figures were read from App Store Connect Help on 2026-10-16.

export const specsChecked = "2026-10-16";

export const appleScreenshotSource = "https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications";
export const appleCreativeSource = "https://developer.apple.com/help/app-store-connect/reference/app-information/creative-assets-specifications";
export const googleGraphicsSource = "https://support.google.com/googleplay/android-developer/answer/9866151";

export type ScreenshotClass = {
  id: string;
  device: "iPhone" | "iPad" | "Mac" | "Apple TV" | "Apple Vision Pro" | "Apple Watch";
  name: string;
  /** Portrait sizes as [width, height]; landscape swaps them unless noted. */
  sizes: Array<[number, number]>;
  required?: string;
  note?: string;
};

export const appleScreenshotClasses: ScreenshotClass[] = [
  { id: "iphone-duo", device: "iPhone", name: "iPhone Duo", sizes: [[1398, 2034], [2007, 2853]], required: "From April 2027 (see note)", note: "1398 × 2034 is the outer display and 2007 × 2853 the inner display. Apple's screenshot specification ties the requirement to apps built with the iOS 27.1 SDK or later; the App Store Connect release notes say any app or game submitted from April 2027. Providing them shows an iPhone Duo badge on the product page." },
  { id: "iphone-dynamic-island-large", device: "iPhone", name: "iPhone with Dynamic Island (large display)", sizes: [[1260, 2736], [1290, 2796], [1320, 2868]], note: "Falls back to scaled iPhone with Face ID (large display) screenshots." },
  { id: "iphone-dynamic-island-medium", device: "iPhone", name: "iPhone with Dynamic Island (medium display)", sizes: [[1179, 2556], [1206, 2622]], required: "Yes, for every iPhone app", note: "This is the one iPhone set Apple requires today." },
  { id: "iphone-face-id-large", device: "iPhone", name: "iPhone with Face ID (large display)", sizes: [[1284, 2778], [1242, 2688]], required: "Only if you skip the Dynamic Island (large display) set" },
  { id: "iphone-face-id-medium", device: "iPhone", name: "iPhone with Face ID (medium display)", sizes: [[1170, 2532], [1125, 2436], [1080, 2340]] },
  { id: "iphone-home-button-large", device: "iPhone", name: "iPhone with Home Button (large display)", sizes: [[1242, 2208]] },
  { id: "iphone-home-button-medium", device: "iPhone", name: "iPhone with Home Button (medium display)", sizes: [[750, 1334]] },
  { id: "ipad-13", device: "iPad", name: "iPad 13-inch display", sizes: [[2064, 2752], [2048, 2732]], required: "Yes, if the app runs on iPad" },
  { id: "ipad-11", device: "iPad", name: "iPad 11-inch display", sizes: [[1488, 2266], [1668, 2420], [1668, 2388], [1640, 2360]], note: "Falls back to scaled 13-inch screenshots." },
  { id: "mac", device: "Mac", name: "Mac", sizes: [[1280, 800], [1440, 900], [2560, 1600], [2880, 1800]], required: "Yes, for Mac apps", note: "16:10, landscape only." },
  { id: "apple-tv", device: "Apple TV", name: "Apple TV", sizes: [[1920, 1080], [3840, 2160]], required: "Yes, for Apple TV apps", note: "Landscape." },
  { id: "vision-pro", device: "Apple Vision Pro", name: "Apple Vision Pro", sizes: [[3840, 2160]], required: "Yes, for visionOS apps" },
  { id: "watch", device: "Apple Watch", name: "Apple Watch", sizes: [[422, 514], [410, 502], [416, 496], [396, 484], [368, 448], [312, 390]], required: "Yes, for watch apps", note: "422 × 514 covers Ultra 4 and Ultra 3; 416 × 496 covers Series 12, 11 and 10. Use the same size in every localization." },
];

export const appleScreenshotRules = {
  count: "1 to 10 per device size and localization",
  formats: ["JPEG", "JPG", "PNG"],
  alpha: false,
  scaling: "If your UI is the same across sizes, upload only the largest required size and App Store Connect scales it down.",
};

export const appleCreativeAssets = [
  { placement: "Product page header", kind: "Image", ratio: "21:9", size: "3840 × 1646", formats: "JPEG, JPG, PNG" },
  { placement: "Product page header", kind: "Image", ratio: "16:9", size: "5244 × 2950", formats: "PNG" },
  { placement: "Product page header", kind: "Video", ratio: "21:9", size: "3840 × 1646", formats: "MOV, M4V, MP4 · 5–30 s · 30 or 60 fps" },
  { placement: "Search results", kind: "Image", ratio: "3:2", size: "1920 × 1280 to 3840 × 2560", formats: "JPEG, JPG, PNG" },
  { placement: "Search results", kind: "Image", ratio: "16:9", size: "5244 × 2950", formats: "PNG" },
  { placement: "Search results", kind: "Video", ratio: "3:2", size: "1920 × 1280 to 3840 × 2560", formats: "MOV, M4V, MP4 · 5–30 s · 30 or 60 fps" },
] as const;

// Read from developer.android.com on 2026-10-17 (Google Play icon design specifications).
export const googlePlayIcon = { size: 512, maxKilobytes: 1024, format: "32-bit PNG", colorSpace: "sRGB", source: "https://developer.android.com/distribute/google-play/resources/icon-design-specifications" } as const;

// Read from App Store Connect Help on 2026-10-17. Apple asks for the accepted resolution, not the device resolution.
export const appPreviewSource = "https://developer.apple.com/help/app-store-connect/reference/app-information/app-preview-specifications";
export type PreviewClass = {
  /** Matches an appleScreenshotClasses id where the site has a size page for it. */
  id: string;
  name: string;
  /** Accepted portrait sizes as [width, height]; landscape swaps them. Empty for landscape-only platforms. */
  portrait: Array<[number, number]>;
  landscape: Array<[number, number]>;
  /** The class whose previews Apple scales down when this one has none. */
  fallback?: string;
};
const iphoneTall: Array<[number, number]> = [[886, 1920]];
const swap = (sizes: Array<[number, number]>) => sizes.map(([w, h]) => [h, w] as [number, number]);
export const appPreviewClasses: PreviewClass[] = [
  { id: "iphone-duo", name: "iPhone Duo", portrait: iphoneTall, landscape: swap(iphoneTall) },
  { id: "iphone-dynamic-island-large", name: "iPhone with Dynamic Island (large display)", portrait: iphoneTall, landscape: swap(iphoneTall), fallback: "iPhone with Face ID (large display)" },
  { id: "iphone-dynamic-island-medium", name: "iPhone with Dynamic Island (medium display)", portrait: iphoneTall, landscape: swap(iphoneTall), fallback: "iPhone with Face ID (large display)" },
  { id: "iphone-face-id-large", name: "iPhone with Face ID (large display)", portrait: iphoneTall, landscape: swap(iphoneTall), fallback: "iPhone with Dynamic Island (large display)" },
  { id: "iphone-face-id-medium", name: "iPhone with Face ID (medium display)", portrait: iphoneTall, landscape: swap(iphoneTall), fallback: "iPhone with Dynamic Island (medium display)" },
  { id: "iphone-home-button-large", name: "iPhone with Home Button (large display)", portrait: [[1080, 1920]], landscape: [[1920, 1080]], fallback: "iPhone with Face ID (medium display)" },
  { id: "iphone-home-button-medium", name: "iPhone with Home Button (medium display)", portrait: [[750, 1334]], landscape: [[1334, 750]], fallback: "iPhone with Home Button (large display)" },
  { id: "ipad-13", name: "iPad 13-inch display", portrait: [[1200, 1600]], landscape: [[1600, 1200]] },
  { id: "ipad-11", name: "iPad 11-inch display", portrait: [[1200, 1600]], landscape: [[1600, 1200]], fallback: "iPad 13-inch display" },
  { id: "mac", name: "Mac", portrait: [], landscape: [[1920, 1080]] },
  { id: "apple-tv", name: "Apple TV", portrait: [], landscape: [[1920, 1080]] },
  { id: "vision-pro", name: "Apple Vision Pro", portrait: [], landscape: [[3840, 2160]] },
];
export const appPreviewRules = {
  seconds: [15, 30] as [number, number],
  maxFps: 30,
  maxMegabytes: 500,
  perLocale: "Up to three app previews per supported device size and language",
  formats: ".mov, .m4v or .mp4 with H.264 (10–12 Mbps, progressive, up to High Profile 4.0); or .mov with ProRes 422 HQ",
  audio: "Stereo. H.264: 256 kbps AAC at 44.1 or 48 kHz. ProRes: PCM or 256 kbps AAC",
  extensions: ["mov", "m4v", "mp4"],
  posterFrameDefault: 5,
} as const;

// Read from App Store Connect Help on 2026-10-17. Card media is landscape, details page media is portrait.
export const appleInAppEventMediaSource = "https://developer.apple.com/help/app-store-connect/reference/in-app-events/in-app-event-media-and-audio-specifications";
export const appleInAppEventMedia = [
  { placement: "Event card", kind: "Image", ratio: "16:9", size: "1920 × 1080 to 3840 × 2160", formats: "JPEG, JPG, PNG · up to 500 MB" },
  { placement: "Event card", kind: "Video", ratio: "16:9", size: "1920 × 1080 to 3840 × 2160", formats: "MOV, M4V, MP4 · 15–30 s · 30 or 60 fps · up to 500 MB" },
  { placement: "Event details page", kind: "Image", ratio: "9:16", size: "1080 × 1920 to 2160 × 3840", formats: "JPEG, JPG, PNG · up to 500 MB" },
  { placement: "Event details page", kind: "Video", ratio: "9:16", size: "1080 × 1920 to 2160 × 3840", formats: "MOV, M4V, MP4 · 15–30 s · 30 or 60 fps · up to 500 MB" },
] as const;

/** The badges Apple lets an event carry. */
export const appleInAppEventBadges = ["Live Event", "Premiere", "Challenge", "Competition", "New Season", "Major Update", "Special Event"] as const;

// UNVERIFIED: Google's Play Console Help pages weren't reachable when these were last checked, so only the
// 512 px, 32-bit PNG, 1024 KB icon figures are confirmed (developer.android.com). Confirm the rest on
// googleGraphicsSource before relying on them; the pages that show them tell readers to do the same.
export const googlePlayGraphics = [
  { asset: "App icon", spec: "512 × 512 px, 32-bit PNG with alpha, up to 1 MB" },
  { asset: "Feature graphic", spec: "1024 × 500 px, JPEG or 24-bit PNG, no alpha. Required to publish." },
  { asset: "Phone screenshots", spec: "2 to 8. JPEG or 24-bit PNG, no alpha. Each side 320–3840 px; the long side at most twice the short side." },
  { asset: "Tablet and Chromebook screenshots", spec: "Up to 8 per device type. Upload at least 4 at 1080 px or more to be eligible for large-screen recommendations." },
  { asset: "Preview video", spec: "A public or unlisted YouTube URL, no ads, not age-restricted." },
] as const;

/** Sizes the frame studio exports for Play: 1080 px or more at 9:16 or 16:9, the recommendation-eligible shapes above. */
export const googlePlayScreenshotPresets: Array<{ id: string; name: string; size: [number, number] }> = [
  { id: "google-play-portrait", name: "Phone, portrait 9:16", size: [1080, 1920] },
  { id: "google-play-landscape", name: "Phone, landscape 16:9", size: [1920, 1080] },
];

export const formatSize = ([w, h]: [number, number]) => `${w} × ${h}`;
