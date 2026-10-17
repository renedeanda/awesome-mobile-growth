import { articleCard, cardSize } from "@/components/PageCards";
import { articlesIn } from "@/lib/articles";

export const dynamic = "force-static";
export const dynamicParams = false;
export const alt = "Mobile Growth guide";
export const size = cardSize;
export const contentType = "image/png";
export function generateStaticParams() { return articlesIn("grow").map(({ slug }) => ({ slug })); }
export default async function Image({ params }: { params: Promise<{ slug: string }> }) { return articleCard("grow", (await params).slug); }
