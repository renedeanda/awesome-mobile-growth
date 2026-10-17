"use client";

import Link from "next/link";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { checkPlayAsset, guessKind, imageFormat, playAssetLabels, type ImageFacts, type PlayAssetKind } from "@/lib/playAssets";
import { googlePlayIcon } from "@/lib/storeSpecs";

type Checked = { id: string; name: string; url: string; facts: ImageFacts; kind: PlayAssetKind };

async function readImage(file: File): Promise<Omit<Checked, "id" | "kind">> {
  const head = imageFormat(new Uint8Array(await file.slice(0, 4096).arrayBuffer()));
  let { width, height } = head;
  if (width === undefined || height === undefined) {
    const bitmap = await createImageBitmap(file);
    width = bitmap.width; height = bitmap.height;
    bitmap.close();
  }
  return { name: file.name, url: URL.createObjectURL(file), facts: { width, height, format: head.format, alpha: head.alpha, bitDepth: head.bitDepth, bytes: file.size } };
}

/** Checks Google Play icons, feature graphics and screenshots in the browser. Nothing is uploaded. */
export function PlayAssetChecker() {
  const [items, setItems] = useState<Checked[]>([]);
  const [status, setStatus] = useState("");
  const [dragging, setDragging] = useState(false);

  const add = async (files: File[]) => {
    const images = files.filter((file) => file.type.startsWith("image/") || /\.(png|jpe?g)$/i.test(file.name));
    if (!images.length) { setStatus("Choose PNG or JPEG images."); return; }
    setStatus("");
    const read = await Promise.all(images.map(async (file) => {
      try { const image = await readImage(file); return { ...image, id: `${file.name}-${file.lastModified}-${Math.random()}`, kind: guessKind(image.facts) }; }
      catch { return null; }
    }));
    const ok = read.filter((item): item is Checked => item !== null);
    if (ok.length < images.length) setStatus("Some files couldn't be read as images.");
    setItems((current) => [...ok, ...current]);
    trackEvent("play_assets_checked", { count: ok.length });
  };

  return <div className="preview-checker">
    <p className="frame-studio__spec">App icon: <strong>{googlePlayIcon.size} × {googlePlayIcon.size}</strong>, {googlePlayIcon.format}, up to {googlePlayIcon.maxKilobytes} KB (<a href={googlePlayIcon.source}>Google&apos;s icon specification</a>). Feature graphic: <strong>1024 × 500</strong>, no transparency. Screenshots: each side 320–3840 px, long side at most twice the short side.</p>
    <label className={`frame-drop${dragging ? " frame-drop--active" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); void add([...event.dataTransfer.files]); }}>
      <input type="file" accept="image/png,image/jpeg" multiple onChange={(event) => { void add([...(event.target.files ?? [])]); event.target.value = ""; }}/>
      <strong>Check Play images</strong>
      <span>Drop an icon, a feature graphic or screenshots. They&apos;re read in this tab and never uploaded.</span>
    </label>
    {status && <p className="notice" role="status">{status}</p>}
    {items.map((item) => <section key={item.id} className="asset-result" aria-label={`Checks for ${item.name}`}>
      <div className="asset-result__head">
        <img src={item.url} alt="" width={56} height={56}/>
        <div><strong>{item.name}</strong>
          <label>Check as <select value={item.kind} onChange={(event) => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, kind: event.target.value as PlayAssetKind } : entry))}>
            {(Object.keys(playAssetLabels) as PlayAssetKind[]).map((kind) => <option key={kind} value={kind}>{playAssetLabels[kind]}</option>)}
          </select></label>
        </div>
      </div>
      <ul className="check-rows">{checkPlayAsset(item.kind, item.facts).map((row) => <li key={row.label} data-status={row.status}><strong>{row.status === "pass" ? "Pass" : row.status === "fail" ? "Fix" : "Check"} · {row.label}</strong><span>{row.detail}</span></li>)}</ul>
    </section>)}
    <p className="tool-caveat">Make screenshots at Play&apos;s recommended sizes in the <Link href="/tools/screenshot-frames/">frame studio</Link>. The feature graphic and screenshot rules come from Play Console Help; confirm them there before launch.</p>
  </div>;
}
