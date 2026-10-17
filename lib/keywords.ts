import { utf8Bytes } from "./workbench.ts";

export type Skipped = { word: string; reason: "in-name" | "repeat" | "no-room" | "plural" | "filler" };
export type Packed = { field: string; bytes: number; used: string[]; skipped: Skipped[] };

// Apple combines words across the name, subtitle and keyword field, so single words separated by
// commas reach the most searches. Words keep the priority order the person gave them.
export const words = (text: string) => text.toLocaleLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}'’.&+-]*/gu) ?? [];

// The keywords guide says to skip these: "app" adds nothing, and filler words aren't searched on their own.
const filler = new Set(["app", "apps", "the", "a", "an", "and", "for", "of", "with"]);
/** The singular forms an English plural could come from ("photos" → "photo", "boxes" → "box"). */
const singulars = (word: string) => word.endsWith("es") ? [word.slice(0, -1), word.slice(0, -2)] : word.endsWith("s") && !word.endsWith("ss") ? [word.slice(0, -1)] : [];

export function packKeywords(candidates: string, nameAndSubtitle: string, limit = 100): Packed {
  const taken = new Set(words(nameAndSubtitle));
  const used: string[] = [];
  const skipped: Skipped[] = [];
  let bytes = 0;
  for (const word of words(candidates)) {
    if (taken.has(word)) { skipped.push({ word, reason: used.includes(word) ? "repeat" : "in-name" }); continue; }
    if (filler.has(word)) { skipped.push({ word, reason: "filler" }); continue; }
    if (singulars(word).some((singular) => taken.has(singular))) { skipped.push({ word, reason: "plural" }); continue; }
    const cost = utf8Bytes(word) + (used.length ? 1 : 0);
    if (bytes + cost > limit) { skipped.push({ word, reason: "no-room" }); continue; }
    used.push(word); taken.add(word); bytes += cost;
  }
  return { field: used.join(","), bytes, used, skipped };
}
