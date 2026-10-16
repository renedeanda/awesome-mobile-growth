import { articles, sections } from "@/lib/articles";
import { changes } from "@/lib/changes";
import { metrics } from "@/lib/metrics";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const guides = articles.map((article) => `## ${article.title}\nSection: ${sections[article.section].name}\nURL: ${site.origin}${article.path}\nChecked: ${article.reviewed}\n\n${article.answer}\n\nSources:\n${article.sources.map((source) => `- ${source.label}: ${source.href}`).join("\n")}`);
  const metricText = metrics.map((metric) => `## ${metric.title}\nURL: ${site.origin}/learn/metrics/${metric.slug}/\n\n${metric.definition}${metric.formula ? `\nFormula: ${metric.formula}` : ""}`);
  const changeText = changes.map((change) => `## ${change.title} (${change.store}, ${change.status}, ${change.dateLabel ?? change.date})\nURL: ${site.origin}/changes/${change.slug}/\n\n${change.summary}`);
  const text = `# ${site.name}: answers index\n\nShort answers from every guide, metric and platform change on the site, with official sources. Follow the links for full context and check store rules before you submit.\n\n${[...guides, ...metricText, ...changeText].join("\n\n")}\n`;
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
