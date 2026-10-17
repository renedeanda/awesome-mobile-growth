import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SourceList } from "@/components/ContentBlocks";
import { getMetric, metrics, metricsReviewed } from "@/lib/metrics";
import { absolute, formatDate, pageMetadata, site } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return metrics.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const metric = getMetric((await params).slug);
  return metric ? pageMetadata({ title: metric.seoTitle, description: metric.description, path: `/learn/metrics/${metric.slug}/`, type: "article", imagePath: `/learn/metrics/${metric.slug}/opengraph-image`, imageAlt: metric.title }) : {};
}

export default async function MetricPage({ params }: { params: Promise<{ slug: string }> }) {
  const metric = getMetric((await params).slug);
  if (!metric) notFound();
  const path = `/learn/metrics/${metric.slug}/`;
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "DefinedTerm", name: metric.term, description: metric.definition, inDefinedTermSet: absolute("/learn/metrics/"), url: absolute(path) },
    { "@context": "https://schema.org", "@type": "Article", headline: metric.title, description: metric.description, datePublished: "2026-10-12", dateModified: metric.reviewed ?? metricsReviewed, author: { "@type": "Person", name: site.author, url: absolute("/about/") }, publisher: { "@id": `${site.origin}/#publisher` }, mainEntityOfPage: absolute(path), image: absolute(`${path}opengraph-image`) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: absolute("/") }, { "@type": "ListItem", position: 2, name: "Metrics", item: absolute("/learn/metrics/") }, { "@type": "ListItem", position: 3, name: metric.title, item: absolute(path) }] },
  ];
  const related = metric.related.map((slug) => getMetric(slug)).filter((item) => item !== undefined);
  return <article className="single-article">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}/>
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/learn/">Learn</Link><span aria-hidden="true">/</span><Link href="/learn/metrics/">Metrics</Link></nav>
    <header className="article-head"><p className="eyebrow">{metric.store === "Google Play" ? "Google Play Console metric" : "App Store Connect metric"}</p><h1>{metric.title}</h1><p className="lede">{metric.description}</p><div className="article-meta"><p className="article-meta__facts"><span>{metric.store === "Google Play" ? "Google definition" : "Apple definition"}</span><span>Checked <time dateTime={metric.reviewed ?? metricsReviewed}>{formatDate(metric.reviewed ?? metricsReviewed)}</time></span></p></div></header>
    <section className="direct-answer"><p className="micro-label">Definition</p><div><p>{metric.definition}</p>{metric.formula && <p className="formula"><code>{metric.formula}</code></p>}</div></section>
    <div className="prose">
      <h2 id="where">Where to find it</h2><p>{metric.where}</p>
      {metric.example && <aside className="example-block"><p className="micro-label">Example</p><p>{metric.example}</p></aside>}
      <h2 id="misread">The common mistake</h2><p>{metric.misread}</p>
      <h2 id="use">What to use it for</h2><p>{metric.useFor}</p>
      <h2 id="sources">Official sources</h2><SourceList items={metric.sources}/>
      {related.length > 0 && <><h2 id="related">Related metrics</h2><ul>{related.map((item) => <li key={item.slug}><Link href={`/learn/metrics/${item.slug}/`}>{item.title}</Link></li>)}</ul></>}
    </div>
  </article>;
}
