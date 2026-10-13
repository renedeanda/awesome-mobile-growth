import { ImageResponse } from "next/og";import { SocialCard } from "@/components/SocialCard";
export const dynamic="force-static";export const alt="AI for ASO with evidence and human judgment";export const size={width:1200,height:630};export const contentType="image/png";
export default function Image(){return new ImageResponse(<SocialCard desk="OPEN AI FIELD LAB" title="Give the model a workflow—not permission to guess." description="Evidence-aware guides and a portable skill for responsible app-store work." trail={["Evidence","Bounded job","Human-approved diff"]} accent="#6b4fd3"/>,size)}
