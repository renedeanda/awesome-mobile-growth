import { utf8Bytes } from "./workbench.ts";

export type Skipped = { word: string; reason: "in-name" | "repeat" | "no-room" };
export type Packed = { field: string; bytes: number; used: string[]; skipped: Skipped[] };

// Apple combines words across the name, subtitle and keyword field, so single words separated by
// commas reach the most searches. Words keep the priority order the person gave them.
export const words = (text: string) => text.toLocaleLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}'’.&+-]*/gu) ?? [];

export function packKeywords(candidates: string, nameAndSubtitle: string, limit = 100): Packed {
  const taken = new Set(words(nameAndSubtitle));
  const used: string[] = [];
  const skipped: Skipped[] = [];
  let bytes = 0;
  for (const word of words(candidates)) {
    if (taken.has(word)) { skipped.push({ word, reason: used.includes(word) ? "repeat" : "in-name" }); continue; }
    const cost = utf8Bytes(word) + (used.length ? 1 : 0);
    if (bytes + cost > limit) { skipped.push({ word, reason: "no-room" }); continue; }
    used.push(word); taken.add(word); bytes += cost;
  }
  return { field: used.join(","), bytes, used, skipped };
}
