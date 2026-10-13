import { notFound } from "next/navigation";
import { FieldArticle } from "@/components/FieldPages";
import { getFieldEntry, teardownEntries } from "@/lib/fieldLab";
import { pageMetadata } from "@/lib/site";
export function generateStaticParams() { return teardownEntries.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const entry = getFieldEntry("teardowns", slug); return entry ? pageMetadata({ title: entry.title, description: entry.description, path: `/teardowns/${slug}/`, type: "article" }) : {}; }
export default async function TeardownPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const entry = getFieldEntry("teardowns", slug); if (!entry) notFound(); return <FieldArticle entry={entry} homeLabel="Teardowns" homeHref="/teardowns/" path={`/teardowns/${slug}/`} next={{ label: "Build an evidence-aware experiment brief", href: "/tools/experiment-brief/" }}/>; }
