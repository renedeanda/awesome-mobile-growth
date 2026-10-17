import { articleByPath, sections } from "./articles/index.ts";
import { changes } from "./changes.ts";
import { metrics } from "./metrics.ts";
import { getSpecPage } from "./specPages.ts";
import { tools } from "./tools.ts";

export type RelatedLink = { path: string; title: string; label: string };

const hubs: RelatedLink[] = [
  { path: "/learn/metrics/", title: "App Store metrics glossary", label: "Learn" },
  { path: "/learn/resources/", title: "Growth tools and resources", label: "Learn" },
  { path: "/learn/podcasts/", title: "Mobile growth podcasts", label: "Learn" },
  { path: "/changes/", title: "Platform changes", label: "Changes" },
  { path: "/screenshot-sizes/", title: "Every screenshot size, by device", label: "Reference" },
];

/** Resolves a site path used in "Read next" lists. Returns undefined for unknown paths so tests can fail on them. */
export function resolveRelated(path: string): RelatedLink | undefined {
  const article = articleByPath(path);
  if (article) return { path, title: article.title, label: `${sections[article.section].name} · ${article.reading}` };
  const metric = metrics.find((item) => `/learn/metrics/${item.slug}/` === path);
  if (metric) return { path, title: metric.title, label: "Metric" };
  const change = changes.find((item) => `/changes/${item.slug}/` === path);
  if (change) return { path, title: change.title, label: `Change · ${change.store}` };
  const spec = path.startsWith("/screenshot-sizes/") ? getSpecPage(path.split("/")[2] ?? "") : undefined;
  if (spec) return { path, title: spec.title, label: "Screenshot size" };
  const tool = tools.find((item) => `/tools/${item.slug}/` === path);
  if (tool) return { path, title: tool.title, label: "Tool" };
  return hubs.find((hub) => hub.path === path);
}
