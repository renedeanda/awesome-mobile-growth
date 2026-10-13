import Link from "next/link";
import { GuideCard } from "@/components/GuideCard";
import { HeroSystem } from "@/components/HeroSystem";
import { guides } from "@/lib/content";

export default function Home() {
  const featured = [guides[0], guides[3], guides[4]].filter(Boolean);
  return <>
    <section className="hero">
      <div className="hero-copy-block">
        <p className="kicker">The field guide for better app growth</p>
        <h1>Understand the store. Build the page. Grow the right audience.</h1>
        <p className="hero-copy">Current, sourced App Store and Google Play guidance—plus private tools for turning product truth into metadata, creative, and experiments.</p>
        <div className="actions"><Link className="button" href="/guides/">Find a guide</Link><Link className="button-secondary" href="/workbench/">Open the workbench</Link></div>
        <p className="hero-trust">Independent · Official sources first · No paid placements</p>
      </div>
      <HeroSystem/>
    </section>
    <section className="signal-strip" aria-label="Current status"><span>Reviewed October 2026</span><span>Apple + Google Play</span><span>Drafts stay in your browser</span></section>

    <section className="section start-paths">
      <div className="section-heading"><div><p className="eyebrow">Choose the work</p><h2>What do you need to ship?</h2></div><p>Start with the decision in front of you. Each path separates official requirements from operating judgment.</p></div>
      <div className="path-grid">
        <Link href="/apple-platforms/"><span>01</span><h3>Launch an Apple app</h3><p>Prepare iPhone, iPad, Mac, and Universal Purchase releases.</p><strong>Choose a platform →</strong></Link>
        <Link href="/guides/metadata/"><span>02</span><h3>Improve a store page</h3><p>Write metadata and creative that make the product easy to understand.</p><strong>Build the page →</strong></Link>
        <Link href="/tools/"><span>03</span><h3>Check the work</h3><p>Validate fields, count keyword bytes, storyboard screenshots, and plan a test.</p><strong>Use the tools →</strong></Link>
        <Link href="/growth/"><span>04</span><h3>Grow beyond the listing</h3><p>Connect acquisition to onboarding, retention, subscription value, and learning.</p><strong>Study the system →</strong></Link>
      </div>
    </section>

    <section className="section current-brief"><div className="brief-marker"><span>Current brief</span><time dateTime="2026-10-13">13 OCT 2026</time></div><div><p className="eyebrow">Apple creative assets</p><h2>New placements need new creative decisions.</h2><p>Plan product-page headers and search-result assets with exact formats, silent-first storytelling, and an honest distinction between current and upcoming requirements.</p><Link className="text-link" href="/guides/app-store-creative-assets/">Read the sourced briefing →</Link></div><div className="brief-spec" aria-label="Creative asset summary"><span>Header</span><strong>21:9</strong><small>Still or video</small><span>Search</span><strong>3:2</strong><small>Silent-first</small></div></section>

    <section className="section">
      <div className="section-heading"><div><p className="eyebrow">The working manual</p><h2>Start with the guides people use at launch.</h2></div><p>Direct answers, primary sources, checklists, and the practical consequence for your next release.</p></div>
      <div className="card-grid">{featured.map(guide => <GuideCard key={guide.slug} guide={guide}/>)}</div>
      <p className="section-link"><Link href="/guides/">Browse the complete guide →</Link></p>
    </section>

    <section className="section workbench-feature"><div><p className="eyebrow">Private by default</p><h2>Turn the advice into a shipping brief.</h2><p>Draft Apple and Google Play metadata, compare a proposed listing, plan screenshots and experiments, then export the work. Nothing is uploaded; browser saving is optional.</p><div className="actions"><Link className="button" href="/workbench/">Use the workbench</Link><Link className="button-secondary" href="/tools/">Choose a focused tool</Link></div></div><div className="mini-editor" aria-label="Illustrative metadata editor"><div><span>App name</span><small>18 / 30</small></div><strong>Northstar Journal</strong><div><span>Subtitle</span><small>22 / 30</small></div><strong>Private notes, anywhere</strong><div className="mini-editor__check"><i aria-hidden="true">✓</i><span>One promise<br/><small>Visible product proof</small></span></div></div></section>

    <section className="section field-feature"><div><p className="eyebrow">Stay sharp</p><h2>Learn from operators, not a content treadmill.</h2><p>Listen to a small, maintained podcast shelf, review decision-focused growth guides, and use the open AI workflow when a bounded task genuinely benefits from it.</p><div className="actions"><Link className="button" href="/podcasts/">Open the podcast shelf</Link><Link className="button-secondary" href="/ai/guides/aso-with-ai/">Use AI responsibly</Link></div></div><div className="feature-ledger"><span>Listen</span><strong>Find a useful idea</strong><span>Apply</span><strong>Make one change</strong><span>Measure</span><strong>Keep the learning</strong></div></section>
  </>;
}
