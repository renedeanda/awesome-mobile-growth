import { ImageResponse } from "next/og";import { SocialCard } from "@/components/SocialCard";
export const dynamic="force-static";export const alt="The App Growth Loop";export const size={width:1200,height:630};export const contentType="image/png";
export default function Image(){return new ImageResponse(<SocialCard desk="APP GROWTH LOOP" title="ASO earns a place in a larger system." description="Connect discovery and conversion to activation, monetization, retention, and advocacy." trail={["Discover","Decide","Activate","Retain"]} accent="#d55232"/>,size)}
