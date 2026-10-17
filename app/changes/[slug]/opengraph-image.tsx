import { cardSize, changeCard } from "@/components/PageCards";
import { changes } from "@/lib/changes";

export const dynamic = "force-static";
export const dynamicParams = false;
export const alt = "App Store and Google Play change";
export const size = cardSize;
export const contentType = "image/png";
export function generateStaticParams() { return changes.map(({ slug }) => ({ slug })); }
export default async function Image({ params }: { params: Promise<{ slug: string }> }) { return changeCard((await params).slug); }
