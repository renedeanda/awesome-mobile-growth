import type { Metadata } from "next";
import { ArticlePage, articleMetadata, articleParams } from "@/components/ArticlePage";

export const dynamicParams = false;
export function generateStaticParams() { return articleParams("learn"); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { return articleMetadata("learn", (await params).slug); }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { return <ArticlePage section="learn" slug={(await params).slug}/>; }
