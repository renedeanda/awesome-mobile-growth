import { apple, google } from "./articles/links.ts";
import type { Source } from "./articles/types.ts";

export type ChangeStatus = "Upcoming" | "In effect" | "Retired";

export type PlatformChange = {
  slug: string;
  /** The date the change took or takes effect (ISO). */
  date: string;
  /** Shown instead of the date when the exact day isn't known. */
  dateLabel?: string;
  store: "Apple" | "Google Play" | "Firebase";
  status: ChangeStatus;
  title: string;
  summary: string;
  details: string[];
  actions: string[];
  sources: Source[];
  related: string[];
  reviewed: string;
};

// Newest first. Each entry links to the official page and to reporting where Apple or Google's page is silent.
export const changes: PlatformChange[] = [
  {
    slug: "iphone-duo-screenshots-april-2027", date: "2027-04-01", dateLabel: "April 2027", store: "Apple", status: "Upcoming",
    title: "iPhone Duo screenshots required from April 2027",
    summary: "App Store Connect accepts iPhone Duo screenshots now, and they become required for App Store submissions in April 2027.",
    details: [
      "Sizes: 1398 × 2034 for the outer display and 2007 × 2853 for the inner display, in portrait (landscape swaps them).",
      "Apple's screenshot specification ties the requirement to apps built with the iOS 27.1 SDK or later. The App Store Connect release notes of 5 and 15 October 2026 say any app or game submitted from April 2027 will need them.",
      "Apps that provide iPhone Duo screenshots get a badge on the product page saying the app is optimized for iPhone Duo.",
    ],
    actions: ["Keep screenshot source files editable so you can produce Duo frames.", "Test your app's layout on both Duo displays before capturing.", "Plan the screenshots into a release before April 2027."],
    sources: [apple.screenshots, apple.releaseNotes],
    related: ["/store-page/screenshots/", "/launch/requirements/"],
    reviewed: "2026-10-16",
  },
  {
    slug: "october-2026-app-store-creative", date: "2026-10-05", store: "Apple", status: "In effect",
    title: "App Store product page headers and search result assets",
    summary: "App Store Connect added an Asset Library and two optional placements: a product page header and a search result asset, shown on iOS and iPadOS 27 or later.",
    details: [
      "Product page header: 21:9 at 3840 × 1646 (image or video) or 16:9 at 5244 × 2950 (PNG).",
      "Search result asset: 3:2 between 1920 × 1280 and 3840 × 2560 (image or video), or 16:9 at 5244 × 2950 (PNG).",
      "Videos are 5–30 seconds at 30 or 60 fps and loop. Search videos can't be unmuted; header videos can.",
    ],
    actions: ["Decide whether your first three screenshots are strong enough first; they still appear when there's no search asset.", "Design one idea that reads in silence at search-result size.", "Preview the placements in App Store Connect before submitting."],
    sources: [apple.creativeAssets, apple.manageAssets],
    related: ["/store-page/creative-assets/", "/store-page/screenshots/"],
    reviewed: "2026-10-16",
  },
  {
    slug: "google-play-target-api-36", date: "2026-08-31", store: "Google Play", status: "In effect",
    title: "Google Play requires Android 16 (API 36) targets",
    summary: "From 31 August 2026, new apps and app updates on Google Play must target Android 16 (API level 36). Extensions to 1 November 2026 were available on request.",
    details: [
      "Wear OS and Android Automotive OS apps need API 35; Android TV and Android XR apps need API 34.",
      "Existing apps that don't update need API 35 or higher to stay available to new users on newer Android versions.",
      "Targeting API 36 removes orientation and aspect-ratio locks on screens with a smallest width of 600dp or more, so tablets and foldables behave differently.",
    ],
    actions: ["Set targetSdk to 36 and test on a tablet and a foldable.", "Check edge-to-edge layouts, since the opt-out is gone.", "Update store screenshots if large-screen layouts changed."],
    sources: [google.targetSdk],
    related: ["/launch/google-play/"],
    reviewed: "2026-10-16",
  },
  {
    slug: "google-play-listing-metrics-unique-clicks", date: "2026-07-01", dateLabel: "Mid-2026", store: "Google Play", status: "In effect",
    title: "Google Play store listing reports now count install clicks",
    summary: "In mid-2026, Play Console store listing reports moved from acquisitions and conversion rate to unique Install, Open or Pre-register taps and click-through rate.",
    details: [
      "Google describes the change as measuring user intent (clicks) instead of successful outcomes (acquisitions).",
      "The previous metrics (store listing acquisitions, visitors, conversion rate) remain available in the Statistics section with full history.",
      "Reports from Google and third parties give dates between late June and 10 July 2026 for the switch, so check the exact date in your own Play Console.",
    ],
    actions: ["Don't compare conversion before the switch with click-through rate after it.", "Re-baseline your store listing metrics from the switch date.", "Note the change in your experiment log."],
    sources: [google.statistics],
    related: ["/launch/google-play/", "/store-page/testing/"],
    reviewed: "2026-10-16",
  },
  {
    slug: "apple-age-ratings-2026", date: "2026-01-31", store: "Apple", status: "In effect",
    title: "New App Store age ratings: 13+, 16+ and 18+",
    summary: "Apple added 13+, 16+ and 18+ age ratings to 4+ and 9+. Developers had until 31 January 2026 to answer new questionnaire topics before submitting updates.",
    details: [
      "The questionnaire now covers in-app controls, capabilities such as AI assistants, medical or wellness topics, and violence.",
      "Apple re-rated existing apps from earlier answers; you can change the rating in App Store Connect if it doesn't fit.",
      "The new values apply on devices running iOS 26 and the matching OS versions or later; earlier versions show the older values.",
    ],
    actions: ["Open the age rating questionnaire and confirm every answer reflects the current app.", "Check the rating shown on your product page in each storefront."],
    sources: [apple.upcomingRequirements, apple.ageRatings, apple.appInformation],
    related: ["/launch/iphone/"],
    reviewed: "2026-10-16",
  },
  {
    slug: "firebase-dynamic-links-shutdown", date: "2025-08-25", store: "Firebase", status: "Retired",
    title: "Firebase Dynamic Links shut down",
    summary: "Firebase Dynamic Links stopped working on 25 August 2025. Links created with it no longer resolve.",
    details: ["Universal Links (iOS) and App Links (Android) are the platform-native replacements. Attribution providers also offer deep-link products."],
    actions: ["Search your app, website, emails and printed QR codes for old page.link URLs.", "Replace them with Universal Links and App Links, and test installed and not-installed cases."],
    sources: [google.dynamicLinks, apple.universalLinks, google.appLinks],
    related: ["/grow/web-to-app/", "/grow/tool-stack/"],
    reviewed: "2026-10-16",
  },
];

export const getChange = (slug: string) => changes.find((change) => change.slug === slug);
