import { fieldCollections } from "@/lib/fieldLab";
import { site } from "@/lib/site";
export const dynamic="force-static";
export function GET(){const entries=Object.entries(fieldCollections).flatMap(([collection,items])=>items.map(item=>`## ${item.title}\nURL: ${site.origin}/${collection === "google" ? "google-play" : collection === "ai" ? "ai/guides" : collection}/${item.slug}/\nReviewed: ${item.reviewed}\n\n${item.answer}\n\nSources:\n${item.sources.map(source=>`- ${source.label}: ${source.href}`).join("\n")}`)).join("\n\n");return new Response(`# ${site.name}: direct-answer index\n\nThis file summarizes public editorial material. Consult linked pages and primary sources for context and current rules.\n\n${entries}\n`,{headers:{"Content-Type":"text/plain; charset=utf-8"}})}
