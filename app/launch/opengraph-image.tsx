import { ImageResponse } from "next/og";
import { SocialCard } from "@/components/SocialCard";

export const dynamic = "force-static";
export const alt = "Launch guides for iPhone, iPad, Mac and Google Play";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<SocialCard desk="LAUNCH" title="Ship your app without launch-week surprises." description="Store records, required screenshot sizes, testing, review and the first two weeks." trail={["iPhone", "iPad", "Mac", "Google Play"]}/>, size);
}
