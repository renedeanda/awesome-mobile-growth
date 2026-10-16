import type { Metadata } from "next";
import { ArticlePage, articleMetadata, articleParams } from "@/components/ArticlePage";

export const dynamicParams = false;
export function generateStaticParams() { return articleParams("launch"); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { return articleMetadata("launch", (await params).slug); }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { return <ArticlePage section="launch" slug={(await params).slug}/>; }
