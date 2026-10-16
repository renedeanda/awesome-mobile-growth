import { notFound } from "next/navigation";
import { FieldArticle } from "@/components/FieldPages";
import { getFieldEntry, updates } from "@/lib/fieldLab";
import { pageMetadata } from "@/lib/site";
export function generateStaticParams() { return updates.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const entry = getFieldEntry("updates", slug); return entry ? pageMetadata({ title: entry.title, description: entry.description, path: `/updates/${slug}/`, type: "article" }) : {}; }
export default async function UpdatePage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const entry = getFieldEntry("updates", slug); if (!entry) notFound(); return <FieldArticle entry={entry} homeLabel="Platform changes" homeHref="/updates/" path={`/updates/${slug}/`} next={{ label: "Read the complete creative guide", href: "/guides/app-store-creative-assets/" }}/>; }
