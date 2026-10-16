import { apple, google } from "./links.ts";
import type { ArticleSource } from "./types.ts";

export const learnArticles: ArticleSource[] = [
  {
    section: "learn", slug: "ai-for-aso", label: "AI for ASO",
    title: "Use AI for App Store Optimization without making things up",
    seoTitle: "AI for ASO: what to use it for, prompts, and what to check",
    description: "Where AI assistants save time on store work, what they can't know, how to brief them with facts, and the five checks every draft needs.",
    answer: "Use AI to group review phrases, draft subtitle and caption options, spot repeated keywords and produce first-draft translations. Don't use it for search volume, store rules or claims about your app. Give it your facts and limits, then check every draft for truth, policy, length, tone and market fit.",
    platforms: ["apple", "google-play"], evidence: ["opinion", "official"], published: "2026-10-12", reviewed: "2026-10-16",
    sources: [apple.productPage, apple.reviewGuidelines, google.metadataPolicy],
    related: ["/store-page/metadata/", "/store-page/keywords/", "/store-page/localization/"],
  },
];
