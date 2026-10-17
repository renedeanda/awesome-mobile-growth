import type { Metadata } from "next";
import Link from "next/link";
import { metrics } from "@/lib/metrics";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "App Store and Google Play metrics glossary", description: "Apple's definitions of impressions, conversion rate, downloads and proceeds, and Google's Android vitals thresholds, with the common misreadings of each.", path: "/learn/metrics/", imagePath: "/learn/opengraph-image" });

export default function MetricsIndex() {
  return <>
    <header className="index-head"><p className="eyebrow">Learn · Metrics</p><h1>App store metrics, defined.</h1><p>Apple's and Google's own definitions for the numbers in App Store Connect and Android vitals, how each is calculated, and the mistake people most often make with it. Most App Store metrics appear once you have at least five first-time downloads.</p></header>
    {(["App Store", "Google Play"] as const).map((store) => <section key={store} aria-labelledby={`metrics-${store === "App Store" ? "apple" : "google"}`}>
      <h2 id={`metrics-${store === "App Store" ? "apple" : "google"}`}>{store === "App Store" ? "App Store Connect" : "Google Play: Android vitals"}</h2>
      <dl className="glossary">{metrics.filter((metric) => (metric.store ?? "App Store") === store).map((metric) => <div key={metric.slug}>
        <dt><Link href={`/learn/metrics/${metric.slug}/`}>{metric.term}</Link></dt>
        <dd>{metric.definition}</dd>
      </div>)}</dl>
    </section>)}
  </>;
}
