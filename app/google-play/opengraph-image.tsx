import { ImageResponse } from "next/og";import { SocialCard } from "@/components/SocialCard";
export const dynamic="force-static";export const alt="Google Play ASO and Android launch desk";export const size={width:1200,height:630};export const contentType="image/png";
export default function Image(){return new ImageResponse(<SocialCard desk="GOOGLE PLAY DESK" title="Build for Play on its own terms." description="Launch, metadata, creative, localization, custom listings, and experiments." trail={["Listing","Creative","Learning"]} accent="#1e7453"/>,size)}
