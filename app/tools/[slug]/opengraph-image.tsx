import { cardSize, toolCard } from "@/components/PageCards";
import { tools } from "@/lib/tools";

export const dynamic = "force-static";
export const dynamicParams = false;
export const alt = "Free private browser tool for ASO";
export const size = cardSize;
export const contentType = "image/png";
export function generateStaticParams() { return tools.map(({ slug }) => ({ slug })); }
export default async function Image({ params }: { params: Promise<{ slug: string }> }) { return toolCard((await params).slug); }
