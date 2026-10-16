import type { Metadata } from "next";
import Link from "next/link";
import { SectionHub } from "@/components/SectionHub";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "Store page guides for the App Store and Google Play", description: "Write metadata, choose keywords, design screenshots and header assets, localize, test and build custom pages for the App Store and Google Play.", path: "/store-page/", imagePath: "/store-page/opengraph-image", imageAlt: "Store page guides" });

const limits = [
  ["App name", "30", "30"],
  ["Subtitle / short description", "30", "80"],
  ["Keywords", "100 bytes", "None"],
  ["Promotional text", "170", "None"],
  ["Description", "4,000", "4,000"],
  ["Screenshots", "1–10 per size", "2–8 per device"],
] as const;

export default function StorePageHub() {
  return <SectionHub section="store-page" eyebrow="Store page" title="Build a store page that gets the install." intro="Everything a visitor sees before they tap Get or Install: the text fields, keywords, screenshots, the new header and search assets, translations, tests and custom pages for specific audiences.">
    <section className="hub-panel" aria-labelledby="limits-heading">
      <h2 id="limits-heading">Limits at a glance</h2>
      <div className="table-scroll" role="region" aria-label="Store page limits" tabIndex={0}>
        <table className="compact-table"><thead><tr><th scope="col">Field</th><th scope="col">App Store</th><th scope="col">Google Play</th></tr></thead>
          <tbody>{limits.map(([field, apple, google]) => <tr key={field}><th scope="row">{field}</th><td>{apple}</td><td>{google}</td></tr>)}</tbody></table>
      </div>
      <p><Link className="text-link" href="/workbench/">Check your own fields in the workbench →</Link></p>
    </section>
  </SectionHub>;
}
