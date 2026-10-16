import { ImageResponse } from "next/og";
import { SocialCard } from "@/components/SocialCard";

export const dynamic = "force-static";
export const alt = "Awesome Mobile Growth: App Store and Google Play launch and ASO guides";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<SocialCard desk="AWESOME MOBILE GROWTH" title="Get your app's store page right." description="Current specs, launch checklists and free tools for the App Store and Google Play." trail={["Launch", "Store page", "Grow", "Tools"]}/>, size);
}
