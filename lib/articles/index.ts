import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import { readingTime } from "../readingTime.ts";
import { launchArticles } from "./launch.ts";
import { storePageArticles } from "./storePage.ts";
import { growArticles } from "./grow.ts";
import { learnArticles } from "./learn.ts";
import { sections } from "./sections.ts";
import type { ArticleSource, SectionId } from "./types.ts";

export type { ArticleSource, SectionId, Platform, Source } from "./types.ts";
export { sections } from "./sections.ts";

export type TocItem = { id: string; label: string };
/** `steps` are the numbered "Do this today" items as plain text, for the social card and HowTo data. */
export type Article = ArticleSource & { path: string; file: string; reading: string; toc: TocItem[]; steps: string[] };

const mdxSource = (file: string) => fs.readFileSync(path.join(process.cwd(), "content", file), "utf8");

// The table of contents and read time come from the MDX source, so they cannot drift from the page.
function toc(source: string): TocItem[] {
  const slugger = new GithubSlugger();
  return source.split("\n").filter((line) => line.startsWith("## ")).map((line) => {
    const label = line.slice(3).trim();
    return { id: slugger.slug(label), label };
  });
}

const plainText = (source: string) => source
  .replace(/^import .*$/gm, " ")
  .replace(/<[A-Z][\s\S]*?\/>/g, (block) => block.replace(/[{}[\]<>=/]/g, " "))
  .replace(/<[^>]+>/g, " ")
  .replace(/[#>*_`|[\]()]/g, " ");

/** The numbered items in a guide's <DoToday> block, with Markdown links, emphasis and code reduced to text. */
export function doTodaySteps(source: string): string[] {
  const block = source.match(/<DoToday>([\s\S]*?)<\/DoToday>/)?.[1] ?? "";
  return block.split("\n").map((line) => line.match(/^\d+\.\s+(.+)$/)?.[1]).filter((step): step is string => Boolean(step))
    .map((step) => step.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*|__|`/g, "").trim());
}

function build(source: ArticleSource): Article {
  const file = `${source.section}/${source.slug}.mdx`;
  const text = mdxSource(file);
  return { ...source, file, path: `${sections[source.section].path}${source.slug}/`, reading: readingTime(plainText(text)), toc: toc(text), steps: doTodaySteps(text) };
}

/** Read time for any MDX file under content/, plus text rendered around it (such as the answer box). */
export const readingFor = (file: string, extra = "") => readingTime(`${extra} ${plainText(mdxSource(file))}`);

export const articles: Article[] = [...launchArticles, ...storePageArticles, ...growArticles, ...learnArticles].map(build);

export const articlesIn = (section: SectionId) => articles.filter((article) => article.section === section);
export const getArticle = (section: SectionId, slug: string) => articles.find((article) => article.section === section && article.slug === slug);
export const articleByPath = (pathname: string) => articles.find((article) => article.path === pathname);
