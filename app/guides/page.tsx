import type { Metadata } from "next";
import { GuideCard } from "@/components/GuideCard";
import { guideCategories, guides } from "@/lib/content";
import { pageMetadata } from "@/lib/site";
export const metadata: Metadata = pageMetadata({ title: "ASO guides for App Store and Google Play", description: "Evidence-aware guides to ASO metadata, keyword research, localization, screenshots, creative assets, testing, retention, tools, and store operations.", path: "/guides/" });
export default function Guides(){return <><header className="page-intro"><p className="eyebrow">Field manual</p><h1>Find the decision you need to make.</h1><p>Current platform rules where they exist. Careful experiments where they do not. Each guide tells you what is known, what is judgment, and what to do next.</p></header><div className="guide-chapters">{guideCategories.map((category,index)=><section className="guide-chapter" key={category.id}><header><span>0{index+1}</span><div><h2>{category.title}</h2><p>{category.description}</p></div></header><div className="card-grid">{guides.filter(guide=>guide.category===category.id).map(guide=><GuideCard key={guide.slug} guide={guide}/>)}</div></section>)}</div></>}
