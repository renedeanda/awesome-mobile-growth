import type { MetadataRoute } from "next";
import { guides } from "@/lib/content";
import { podcasts } from "@/lib/podcasts";
import { absolute } from "@/lib/site";
import { applePlatformGuides } from "@/lib/applePlatforms";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = [
    "",
    "app-store-optimization",
    "apple-platforms",
    "aso-checklist",
    "guides",
    "google-play",
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
  const podcastPages: MetadataRoute.Sitemap = podcasts.map((podcast) => ({
    url: absolute(`/podcasts/${podcast.slug}/`),
    lastModified: new Date(podcast.latestChecked),
  }));
  const applePlatformPages: MetadataRoute.Sitemap = applePlatformGuides.map((guide) => ({
    url: absolute(`/apple-platforms/${guide.slug}/`),
    lastModified: new Date("2026-10-12"),
  }));
  return [...pages, ...applePlatformPages, ...guidePages, ...podcastPages];
}
