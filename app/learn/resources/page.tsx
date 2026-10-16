import type { Metadata } from "next";
import Link from "next/link";
import { SourceList } from "@/components/ContentBlocks";
import { apple, google } from "@/lib/articles/links";
import { resourceGroups, resourcesReviewed, transitions } from "@/lib/resources";
import { formatDate, pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "ASO and mobile growth tools: an independent list", description: "A maintained, unpaid list of ASO, analytics, attribution and subscription tools, with what each is for and which products were acquired or shut down.", path: "/learn/resources/", imagePath: "/learn/opengraph-image" });

const official = [apple.productPage, apple.search, apple.screenshots, apple.creativeAssets, apple.cpp, apple.ppo, apple.metrics, google.listing, google.metadataPolicy, google.customListings, google.experiments];

export default function Resources() {
  return <>
    <header className="index-head"><p className="eyebrow">Learn · Resources</p><h1>Tools for the job in front of you.</h1><p>Start with the question you need answered, then pick a tool. Nothing here is paid for or ranked. Last checked {formatDate(resourcesReviewed)}. For how to choose, read <Link href="/grow/tool-stack/">Choose a mobile growth tool stack</Link>.</p></header>
    <section className="section"><div className="section-heading"><div><p className="eyebrow">Start here</p><h2>Apple and Google's own pages</h2></div><p>Limits and rules change. Check these before anything submission-critical.</p></div><SourceList items={official}/></section>
    {resourceGroups.map((group) => <section className="section" key={group.title}>
      <div className="section-heading"><h2>{group.title}</h2><p>{group.description}</p></div>
      <div className="editorial-note"><p><strong>Use when:</strong> {group.useWhen}</p><p><strong>Watch for:</strong> {group.watchFor}</p></div>
      <div className="resource-grid">{group.items.map((item) => <article className="resource-card" key={item.href}><h3><a href={item.href}>{item.name} ↗</a></h3><p>{item.note}</p></article>)}</div>
    </section>)}
    <section className="section"><div className="section-heading"><div><p className="eyebrow">Old links</p><h2>Acquired and retired products</h2></div><p>Old tutorials keep ranking after the tools change. Check here before you follow one.</p></div>
      <div className="source-list">{transitions.map((item) => <a className="source-item" key={item.href} href={item.href}><span><strong>{item.name}</strong><br/><small>{item.note}</small></span><small>Details ↗</small></a>)}</div>
    </section>
  </>;
}
