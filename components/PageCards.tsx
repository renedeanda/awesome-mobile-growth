// Per-page social cards for guides, platform changes, metrics and tools. Each card carries the page's own title, checked
// date and something concrete from the page, so a shared link previews that page rather than its section.
import type { ReactElement } from "react";
import { ChecklistArt, clip, GlossaryArt, KeywordArt, PhoneFrameArt, SizesArt, StepsArt } from "@/components/SocialArt";
import { heroShots } from "@/components/HeroSystem";
import { SocialCard } from "@/components/SocialCard";
import { getArticle, sections, type SectionId } from "@/lib/articles";
import { getChange } from "@/lib/changes";
import { checklistPhases, keywordExample } from "@/lib/socialData";
import { getMetric, metricsReviewed } from "@/lib/metrics";
import { cardImage } from "@/lib/socialImage";
import { platformRules } from "@/lib/platform";
import { appleScreenshotClasses, appPreviewRules, formatSize, googlePlayIcon } from "@/lib/storeSpecs";
import { getTool, type ToolSlug } from "@/lib/tools";

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

const iphoneRequired = appleScreenshotClasses.find((spec) => spec.id === "iphone-dynamic-island-medium")!;
const { appleName, appleSubtitle, appleKeywords, applePromotional } = platformRules;

// Each tool's card shows what that tool checks, drawn from the same data the tool uses.
const toolArt: Record<ToolSlug, () => ReactElement> = {
  "app-store-keyword-field": () => <KeywordArt {...keywordExample()}/>,
  "metadata-validator": () => <StepsArt heading="LIMITS IT CHECKS" steps={[
    `${appleName.label} and ${appleSubtitle.label.toLowerCase()}: ${appleName.limit} characters each`,
    `${appleKeywords.label}: ${appleKeywords.limit} ${appleKeywords.unit}`,
    `${applePromotional.label}: ${applePromotional.limit} characters`,
    "Google Play name, short and full description",
  ]}/>,
  "app-store-screenshot-sizes": () => <SizesArt sizes={iphoneRequired.sizes} status="Required for every iPhone app" radius={0.12}/>,
  "screenshot-frames": () => <PhoneFrameArt caption={heroShots[1]} size={formatSize(iphoneRequired.sizes[1])}/>,
  "app-preview-checker": () => <StepsArt heading="APPLE'S LIMITS" steps={[
    `${appPreviewRules.seconds[0]} to ${appPreviewRules.seconds[1]} seconds long`,
    `Up to ${appPreviewRules.maxFps} frames per second`,
    `Up to ${appPreviewRules.maxMegabytes} MB, as .mov, .m4v or .mp4`,
  ]}/>,
  "play-asset-checker": () => <StepsArt heading="WHAT IT CHECKS" steps={[
    `App icon: ${googlePlayIcon.size} × ${googlePlayIcon.size} px, ${googlePlayIcon.format}, up to ${googlePlayIcon.maxKilobytes} KB`,
    "Feature graphic: size, transparency and file size",
    "Screenshots: size, transparency and file size",
  ]}/>,
  "experiment-brief": () => <StepsArt heading="THE BRIEF" steps={["A hypothesis", "One primary measure and a guardrail", "The decision you'll make"]}/>,
};

export function toolCard(slug: string) {
  const tool = getTool(slug);
  if (!tool) throw new Error(`No tool ${slug}`);
  return cardImage(<SocialCard desk="FREE BROWSER TOOL" title={tool.title} description={shorten(tool.description)} trail={[tool.label, "Runs in your browser", "Private"]} art={toolArt[tool.slug]()}/>);
}

export function skillCard() {
  return cardImage(<SocialCard desk="AGENT SKILL" title="App Store Growth skill for AI agents" description="An open skill with current store limits, a review checklist and a validator, with rules against invented data." trail={["App Store", "Google Play", "Open source"]} art={<StepsArt heading="IN THE SKILL" steps={["Current App Store and Google Play limits", "A listing review checklist", "A validator, with rules against invented data"]}/>}/>);
}
