// Search over the static index; safe to import in client components (no Node APIs).
export type SearchEntry = { path: string; title: string; kind: string; summary: string; text: string };

const fold = (text: string) => text.toLocaleLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
export const terms = (query: string) => fold(query).split(/[^\p{L}\p{N}]+/u).filter(Boolean);

/** Every term must match; title matches and word starts rank higher. */
export function search(index: SearchEntry[], query: string, limit = 8) {
  const wanted = terms(query);
  if (!wanted.length) return [];
  return index.map((entry) => {
    const title = fold(entry.title), body = fold(`${entry.summary} ${entry.text} ${entry.kind}`);
    let score = 0;
    for (const term of wanted) {
      const inTitle = title.indexOf(term), inBody = body.indexOf(term);
      if (inTitle < 0 && inBody < 0) return { entry, score: 0 };
      if (inTitle >= 0) score += new RegExp(`(^|[^\\p{L}\\p{N}])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "u").test(title) ? 10 : 6;
      if (inBody >= 0) score += 2;
    }
    return { entry, score };
  }).filter((hit) => hit.score > 0).sort((a, b) => b.score - a.score || a.entry.title.length - b.entry.title.length).slice(0, limit).map((hit) => hit.entry);
}
