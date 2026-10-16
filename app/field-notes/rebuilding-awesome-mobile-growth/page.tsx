import type { Metadata } from "next";
import Link from "next/link";
import { ArticleJsonLd, DirectAnswer } from "@/components/ContentBlocks";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Rebuilding Awesome Mobile Growth: a field note",
  description: "A transparent account of turning an old link collection into a sourced ASO field guide and private workbench—without inventing results.",
  path: "/field-notes/rebuilding-awesome-mobile-growth/",
  type: "article",
});

export default function FieldNote() {
  return <article className="single-article">
    <ArticleJsonLd title="Rebuilding a list that had stopped being useful" description="A transparent account of turning an old link collection into a sourced ASO field guide and private workbench." path="/field-notes/rebuilding-awesome-mobile-growth/"/>
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Field note</span></nav>
    <header className="article-head">
      <p className="eyebrow">Field note · Published 2026-10-12</p>
      <h1>Rebuilding a list that had stopped being useful.</h1>
      <p className="lede">The repository was attracting promotional submissions while the public experience had fallen behind the work it was meant to support.</p>
    </header>
    <DirectAnswer><p>The useful move was not adding more links. It was changing the product: preserve the durable resources, turn the subject into a maintained guide, label evidence, and give visitors a private place to do the work.</p></DirectAnswer>
    <div className="prose">
      <h2 id="problem">The problem was incentives</h2>
      <p>An open “awesome” list invites volume. Over time, submitters had more incentive to promote themselves than readers had reason to return. The repository owner also needed a current ASO reference, not an inbox of vendor requests.</p>
      <h2 id="decision">The product decision</h2>
      <p>The rebuild kept public contribution paths for precise corrections but removed the promise that every nomination deserved inclusion. Guides now start from Apple and Google's own documentation, tools need a reason to exist, and recommendation pages explain how items are chosen.</p>
      <h2 id="what-changed">What changed in the experience</h2>
      <ul><li>Maintained guides replaced the flat link pile.</li><li>Evidence labels separate rules from observations and judgment.</li><li>A browser-local workbench turns reading into an exportable release brief.</li><li>Podcast and resource shelves are intentionally small and actively reviewed.</li><li>Visible dates make staleness inspectable rather than pretending the web stopped changing.</li></ul>
      <h2 id="what-remains-unproven">What remains unproven</h2>
      <p>This redesign does not yet prove higher search visibility, better retention, or more useful assistant citations. Those outcomes require real Search Console data and time. The page will record results only when the evidence exists.</p>
      <h2 id="second-pass">October 2026: the second pass</h2>
      <p>A review four days after launch found the first rebuild still had problems: guide read times four to five times longer than the text, four Apple source links that led to Apple's "Page Not Found" page, a phone menu that stayed open after you tapped a link, and copy that leaned on the same abstract words on every page.</p>
      <p>The second pass reorganized the site into clear sections (Launch, Store page, Grow, Tools, Changes and Learn), rewrote every guide around specific limits, sizes and worked examples, and added build checks that fail on dead official links, drifting read times, small tap targets and a list of banned phrases.</p>
      <h2 id="standard">The standard going forward</h2>
      <p>A new page should answer a real app-builder question, contain something more useful than a summary of other summaries, and remain maintainable by one owner. If it cannot clear that bar, it does not need to exist.</p>
    </div>
  </article>;
}
