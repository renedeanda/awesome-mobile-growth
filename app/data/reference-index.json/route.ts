import { articles, sections } from "@/lib/articles";
import { changes } from "@/lib/changes";
import { metrics, metricsReviewed } from "@/lib/metrics";

export const dynamic = "force-static";

export function GET() {
  return Response.json({
    schemaVersion: 2,
    entries: [
      ...articles.map((article) => ({ collection: sections[article.section].name, title: article.title, description: article.description, answer: article.answer, url: article.path, reviewed: article.reviewed, sources: article.sources })),
      ...metrics.map((metric) => ({ collection: "Metrics", title: metric.title, description: metric.description, answer: metric.definition, url: `/learn/metrics/${metric.slug}/`, reviewed: metricsReviewed, sources: metric.sources })),
      ...changes.map((change) => ({ collection: "Changes", title: change.title, description: change.summary, url: `/changes/${change.slug}/`, reviewed: change.reviewed, effective: change.date, status: change.status, sources: change.sources })),
    ],
  });
}
