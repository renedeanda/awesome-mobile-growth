import type { MetadataRoute } from "next";
import { articles, sections } from "@/lib/articles";
import { changes } from "@/lib/changes";
import { metrics, metricsReviewed } from "@/lib/metrics";
import { absolute } from "@/lib/site";
import { tools } from "@/lib/tools";
import { specPages, specPath, specsChecked } from "@/lib/specPages";

export const dynamic = "force-static";
export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  // Hub and tool pages have no editorial date of their own, so they omit lastModified.
  const fixed = ["", ...Object.values(sections).map((section) => section.path.slice(1, -1)), "app-store-optimization", "changes", "screenshot-sizes", "tools", "tools/app-store-growth-skill", "workbench", "learn/metrics", "learn/podcasts", "learn/resources", "about", "privacy", "field-notes/rebuilding-awesome-mobile-growth"];
  return [
    ...fixed.map((path) => ({ url: absolute(`/${path}${path ? "/" : ""}`) })),
    ...articles.map((article) => ({ url: absolute(article.path), lastModified: new Date(article.reviewed) })),
    ...metrics.map((metric) => ({ url: absolute(`/learn/metrics/${metric.slug}/`), lastModified: new Date(metricsReviewed) })),
    ...changes.map((change) => ({ url: absolute(`/changes/${change.slug}/`), lastModified: new Date(change.reviewed) })),
    ...tools.map((tool) => ({ url: absolute(`/tools/${tool.slug}/`) })),
    ...specPages.map((page) => ({ url: absolute(specPath(page.slug)), lastModified: new Date(specsChecked) })),
  ];
}
