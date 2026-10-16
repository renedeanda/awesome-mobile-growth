// Site search: a small index built at export time and searched in the browser.
import { articles, sections } from "./articles/index.ts";
import { changes } from "./changes.ts";
import { metrics } from "./metrics.ts";
import { specPages, specPath } from "./specPages.ts";
import { tools } from "./tools.ts";
import type { SearchEntry } from "./search.ts";


const pages: SearchEntry[] = [
  { path: "/workbench/", title: "Workbench", kind: "Tool", summary: "Preview your store page, draft Apple and Google Play metadata with live limits, and plan screenshots and tests.", text: "store preview search result product page brief metadata export" },
  { path: "/screenshot-sizes/", title: "Every screenshot size, by device", kind: "Reference", summary: "App Store screenshot sizes for every display class plus Google Play's limits.", text: "pixels dimensions resolution" },
  { path: "/learn/metrics/", title: "App Store metrics glossary", kind: "Learn", summary: "What each App Store Connect and Play Console metric counts and how it is misread.", text: "analytics" },
  { path: "/learn/podcasts/", title: "Mobile growth podcasts", kind: "Learn", summary: "Podcasts worth your time on app growth, ASO and subscriptions.", text: "listen audio" },
  { path: "/learn/resources/", title: "Growth tools and resources", kind: "Learn", summary: "Tools, newsletters and references for app growth.", text: "newsletters" },
  { path: "/app-store-optimization/", title: "What is App Store Optimization (ASO)?", kind: "Learn", summary: "ASO is the work of helping the right people find your app and decide to install it.", text: "aso definition primer" },
  { path: "/changes/", title: "Platform changes", kind: "Changes", summary: "Dated App Store and Google Play changes with what to do.", text: "news updates policy" },
];

export function buildSearchIndex(): SearchEntry[] {
  return [
    ...articles.map((article) => ({ path: article.path, title: article.title, kind: sections[article.section].name, summary: article.description, text: [article.label, article.seoTitle, article.answer, ...article.toc.map((item) => item.label)].join(" ") })),
    ...metrics.map((metric) => ({ path: `/learn/metrics/${metric.slug}/`, title: metric.title, kind: "Metric", summary: metric.description, text: [metric.term, metric.definition, metric.formula ?? "", metric.where].join(" ") })),
    ...changes.map((change) => ({ path: `/changes/${change.slug}/`, title: change.title, kind: `Change · ${change.store}`, summary: change.summary, text: change.details.join(" ") })),
    ...tools.map((tool) => ({ path: `/tools/${tool.slug}/`, title: tool.title, kind: "Tool", summary: tool.description, text: tool.action })),
    ...specPages.map((page) => ({ path: specPath(page.slug), title: page.title, kind: "Screenshot size", summary: page.description, text: `${page.short} ${page.device}` })),
    ...pages,
  ];
}
