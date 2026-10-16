import type { Metadata } from "next";
import Link from "next/link";
import { articlesIn } from "@/lib/articles";
import { metrics } from "@/lib/metrics";
import { podcasts } from "@/lib/podcasts";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "Learn app growth: metrics, AI, podcasts and tools", description: "An App Store metrics glossary, a practical guide to using AI for ASO, a short podcast list and an independent list of growth tools.", path: "/learn/", imagePath: "/learn/opengraph-image" });

export default function LearnHub() {
  const ai = articlesIn("learn").find((article) => article.slug === "ai-for-aso");
  const cards = [
    { href: "/app-store-optimization/", label: "Primer", title: "What App Store Optimization is", text: "How the App Store and Google Play differ, and what ASO includes beyond keywords." },
    { href: "/learn/metrics/", label: `${metrics.length} definitions`, title: "App Store metrics glossary", text: "Impressions, conversion rate, downloads, sources and proceeds, as Apple defines them." },
    ...(ai ? [{ href: ai.path, label: ai.reading, title: ai.title, text: ai.description }] : []),
    { href: "/learn/podcasts/", label: `${podcasts.length} shows`, title: "Mobile growth podcasts", text: "Shows about launches, subscriptions and acquisition, with the episodes to start with." },
    { href: "/learn/resources/", label: "Independent", title: "Growth tools and resources", text: "ASO, analytics, attribution and subscription tools, plus products that were acquired or retired." },
    { href: "/changes/", label: "Dated", title: "Platform changes", text: "What changed in the App Store and Google Play, and what to do about it." },
  ];
  return <>
    <header className="index-head"><p className="eyebrow">Learn</p><h1>The ideas and numbers behind app growth.</h1><p>Definitions, background and reading for when you're not shipping something today.</p></header>
    <section className="section"><div className="hub-grid">{cards.map((card) => <Link key={card.href} href={card.href} className="hub-card"><span>{card.label}</span><h3>{card.title}</h3><p>{card.text}</p></Link>)}</div></section>
  </>;
}
