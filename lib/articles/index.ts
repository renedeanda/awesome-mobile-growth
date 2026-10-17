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
export type Article = ArticleSource & { path: string; file: string; reading: string; toc: TocItem[] };

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

function build(source: ArticleSource): Article {
  const file = `${source.section}/${source.slug}.mdx`;
  const text = mdxSource(file);
  return { ...source, file, path: `${sections[source.section].path}${source.slug}/`, reading: readingTime(plainText(text)), toc: toc(text) };
}

/** Read time for any MDX file under content/, plus text rendered around it (such as the answer box). */
export const readingFor = (file: string, extra = "") => readingTime(`${extra} ${plainText(mdxSource(file))}`);

export const articles: Article[] = [...launchArticles, ...storePageArticles, ...growArticles, ...learnArticles].map(build);

export const articlesIn = (section: SectionId) => articles.filter((article) => article.section === section);
export const getArticle = (section: SectionId, slug: string) => articles.find((article) => article.section === section && article.slug === slug);
export const articleByPath = (pathname: string) => articles.find((article) => article.path === pathname);
