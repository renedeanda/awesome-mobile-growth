import { notFound } from "next/navigation";
import { FieldArticle } from "@/components/FieldPages";
import { aiGuides, getFieldEntry } from "@/lib/fieldLab";
import { pageMetadata } from "@/lib/site";
export const dynamicParams=false;
export function generateStaticParams(){return aiGuides.map(({slug})=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const entry=getFieldEntry("ai",slug);if(!entry)return {};return pageMetadata({title:entry.title,description:entry.description,path:`/ai/guides/${slug}/`,type:"article",imagePath:"/ai/opengraph-image",imageAlt:"AI for ASO with evidence and human judgment"});}
export default async function AiGuide({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const entry=getFieldEntry("ai",slug);if(!entry)notFound();return <FieldArticle entry={entry} homeLabel="AI for ASO" homeHref="/ai/" path={`/ai/guides/${slug}/`} next={{label:"Use the open App Store Growth skill",href:"/ai/skills/app-store-growth/"}}/>}
