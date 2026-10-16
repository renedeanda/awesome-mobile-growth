import { articles, sections } from "@/lib/articles";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const bySection = Object.values(sections).map((section) => `## ${section.name}\n- [${section.title}](${site.origin}${section.path})\n${articles.filter((article) => article.section === section.id).map((article) => `- [${article.title}](${site.origin}${article.path}): ${article.description}`).join("\n")}`).join("\n\n");
  const text = `# ${site.name}\n\n> Practical, sourced guides for launching and growing apps on the App Store and Google Play, free browser tools, and an open AI agent skill.\n\n${bySection}\n\n## More\n- [Platform changes](${site.origin}/changes/)\n- [App Store metrics glossary](${site.origin}/learn/metrics/)\n- [Screenshot sizes by device](${site.origin}/screenshot-sizes/)\n- [Free tools](${site.origin}/tools/)\n- [Answers index](${site.origin}/llms-full.txt)\n\n## Data\n- ${site.origin}/data/reference-index.json\n- ${site.origin}/data/store-specs.json\n- ${site.origin}/data/source-manifest.json\n\n## Editorial rules\nPlatform rules link to Apple and Google's own pages. Search volume, rankings, conversion and revenue are never invented. Opinions are labeled.\n`;
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
