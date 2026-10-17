import type { ComponentType } from "react";

type MdxModule = { default: ComponentType };

// Static import map so each guide's MDX is bundled. Keyed by "<section>/<slug>".
// scripts/audit-content.mjs fails if a guide is missing here or in the registry.
export const articleLoaders: Record<string, () => Promise<MdxModule>> = {
  "launch/checklist": () => import("@/content/launch/checklist.mdx"),
  "launch/google-play": () => import("@/content/launch/google-play.mdx"),
  "launch/ipad": () => import("@/content/launch/ipad.mdx"),
  "launch/iphone": () => import("@/content/launch/iphone.mdx"),
  "launch/mac": () => import("@/content/launch/mac.mdx"),
  "launch/requirements": () => import("@/content/launch/requirements.mdx"),
  "launch/universal-purchase": () => import("@/content/launch/universal-purchase.mdx"),
  "store-page/creative-assets": () => import("@/content/store-page/creative-assets.mdx"),
  "store-page/custom-pages": () => import("@/content/store-page/custom-pages.mdx"),
  "store-page/keywords": () => import("@/content/store-page/keywords.mdx"),
  "store-page/localization": () => import("@/content/store-page/localization.mdx"),
  "store-page/metadata": () => import("@/content/store-page/metadata.mdx"),
  "store-page/screenshots": () => import("@/content/store-page/screenshots.mdx"),
  "store-page/testing": () => import("@/content/store-page/testing.mdx"),
  "store-page/app-previews": () => import("@/content/store-page/app-previews.mdx"),
  "grow/app-store-connect": () => import("@/content/grow/app-store-connect.mdx"),
  "grow/growth-loop": () => import("@/content/grow/growth-loop.mdx"),
  "grow/onboarding": () => import("@/content/grow/onboarding.mdx"),
  "grow/paid-and-organic": () => import("@/content/grow/paid-and-organic.mdx"),
  "grow/ratings-reviews": () => import("@/content/grow/ratings-reviews.mdx"),
  "grow/subscriptions": () => import("@/content/grow/subscriptions.mdx"),
  "grow/tool-stack": () => import("@/content/grow/tool-stack.mdx"),
  "grow/web-to-app": () => import("@/content/grow/web-to-app.mdx"),
  "grow/in-app-events": () => import("@/content/grow/in-app-events.mdx"),
  "grow/featuring": () => import("@/content/grow/featuring.mdx"),
  "grow/pricing": () => import("@/content/grow/pricing.mdx"),
  "learn/ai-for-aso": () => import("@/content/learn/ai-for-aso.mdx"),
};
