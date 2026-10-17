import { SocialCard } from "@/components/SocialCard";
import { cardImage } from "@/lib/socialImage";
import { GlossaryArt } from "@/components/SocialArt";
import { getMetric, metricsReviewed } from "@/lib/metrics";

export const dynamic = "force-static";
export const alt = "Learn app growth: metrics, AI, podcasts and resources";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const metric = getMetric("conversion-rate")!;
  return cardImage(<SocialCard desk="LEARN" title="The metrics and ideas behind app growth." description="An App Store metrics glossary, AI for ASO, podcasts and a maintained resource list." trail={["Metrics", "AI", "Podcasts", "Resources"]} checked={metricsReviewed} art={<GlossaryArt term={metric.term} definition={metric.definition} where={metric.where}/>}/>);
}
