import { fieldCollections } from "@/lib/fieldLab";
import { guides } from "@/lib/content";
export const dynamic="force-static";
export function GET(){const paths={reference:"/reference/",google:"/google-play/",growth:"/growth/",ai:"/ai/guides/",teardowns:"/teardowns/",updates:"/updates/"};return Response.json({schemaVersion:1,reviewed:"2026-10-12",entries:[...Object.entries(fieldCollections).flatMap(([collection,entries])=>entries.map(entry=>({collection,title:entry.title,description:entry.description,url:`${paths[collection as keyof typeof paths]}${entry.slug}/`,reviewed:entry.reviewed,sources:entry.sources}))),...guides.map(guide=>({collection:"guides",title:guide.title,description:guide.description,url:`/guides/${guide.slug}/`,reviewed:guide.modified}))]});}
