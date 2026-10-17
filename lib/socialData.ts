// Real data for the social card illustrations. Build-time only: it reads MDX source from disk.
import fs from "node:fs";
import path from "node:path";
import { changes } from "./changes.ts";
import { formatDate } from "./site.ts";
import { keywordTokens, utf8Bytes } from "./workbench.ts";

const content = (file: string) => fs.readFileSync(path.join(process.cwd(), "content", file), "utf8");

/** The launch checklist's phases, with how many items each holds. */
export function checklistPhases() {
  const source = content("launch/checklist.mdx");
  const starts = [...source.matchAll(/\{ title: "([^"]+)", when: "([^"]+)"/g)];
  return starts.map((match, index) => {
    const block = source.slice(match.index, starts[index + 1]?.index ?? source.length);
    return { title: match[1], when: match[2], count: (block.match(/\bid: "/g) ?? []).length };
  });
}

/** The keywords guide's "after" example, measured the way the Workbench measures it. */
export function keywordExample() {
  const values = [...content("store-page/keywords.mdx").matchAll(/<KeywordField value="([^"]+)"/g)].map((match) => match[1]);
  const value = values.at(-1) ?? "";
  return { value, bytes: utf8Bytes(value), terms: keywordTokens(value).length };
}

/** The most recent and upcoming platform changes, newest first. */
export function latestChanges(count = 3) {
  return [...changes].sort((a, b) => b.date.localeCompare(a.date)).slice(0, count).map((change) => ({
    when: change.dateLabel ?? formatDate(change.date), store: change.store, title: change.title, upcoming: change.status === "Upcoming",
  }));
}
