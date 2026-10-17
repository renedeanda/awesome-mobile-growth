// Per-page social cards for guides, platform changes and metrics. Each card carries the page's own title, checked
// date and something concrete from the page, so a shared link previews that page rather than its section.
import { ChecklistArt, clip, GlossaryArt, StepsArt } from "@/components/SocialArt";
import { SocialCard } from "@/components/SocialCard";
import { getArticle, sections, type SectionId } from "@/lib/articles";
import { getChange } from "@/lib/changes";
import { checklistPhases } from "@/lib/socialData";
import { getMetric, metricsReviewed } from "@/lib/metrics";
import { cardImage } from "@/lib/socialImage";

export const cardSize = { width: 1200, height: 630 };

const platformLabel = { apple: "App Store", "google-play": "Google Play" } as const;
const shorten = (text: string) => clip(text, 120);
const day = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export function articleCard(section: SectionId, slug: string) {
  const article = getArticle(section, slug);
  if (!article) throw new Error(`No guide at ${section}/${slug}`);
  const art = article.steps.length
    ? <StepsArt heading="DO THIS TODAY" steps={article.steps}/>
    : <ChecklistArt phases={checklistPhases().slice(0, 4)} done={0}/>;
  return cardImage(<SocialCard desk={sections[section].name.toUpperCase()} title={article.title} description={shorten(article.description)} trail={[...article.platforms.map((platform) => platformLabel[platform]), article.reading, "Sourced"]} checked={article.reviewed} art={art}/>);
}

export function changeCard(slug: string) {
  const change = getChange(slug);
  if (!change) throw new Error(`No change ${slug}`);
  return cardImage(<SocialCard desk="PLATFORM CHANGES" title={change.title} description={shorten(change.summary)} trail={[change.store, change.status, day(change.date)]} checked={change.reviewed} art={<StepsArt heading="WHAT TO DO" steps={change.actions}/>}/>);
}

export function metricCard(slug: string) {
  const metric = getMetric(slug);
  if (!metric) throw new Error(`No metric ${slug}`);
  return cardImage(<SocialCard desk="METRICS GLOSSARY" title={metric.title} description={shorten(metric.description)} trail={[metric.store ?? "App Store", "Definition", "Common misreading"]} checked={metric.reviewed ?? metricsReviewed} art={<GlossaryArt term={metric.term} definition={metric.definition} where={metric.where}/>}/>);
}
