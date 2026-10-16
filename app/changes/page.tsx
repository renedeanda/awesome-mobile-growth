import type { Metadata } from "next";
import Link from "next/link";
import { changes } from "@/lib/changes";
import { formatDate, pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "App Store and Google Play changes", description: "Dated App Store and Google Play changes that affect launches, store pages and measurement, each with what to do and the official source.", path: "/changes/", imagePath: "/changes/opengraph-image" });

export default function ChangesPage() {
  return <>
    <header className="index-head"><p className="eyebrow">Changes</p><h1>What changed in the stores, and what to do.</h1><p>Only changes that affect how you launch, build a store page or read your numbers. Each one is dated, links to Apple or Google, and ends with actions. <a href="/feed.xml">Subscribe with RSS</a>.</p></header>
    <ol className="change-list">{changes.map((change) => <li key={change.slug}>
      <div className="change-list__meta"><time dateTime={change.date}>{change.dateLabel ?? formatDate(change.date)}</time><span>{change.store}</span><span className={`status status--${change.status.toLowerCase().replace(" ", "-")}`}>{change.status}</span></div>
      <h2><Link href={`/changes/${change.slug}/`}>{change.title}</Link></h2>
      <p>{change.summary}</p>
    </li>)}</ol>
  </>;
}
