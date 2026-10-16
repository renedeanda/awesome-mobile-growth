import { articles } from "@/lib/articles";
import { changes } from "@/lib/changes";
import { metrics } from "@/lib/metrics";

export const dynamic = "force-static";

export function GET() {
  const all = [...articles.flatMap((article) => article.sources), ...metrics.flatMap((metric) => metric.sources), ...changes.flatMap((change) => change.sources)];
  const sources = [...new Map(all.map((source) => [source.href, source])).values()].sort((a, b) => a.label.localeCompare(b.label));
  return Response.json({ schemaVersion: 2, policy: "Platform claims link to Apple or Google's own pages. Opinions are labeled.", sources });
}
