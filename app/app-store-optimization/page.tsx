import type { Metadata } from "next";
import Link from "next/link";
import { ArticleMeta } from "@/components/ArticleMeta";
import { DirectAnswer, SourceList } from "@/components/ContentBlocks";
import { apple, google } from "@/lib/articles/links";
import { readingFor } from "@/lib/articles";
import { absolute, pageMetadata, site } from "@/lib/site";
import Body from "@/content/primer/app-store-optimization.mdx";

export const metadata: Metadata = pageMetadata({ title: "What is App Store Optimization (ASO)? A practical guide", description: "What ASO includes, how App Store and Google Play search differ, and the order to work in: keywords, store page, testing and what happens after the install.", path: "/app-store-optimization/", type: "article", imagePath: "/store-page/opengraph-image" });

const reviewed = "2026-10-16";
const answer = "ASO covers two things: being found (search ranking and browse placement) and being chosen (the store page that turns a look into an install). On the App Store, search reads your app name, subtitle, keyword field and category. On Google Play, it reads your visible text. Both stores also weigh how people respond: downloads, ratings and reviews.";
const reading = readingFor("primer/app-store-optimization.mdx", answer);

export default function ASOGuide() {
  const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: "What is App Store Optimization (ASO)?", description: "What ASO includes, how App Store and Google Play search differ, and the order to work in.", datePublished: "2026-10-12", dateModified: reviewed, author: { "@type": "Person", name: site.author, url: absolute("/about/") }, publisher: { "@id": `${site.origin}/#publisher` }, mainEntityOfPage: absolute("/app-store-optimization/"), image: absolute("/store-page/opengraph-image") };
  return <article className="single-article">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}/>
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/learn/">Learn</Link></nav>
    <header className="article-head"><p className="eyebrow">Learn · Primer</p><h1>What is App Store Optimization (ASO)?</h1><p className="lede">ASO is the work of helping the right people find your app in the App Store and Google Play, and decide to install it.</p><ArticleMeta evidence={["official", "opinion"]} reading={reading} checked={reviewed}/></header>
    <DirectAnswer><p>{answer}</p></DirectAnswer>
    <div className="prose">
      <Body/>
      <h2 id="sources">Official sources</h2>
      <SourceList items={[apple.search, apple.productPage, apple.ppo, apple.cpp, google.listing, google.metadataPolicy, google.experiments]}/>
    </div>
  </article>;
}
