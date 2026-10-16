import type { Metadata } from "next";
import Link from "next/link";
import { metrics } from "@/lib/metrics";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "App Store Connect metrics glossary", description: "Apple's definitions of impressions, product page views, conversion rate, downloads, source types and proceeds, with the common misreadings of each.", path: "/learn/metrics/", imagePath: "/learn/opengraph-image" });

export default function MetricsIndex() {
  return <>
    <header className="index-head"><p className="eyebrow">Learn · Metrics</p><h1>App Store metrics, defined.</h1><p>Apple's own definitions for the numbers in App Store Connect, how each is calculated, and the mistake people most often make with it. Most App Store metrics appear once you have at least five first-time downloads.</p></header>
    <dl className="glossary">{metrics.map((metric) => <div key={metric.slug}>
      <dt><Link href={`/learn/metrics/${metric.slug}/`}>{metric.term}</Link></dt>
      <dd>{metric.definition}</dd>
    </div>)}</dl>
  </>;
}
