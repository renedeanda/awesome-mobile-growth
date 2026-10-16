import type { Metadata } from "next";
import Link from "next/link";
import { ArticleMeta } from "@/components/ArticleMeta";
import { DirectAnswer, SourceList } from "@/components/ContentBlocks";
import { apple, google } from "@/lib/articles/links";
import { absolute, pageMetadata, site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "What is App Store Optimization (ASO)? A practical guide", description: "What ASO includes, how App Store and Google Play search differ, and the order to work in: keywords, store page, testing and what happens after the install.", path: "/app-store-optimization/", type: "article", imagePath: "/store-page/opengraph-image" });

const reviewed = "2026-10-16";

export default function ASOGuide() {
  const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: "What is App Store Optimization (ASO)?", description: "What ASO includes, how App Store and Google Play search differ, and the order to work in.", datePublished: "2026-10-12", dateModified: reviewed, author: { "@type": "Person", name: site.author, url: absolute("/about/") }, publisher: { "@id": `${site.origin}/#publisher` }, mainEntityOfPage: absolute("/app-store-optimization/"), image: absolute("/store-page/opengraph-image") };
  return <article className="single-article">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}/>
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/learn/">Learn</Link></nav>
    <header className="article-head"><p className="eyebrow">Learn · Primer</p><h1>What is App Store Optimization (ASO)?</h1><p className="lede">ASO is the work of helping the right people find your app in the App Store and Google Play, and decide to install it.</p><ArticleMeta evidence={["official", "opinion"]} reading="4 min read" checked={reviewed}/></header>
    <DirectAnswer><p>ASO covers two things: being found (search ranking and browse placement) and being chosen (the store page that turns a look into an install). On the App Store, search reads your app name, subtitle, keyword field and category. On Google Play, it reads your visible text. Both stores also weigh how people respond: downloads, ratings and reviews.</p></DirectAnswer>
    <div className="prose">
      <h2 id="what-it-includes">What ASO includes</h2>
      <ul>
        <li><strong>Keywords:</strong> the words people search with, placed in the fields each store reads. <Link href="/store-page/keywords/">Keywords guide</Link></li>
        <li><strong>Metadata:</strong> the name, subtitle or short description, and description. <Link href="/store-page/metadata/">Metadata guide</Link></li>
        <li><strong>Visuals:</strong> icon, screenshots, previews, and Apple's new header and search assets. <Link href="/store-page/screenshots/">Screenshots guide</Link></li>
        <li><strong>Ratings and reviews:</strong> they show next to your app and Apple says they influence search ranking. <Link href="/grow/ratings-reviews/">Ratings guide</Link></li>
        <li><strong>Localization:</strong> rewriting all of the above for each market. <Link href="/store-page/localization/">Localization guide</Link></li>
        <li><strong>Testing:</strong> Product Page Optimization and Google Play store listing experiments. <Link href="/store-page/testing/">Testing guide</Link></li>
      </ul>
      <h2 id="stores-differ">How the two stores differ</h2>
      <div className="table-scroll" role="region" aria-label="App Store and Google Play differences" tabIndex={0}><table>
        <thead><tr><th scope="col"></th><th scope="col">App Store</th><th scope="col">Google Play</th></tr></thead>
        <tbody>
          <tr><th scope="row">Search reads</th><td>Name, subtitle, keyword field, category, plus user behavior</td><td>Name, short and full description, plus user behavior</td></tr>
          <tr><th scope="row">Hidden keyword field</th><td>Yes, 100 bytes</td><td>No</td></tr>
          <tr><th scope="row">One-line summary</th><td>Subtitle, 30 characters</td><td>Short description, 80 characters</td></tr>
          <tr><th scope="row">Store page tests</th><td>Product Page Optimization: icon, screenshots, previews</td><td>Store listing experiments: graphics and, in localized tests, descriptions</td></tr>
          <tr><th scope="row">Audience pages</th><td>Up to 70 custom product pages</td><td>Up to 50 custom store listings</td></tr>
        </tbody>
      </table></div>
      <h2 id="order">The order to work in</h2>
      <ol>
        <li>Write one sentence on what the app does and who it's for.</li>
        <li>Collect the words customers use, from reviews, support and store search suggestions.</li>
        <li>Write the subtitle or short description, then the name and keywords.</li>
        <li>Make the first three screenshots show the outcome, the main screen and the difference.</li>
        <li>Check every claim against the shipped build.</li>
        <li>Launch, record a baseline, then test one change at a time.</li>
        <li>Judge changes by retention as well as conversion.</li>
      </ol>
      <h2 id="what-not-to-believe">What not to believe</h2>
      <ul>
        <li>No tool has Apple's or Google's real search volume. Popularity scores are estimates.</li>
        <li>A ranking change rarely has a single cause you can prove.</li>
        <li>A higher conversion rate is a loss if the new installs leave in a day.</li>
        <li>Repeating a keyword in your Google Play description doesn't help, and can break the metadata policy.</li>
      </ul>
      <p>Start with the <Link href="/launch/checklist/">launch checklist</Link> if you're shipping, or the <Link href="/store-page/">store page guides</Link> if you're improving a live app.</p>
      <h2 id="sources">Official sources</h2>
      <SourceList items={[apple.search, apple.productPage, apple.ppo, apple.cpp, google.listing, google.metadataPolicy, google.experiments]}/>
    </div>
  </article>;
}
