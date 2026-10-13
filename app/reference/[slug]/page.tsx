import { notFound } from "next/navigation";
import { FieldArticle } from "@/components/FieldPages";
import { getFieldEntry, referenceEntries } from "@/lib/fieldLab";
import { pageMetadata } from "@/lib/site";

export function generateStaticParams() { return referenceEntries.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const entry = getFieldEntry("reference", slug); return entry ? pageMetadata({ title: `${entry.title}: quick reference`, description: `A concise, sourced reference for ${entry.title.toLocaleLowerCase()}: exact meaning, common misread, and the decision it can support.`, path: `/reference/${slug}/`, type: "article" }) : {}; }
export default async function ReferenceEntryPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const entry = getFieldEntry("reference", slug); if (!entry) notFound(); return <FieldArticle entry={entry} homeLabel="Reference" homeHref="/reference/" path={`/reference/${slug}/`} next={{ label: "Use a browser-local ASO tool", href: "/tools/" }}/>; }
