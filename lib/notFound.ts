// Turns a broken URL into the pages it most likely meant, using the same search the site's search box uses.
import { search, terms, type SearchEntry } from "./search.ts";

const noise = new Set(["www", "html", "index", "page", "the", "and", "for"]);

export function wordsFromPath(pathname: string) {
  let decoded = pathname;
  try { decoded = decodeURIComponent(pathname); } catch { /* keep the raw path */ }
  return terms(decoded).filter((word) => word.length > 1 && !noise.has(word));
}

/** Pages matching every word first, then pages matching the most individual words. */
export function suggestPages(index: SearchEntry[], pathname: string, limit = 3) {
  const words = wordsFromPath(pathname);
  if (!words.length) return [];
  const picks = new Map(search(index, words.join(" "), limit).map((entry) => [entry.path, entry]));
  if (picks.size < limit) {
    const tally = new Map<string, { entry: SearchEntry; score: number }>();
    for (const word of words) {
      const hits = search(index, word, index.length);
      // A word on most pages ("guide", "app") says nothing about which one was meant.
      if (hits.length > index.length / 2) continue;
      hits.slice(0, 12).forEach((entry, rank) => {
        const hit = tally.get(entry.path) ?? { entry, score: 0 };
        hit.score += 12 - rank;
        tally.set(entry.path, hit);
      });
    }
    for (const { entry } of [...tally.values()].sort((a, b) => b.score - a.score)) {
      if (picks.size >= limit) break;
      if (!picks.has(entry.path)) picks.set(entry.path, entry);
    }
  }
  return [...picks.values()];
}

/** The broken URL's words that still find something together, so "Search for …" never opens on an empty result.
 * Search needs every word to match, so a word with no match anywhere ("tools" in "/tools/frame-studio") is dropped. */
export function searchableQuery(index: SearchEntry[], pathname: string) {
  const kept: string[] = [];
  for (const word of wordsFromPath(pathname)) if (search(index, [...kept, word].join(" "), 1).length) kept.push(word);
  return kept.join(" ");
}
