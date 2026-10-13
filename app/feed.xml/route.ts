import { guides } from "@/lib/content";
import { site, absolute } from "@/lib/site";

export const dynamic = "force-static";
const xml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");

export function GET() {
  const entries = guides.map((guide) => {
    const url = absolute(`/guides/${guide.slug}/`);
    return `<entry><title>${xml(guide.title)}</title><id>${xml(url)}</id><link href="${xml(url)}"/><updated>${guide.modified}T12:00:00Z</updated><summary>${xml(guide.description)}</summary></entry>`;
  }).join("");
  const updated = [...guides].sort((a, b) => b.modified.localeCompare(a.modified))[0]?.modified ?? "2026-10-12";
  const body = `<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>${xml(site.name)}</title><id>${xml(site.origin)}</id><link href="${xml(absolute("/feed.xml"))}" rel="self"/><updated>${updated}T12:00:00Z</updated><author><name>${xml(site.author)}</name></author>${entries}</feed>`;
  return new Response(body, { headers: { "Content-Type": "application/atom+xml; charset=utf-8" } });
}
