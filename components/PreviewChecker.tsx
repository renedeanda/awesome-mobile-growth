"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { checkPreview, type CheckRow, type VideoFacts } from "@/lib/previews";
import { appPreviewClasses, appPreviewRules, appPreviewSource } from "@/lib/storeSpecs";

type FrameVideo = HTMLVideoElement & { requestVideoFrameCallback?: (callback: (now: number, meta: { mediaTime: number; presentedFrames: number }) => void) => number };

/** Plays the muted video briefly and counts presented frames. Undefined where the browser can't report them. */
function measureFps(video: FrameVideo): Promise<number | undefined> {
  if (!video.requestVideoFrameCallback) return Promise.resolve(undefined);
  return new Promise((resolve) => {
    let first: { time: number; frames: number } | undefined;
    const done = (value: number | undefined) => { video.pause(); video.currentTime = 0; resolve(value); };
    const timeout = window.setTimeout(() => done(undefined), 4000);
    const onFrame = (_now: number, meta: { mediaTime: number; presentedFrames: number }) => {
      if (!first) first = { time: meta.mediaTime, frames: meta.presentedFrames };
      const elapsed = meta.mediaTime - first.time;
      if (elapsed >= 1) { window.clearTimeout(timeout); done((meta.presentedFrames - first.frames) / elapsed); return; }
      video.requestVideoFrameCallback?.(onFrame);
    };
    video.requestVideoFrameCallback(onFrame);
    video.play().catch(() => { window.clearTimeout(timeout); done(undefined); });
  });
}

/** Reads a video locally and checks it against Apple's app preview specification. Nothing is uploaded. */
export function PreviewChecker() {
  const [classId, setClassId] = useState("iphone-dynamic-island-medium");
  const [url, setUrl] = useState("");
  const [facts, setFacts] = useState<VideoFacts | null>(null);
  const [status, setStatus] = useState("");
  const [dragging, setDragging] = useState(false);
  const pending = useRef<File | null>(null);
  const previewClass = appPreviewClasses.find((item) => item.id === classId) ?? appPreviewClasses[0];
  const rows: CheckRow[] = facts ? checkPreview(facts, previewClass) : [];

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("class");
    if (requested && appPreviewClasses.some((item) => item.id === requested)) setClassId(requested);
  }, []);
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  const open = (file: File | undefined) => {
    if (!file) return;
    // Clear the last video's results first, so a rejected file never sits above another file's checks.
    setFacts(null);
    if (!file.type.startsWith("video/") && !/\.(mov|m4v|mp4)$/i.test(file.name)) { setUrl(""); setStatus("That isn't a video file."); return; }
    pending.current = file;
    setStatus("Reading the video…");
    setUrl(URL.createObjectURL(file));
  };

  const onLoaded = async (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget as FrameVideo;
    const file = pending.current;
    const base: VideoFacts = { width: video.videoWidth, height: video.videoHeight, seconds: video.duration, bytes: file?.size, name: file?.name };
    setFacts(base);
    setStatus("Measuring the frame rate…");
    const fps = await measureFps(video);
    setFacts({ ...base, fps });
    setStatus("");
    trackEvent("preview_checked", { class_id: classId });
  };

  return <div className="preview-checker">
    <label className="field"><span className="field-label">Display class</span>
      <select value={classId} onChange={(event) => setClassId(event.target.value)}>{appPreviewClasses.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
    </label>
    <p className="frame-studio__spec">Accepted: <strong>{[...previewClass.portrait, ...previewClass.landscape].map(([w, h]) => `${w} × ${h}`).join(", ")}</strong>, {appPreviewRules.seconds[0]}–{appPreviewRules.seconds[1]} seconds, up to {appPreviewRules.maxFps} fps and {appPreviewRules.maxMegabytes} MB. <a href={appPreviewSource}>Apple's specification</a>.{previewClass.fallback ? ` If you skip this class, Apple scales down previews from ${previewClass.fallback}.` : ""}</p>
    <label className={`frame-drop${dragging ? " frame-drop--active" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); open(event.dataTransfer.files[0]); }}>
      <input type="file" accept="video/*,.mov,.m4v,.mp4" onChange={(event) => { open(event.target.files?.[0]); event.target.value = ""; }}/>
      <strong>Check a video</strong>
      <span>Drop or choose an exported preview. It's read in this tab and never uploaded.</span>
    </label>
    {status && <p className="notice" role="status">{status}</p>}
    {url && <video className="preview-checker__video" src={url} muted playsInline controls onLoadedMetadata={onLoaded} onError={() => setStatus("This browser can't read that video. Safari reads .mov files that other browsers can't.")}/>}
    {rows.length > 0 && <ul className="check-rows" aria-label="Preview checks">
      {rows.map((row) => <li key={row.label} data-status={row.status}><strong>{row.status === "pass" ? "Pass" : row.status === "fail" ? "Fix" : "Check"} · {row.label}</strong><span>{row.detail}</span></li>)}
    </ul>}
    <p className="tool-caveat">Design the preview in the <Link href="/store-page/app-previews/">app previews guide</Link>, and frame your screenshots in the <Link href="/tools/screenshot-frames/">frame studio</Link>.</p>
  </div>;
}
