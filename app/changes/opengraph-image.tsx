import { ImageResponse } from "next/og";
import { SocialCard } from "@/components/SocialCard";

export const dynamic = "force-static";
export const alt = "App Store and Google Play changes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<SocialCard desk="PLATFORM CHANGES" title="What changed in the stores, and what to do." description="Dated App Store and Google Play changes with the action each one needs." trail={["Apple", "Google Play", "Dated", "Sourced"]}/>, size);
}
