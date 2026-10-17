import { SocialCard } from "@/components/SocialCard";
import { cardImage } from "@/lib/socialImage";
import { FunnelArt } from "@/components/SocialArt";
import { getMetric } from "@/lib/metrics";

export const dynamic = "force-static";
export const alt = "Growth guides for mobile apps";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const steps = ["impressions", "product-page-views", "first-time-downloads"].map((slug) => getMetric(slug)?.term ?? slug);
  return cardImage(<SocialCard desk="GROW" title="Grow after the install." description="Onboarding, subscriptions, ratings, web-to-app and the metrics that connect them." trail={["Onboarding", "Subscriptions", "Ratings", "Analytics"]} art={<FunnelArt steps={steps}/>}/>);
}
