import { notFound } from "next/navigation";
import { FieldArticle } from "@/components/FieldPages";
import { getFieldEntry, growthGuides } from "@/lib/fieldLab";
import { pageMetadata } from "@/lib/site";
export function generateStaticParams() { return growthGuides.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const entry = getFieldEntry("growth", slug); return entry ? pageMetadata({ title: entry.title, description: entry.description, path: `/growth/${slug}/`, type: "article", imagePath: "/growth/opengraph-image", imageAlt: "The App Growth Loop" }) : {}; }
export default async function GrowthGuidePage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const entry = getFieldEntry("growth", slug); if (!entry) notFound(); return <FieldArticle entry={entry} homeLabel="Growth" homeHref="/growth/" path={`/growth/${slug}/`} next={{ label: "Turn the next decision into an experiment brief", href: "/tools/experiment-brief/" }}/>; }
