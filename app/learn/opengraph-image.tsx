import { ImageResponse } from "next/og";
import { SocialCard } from "@/components/SocialCard";

export const dynamic = "force-static";
export const alt = "Learn app growth: metrics, AI, podcasts and resources";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<SocialCard desk="LEARN" title="The metrics and ideas behind app growth." description="An App Store metrics glossary, AI for ASO, podcasts and a maintained resource list." trail={["Metrics", "AI", "Podcasts", "Resources"]}/>, size);
}
