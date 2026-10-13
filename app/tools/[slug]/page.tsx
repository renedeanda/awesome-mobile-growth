import { notFound } from "next/navigation";
import Link from "next/link";
import { BrowserTool } from "@/components/BrowserTools";
import { getTool, tools, type ToolSlug } from "@/lib/tools";
import { pageMetadata } from "@/lib/site";
export const dynamicParams=false;
export function generateStaticParams(){return tools.map(({slug})=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const tool=getTool(slug);if(!tool)return {};return pageMetadata({title:tool.title,description:tool.description,path:`/tools/${slug}/`,imagePath:"/tools/opengraph-image",imageAlt:"Free private browser tools for ASO"});}
export default async function ToolPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const tool=getTool(slug);if(!tool)notFound();return <article className="single-article tool-page"><nav className="breadcrumbs"><Link href="/tools/">Tools</Link><span>/</span><span>{tool.label}</span></nav><header className="article-head"><p className="eyebrow">Runs entirely in your browser</p><h1>{tool.title}</h1><p className="lede">{tool.description}</p></header><BrowserTool tool={tool.slug as ToolSlug}/><section className="tool-method"><p className="eyebrow">How to use the result</p><h2>Mechanics are the floor.</h2><p>Use the output to remove preventable errors. Then return to the harder editorial question: does this listing describe a product the right person will understand, trust, and want?</p></section></article>}
