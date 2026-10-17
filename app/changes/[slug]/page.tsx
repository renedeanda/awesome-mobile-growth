import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SourceList } from "@/components/ContentBlocks";
import { resolveRelated } from "@/lib/related";
import { changes, getChange } from "@/lib/changes";
import { absolute, formatDate, pageMetadata, site } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return changes.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const change = getChange((await params).slug);
  return change ? pageMetadata({ title: change.title, description: change.summary, path: `/changes/${change.slug}/`, type: "article", imagePath: `/changes/${change.slug}/opengraph-image`, imageAlt: change.title }) : {};
}

export default async function ChangePage({ params }: { params: Promise<{ slug: string }> }) {
  const change = getChange((await params).slug);
  if (!change) notFound();
  const path = `/changes/${change.slug}/`;
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "NewsArticle", headline: change.title, description: change.summary, // Published when it took effect, or when first reported if it is still upcoming.
    datePublished: change.date <= change.reviewed ? change.date : change.reviewed, dateModified: change.reviewed, author: { "@type": "Person", name: site.author, url: absolute("/about/") }, publisher: { "@id": `${site.origin}/#publisher` }, mainEntityOfPage: absolute(path), image: absolute(`${path}opengraph-image`) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: absolute("/") }, { "@type": "ListItem", position: 2, name: "Changes", item: absolute("/changes/") }, { "@type": "ListItem", position: 3, name: change.title, item: absolute(path) }] },
  ];
  const related = change.related.map((item) => resolveRelated(item)).filter((item) => item !== undefined);
  return <article className="single-article change-article">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}/>
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/changes/">Changes</Link></nav>
    <header className="article-head">
      <p className="eyebrow">{change.store} · {change.status}</p>
      <h1>{change.title}</h1>
      <p className="lede">{change.summary}</p>
      <div className="article-meta"><p className="article-meta__facts"><span>Effective <time dateTime={change.date}>{change.dateLabel ?? formatDate(change.date)}</time></span><span>Checked <time dateTime={change.reviewed}>{formatDate(change.reviewed)}</time></span></p></div>
    </header>
    <div className="prose">
      <h2 id="details">The details</h2>
      <ul>{change.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
      <section className="do-today" aria-label="What to do"><p className="micro-label">What to do</p><ol>{change.actions.map((action) => <li key={action}>{action}</li>)}</ol></section>
      <h2 id="sources">Official sources</h2>
      <SourceList items={change.sources}/>
      {related.length > 0 && <><h2 id="related">Related guides</h2><ul>{related.map((item) => <li key={item.path}><Link href={item.path}>{item.title}</Link></li>)}</ul></>}
    </div>
  </article>;
}
