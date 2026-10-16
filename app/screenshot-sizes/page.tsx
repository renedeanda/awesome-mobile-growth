import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, pageMetadata } from "@/lib/site";
import { specPages, specPath, specsChecked } from "@/lib/specPages";
import { formatSize } from "@/lib/storeSpecs";

export const metadata: Metadata = pageMetadata({ title: "App Store and Google Play screenshot sizes", description: "Every App Store screenshot size by device, from iPhone Duo to Apple Watch, plus Google Play's limits. One page per device, generated from one checked source.", path: "/screenshot-sizes/", imagePath: "/store-page/opengraph-image", imageAlt: "App Store and Google Play screenshot sizes" });

const groups = [...new Set(specPages.map((page) => page.device))];

export default function ScreenshotSizes() {
  return <>
    <header className="index-head"><p className="eyebrow">Screenshot sizes</p><h1>Every screenshot size, one page per device.</h1><p>Pick your device for the accepted pixel sizes, whether the slot is required, and what happens if you skip it. All figures come from one file checked against Apple and Google on {formatDate(specsChecked)}. For what to put in the frames, read the <Link href="/store-page/screenshots/">screenshots guide</Link>.</p></header>
    <div className="spec-index">{groups.map((device) => <section key={device} aria-labelledby={`group-${device}`}>
      <h2 id={`group-${device}`}>{device}</h2>
      <ul>{specPages.filter((page) => page.device === device).map((page) => <li key={page.slug}>
        <Link href={specPath(page.slug)}><strong>{page.spec?.name ?? page.title}</strong><span>{page.spec ? page.spec.sizes.slice(0, 2).map(formatSize).join(" · ") + (page.spec.sizes.length > 2 ? " · …" : "") : "Phone, tablet, feature graphic, icon"}</span>{page.spec?.required && <small>Required</small>}</Link>
      </li>)}</ul>
    </section>)}</div>
  </>;
}
