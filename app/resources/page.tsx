import type { Metadata } from "next";
import Link from "next/link";
import { sources } from "@/lib/content";
import { resourceGroups, transitions } from "@/lib/resources";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "Mobile growth and ASO tools", description: "A maintained, independent guide to ASO tools, analytics, attribution, subscriptions, learning resources, and retired products.", path: "/resources/" });

export default function Resources() { return <>
  <header className="index-head"><p className="eyebrow">A working shelf, not a logo wall</p><h1>Tools for the decision in front of you.</h1><p>Start with the question, then evaluate the product. Inclusion is unpaid and editorial; it is not an endorsement, ranking, or promise that a vendor fits your app.</p></header>
  <section className="section"><div className="section-heading"><div><p className="eyebrow">Source of truth</p><h2>Platform documentation first.</h2></div><p>Limits and features move. These pages should be your last check before submission-sensitive work.</p></div><div className="source-list">{sources.map((item) => <a className="source-item" key={item.href} href={item.href}><span>{item.name}</span><small>{item.kind} ↗</small></a>)}</div></section>
  {resourceGroups.map((group) => <section className="section" key={group.title}><div className="section-heading"><h2>{group.title}</h2><p>{group.description}</p></div><div className="editorial-note"><p><strong>Use when:</strong> {group.useWhen}</p><p><strong>It cannot prove:</strong> {group.watchFor}</p></div><div className="resource-grid">{group.items.map((item) => <article className="resource-card" key={item.href}><h3><a href={item.href}>{item.name} ↗</a></h3><p>{item.note}</p></article>)}</div></section>)}
  <section className="section"><div className="section-heading"><div><p className="eyebrow">Old links, current reality</p><h2>Retired and acquired products.</h2></div><p>Historical articles can rank long after their tooling changes. Use this transition map before following an old tutorial.</p></div><div className="source-list">{transitions.map((item) => <a className="source-item" key={item.href} href={item.href}><span><strong>{item.name}</strong><br/><small>{item.note}</small></span><small>Transition ↗</small></a>)}</div><div className="callout">Firebase A/B Testing is still an in-product experimentation tool. It should not be confused with the retired Firebase Dynamic Links service or with store-page experiments. For the full decision map, read <Link href="/guides/mobile-growth-stack/">Choose a mobile growth stack</Link>.</div></section>
  </>; }
