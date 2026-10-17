import { SocialCard } from "@/components/SocialCard";
import { cardImage } from "@/lib/socialImage";
import { PhoneFrameArt } from "@/components/SocialArt";
import { heroShots } from "@/components/HeroSystem";
import { appleScreenshotClasses, formatSize } from "@/lib/storeSpecs";

export const dynamic = "force-static";
export const alt = "Free private browser tools for ASO";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const required = appleScreenshotClasses.find((spec) => spec.id === "iphone-dynamic-island-medium")!;
  return cardImage(<SocialCard desk="PRIVATE BROWSER TOOLS" title="Useful mechanics. No mystery score." description="Check metadata, Apple keywords, screenshot sizes and frames, and experiment briefs locally." trail={["Private", "Deterministic", "Sourced"]} art={<PhoneFrameArt caption={heroShots[1]} size={formatSize(required.sizes[1])}/>}/>);
}
