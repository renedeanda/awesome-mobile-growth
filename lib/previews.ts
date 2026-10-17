// Checks a video's readable properties against Apple's app preview specification. Codec, bit rate and audio
// can't be read reliably in a browser, so they are listed for the reader to confirm, never guessed.
import { appPreviewRules, type PreviewClass } from "./storeSpecs.ts";

export type VideoFacts = { width: number; height: number; seconds: number; fps?: number; bytes?: number; name?: string };
export type CheckRow = { label: string; status: "pass" | "fail" | "check"; detail: string };

const size = ([w, h]: [number, number]) => `${w} × ${h}`;

/** The accepted size closest in shape and pixel count to the video, in the same orientation when possible. */
export function closestSize(width: number, height: number, previewClass: PreviewClass): [number, number] | undefined {
  const all = [...previewClass.portrait, ...previewClass.landscape];
  const sameShape = all.filter(([w, h]) => (w >= h) === (width >= height));
  const pool = sameShape.length ? sameShape : all;
  const score = ([w, h]: [number, number]) => Math.abs(Math.log((w / h) / (width / height))) * 10 + Math.abs(Math.log((w * h) / (width * height)));
  return [...pool].sort((a, b) => score(a) - score(b))[0];
}

export function checkPreview(video: VideoFacts, previewClass: PreviewClass): CheckRow[] {
  const rows: CheckRow[] = [];
  const accepted = [...previewClass.portrait, ...previewClass.landscape];
  const fits = accepted.some(([w, h]) => w === video.width && h === video.height);
  const closest = closestSize(video.width, video.height, previewClass);
  rows.push({
    label: "Resolution",
    status: fits ? "pass" : "fail",
    detail: fits ? `${size([video.width, video.height])} is accepted for ${previewClass.name}.` : `${size([video.width, video.height])} isn't accepted for ${previewClass.name}.${closest ? ` Export at ${size(closest)}.` : ""}`,
  });
  const [min, max] = appPreviewRules.seconds;
  const seconds = Math.round(video.seconds * 10) / 10;
  rows.push({
    label: "Length",
    status: seconds >= min && seconds <= max ? "pass" : "fail",
    detail: seconds < min ? `${seconds} s is too short. Apple's minimum is ${min} seconds.` : seconds > max ? `${seconds} s is too long. Apple's maximum is ${max} seconds.` : `${seconds} s is within ${min}–${max} seconds.`,
  });
  rows.push(video.fps === undefined
    ? { label: "Frame rate", status: "check", detail: `Couldn't measure it in this browser. Apple's maximum is ${appPreviewRules.maxFps} fps.` }
    : { label: "Frame rate", status: video.fps <= appPreviewRules.maxFps + 0.5 ? "pass" : "fail", detail: `About ${Math.round(video.fps)} fps measured. Apple's maximum is ${appPreviewRules.maxFps} fps.` });
  if (video.bytes !== undefined) {
    const megabytes = video.bytes / 1_000_000;
    rows.push({ label: "File size", status: megabytes <= appPreviewRules.maxMegabytes ? "pass" : "fail", detail: `${megabytes.toFixed(1)} MB. Apple's maximum is ${appPreviewRules.maxMegabytes} MB.` });
  }
  if (video.name) {
    const extension = video.name.split(".").pop()?.toLowerCase() ?? "";
    rows.push({ label: "File type", status: (appPreviewRules.extensions as readonly string[]).includes(extension) ? "pass" : "fail", detail: `.${extension} file. Apple accepts .mov, .m4v and .mp4.` });
  }
  rows.push({ label: "Codec and audio", status: "check", detail: `Confirm in your export settings: ${appPreviewRules.formats}. ${appPreviewRules.audio}.` });
  return rows;
}
