import { guides } from "@/lib/content";
import { site, absolute } from "@/lib/site";
import { fieldCollections } from "@/lib/fieldLab";

export const dynamic = "force-static";
const xml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");

export function GET() {
  const guideEntries = guides.map((guide) => {
    const url = absolute(`/guides/${guide.slug}/`);
    return `<entry><title>${xml(guide.title)}</title><id>${xml(url)}</id><link href="${xml(url)}"/><updated>${guide.modified}T12:00:00Z</updated><summary>${xml(guide.description)}</summary></entry>`;
  });
  const bases = { reference: "reference", google: "google-play", growth: "growth", ai: "ai/guides", updates: "updates" } as const;
  const fieldEntries = Object.entries(fieldCollections).flatMap(([collection, items]) => items.map((item) => { const url=absolute(`/${bases[collection as keyof typeof bases]}/${item.slug}/`); return `<entry><title>${xml(item.title)}</title><id>${xml(url)}</id><link href="${xml(url)}"/><updated>${item.reviewed}T12:00:00Z</updated><summary>${xml(item.description)}</summary></entry>`; }));
  const entries=[...guideEntries,...fieldEntries].join("");
  const updated = [...guides].sort((a, b) => b.modified.localeCompare(a.modified))[0]?.modified ?? "2026-10-12";
  const body = `<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>${xml(site.name)}</title><id>${xml(site.origin)}</id><link href="${xml(absolute("/feed.xml"))}" rel="self"/><updated>${updated}T12:00:00Z</updated><author><name>${xml(site.author)}</name></author>${entries}</feed>`;
  return new Response(body, { headers: { "Content-Type": "application/atom+xml; charset=utf-8" } });
}
