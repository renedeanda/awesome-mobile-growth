import { articles } from "@/lib/articles";
import { changes } from "@/lib/changes";
import { specPages, specPath, specsChecked } from "@/lib/specPages";
import { absolute, site } from "@/lib/site";

export const dynamic = "force-static";
const xml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
const entry = (title: string, path: string, updated: string, summary: string) => {
  const url = absolute(path);
  return `<entry><title>${xml(title)}</title><id>${xml(url)}</id><link href="${xml(url)}"/><updated>${updated}T12:00:00Z</updated><summary>${xml(summary)}</summary></entry>`;
};

export function GET() {
  const items: Array<{ title: string; path: string; updated: string; published?: string; summary: string }> = [
    ...changes.map((change) => ({ title: change.title.startsWith(change.store) ? change.title : `${change.store}: ${change.title}`, path: `/changes/${change.slug}/`, updated: change.reviewed, published: change.date, summary: change.summary })),
    ...articles.map((article) => ({ title: article.title, path: article.path, updated: article.reviewed, published: article.published, summary: article.description })),
    ...specPages.map((page) => ({ title: page.title, path: specPath(page.slug), updated: specsChecked, summary: page.description })),
    { title: "Rebuilding Awesome Mobile Growth: a field note", path: "/field-notes/rebuilding-awesome-mobile-growth/", updated: "2026-10-12", summary: "A transparent account of turning an old link collection into a sourced ASO field guide and private workbench." },
  ];
  // Newest check first; entries checked the same day fall back to their own publish or effective date.
  items.sort((a, b) => b.updated.localeCompare(a.updated) || (b.published ?? b.updated).localeCompare(a.published ?? a.updated));
  const updated = items[0]?.updated ?? "2026-10-16";
  const body = `<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>${xml(site.name)}</title><id>${xml(site.origin)}/</id><link href="${xml(absolute("/feed.xml"))}" rel="self"/><updated>${updated}T12:00:00Z</updated><author><name>${xml(site.author)}</name></author>${items.map((item) => entry(item.title, item.path, item.updated, item.summary)).join("")}</feed>`;
  return new Response(body, { headers: { "Content-Type": "application/atom+xml; charset=utf-8" } });
}
