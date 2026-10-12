import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { podcasts } from "@/lib/podcasts";
import { site } from "@/lib/site";

export function generateStaticParams() { return podcasts.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const podcast = podcasts.find((item) => item.slug === slug); return podcast ? { title: `${podcast.name} podcast guide`, description: podcast.description, alternates: { canonical: `/podcasts/${slug}/` } } : {}; }

export default async function PodcastPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const podcast = podcasts.find((item) => item.slug === slug); if (!podcast) notFound();
  const jsonLd = { "@context": "https://schema.org", "@type": "PodcastSeries", name: podcast.name, description: podcast.description, url: podcast.href, publisher: { "@type": "Organization", name: podcast.publisher }, subjectOf: `${site.origin}/podcasts/${podcast.slug}/` };
  return <article className="article-shell"><div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><header className="article-head"><p className="eyebrow">{podcast.publisher} · {podcast.cadenceNote}</p><h1>{podcast.name}</h1><p className="lede">{podcast.description}</p><div className="tag-row">{podcast.topics.map((item) => <span key={item}>{item}</span>)}</div></header><div className="prose"><h2>Why it earns a place</h2><p>{podcast.bestFor} This page is an editorial listening guide, not a ranking or paid placement.</p><h2>How to start</h2><ol>{podcast.startWith.map((item) => <li key={item}>{item}</li>)}</ol><h2>Listen critically</h2><p>Podcast stories are useful context, not controlled evidence. Note the date, product stage, market, incentives, and whether a guest is describing a result or promoting a service. Verify platform rules with current first-party documentation before changing a live listing.</p><div className="actions"><a className="button" href={podcast.href}>Visit the official show ↗</a><Link className="button-secondary" href="/podcasts/">Browse all podcasts</Link></div></div></div><aside className="toc"><p className="eyebrow">Curation check</p><p>Activity reviewed {podcast.latestChecked}. Feeds can change; the publisher is the source of truth.</p></aside></article>;
}
