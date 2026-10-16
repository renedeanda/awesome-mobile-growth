import Link from "next/link";
import type { Guide } from "@/lib/content";
import { formatDate } from "@/lib/site";

const platformLabel: Record<Guide["platform"], string> = {
  apple: "Apple",
  "google-play": "Google Play",
  "cross-platform": "Cross-platform",
};

export function GuideCard({ guide }: { guide: Guide }) {
  return <article className="guide-card">
    <p className="eyebrow">{guide.eyebrow} · {platformLabel[guide.platform]}</p>
    <h3><Link href={`/guides/${guide.slug}/`}>{guide.title}</Link></h3>
    <p>{guide.description}</p>
    <footer><span>{guide.reading}</span><span>Checked {formatDate(guide.reviewed)}</span></footer>
  </article>;
}
