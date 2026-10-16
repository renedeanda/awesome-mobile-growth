export const applePlatformsReviewed = "2026-10-16";

export type ApplePlatformGuide = {
  slug: "macos-app-store-launch" | "universal-purchase" | "iphone-app-store-launch" | "ipad-app-store-launch" | "app-store-launch-requirements";
  label: string;
  title: string;
  description: string;
  answer: string;
  reading: string;
};

export const applePlatformGuides: ApplePlatformGuide[] = [
  {
    slug: "macos-app-store-launch",
    label: "Mac launch",
    title: "Launch a macOS app on the Mac App Store",
    description: "A practical Mac App Store launch and ASO guide: choose the right app architecture, add macOS to an existing record, prepare the product page, test, submit, and measure the release.",
    answer: "For an existing iPhone or iPad app, add macOS to the same App Store Connect record when you want Universal Purchase. Decide the architecture before creating records, ship a desktop-quality product, and give the Mac version its own screenshots, description, testing, and review context.",
    reading: "7 min read",
  },
  {
    slug: "universal-purchase",
    label: "Architecture",
    title: "Apple Universal Purchase, without the ambiguity",
    description: "Understand how one App Store record connects iPhone, iPad, and Mac apps, what must match, what stays platform-specific, and which decisions cannot be undone.",
    answer: "Universal Purchase uses one App Store Connect app record for related platform versions. The platforms share the app record and commerce relationship, while each platform ships its own build and can have platform-specific product-page information. Plan it before creating separate records: existing records cannot be merged.",
    reading: "3 min read",
  },
  {
    slug: "iphone-app-store-launch",
    label: "iPhone launch",
    title: "Launch an iPhone app people can understand",
    description: "An iPhone App Store launch and ASO guide covering the app record, metadata, screenshots, previews, testing, privacy, review, release, and post-launch learning.",
    answer: "A strong iPhone launch joins a release-ready product to a truthful store promise. Build the app record and privacy details early, design a legible screenshot argument around real product value, test the signed build on supported devices, then measure activation and retention alongside product-page conversion.",
    reading: "5 min read",
  },
  {
    slug: "ipad-app-store-launch",
    label: "iPad launch",
    title: "Launch an iPad app that feels made for iPad",
    description: "An iPad App Store launch and ASO guide for shared iOS metadata, 13-inch screenshots, tablet-native creative, multitasking, input, review, and measurement.",
    answer: "iPad is part of the iOS platform in App Store Connect, not a platform you add separately. The listing shares core iOS metadata, but an iPad-supporting app needs current iPad screenshots and deserves tablet-specific proof of layout, multitasking, keyboard, pointer, and large-canvas value.",
    reading: "3 min read",
  },
  {
    slug: "app-store-launch-requirements",
    label: "Reference",
    title: "App Store launch requirements by Apple platform",
    description: "Compare iPhone, iPad, and Mac App Store launch requirements, screenshot specifications, previews, records, testing, and Universal Purchase behavior in one current reference.",
    answer: "iPhone and iPad share an iOS platform version in App Store Connect, while macOS is added as another platform. Metadata and commerce can span the app record, but screenshots, builds, testing, and some product-page information remain platform-specific.",
    reading: "4 min read",
  },
];

export const appleSources = {
  addPlatforms: { label: "Apple · Add platforms", href: "https://developer.apple.com/help/app-store-connect/create-an-app-record/add-platforms" },
  universalPurchase: { label: "Apple · Universal Purchase", href: "https://developer.apple.com/help/glossary/universal-purchase/" },
  iosOnMac: { label: "Apple · iPhone and iPad apps on Apple silicon Macs", href: "https://developer.apple.com/help/app-store-connect/manage-your-apps-availability/manage-availability-of-iphone-and-ipad-apps-on-macs-with-apple-silicon" },
  appInformation: { label: "Apple · App information", href: "https://developer.apple.com/help/app-store-connect/reference/app-information/app-information" },
  versionInformation: { label: "Apple · Platform version information", href: "https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information" },
  screenshots: { label: "Apple · Screenshot specifications", href: "https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications" },
  previews: { label: "Apple · Manage App Store assets", href: "https://developer.apple.com/help/app-store-connect/manage-app-information/manage-your-app-store-assets" },
  sandbox: { label: "Apple · App Sandbox", href: "https://developer.apple.com/documentation/security/app-sandbox" },
  testflight: { label: "Apple · TestFlight overview", href: "https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/" },
  purchases: { label: "Apple · Configure in-app purchases", href: "https://developer.apple.com/help/app-store-connect/configure-in-app-purchase-settings/overview-for-configuring-in-app-purchases/" },
  privacy: { label: "Apple · Manage app privacy", href: "https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy" },
  accessibility: { label: "Apple · Accessibility nutrition labels", href: "https://developer.apple.com/help/app-store-connect/manage-app-accessibility/overview-of-accessibility-nutrition-labels" },
  submit: { label: "Apple · Submit an app", href: "https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app/" },
  reviewOverview: { label: "Apple · Submitting for review", href: "https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/overview-of-submitting-for-review/" },
  publishing: { label: "Apple · Publishing overview", href: "https://developer.apple.com/help/app-store-connect/manage-your-apps-availability/overview-of-publishing-your-app-on-the-app-store" },
  devices: { label: "Apple · Test compatible devices", href: "https://developer.apple.com/help/app-review/before-submitting-for-review/test-compatible-devices" },
} as const;

export const platformComparison = [
  { topic: "App Store Connect platform", iphone: "iOS", ipad: "iOS — shared with iPhone", mac: "macOS — add to the app record" },
  { topic: "Required screenshot set", iphone: "At least one current required iPhone size", ipad: "13-inch when the app supports iPad", mac: "At least one accepted 16:10 Mac size" },
  { topic: "Accepted screenshot range", iphone: "1–10 per device size and localization", ipad: "1–10 per device size and localization", mac: "1–10 per localization" },
  { topic: "App previews", iphone: "Optional; up to 3 per supported size/language", ipad: "Optional; up to 3 per supported size/language", mac: "Optional; up to 3, landscape only" },
  { topic: "Separate Add Platform step", iphone: "No — the initial iOS platform", ipad: "No", mac: "Yes, for a native or Mac Catalyst Mac version" },
  { topic: "App Sandbox", iphone: "Not the Mac App Sandbox requirement", ipad: "Not the Mac App Sandbox requirement", mac: "Required for Mac App Store distribution" },
  { topic: "Creative priority", iphone: "Fast scan and immediate value", ipad: "Large canvas, multitasking, input", mac: "Desktop workflow, depth, continuity" },
] as const;

export const macScreenshotSizes = ["1280 × 800", "1440 × 900", "2560 × 1600", "2880 × 1800"] as const;

export function appleGuide(slug: ApplePlatformGuide["slug"]) {
  const guide = applePlatformGuides.find((item) => item.slug === slug);
  if (!guide) throw new Error(`Unknown Apple platform guide: ${slug}`);
  return guide;
}
