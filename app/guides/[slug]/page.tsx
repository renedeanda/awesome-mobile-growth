import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DirectAnswer } from "@/components/ContentBlocks";
import { Evidence } from "@/components/Evidence";
import { guideLoaders, guides } from "@/lib/content";
import { absolute, pageMetadata, site } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams(){return guides.map(({slug})=>({slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const guide=guides.find(item=>item.slug===slug);if(!guide)return{};return pageMetadata({title:guide.searchTitle,description:guide.description,path:`/guides/${slug}/`,type:"article"})}

export default async function GuidePage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const index=guides.findIndex(item=>item.slug===slug);
  const guide=guides[index];
  const load=guideLoaders[slug];
  if(!guide||!load)notFound();
  const {default:Content}=await load();
  const previous=guides[index-1]; const next=guides[index+1];
  const articleUrl=absolute(`/guides/${guide.slug}/`);
  const jsonLd=[
    {"@context":"https://schema.org","@type":"Article",headline:guide.title,description:guide.description,datePublished:guide.published,dateModified:guide.modified,image:absolute("/opengraph-image"),author:{"@type":"Person",name:site.author,url:absolute("/about/")},mainEntityOfPage:articleUrl},
    {"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Guides",item:absolute("/guides/")},{"@type":"ListItem",position:2,name:guide.title,item:articleUrl}]},
  ];
  return <div className="article-shell"><article className="article"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd).replace(/</g,"\\u003c")}}/><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/guides/">Guides</Link><span aria-hidden="true">/</span><span>{guide.eyebrow}</span></nav><header className="article-head"><p className="eyebrow">{guide.eyebrow} · {guide.platform.replace("-"," ")}</p><h1>{guide.title}</h1><p className="lede">{guide.description}</p><div className="article-meta"><Evidence kinds={guide.evidence}/><span>{guide.reading}</span><span>Verified <time dateTime={guide.reviewed}>{guide.reviewed}</time></span></div></header><DirectAnswer><p>{guide.directAnswer}</p></DirectAnswer><details className="toc-mobile"><summary>On this page</summary><ol>{guide.sections.map(section=><li key={section.id}><a href={`#${section.id}`}>{section.label}</a></li>)}</ol></details><div className="prose"><Content/></div><nav className="article-next" aria-label="More guides">{previous?<Link href={`/guides/${previous.slug}/`}><span>Previous</span><strong>{previous.title}</strong></Link>:<span/>}{next?<Link href={`/guides/${next.slug}/`}><span>Next</span><strong>{next.title}</strong></Link>:<Link href="/workbench/"><span>Put it to work</span><strong>Open the ASO workbench</strong></Link>}</nav></article><aside className="toc"><p className="micro-label">On this page</p><ol>{guide.sections.map(section=><li key={section.id}><a href={`#${section.id}`}>{section.label}</a></li>)}</ol><div className="toc-note"><p>Platform rules move. Follow the linked primary source before submission-sensitive work.</p><Link href={`/workbench/?platform=${guide.platform==="google-play"?"google-play":"apple"}&template=metadata`}>Put this into practice →</Link></div></aside></div>
}
