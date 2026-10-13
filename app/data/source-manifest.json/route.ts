import { fieldCollections } from "@/lib/fieldLab";
export const dynamic="force-static";
export function GET(){const sources=[...new Map(Object.values(fieldCollections).flat().flatMap(entry=>entry.sources).map(source=>[source.href,source])).values()];return Response.json({schemaVersion:1,reviewed:"2026-10-12",policy:"Primary sources support volatile platform claims; editorial judgment remains labeled.",sources});}
