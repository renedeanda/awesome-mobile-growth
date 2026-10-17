// Builds /llms.txt (the index) and /llms-full.txt (answers with sources) for AI assistants, from the
// same registries the pages render, so neither file can drift from the site.
import { articles, sections } from "./articles/index.ts";
import { changes } from "./changes.ts";
import { metrics } from "./metrics.ts";
import { site } from "./site.ts";
import { specPages, specPath, specsChecked } from "./specPages.ts";
import { appleScreenshotSource, googleGraphicsSource } from "./storeSpecs.ts";
import { tools } from "./tools.ts";

const url = (path: string) => `${site.origin}${path}`;

const toolLinks = [
  ...tools.map((tool) => `- [${tool.title}](${url(`/tools/${tool.slug}/`)}): ${tool.description}`),
  `- [Workbench](${url("/workbench/")}): draft a full Apple and Google Play listing with live limits and a store preview, privately in the browser.`,
  `- [App Store Growth skill](${url("/tools/app-store-growth-skill/")}): an open agent skill with the store limits, a review checklist and a validator.`,
];
const sizeLinks = specPages.map((page) => `- [${page.title}](${url(specPath(page.slug))}): ${page.description}`);

export function buildLlmsIndex() {
  const bySection = Object.values(sections).map((section) => `## ${section.name}\n- [${section.title}](${url(section.path)})\n${articles.filter((article) => article.section === section.id).map((article) => `- [${article.title}](${url(article.path)}): ${article.description}`).join("\n")}`).join("\n\n");
  return `# ${site.name}

> Practical, sourced guides for launching and growing apps on the App Store and Google Play, free browser tools, and an open AI agent skill.

## Start here
- [What is App Store Optimization (ASO)?](${url("/app-store-optimization/")}): what ASO includes, how App Store and Google Play search differ, and the order to work in.

${bySection}

## Tools
Every tool runs in the browser; drafts and screenshots are never uploaded.

${toolLinks.join("\n")}

## Screenshot sizes
Accepted pixel sizes per device class, checked against Apple and Google on ${specsChecked}.

${sizeLinks.join("\n")}

## Metrics glossary
- [App Store and Google Play metrics glossary](${url("/learn/metrics/")})
${metrics.map((metric) => `- [${metric.title}](${url(`/learn/metrics/${metric.slug}/`)}): ${metric.description}`).join("\n")}

## Platform changes
- [All dated platform changes](${url("/changes/")})
${changes.map((change) => `- [${change.title}](${url(`/changes/${change.slug}/`)}): ${change.summary}`).join("\n")}

## More
- [Mobile growth podcasts](${url("/learn/podcasts/")})
- [ASO and mobile growth tools: an independent list](${url("/learn/resources/")})
- [Answers index](${url("/llms-full.txt")})

## Data
- ${url("/data/reference-index.json")}
- ${url("/data/store-specs.json")}
- ${url("/data/source-manifest.json")}

## Editorial rules
Platform rules link to Apple and Google's own pages. Search volume, rankings, conversion and revenue are never invented. Opinions are labeled.
`;
}

export function buildLlmsFull() {
  const guides = articles.map((article) => `## ${article.title}\nSection: ${sections[article.section].name}\nURL: ${url(article.path)}\nChecked: ${article.reviewed}\n\n${article.answer}\n\nSources:\n${article.sources.map((source) => `- ${source.label}: ${source.href}`).join("\n")}`);
  const sizes = specPages.map((page) => `## ${page.title}\nURL: ${url(specPath(page.slug))}\nChecked: ${specsChecked}\n\n${page.answer}\n\nSource: ${page.store === "apple" ? appleScreenshotSource : googleGraphicsSource}`);
  const toolText = tools.map((tool) => `## ${tool.title} (tool)\nURL: ${url(`/tools/${tool.slug}/`)}\nGuide: ${url(tool.guide)}\n\n${tool.description}`);
  const metricText = metrics.map((metric) => `## ${metric.title}\nURL: ${url(`/learn/metrics/${metric.slug}/`)}\n\n${metric.definition}${metric.formula ? `\nFormula: ${metric.formula}` : ""}`);
  const changeText = changes.map((change) => `## ${change.title} (${change.store}, ${change.status}, ${change.dateLabel ?? change.date})\nURL: ${url(`/changes/${change.slug}/`)}\n\n${change.summary}`);
  return `# ${site.name}: answers index\n\nShort answers from every guide, screenshot size, tool, metric and platform change on the site, with official sources. Follow the links for full context and check store rules before you submit.\n\n${[...guides, ...sizes, ...toolText, ...metricText, ...changeText].join("\n\n")}\n`;
}
