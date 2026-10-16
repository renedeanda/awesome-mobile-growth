import type { SectionId } from "./types.ts";

export type SectionInfo = { id: SectionId; path: string; name: string; title: string; description: string };

export const sections: Record<SectionId, SectionInfo> = {
  launch: { id: "launch", path: "/launch/", name: "Launch", title: "Launch an app on the App Store and Google Play", description: "Step-by-step launch guides for iPhone, iPad, Mac and Android: records, builds, screenshots, review and release." },
  "store-page": { id: "store-page", path: "/store-page/", name: "Store page", title: "Build a store page that gets the install", description: "Metadata, keywords, screenshots, header and search assets, localization, testing and custom pages for the App Store and Google Play." },
  grow: { id: "grow", path: "/grow/", name: "Grow", title: "Grow after the install", description: "Onboarding, subscriptions, ratings, web-to-app, paid and organic, App Store Connect analytics and choosing a growth stack." },
  learn: { id: "learn", path: "/learn/", name: "Learn", title: "Learn the metrics, tools and ideas behind app growth", description: "An App Store metrics glossary, using AI for ASO, a podcast shelf and a maintained resource list." },
};
