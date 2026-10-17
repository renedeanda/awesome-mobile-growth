import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DirectAnswer, SourceList } from "@/components/ContentBlocks";
import { GooglePlayGraphicsTable } from "@/components/MdxBlocks";
import { apple, google } from "@/lib/articles/links";
import { absolute, formatDate, pageMetadata, site } from "@/lib/site";
import { appleScreenshotRules, aspectRatio, getSpecPage, specPages, specPath, specsChecked, type SpecPage } from "@/lib/specPages";
import { formatSize, googlePlayScreenshotPresets } from "@/lib/storeSpecs";
import { DeviceSilhouettes } from "@/components/DeviceSilhouettes";
import { ShareButton } from "@/components/ShareButton";

export const dynamicParams = false;
export function generateStaticParams() { return specPages.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = getSpecPage((await params).slug);
  return page ? pageMetadata({ title: page.seoTitle, description: page.description, path: specPath(page.slug), type: "article", imagePath: `${specPath(page.slug)}opengraph-image`, imageAlt: `${page.short} screenshot sizes` }) : {};
}

function AppleSpec({ page }: { page: SpecPage }) {
  const spec = page.spec!;
  const siblings = specPages.filter((item) => item.device === page.device && item.slug !== page.slug);
  return <>
    <h2 id="sizes">Accepted sizes</h2>
    <figure className="silhouette-figure"><DeviceSilhouettes device={page.device} sizes={spec.sizes}/><figcaption>Every accepted size, drawn to scale.</figcaption></figure>
    <div className="table-scroll" role="region" aria-label={`${page.short} screenshot sizes`} tabIndex={0}>
      <table><thead><tr><th scope="col">{page.orientation === "both" ? "Portrait" : "Pixels"}</th>{page.orientation === "both" && <th scope="col">Landscape</th>}<th scope="col">Aspect ratio</th></tr></thead>
        <tbody>{spec.sizes.map((size) => <tr key={formatSize(size)}><th scope="row" className="nowrap-cells">{formatSize(size)}</th>{page.orientation === "both" && <td className="nowrap-cells">{formatSize([size[1], size[0]])}</td>}<td>{aspectRatio(size)}</td></tr>)}</tbody></table>
      <p className="table-source">Source: <a href={apple.screenshots.href}>Apple screenshot specifications</a>, checked {formatDate(specsChecked)}.</p>
    </div>
    <p>Any one of these sizes is accepted for the {spec.name} slot. Pick the size your capture device or design canvas produces natively; you don’t need to upload every size.</p>

    <h2 id="rules">Upload rules</h2>
    <ul>
      <li><strong>Count:</strong> {appleScreenshotRules.count}.</li>
      <li><strong>Formats:</strong> {appleScreenshotRules.formats.join(", ")}, with no transparency (alpha channel).</li>
      <li><strong>Scaling:</strong> {appleScreenshotRules.scaling}</li>
      {page.orientation === "landscape" && <li><strong>Orientation:</strong> landscape only.</li>}
      {page.orientation === "fixed" && <li><strong>Orientation:</strong> upload at the listed size; there is no landscape variant.</li>}
    </ul>

    <h2 id="required">Is it required?</h2>
    <p>{spec.required ? <>Yes: {spec.required.replace(/^Yes, /, "").replace(/ \(see note\)$/, "")}.</> : <>No. You can skip this slot.</>} {spec.note}</p>
    {!spec.required && <p>When you skip an optional slot, App Store Connect uses your screenshots from a larger display class, scaled to fit. Upload a dedicated set only if the scaled version crops or shrinks something important.</p>}

    {siblings.length > 0 && <><h2 id="other-sizes">Other {page.device} sizes</h2>
      <ul>{siblings.map((item) => <li key={item.slug}><Link href={specPath(item.slug)}>{item.spec!.name}</Link>{item.spec?.required && <> · required {item.spec.required.replace(/^Yes, /, "").replace(/ \(see note\)$/, "").replace(/^./, (c) => c.toLowerCase())}</>}</li>)}</ul></>}
  </>;
}

function GoogleSpec() {
  return <>
    <h2 id="sizes">Graphic assets</h2>
    <figure className="silhouette-figure"><DeviceSilhouettes device="Google Play" sizes={googlePlayScreenshotPresets.map((preset) => preset.size)}/><figcaption>Portrait and landscape phone screenshots at 1080 pixels, drawn to scale.</figcaption></figure>
    <GooglePlayGraphicsTable/>
    <h2 id="rules">What to check before upload</h2>
    <ul>
      <li>Every phone screenshot must keep its long side within twice the short side: 1080 × 2160 passes, 1080 × 2400 does not.</li>
      <li>Export as JPEG or 24-bit PNG. A PNG with an alpha channel is rejected even when it looks opaque.</li>
      <li>The feature graphic is required to publish and must be exactly 1024 × 500.</li>
      <li>Upload at least four tablet screenshots at 1080 pixels or more if you want to be eligible for large-screen recommendations.</li>
    </ul>
    <h2 id="required">Is it required?</h2>
    <p>Yes: at least two screenshots across your supported device types, the feature graphic and the icon. Tablet, Chromebook and other form-factor screenshots apply only if you ship on them.</p>
  </>;
}

export default async function SpecDetail({ params }: { params: Promise<{ slug: string }> }) {
  const page = getSpecPage((await params).slug);
  if (!page) notFound();
  const path = specPath(page.slug);
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "TechArticle", headline: page.title, description: page.description, datePublished: "2026-10-16", dateModified: specsChecked, author: { "@type": "Person", name: site.author, url: absolute("/about/") }, publisher: { "@id": `${site.origin}/#publisher` }, mainEntityOfPage: absolute(path), image: absolute("/store-page/opengraph-image") },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: absolute("/") }, { "@type": "ListItem", position: 2, name: "Screenshot sizes", item: absolute("/screenshot-sizes/") }, { "@type": "ListItem", position: 3, name: page.short, item: absolute(path) }] },
  ];
  return <article className="single-article spec-article">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}/>
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/screenshot-sizes/">Screenshot sizes</Link></nav>
    <header className="article-head">
      <p className="eyebrow">{page.store === "apple" ? `App Store · ${page.device}` : "Google Play"}</p>
      <h1>{page.title}</h1>
      <p className="lede">{page.store === "apple" ? `Accepted pixel sizes, upload rules, and what happens if you skip the ${page.short} slot.` : "Screenshot limits, the feature graphic, the icon and video rules for a Google Play store listing."}</p>
      <div className="article-meta"><p className="article-meta__facts"><span>Checked <time dateTime={specsChecked}>{formatDate(specsChecked)}</time></span></p><ShareButton title={page.title} path={path}/></div>
    </header>
    <DirectAnswer><p>{page.answer}</p></DirectAnswer>
    <div className="prose">
      {page.store === "apple" ? <AppleSpec page={page}/> : <GoogleSpec/>}
      <section className="do-today" aria-label="Next steps"><p className="micro-label">Next steps</p><ol>
        <li>Plan what the first three frames say in the <Link href="/store-page/screenshots/">screenshots guide</Link>.</li>
        <li>Storyboard each frame with the <Link href="/tools/app-store-screenshot-sizes/">screenshot planner</Link>.</li>
        {page.device !== "Apple Watch" && <li>Put your captures in device frames and export them at these sizes with the <Link href={`/tools/screenshot-frames/?class=${page.slug}`}>screenshot frame studio</Link>.</li>}
        <li>See your icon and screenshots in a search result with the <Link href="/workbench/">Workbench store preview</Link>.</li>
      </ol></section>
      <h2 id="sources">Official sources</h2>
      <SourceList items={page.store === "apple" ? [apple.screenshots, apple.manageAssets] : [google.graphics]}/>
    </div>
  </article>;
}
