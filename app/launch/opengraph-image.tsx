import { SocialCard } from "@/components/SocialCard";
import { cardImage } from "@/lib/socialImage";
import { ChecklistArt } from "@/components/SocialArt";
import { checklistPhases } from "@/lib/socialData";

export const dynamic = "force-static";
export const alt = "Launch guides for iPhone, iPad, Mac and Google Play";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const phases = checklistPhases();
  return cardImage(<SocialCard desk="LAUNCH" title="Ship your app without launch-week surprises." description="Store records, required screenshot sizes, testing, review and the first two weeks." trail={["iPhone", "iPad", "Mac", "Google Play"]} art={<ChecklistArt phases={phases.slice(0, 4)} done={2}/>}/>);
}
