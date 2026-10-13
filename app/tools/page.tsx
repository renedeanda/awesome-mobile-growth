import Link from "next/link";
import { tools } from "@/lib/tools";
import { pageMetadata } from "@/lib/site";
export const metadata=pageMetadata({title:"Free ASO tools",description:"Private, browser-local tools for app store metadata, Apple keywords, screenshot specifications, and experiment planning.",path:"/tools/",imagePath:"/tools/opengraph-image",imageAlt:"Free private browser tools for ASO"});
export default function ToolsPage(){return <><header className="index-head"><p className="eyebrow">Private by default</p><h1>Useful tools, without the upload.</h1><p>Check the mechanics, clarify the decision, and keep your unreleased listing in your own browser. These tools do not manufacture keyword volume or an “ASO score.”</p></header><div className="field-card-grid">{tools.map(tool=><Link className="field-card" href={`/tools/${tool.slug}/`} key={tool.slug}><span>{tool.label}</span><h2>{tool.title}</h2><p>{tool.description}</p><strong>{tool.action} →</strong></Link>)}</div></>}
