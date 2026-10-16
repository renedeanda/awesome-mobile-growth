import { ImageResponse } from "next/og";
import { SocialCard } from "@/components/SocialCard";

export const dynamic = "force-static";
export const alt = "Growth guides for mobile apps";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<SocialCard desk="GROW" title="Grow after the install." description="Onboarding, subscriptions, ratings, web-to-app and the metrics that connect them." trail={["Onboarding", "Subscriptions", "Ratings", "Analytics"]}/>, size);
}
