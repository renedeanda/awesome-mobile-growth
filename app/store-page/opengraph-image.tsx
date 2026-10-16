import { ImageResponse } from "next/og";
import { SocialCard } from "@/components/SocialCard";

export const dynamic = "force-static";
export const alt = "Store page guides for the App Store and Google Play";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<SocialCard desk="STORE PAGE" title="Build a store page that gets the install." description="Metadata, keywords, screenshots, header assets, localization and testing." trail={["Metadata", "Keywords", "Screenshots", "Testing"]}/>, size);
}
