import Link from "next/link";
import type { ReactNode } from "react";
import { DirectAnswer } from "@/components/ContentBlocks";
import type { ApplePlatformGuide } from "@/lib/applePlatforms";
import { applePlatformsReviewed } from "@/lib/applePlatforms";
import { absolute, site } from "@/lib/site";

export type GuideSection = { id: string; label: string };

export function PlatformGuide({ guide, sections, children }: { guide: ApplePlatformGuide; sections: GuideSection[]; children: ReactNode }) {
  const path = `/apple-platforms/${guide.slug}/`;
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.description, datePublished: applePlatformsReviewed, dateModified: applePlatformsReviewed, author: { "@type": "Person", name: site.author, url: absolute("/about/") }, publisher: { "@id": `${site.origin}/#publisher` }, mainEntityOfPage: absolute(path), image: absolute("/apple-platforms/opengraph-image") },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Apple launch guides", item: absolute("/apple-platforms/") },
      { "@type": "ListItem", position: 2, name: guide.title, item: absolute(path) },
    ] },
  ];
  return <div className="article-shell platform-article"><article className="article">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/apple-platforms/">Apple launch guides</Link><span aria-hidden="true">/</span><span>{guide.label}</span></nav>
    <header className="article-head platform-article__head"><p className="eyebrow">{guide.label} · Official sources first</p><h1>{guide.title}</h1><p className="lede">{guide.description}</p><div className="article-meta"><span>{guide.reading}</span><span>Verified <time dateTime={applePlatformsReviewed}>{applePlatformsReviewed}</time></span></div></header>
    <DirectAnswer><p>{guide.answer}</p></DirectAnswer>
    <details className="toc-mobile"><summary>On this page</summary><ol>{sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.label}</a></li>)}</ol></details>
    <div className="prose platform-prose">{children}</div>
    <nav className="article-next" aria-label="Continue the launch plan"><Link href="/apple-platforms/"><span>All Apple platforms</span><strong>Return to the launch desk</strong></Link><Link href="/aso-checklist/"><span>Before submission</span><strong>Run the ASO checklist</strong></Link></nav>
  </article><aside className="toc"><p className="micro-label">On this page</p><ol>{sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.label}</a></li>)}</ol><div className="toc-note"><p>Apple changes submission rules. Reconfirm linked requirements in App Store Connect before delivery.</p><Link href="/apple-platforms/app-store-launch-requirements/">Compare platform requirements →</Link></div></aside></div>;
}

export function LaunchChecklist({ items }: { items: Array<{ title: string; detail: string }> }) {
  return <ol className="launch-checklist">{items.map((item, index) => <li key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.title}</strong><p>{item.detail}</p></div></li>)}</ol>;
}

export function DecisionPath({ items }: { items: Array<{ label: string; title: string; detail: string }> }) {
  return <div className="decision-path">{items.map((item) => <section key={item.label}><span>{item.label}</span><h3>{item.title}</h3><p>{item.detail}</p></section>)}</div>;
}

export function PlatformSources({ items }: { items: ReadonlyArray<{ label: string; href: string }> }) {
  return <ul className="primary-sources">{items.map((item) => <li key={item.href}><a href={item.href}>{item.label} ↗</a></li>)}</ul>;
}
