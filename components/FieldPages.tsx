import Link from "next/link";
import { ArticleJsonLd, DirectAnswer, SourceList } from "@/components/ContentBlocks";
import type { FieldEntry } from "@/lib/fieldLab";

export function FieldCards({ entries, base }: { entries: FieldEntry[]; base: string }) {
  return <div className="field-card-grid">{entries.map((entry) => <Link href={`${base}${entry.slug}/`} key={entry.slug} className="field-card"><span>{entry.label}</span><h2>{entry.title}</h2><p>{entry.description}</p><strong>{entry.reading} · Open guide →</strong></Link>)}</div>;
}

export function FieldArticle({ entry, homeLabel, homeHref, path, next }: { entry: FieldEntry; homeLabel: string; homeHref: string; path: string; next?: { label: string; href: string } }) {
  return <article className="single-article field-article">
    <ArticleJsonLd title={entry.title} description={entry.description} path={path} modified={entry.reviewed}/>
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href={homeHref}>{homeLabel}</Link><span aria-hidden="true">/</span><span>{entry.label}</span></nav>
    <header className="article-head"><p className="eyebrow">{entry.label} · Verified {entry.reviewed}</p><h1>{entry.title}</h1><p className="lede">{entry.description}</p><div className="article-meta"><span>{entry.reading}</span><span>Primary sources reviewed</span></div></header>
    <DirectAnswer><p>{entry.answer}</p></DirectAnswer>
    <nav className="article-jump" aria-label="On this page">{entry.sections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}</nav>
    <div className="prose">{entry.sections.map((section) => <section key={section.id}><h2 id={section.id}>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}<h2 id="sources">Primary sources</h2><p>Rules and interfaces move. Recheck these sources before submission-sensitive work.</p><SourceList items={entry.sources}/>{next && <p className="field-next"><Link href={next.href}>{next.label} →</Link></p>}</div>
  </article>;
}
