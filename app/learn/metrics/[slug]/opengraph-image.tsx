import { cardSize, metricCard } from "@/components/PageCards";
import { metrics } from "@/lib/metrics";

export const dynamic = "force-static";
export const dynamicParams = false;
export const alt = "App store metric definition";
export const size = cardSize;
export const contentType = "image/png";
export function generateStaticParams() { return metrics.map(({ slug }) => ({ slug })); }
export default async function Image({ params }: { params: Promise<{ slug: string }> }) { return metricCard((await params).slug); }
