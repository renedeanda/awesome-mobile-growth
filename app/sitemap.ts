import type { MetadataRoute } from "next";
import { guides } from "@/lib/content";
import { absolute } from "@/lib/site";
import { applePlatformGuides } from "@/lib/applePlatforms";
import { fieldCollections } from "@/lib/fieldLab";
import { tools } from "@/lib/tools";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = [
    "",
    "app-store-optimization",
    "apple-platforms",
    "aso-checklist",
    "guides",
    "google-play",
    "growth",
    "reference",
    "updates",
    "tools",
    "ai",
    "ai/skills",
    "ai/skills/app-store-growth",
    "podcasts",
    "resources",
    "workbench",
    "about",
    "privacy",
    "field-notes/rebuilding-awesome-mobile-growth",
  ];
  const pages: MetadataRoute.Sitemap = fixed.map((path) => ({
    url: absolute(`/${path}${path ? "/" : ""}`),
    lastModified: new Date("2026-10-12"),
  }));
  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: absolute(`/guides/${guide.slug}/`),
    lastModified: new Date(guide.modified),
  }));
  const applePlatformPages: MetadataRoute.Sitemap = applePlatformGuides.map((guide) => ({
    url: absolute(`/apple-platforms/${guide.slug}/`),
    lastModified: new Date("2026-10-12"),
  }));
  const bases = { reference: "reference", google: "google-play", growth: "growth", ai: "ai/guides", updates: "updates" } as const;
  const fieldPages: MetadataRoute.Sitemap = Object.entries(fieldCollections).flatMap(([collection, entries]) => entries.map((entry) => ({ url: absolute(`/${bases[collection as keyof typeof bases]}/${entry.slug}/`), lastModified: new Date(entry.reviewed) })));
  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({ url: absolute(`/tools/${tool.slug}/`), lastModified: new Date("2026-10-12") }));
  return [...pages, ...applePlatformPages, ...guidePages, ...fieldPages, ...toolPages];
}
