import { SocialCard } from "@/components/SocialCard";
import { cardImage } from "@/lib/socialImage";
import { SearchResultArt } from "@/components/SocialArt";
import { heroFields, heroShots } from "@/components/HeroSystem";

export const dynamic = "force-static";
export const alt = "Awesome Mobile Growth: App Store and Google Play launch and ASO guides";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const art = <SearchResultArt query="film camera" name={heroFields[0].value} subtitle={heroFields[1].value} captions={heroShots}/>;
  return cardImage(<SocialCard desk="APP STORE + GOOGLE PLAY" title="Get your app's store page right." description="Current specs, launch checklists and free tools for the App Store and Google Play." trail={["Launch", "Store page", "Grow", "Tools"]} art={art}/>);
}
