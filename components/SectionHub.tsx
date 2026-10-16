import Link from "next/link";
import type { ReactNode } from "react";
import { articlesIn, sections, type SectionId } from "@/lib/articles";

const platformLabel = { apple: "App Store", "google-play": "Google Play" } as const;

export function SectionHub({ section, eyebrow, title, intro, children }: { section: SectionId; eyebrow: string; title: string; intro: ReactNode; children?: ReactNode }) {
  const items = articlesIn(section);
  return <>
    <header className="index-head"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></header>
    {children}
    <section className="section" aria-labelledby={`${section}-guides`}>
      <h2 id={`${section}-guides`} className="hub-heading">{items.length} {sections[section].name.toLowerCase()} guides</h2>
      <div className="hub-grid">{items.map((article) => <Link key={article.slug} href={article.path} className="hub-card">
        <span>{article.platforms.map((platform) => platformLabel[platform]).join(" + ")} · {article.reading}</span>
        <h3>{article.title}</h3>
        <p>{article.description}</p>
      </Link>)}</div>
    </section>
  </>;
}
