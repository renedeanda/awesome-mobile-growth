export type Evidence = "official" | "observed" | "experiment" | "hypothesis" | "opinion";
export type Guide = { slug: string; eyebrow: string; title: string; description: string; reviewed: string; reading: string; evidence: Evidence[]; file: string };

export const guides: Guide[] = [
  { slug: "metadata", eyebrow: "01 · Foundation", title: "Metadata that earns the tap", description: "Write an accurate name, subtitle, keywords, and description around the job your app actually does.", reviewed: "2026-10-12", reading: "8 min", evidence: ["official", "observed"], file: "metadata.md" },
  { slug: "keyword-research", eyebrow: "02 · Discovery", title: "Keyword research without fake precision", description: "Build a useful vocabulary from real customer language—without pretending estimates are ground truth.", reviewed: "2026-10-12", reading: "7 min", evidence: ["official", "experiment"], file: "keyword-research.md" },
  { slug: "localization", eyebrow: "03 · Markets", title: "Localize meaning, not just words", description: "Adapt the promise, search vocabulary, and creative for each market with native review.", reviewed: "2026-10-12", reading: "6 min", evidence: ["official", "observed"], file: "localization.md" },
  { slug: "screenshots", eyebrow: "04 · Conversion", title: "Screenshots as a visual argument", description: "Turn real product value into an honest, legible sequence that survives a one-second scan.", reviewed: "2026-10-12", reading: "9 min", evidence: ["official", "experiment"], file: "screenshots.md" },
  { slug: "app-store-creative-assets", eyebrow: "05 · New for 2026", title: "App Store creative assets, decoded", description: "Plan Apple’s new product-page header and search-result assets with exact formats, honest composition, and graceful fallbacks.", reviewed: "2026-10-12", reading: "8 min", evidence: ["official", "observed"], file: "app-store-creative-assets.md" },
  { slug: "product-page-testing", eyebrow: "06 · Learning", title: "Run tests that teach you something", description: "Choose one decision, one hypothesis, and one primary measure before changing the page.", reviewed: "2026-10-12", reading: "8 min", evidence: ["official", "experiment"], file: "product-page-testing.md" },
  { slug: "app-store-connect-growth", eyebrow: "07 · Operations", title: "The App Store Connect growth loop", description: "Use custom pages, tags, analytics, nominations, and benchmarks as one evidence-aware operating rhythm.", reviewed: "2026-10-12", reading: "10 min", evidence: ["official", "opinion"], file: "app-store-connect-growth.md" },
  { slug: "mobile-growth-stack", eyebrow: "08 · Stack", title: "Choose a mobile growth stack", description: "Map tools to decisions across research, measurement, attribution, monetization, and experimentation—without buying a logo wall.", reviewed: "2026-10-12", reading: "10 min", evidence: ["observed", "opinion"], file: "mobile-growth-stack.md" },
  { slug: "ratings-retention", eyebrow: "09 · Product", title: "Growth after the install", description: "Treat ratings, reviews, retention, and the product experience as one connected system.", reviewed: "2026-10-12", reading: "6 min", evidence: ["official", "opinion"], file: "ratings-retention.md" },
];

export const sources = [
  { name: "Apple · Creating your product page", href: "https://developer.apple.com/app-store/product-page/", kind: "Primary source" },
  { name: "Apple · App information reference", href: "https://developer.apple.com/help/app-store-connect/reference/app-information/app-information", kind: "Primary source" },
  { name: "Apple · Platform version information", href: "https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information", kind: "Primary source" },
  { name: "Apple · Manage App Store assets", href: "https://developer.apple.com/help/app-store-connect/manage-app-information/manage-your-app-store-assets", kind: "Primary source" },
  { name: "Apple · Custom product pages", href: "https://developer.apple.com/app-store/custom-product-pages/", kind: "Primary source" },
  { name: "Google Play · Store listing fields", href: "https://support.google.com/googleplay/android-developer/answer/9859152", kind: "Primary source" },
  { name: "Google Play · Metadata policy", href: "https://support.google.com/googleplay/android-developer/answer/9898842", kind: "Primary source" },
];
