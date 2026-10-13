import type { Metadata } from "next";
import Link from "next/link";
import { ArticleJsonLd, DirectAnswer, SpecGrid } from "@/components/ContentBlocks";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "App Store Optimization (ASO): the practical guide",
  description: "Learn what App Store Optimization includes, how Apple and Google Play differ, and how to improve discovery, conversion, and retention without fake certainty.",
  path: "/app-store-optimization/",
  type: "article",
});

export default function ASOGuide() {
  return <article className="single-article">
    <ArticleJsonLd title="App Store Optimization, without the folklore" description="A practical introduction to discovery, conversion, experimentation, and retention for App Store and Google Play." path="/app-store-optimization/"/>
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>App Store Optimization</span></nav>
    <header className="article-head">
      <p className="eyebrow">Start here · Reviewed 2026-10-12</p>
      <h1>App Store Optimization, without the folklore.</h1>
      <p className="lede">A practical introduction to discovery, conversion, experimentation, and the product experience after the install.</p>
    </header>
    <DirectAnswer><p>App Store Optimization—or ASO—is the ongoing work of making an app easier for the right people to discover, understand, and confidently install in an app marketplace. It connects search language and store creative to product quality, experimentation, and retention.</p></DirectAnswer>
    <div className="prose">
      <h2 id="what-aso-includes">What ASO actually includes</h2>
      <p>ASO begins before a keyword list. You need a clear audience, a real customer job, and product evidence that can support the promise. The store page then expresses that truth through metadata, iconography, screenshots, video, ratings, localization, and audience-specific pages.</p>
      <div className="sequence"><span>Understand demand</span><span>Make a promise</span><span>Show proof</span><span>Measure fit</span></div>
      <h2 id="apple-vs-google">Apple and Google Play are different systems</h2>
      <SpecGrid label="Apple App Store and Google Play differences" items={[
        { label: "Search metadata", values: [{ label: "Apple App Store", value: "Name, subtitle, categories, and a private keyword field" }, { label: "Google Play", value: "Name, short description, and full description are visible listing copy" }] },
        { label: "Testing", values: [{ label: "Apple App Store", value: "Product Page Optimization and custom product pages" }, { label: "Google Play", value: "Store listing experiments and custom store listings" }] },
        { label: "Working rule", values: [{ label: "Apple App Store", value: "Count keyword bytes and keep every field distinct" }, { label: "Google Play", value: "Use relevant language naturally; never turn visible copy into a keyword dump" }] },
      ]}/>
      <p>Reuse the product truth, not the finished copy. A literal port leaves platform capabilities unused and often makes the language worse.</p>
      <h2 id="workflow">A durable ASO workflow</h2>
      <ol className="workflow-list">
        <li><strong>Ground the work.</strong><span>Name the audience, job, constraints, and one primary promise.</span></li>
        <li><strong>Collect language.</strong><span>Use reviews, support, interviews, store suggestions, and product vocabulary.</span></li>
        <li><strong>Build the listing.</strong><span>Give each field and creative frame one clear job.</span></li>
        <li><strong>Validate.</strong><span>Check limits, policy, localization, claims, crops, and actual console previews.</span></li>
        <li><strong>Learn.</strong><span>Record the change and read conversion with activation, retention, and review quality.</span></li>
      </ol>
      <h2 id="what-not-to-believe">What not to believe automatically</h2>
      <ul><li>No third party has ground-truth keyword volume for every store query.</li><li>A ranking change does not prove which single factor caused it.</li><li>A conversion lift is not a win if it attracts people the product cannot retain.</li><li>Keyword density formulas do not replace clear, policy-safe Google Play copy.</li><li>A beautiful screenshot is not useful if the customer cannot tell what the product does.</li></ul>
      <div className="next-actions">
        <Link href="/aso-checklist/"><span>Doing a release?</span><strong>Use the practical checklist →</strong></Link>
        <Link href="/guides/"><span>Solving one problem?</span><strong>Open the field manual →</strong></Link>
        <Link href="/workbench/"><span>Ready to write?</span><strong>Draft privately →</strong></Link>
      </div>
    </div>
  </article>;
}
