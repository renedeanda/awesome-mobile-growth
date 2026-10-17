import { ShareButton } from "@/components/ShareButton";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleMeta } from "@/components/ArticleMeta";
import { DirectAnswer, SourceList } from "@/components/ContentBlocks";
import { TocBar } from "@/components/TocBar";
import { articlesIn, getArticle, sections, type Article, type SectionId } from "@/lib/articles";
import { resolveRelated } from "@/lib/related";
import { articleLoaders } from "@/lib/articles/loaders";
import { absolute, pageMetadata, site } from "@/lib/site";

const platformLabel = { apple: "App Store", "google-play": "Google Play" } as const;

export const articleParams = (section: SectionId) => articlesIn(section).map(({ slug }) => ({ slug }));

export function articleMetadata(section: SectionId, slug: string): Metadata {
  const article = getArticle(section, slug);
  if (!article) return {};
  return pageMetadata({ title: article.seoTitle, description: article.description, path: article.path, type: "article", imagePath: `${sections[section].path}opengraph-image`, imageAlt: article.title });
}

function jsonLd(article: Article) {
  const section = sections[article.section];
  return [
    { "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.description, datePublished: article.published, dateModified: article.reviewed, author: { "@type": "Person", name: site.author, url: absolute("/about/") }, publisher: { "@id": `${site.origin}/#publisher` }, mainEntityOfPage: absolute(article.path), image: absolute(`${section.path}opengraph-image`), citation: article.sources.map((source) => source.href) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absolute("/") },
      { "@type": "ListItem", position: 2, name: section.name, item: absolute(section.path) },
      { "@type": "ListItem", position: 3, name: article.title, item: absolute(article.path) },
    ] },
  ];
}

export async function ArticlePage({ section, slug }: { section: SectionId; slug: string }) {
  const article = getArticle(section, slug);
  const load = articleLoaders[`${section}/${slug}`];
  if (!article || !load) notFound();
  const { default: Body } = await load();
  const info = sections[section];
  const siblings = articlesIn(section);
  const index = siblings.findIndex((item) => item.slug === slug);
  const next = siblings[index + 1];
  const related = article.related.map((path) => {
    const match = resolveRelated(path);
    if (!match) throw new Error(`${article.path} lists an unknown related page: ${path}`);
    return match;
  });

  return <div className="article-shell">
    <article className="article">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(article)).replace(/</g, "\\u003c") }}/>
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href={info.path}>{info.name}</Link></nav>
      <header className="article-head">
        <p className="eyebrow">{info.name} · {article.platforms.map((platform) => platformLabel[platform]).join(" + ")}</p>
        <h1>{article.title}</h1>
        <p className="lede">{article.description}</p>
        <ArticleMeta evidence={article.evidence} reading={article.reading} checked={article.reviewed}/>
        <ShareButton title={article.title} path={article.path}/>
      </header>
      <DirectAnswer><p>{article.answer}</p></DirectAnswer>
      <TocBar items={article.toc}/>
      <div className="prose"><Body/></div>
      <section className="article-sources" aria-labelledby="sources">
        <h2 id="sources">Official sources</h2>
        <p>Checked {article.reviewed}. Store rules change; confirm anything submission-critical on these pages.</p>
        <SourceList items={article.sources}/>
      </section>
      {related.length > 0 && <section className="related" aria-labelledby="related">
        <h2 id="related">Read next</h2>
        <div className="related__grid">{related.map((item) => <Link key={item.path} href={item.path}><span>{item.label}</span><strong>{item.title}</strong></Link>)}</div>
      </section>}
      <nav className="article-next" aria-label={`More in ${info.name}`}>
        <Link href={info.path}><span>{info.name}</span><strong>All {info.name.toLowerCase()} guides</strong></Link>
        {next && <Link href={next.path}><span>Next</span><strong>{next.title}</strong></Link>}
      </nav>
    </article>
    <aside className="toc" aria-label="On this page"><p className="micro-label">On this page</p><ol>{article.toc.map((item) => <li key={item.id}><a href={`#${item.id}`}>{item.label}</a></li>)}</ol></aside>
  </div>;
}
