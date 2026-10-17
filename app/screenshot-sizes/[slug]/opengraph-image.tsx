import { SizesArt } from "@/components/SocialArt";
import { SocialCard } from "@/components/SocialCard";
import { cardImage } from "@/lib/socialImage";
import { getSpecPage, specPages, specsChecked } from "@/lib/specPages";
import { formatSize, googlePlayScreenshotPresets } from "@/lib/storeSpecs";

export const dynamic = "force-static";
export const dynamicParams = false;
export const alt = "App Store and Google Play screenshot sizes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return specPages.map((page) => ({ slug: page.slug }));
}

// Corner radius as a share of the short side, so each outline reads as its device.
const radius: Record<string, number> = { iPhone: 0.12, iPad: 0.05, "Apple Watch": 0.22, "Google Play": 0.1 };

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const page = getSpecPage((await params).slug)!;
  const sizes = page.spec?.sizes ?? googlePlayScreenshotPresets.map((preset) => preset.size);
  const required = page.spec?.required?.replace(/^Yes, /, "").replace(/ \(see note\)$/, "");
  const status = page.store === "google-play" ? "2 to 8 phone screenshots" : required ? `Required ${required[0].toLowerCase()}${required.slice(1)}` : "Optional";
  const title = page.spec ? `${page.short} screenshot size` : "Google Play screenshot sizes";
  const pixels = sizes.map(([w, h]) => w * h), named = sizes.map(formatSize);
  const description = sizes.length <= 3
    ? `${named.slice(0, -1).join(", ")}${sizes.length > 1 ? " or " : ""}${named.at(-1)} pixels.`
    : `${sizes.length} accepted sizes, from ${named[pixels.indexOf(Math.min(...pixels))]} to ${named[pixels.indexOf(Math.max(...pixels))]} pixels.`;
  return cardImage(<SocialCard desk="SCREENSHOT SIZES" title={title} description={description} trail={page.store === "apple" ? ["App Store", page.device, "Sourced"] : ["Google Play", "Phone and tablet", "Sourced"]} checked={specsChecked} art={<SizesArt sizes={sizes} status={status} radius={radius[page.device] ?? 0.03}/>}/>);
}
