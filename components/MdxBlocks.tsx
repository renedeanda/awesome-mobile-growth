import Link from "next/link";
import type { ReactNode } from "react";
import { CopyButton } from "@/components/CopyButton";
import { keywordTokens, utf8Bytes } from "@/lib/workbench";
import { appleCreativeAssets, appleInAppEventMedia, appleInAppEventMediaSource, appleScreenshotClasses, appleScreenshotSource, appleCreativeSource, formatSize, googleGraphicsSource, googlePlayGraphics, type ScreenshotClass } from "@/lib/storeSpecs";

/** The closing action list every guide ends with. */
export function DoToday({ children }: { children: ReactNode }) {
  return <section className="do-today" aria-label="Do this today"><p className="micro-label">Do this today</p>{children}</section>;
}

/** A labeled, invented example. */
export function Example({ title, children }: { title?: string; children: ReactNode }) {
  return <aside className="example-block"><p className="micro-label">Example{title ? ` · ${title}` : ""}</p><div>{children}</div></aside>;
}

export function BeforeAfter({ before, after, note }: { before: ReactNode; after: ReactNode; note?: ReactNode }) {
  return <figure className="before-after">
    <div><p className="micro-label">Before</p><div>{before}</div></div>
    <div><p className="micro-label">After</p><div>{after}</div></div>
    {note && <figcaption>{note}</figcaption>}
  </figure>;
}

/** A copyable prompt for an AI assistant, with the checks a human still owns. */
export function AskAI({ prompt, checks }: { prompt: string; checks?: string[] }) {
  return <div className="ask-ai">
    <div className="ask-ai__head"><p className="micro-label">Prompt</p><CopyButton text={prompt} label="Copy prompt"/></div>
    <pre>{prompt}</pre>
    {checks?.length ? <div className="ask-ai__checks"><p className="micro-label">Before you use the answer</p><ul>{checks.map((check) => <li key={check}>{check}</li>)}</ul></div> : null}
  </div>;
}

function ScreenshotRows({ items }: { items: ScreenshotClass[] }) {
  return <>{items.map((item) => <tr key={item.id}><th scope="row"><Link href={`/screenshot-sizes/${item.id}/`}>{item.name}</Link>{item.required && <small className="required-tag">Required: {item.required}</small>}</th><td className="nowrap-cells">{item.sizes.map((size) => <span key={formatSize(size)}>{formatSize(size)}</span>)}</td></tr>)}</>;
}

export function AppleScreenshotTable({ devices = ["iPhone", "iPad"] }: { devices?: Array<ScreenshotClass["device"]> }) {
  const items = appleScreenshotClasses.filter((item) => devices.includes(item.device));
  return <div className="table-scroll" role="region" aria-label="Apple screenshot sizes" tabIndex={0}>
    <table><thead><tr><th scope="col">Display class</th><th scope="col">Portrait pixels (landscape swaps them)</th></tr></thead><tbody><ScreenshotRows items={items}/></tbody></table>
    <p className="table-source">Source: <a href={appleScreenshotSource}>Apple screenshot specifications</a>. 1–10 screenshots per size and language; JPEG or PNG; no transparency.</p>
  </div>;
}

export function AppleEventMediaTable() {
  return <div className="table-scroll" role="region" aria-label="In-app event media sizes" tabIndex={0}>
    <table><thead><tr><th scope="col">Placement</th><th scope="col">Type</th><th scope="col">Ratio</th><th scope="col">Pixels</th><th scope="col">Formats</th></tr></thead>
      <tbody>{appleInAppEventMedia.map((row) => <tr key={`${row.placement}-${row.kind}`}><th scope="row">{row.placement}</th><td>{row.kind}</td><td>{row.ratio}</td><td>{row.size}</td><td>{row.formats}</td></tr>)}</tbody></table>
    <p className="table-source">Source: <a href={appleInAppEventMediaSource}>Apple In-App Event media and audio specifications</a>. Card media is landscape; details page media is portrait.</p>
  </div>;
}

export function AppleCreativeTable() {
  return <div className="table-scroll" role="region" aria-label="Apple creative asset sizes" tabIndex={0}>
    <table><thead><tr><th scope="col">Placement</th><th scope="col">Type</th><th scope="col">Ratio</th><th scope="col">Pixels</th><th scope="col">Formats</th></tr></thead>
      <tbody>{appleCreativeAssets.map((row) => <tr key={`${row.placement}-${row.kind}-${row.ratio}`}><th scope="row">{row.placement}</th><td>{row.kind}</td><td>{row.ratio}</td><td>{row.size}</td><td>{row.formats}</td></tr>)}</tbody></table>
    <p className="table-source">Source: <a href={appleCreativeSource}>Apple creative assets specifications</a>. No transparency in images.</p>
  </div>;
}

export function GooglePlayGraphicsTable() {
  return <div className="table-scroll" role="region" aria-label="Google Play graphic asset rules" tabIndex={0}>
    <table><thead><tr><th scope="col">Asset</th><th scope="col">Rule</th></tr></thead><tbody>{googlePlayGraphics.map((row) => <tr key={row.asset}><th scope="row">{row.asset}</th><td>{row.spec}</td></tr>)}</tbody></table>
    <p className="table-source">Source: <a href={googleGraphicsSource}>Google Play graphic assets</a>. Check the upload screen in Play Console before delivery.</p>
  </div>;
}

/** A disclosed link to another site by the same author (see docs/EDITORIAL.md, First-party disclosure). */
export function AlsoBy({ href, title, children }: { href: string; title: string; children: ReactNode }) {
  return <aside className="also-by-block"><p className="micro-label">Also by the author</p><p><a href={href}>{title} ↗</a> {children}</p></aside>;
}

/** An Apple keyword field example with its byte count measured, never typed by hand. */
export function KeywordField({ value, note }: { value: string; note?: ReactNode }) {
  const bytes = utf8Bytes(value);
  const terms = keywordTokens(value).length;
  return <span className="keyword-field">
    <code>{value}</code>
    <span className="keyword-field__meter" role="img" aria-label={`${bytes} of 100 bytes`}><i style={{ width: `${Math.min(bytes, 100)}%` }} className={bytes > 100 ? "over" : undefined}/></span>
    <span className="keyword-field__count"><strong>{bytes}/100 bytes</strong> · {terms} term{terms === 1 ? "" : "s"}{note ? <>. {note}</> : null}</span>
  </span>;
}
