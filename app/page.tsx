import Link from "next/link";
import { HeroSystem } from "@/components/HeroSystem";
import { getArticle, sections } from "@/lib/articles";
import { changes } from "@/lib/changes";
import { formatDate } from "@/lib/site";

const paths = [
  { section: sections.launch, text: "Store records, required screenshot sizes, testing, App Review and the first two weeks, for iPhone, iPad, Mac and Google Play.", cta: "Plan a launch" },
  { section: sections["store-page"], text: "Name, subtitle, keywords, screenshots, the new header and search assets, localization and testing.", cta: "Improve a store page" },
  { section: sections.grow, text: "Onboarding, paywalls, ratings, web-to-app funnels and the numbers that connect them.", cta: "Grow after the install" },
  { section: { path: "/tools/", name: "Tools" }, text: "Count Apple keyword bytes, validate metadata, check screenshot sizes and draft a test, privately in your browser.", cta: "Use the free tools" },
];

const popular = [["store-page", "screenshots"], ["store-page", "keywords"], ["launch", "iphone"], ["launch", "google-play"]] as const;

export default function Home() {
  const guides = popular.map(([section, slug]) => getArticle(section, slug)).filter((item) => item !== undefined);
  return <>
    <section className="hero">
      <div className="hero-copy-block">
        <p className="kicker">For people who ship mobile apps</p>
        <h1>Get your app's store page right.</h1>
        <p className="hero-copy">Current specs, launch checklists and free tools for the App Store and Google Play. Updated when Apple and Google change the rules.</p>
        <div className="actions"><Link className="button" href="/launch/checklist/">Start the launch checklist</Link><Link className="button-secondary" href="/workbench/">Check your listing</Link></div>
        <p className="hero-trust">Independent · Sourced from Apple and Google · No paid placements</p>
      </div>
      <HeroSystem/>
    </section>

    <section className="section home-changes" aria-labelledby="changes-heading">
      <div className="section-heading"><div><p className="eyebrow">Platform changes</p><h2 id="changes-heading">What changed recently</h2></div><p><Link className="text-link" href="/changes/">All changes →</Link></p></div>
      <ol className="change-list change-list--compact">{changes.slice(0, 3).map((change) => <li key={change.slug}>
        <div className="change-list__meta"><time dateTime={change.date}>{change.dateLabel ?? formatDate(change.date)}</time><span>{change.store}</span><span className={`status status--${change.status.toLowerCase().replace(" ", "-")}`}>{change.status}</span></div>
        <h3><Link href={`/changes/${change.slug}/`}>{change.title}</Link></h3>
      </li>)}</ol>
    </section>

    <section className="section start-paths" aria-labelledby="paths-heading">
      <div className="section-heading"><div><p className="eyebrow">Start here</p><h2 id="paths-heading">What are you working on?</h2></div></div>
      <div className="hub-grid">{paths.map(({ section, text, cta }) => <Link key={section.path} href={section.path} className="hub-card"><span>{section.name}</span><h3>{cta}</h3><p>{text}</p></Link>)}</div>
    </section>

    <section className="section" aria-labelledby="popular-heading">
      <div className="section-heading"><div><p className="eyebrow">Most used</p><h2 id="popular-heading">Guides people open at launch</h2></div></div>
      <div className="hub-grid">{guides.map((guide) => <Link key={guide.path} href={guide.path} className="hub-card"><span>{sections[guide.section].name} · {guide.reading}</span><h3>{guide.title}</h3><p>{guide.description}</p></Link>)}</div>
    </section>

    <section className="section workbench-feature">
      <div><p className="eyebrow">Private by default</p><h2>Draft your listing with the limits built in.</h2><p>Write Apple and Google Play metadata with live character and byte counts, map keywords, plan screenshots and keep a test log, then export it. Nothing leaves your browser, and saving is optional.</p><div className="actions"><Link className="button" href="/workbench/">Open the workbench</Link><Link className="button-secondary" href="/tools/">See all tools</Link></div></div>
      <div className="mini-editor" aria-label="Example workbench fields"><div><span>App name</span><small>24 / 30</small></div><strong>Rollbook: Film Photo Log</strong><div><span>Subtitle</span><small>29 / 30</small></div><strong>Exposure notes for every roll</strong><div><span>Keywords</span><small>86 / 100 bytes</small></div><strong>35mm,120,analog,camera,aperture…</strong></div>
    </section>

    <section className="section field-feature">
      <div><p className="eyebrow">Learn</p><h2>The numbers and ideas behind growth.</h2><p>Apple's metric definitions, a practical guide to using AI for store work, a short podcast list and an independent list of tools.</p><div className="actions"><Link className="button" href="/learn/metrics/">Metrics glossary</Link><Link className="button-secondary" href="/learn/ai-for-aso/">AI for ASO</Link></div></div>
      <div className="feature-ledger"><span>Impressions</span><strong>Seen for over a second</strong><span>Conversion</span><strong>Downloads ÷ unique impressions</strong><span>Retention</span><strong>Came back on day 7</strong></div>
    </section>
  </>;
}
