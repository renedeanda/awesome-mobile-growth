import { notFound } from "next/navigation";
import { FieldArticle } from "@/components/FieldPages";
import { getFieldEntry, googleGuides } from "@/lib/fieldLab";
import { pageMetadata } from "@/lib/site";
export function generateStaticParams() { return googleGuides.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const entry = getFieldEntry("google", slug); return entry ? pageMetadata({ title: entry.title, description: entry.description, path: `/google-play/${slug}/`, type: "article", imagePath: "/google-play/opengraph-image", imageAlt: "Google Play ASO and Android launch desk" }) : {}; }
export default async function GoogleGuidePage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const entry = getFieldEntry("google", slug); if (!entry) notFound(); return <FieldArticle entry={entry} homeLabel="Google Play" homeHref="/google-play/" path={`/google-play/${slug}/`} next={{ label: "Open the Google Play workbench", href: "/workbench/?platform=google-play&template=metadata" }}/>; }
