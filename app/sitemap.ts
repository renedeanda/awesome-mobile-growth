import type { MetadataRoute } from "next";
import { guides } from "@/lib/content";
import { podcasts } from "@/lib/podcasts";
import { absolute } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = [
    "",
    "app-store-optimization",
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
  return [...pages, ...guidePages, ...podcastPages];
}
