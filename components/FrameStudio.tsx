"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DragEvent, useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { cropShare, frameFileName, frameTargets, getTarget, largestSize, layoutFrame, playRuleCheck, styleLabels, wordCount, type FrameStyle, type Size } from "@/lib/frames";
import { drawFrame, type Background, type DeviceTone, type FrameImage, type FrameSettings } from "@/lib/frameCanvas";
import { setHandoffFrames } from "@/lib/frameHandoff";
import { encodeRgbPng } from "@/lib/png";
import { zip } from "@/lib/zip";
import { formatSize } from "@/lib/storeSpecs";
import { specPath } from "@/lib/specPages";

// Uploaded screenshots are decoded into ImageBitmaps in this tab. They are never stored or sent anywhere.
type Shot = { id: number; image: ImageBitmap; caption: string };
type Format = "png" | "jpg";

const MAX_BYTES = 30 * 1024 * 1024;
const THUMB = 420;
let nextId = 1;

function FramePreview({ settings, caption, image, label }: { settings: FrameSettings; caption: string; image?: FrameImage; label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;
    const [w, h] = settings.size;
    const scale = THUMB / Math.max(w, h);
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    drawFrame(ctx, settings, caption, image);
  }, [settings, caption, image]);
  return <canvas ref={ref} className="frame-canvas" role="img" aria-label={label}/>;
}

// One canvas is reused for every frame in an export and released afterwards: iOS Safari caps total
// canvas memory, and ten 13-inch iPad frames on separate canvases would exceed it.
async function renderFull(canvas: HTMLCanvasElement, settings: FrameSettings, caption: string, image: FrameImage, format: Format) {
  const [w, h] = settings.size;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("This browser can’t draw the frame.");
  drawFrame(ctx, settings, caption, image);
  if (format === "jpg") {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
    if (!blob) throw new Error("Couldn’t encode the JPEG.");
    return blob;
  }
  const png = await encodeRgbPng(ctx.getImageData(0, 0, w, h).data, w, h);
  return new Blob([png as BlobPart], { type: "image/png" });
}

function save(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export function FrameStudio() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [targetId, setTargetId] = useState("iphone-dynamic-island-medium");
  const target = getTarget(targetId) ?? frameTargets[0];
  const [sizeKey, setSizeKey] = useState(formatSize(largestSize(target)));
  const [landscape, setLandscape] = useState(false);
  const [style, setStyle] = useState<FrameStyle>(target.styles[0]);
  const [background, setBackground] = useState<Background>({ mode: "gradient", from: "#1d5bd8", to: "#0c2766", angle: 180 });
  const [textColor, setTextColor] = useState("#ffffff");
  const [tone, setTone] = useState<DeviceTone>("dark");
  const [format, setFormat] = useState<Format>("png");
  const [shots, setShots] = useState<Shot[]>([]);
  const [bulk, setBulk] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  // The settings and frame list an export was made from; the handoff button shows only while both still match.
  const [exportedFrom, setExportedFrom] = useState<{ settings: FrameSettings; shots: Shot[] } | null>(null);
  const [dragging, setDragging] = useState(false);

  const chooseTarget = (id: string) => {
    const next = getTarget(id);
    if (!next) return;
    setTargetId(next.id);
    setSizeKey(formatSize(largestSize(next)));
    setStyle(next.styles[0]);
    if (!next.rotatable) setLandscape(false);
  };

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("class");
    if (requested && getTarget(requested)) chooseTarget(requested);
    setReady(true);
  }, []);

  // Free decoded images when they leave the list or the page closes.
  const shotsRef = useRef(shots);
  shotsRef.current = shots;
  useEffect(() => () => shotsRef.current.forEach((shot) => shot.image.close()), []);

  const base = target.sizes.find((size) => formatSize(size) === sizeKey) ?? largestSize(target);
  const [width, height] = landscape ? [base[1], base[0]] : base;
  const size: Size = useMemo(() => [width, height], [width, height]);
  // Stable unless a setting changes, so editing one caption redraws only that frame's preview.
  const settings: FrameSettings = useMemo(() => ({ size, style, background, textColor, tone }), [size, style, background, textColor, tone]);
  const playProblems = target.store === "google-play" ? playRuleCheck(size) : [];

  const addFiles = async (files: File[]) => {
    const room = target.maxFrames - shots.length;
    const images = files.filter((file) => file.type.startsWith("image/"));
    const skipped = files.length - images.length;
    const accepted = images.filter((file) => file.size <= MAX_BYTES).slice(0, Math.max(0, room));
    const added: Shot[] = [];
    for (const file of accepted) {
      try { added.push({ id: nextId++, image: await createImageBitmap(file), caption: "" }); } catch { /* not a decodable image */ }
    }
    if (added.length && !shots.length) trackEvent("tool_started", { tool_id: "screenshot-frames", platform: target.store });
    setShots((current) => [...current, ...added]);
    const notes = [`Added ${added.length} screenshot${added.length === 1 ? "" : "s"}.`];
    if (images.length > accepted.length) notes.push(`${target.name} takes up to ${target.maxFrames}, and files must be under ${MAX_BYTES / 1024 / 1024} MB.`);
    if (skipped || added.length < accepted.length) notes.push("Some files weren’t images this browser can read.");
    setStatus(notes.join(" "));
  };

  const updateShot = (id: number, caption: string) => setShots((current) => current.map((shot) => shot.id === id ? { ...shot, caption } : shot));
  const removeShot = (id: number) => { shots.find((shot) => shot.id === id)?.image.close(); setShots((current) => current.filter((shot) => shot.id !== id)); };
  const moveShot = (index: number, by: number) => setShots((current) => {
    const next = [...current];
    const [item] = next.splice(index, 1);
    next.splice(index + by, 0, item);
    return next;
  });
  const applyBulk = () => {
    const lines = bulk.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    setShots((current) => current.map((shot, index) => lines[index] !== undefined ? { ...shot, caption: lines[index] } : shot));
    setStatus(`Applied ${Math.min(lines.length, shots.length)} caption${lines.length === 1 ? "" : "s"}.`);
  };

  const onDrop = (event: DragEvent) => { event.preventDefault(); setDragging(false); void addFiles([...event.dataTransfer.files]); };

  const exportAll = async () => {
    const list = shots.slice(0, target.maxFrames);
    if (!list.length) return;
    setBusy(true);
    setStatus(`Exporting ${list.length} frame${list.length === 1 ? "" : "s"} at ${formatSize(size)}…`);
    try {
      const blobs: Blob[] = [];
      const canvas = document.createElement("canvas");
      try {
        for (const shot of list) blobs.push(await renderFull(canvas, settings, shot.caption, shot.image, format));
      } finally {
        canvas.width = canvas.height = 0;
      }
      const names = blobs.map((_, index) => frameFileName(target.id, size, index, format));
      if (blobs.length === 1) save(blobs[0], names[0]);
      else save(zip(await Promise.all(blobs.map(async (blob, index) => ({ name: names[index], data: new Uint8Array(await blob.arrayBuffer()) })))), `${target.id}-${size[0]}x${size[1]}.zip`);
      setHandoffFrames(blobs);
      setExportedFrom({ settings, shots });
      trackEvent("tool_completed", { tool_id: "screenshot-frames", format, platform: target.store });
      setStatus(`Saved ${blobs.length} frame${blobs.length === 1 ? "" : "s"} at ${formatSize(size)} pixels, ${format === "png" ? "24-bit PNG" : "JPEG"} with no transparency.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Export failed. Try fewer or smaller screenshots.");
    } finally {
      setBusy(false);
    }
  };

  const exportCount = Math.min(shots.length, target.maxFrames);
  const specLink = target.store === "google-play" ? specPath("google-play") : specPath(target.id);
  const apple = frameTargets.filter((item) => item.store === "apple");

  return <div className="tool-panel frame-studio" data-testid="frame-studio" data-ready={ready}>
    <div className="frame-studio__setup">
      <label className="field"><span className="field-label">Store slot</span>
        <select value={target.id} onChange={(event) => chooseTarget(event.target.value)}>
          <optgroup label="App Store">{apple.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</optgroup>
          <optgroup label="Google Play">{frameTargets.filter((item) => item.store === "google-play").map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</optgroup>
        </select>
      </label>
      <label className="field"><span className="field-label">Export size</span>
        <select value={formatSize(base)} onChange={(event) => setSizeKey(event.target.value)}>
          {target.sizes.map((item) => <option key={formatSize(item)} value={formatSize(item)}>{formatSize(item)}{formatSize(item) === formatSize(largestSize(target)) ? " (largest)" : ""}</option>)}
        </select>
      </label>
      {target.rotatable && <div className="field"><span className="field-label">Orientation</span><div className="segmented" role="group" aria-label="Orientation"><button type="button" aria-pressed={!landscape} onClick={() => setLandscape(false)}>Portrait</button><button type="button" aria-pressed={landscape} onClick={() => setLandscape(true)}>Landscape</button></div></div>}
      <label className="field"><span className="field-label">Device frame</span>
        <select value={style} onChange={(event) => setStyle(event.target.value as FrameStyle)}>{target.styles.map((item) => <option key={item} value={item}>{styleLabels[item]}</option>)}</select>
      </label>
      {style !== "none" && <div className="field"><span className="field-label">Device color</span><div className="segmented" role="group" aria-label="Device color"><button type="button" aria-pressed={tone === "dark"} onClick={() => setTone("dark")}>Dark</button><button type="button" aria-pressed={tone === "light"} onClick={() => setTone("light")}>Light</button></div></div>}
      <div className="field"><span className="field-label">Background</span><div className="segmented" role="group" aria-label="Background"><button type="button" aria-pressed={background.mode === "gradient"} onClick={() => setBackground((b) => ({ ...b, mode: "gradient" }))}>Gradient</button><button type="button" aria-pressed={background.mode === "solid"} onClick={() => setBackground((b) => ({ ...b, mode: "solid" }))}>Solid</button></div>
        <div className="frame-studio__colors">
          <label><input type="color" value={background.from} onChange={(event) => setBackground((b) => ({ ...b, from: event.target.value }))}/><span>{background.mode === "solid" ? "Color" : "Start"}</span></label>
          {background.mode === "gradient" && <label><input type="color" value={background.to} onChange={(event) => setBackground((b) => ({ ...b, to: event.target.value }))}/><span>End</span></label>}
          <label><input type="color" value={textColor} onChange={(event) => setTextColor(event.target.value)}/><span>Caption</span></label>
        </div>
        {background.mode === "gradient" && <label className="frame-studio__range"><span>Angle {background.angle}°</span><input type="range" min={0} max={360} step={15} value={background.angle} onChange={(event) => setBackground((b) => ({ ...b, angle: Number(event.target.value) }))}/></label>}
      </div>
    </div>

    <p className="frame-studio__spec">Exports at exactly <strong>{formatSize(size)}</strong> pixels with no transparency. <Link href={specLink}>{target.name} size rules</Link>.{playProblems.map((problem) => ` ${problem}`)}</p>

    <label className={`frame-drop${dragging ? " frame-drop--active" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}>
      <input type="file" accept="image/*" multiple onChange={(event) => { void addFiles([...(event.target.files ?? [])]); event.target.value = ""; }}/>
      <strong>Add screenshots</strong>
      <span>Drop raw captures here or choose files. Up to {target.maxFrames}. They stay in this tab and are never uploaded.</span>
    </label>

    {status && <p className="notice" role="status">{status}</p>}

    <div className={`frame-grid${size[0] > size[1] ? " frame-grid--landscape" : ""}`}>
      {shots.length === 0 && <figure className="frame-card"><FramePreview settings={settings} caption="Your caption goes here" label="Sample frame"/><figcaption>Sample frame. Add screenshots to make your own.</figcaption></figure>}
      {shots.map((shot, index) => <figure className="frame-card" key={shot.id}>
        <FramePreview settings={settings} caption={shot.caption} image={shot.image} label={`Frame ${index + 1}${shot.caption ? `: ${shot.caption}` : ""}`}/>
        <figcaption>
          <label className="field"><span className="field-label">Frame {index + 1} caption{index >= target.maxFrames && <small className="over">not exported</small>}</span><textarea rows={2} value={shot.caption} onChange={(event) => updateShot(shot.id, event.target.value)} placeholder="One idea, a few words"/><CaptionLength text={shot.caption}/></label>
          <CropNote settings={settings} image={shot.image}/>
          <div className="frame-card__actions">
            <button type="button" onClick={() => moveShot(index, -1)} disabled={index === 0} aria-label={`Move frame ${index + 1} earlier`}>←</button>
            <button type="button" onClick={() => moveShot(index, 1)} disabled={index === shots.length - 1} aria-label={`Move frame ${index + 1} later`}>→</button>
            <button type="button" onClick={() => removeShot(shot.id)}>Remove</button>
          </div>
        </figcaption>
      </figure>)}
    </div>

    {shots.length > 0 && <details className="frame-studio__bulk">
      <summary>Paste captions, one per line</summary>
      <label className="field"><span className="field-label">Captions</span><textarea rows={5} value={bulk} onChange={(event) => setBulk(event.target.value)} placeholder={"Know what worked on every roll\nLog each frame in one tap\nMeter light with your phone camera"}/></label>
      <button type="button" className="button-secondary" onClick={applyBulk}>Apply to frames in order</button>
    </details>}

    <div className="frame-studio__export">
      <div className="segmented" role="group" aria-label="File format"><button type="button" aria-pressed={format === "png"} onClick={() => setFormat("png")}>PNG</button><button type="button" aria-pressed={format === "jpg"} onClick={() => setFormat("jpg")}>JPEG</button></div>
      <button type="button" className="button" onClick={exportAll} disabled={!shots.length || busy || playProblems.length > 0}>{busy ? "Exporting…" : exportCount ? `Export ${exportCount} frame${exportCount === 1 ? "" : "s"}` : "Export frames"}</button>
      {exportedFrom?.settings === settings && exportedFrom.shots === shots && <button type="button" className="button-secondary" onClick={() => router.push("/workbench/?from=frames")}>See them in the Store preview</button>}
    </div>
    <p className="tool-caveat">Frames are generic device shapes drawn in code, not replicas of any model. Apple’s App Review Guidelines (2.3.3) ask for screenshots that show the app in use, so put real screens inside them.</p>
  </div>;
}

function CaptionLength({ text }: { text: string }) {
  const words = wordCount(text);
  if (!words) return null;
  return <small className={`frame-card__words${words > 7 ? " over" : ""}`}>{words} word{words === 1 ? "" : "s"}{words > 7 ? " · aim for 7 or fewer so it reads at thumbnail size" : ""}</small>;
}

function CropNote({ settings, image }: { settings: FrameSettings; image: FrameImage }) {
  const screen = layoutFrame(settings.size, settings.style, null, image.width / image.height).screen;
  const share = cropShare(image.width / image.height, screen);
  if (share <= 0.12) return null;
  const shape = screen.w > screen.h ? "landscape" : "portrait";
  return <p className="frame-card__crop" role="note">About {Math.round(share * 100)}% of this capture is cropped. Use a {shape} capture{settings.style === "none" ? "" : ", or pick No device frame to pad it"}.</p>;
}
