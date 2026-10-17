import { SocialCard } from "@/components/SocialCard";
import { cardImage } from "@/lib/socialImage";
import { KeywordArt } from "@/components/SocialArt";
import { keywordExample } from "@/lib/socialData";

export const dynamic = "force-static";
export const alt = "Store page guides for the App Store and Google Play";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return cardImage(<SocialCard desk="STORE PAGE" title="Build a store page that gets the install." description="Metadata, keywords, screenshots, header assets, localization and testing." trail={["Metadata", "Keywords", "Screenshots", "Testing"]} art={<KeywordArt {...keywordExample()}/>}/>);
}
