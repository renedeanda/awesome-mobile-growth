import { ImageResponse } from "next/og";import { SocialCard } from "@/components/SocialCard";
export const dynamic="force-static";export const alt="Free private browser tools for ASO";export const size={width:1200,height:630};export const contentType="image/png";
export default function Image(){return new ImageResponse(<SocialCard desk="PRIVATE BROWSER TOOLS" title="Useful mechanics. No mystery score." description="Check metadata, Apple keywords, screenshot sizes and frames, and experiment briefs locally." trail={["Private","Deterministic","Sourced"]}/>,size)}
