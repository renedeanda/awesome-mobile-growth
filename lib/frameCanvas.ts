// Draws one studio frame onto a 2D canvas. Shared by the preview thumbnails and the export,
// so what you see is what you upload. Browser-only (uses CanvasRenderingContext2D).
import { fitCaption, layoutFrame, type FrameLayout, type FrameStyle, type Rect, type Size } from "./frames.ts";

export type Background = { mode: "solid" | "gradient"; from: string; to: string; angle: number };
export type DeviceTone = "dark" | "light";
export type FrameSettings = { size: Size; style: FrameStyle; background: Background; textColor: string; tone: DeviceTone };

export const captionFont = (size: number) => `700 ${size}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
const tones = { dark: { body: "#1c1d21", rim: "#45474e" }, light: { body: "#e6e6e9", rim: "#b4b5bb" } };
const glass = "#050506";

function fillBackground(ctx: CanvasRenderingContext2D, [w, h]: Size, background: Background) {
  if (background.mode === "solid") { ctx.fillStyle = background.from; ctx.fillRect(0, 0, w, h); return; }
  // Same geometry as a CSS linear-gradient: 180° runs top to bottom.
  const angle = (background.angle * Math.PI) / 180;
  const half = (Math.abs(w * Math.sin(angle)) + Math.abs(h * Math.cos(angle))) / 2;
  const dx = Math.sin(angle) * half, dy = -Math.cos(angle) * half;
  const gradient = ctx.createLinearGradient(w / 2 - dx, h / 2 - dy, w / 2 + dx, h / 2 + dy);
  gradient.addColorStop(0, background.from);
  gradient.addColorStop(1, background.to);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
}

function rounded(ctx: CanvasRenderingContext2D, rect: Rect, radius: number) {
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y, rect.w, rect.h, Math.max(0, Math.min(radius, rect.w / 2, rect.h / 2)));
}

function drawCover(ctx: CanvasRenderingContext2D, image: CanvasImageSource & { width: number; height: number }, rect: Rect) {
  const scale = Math.max(rect.w / image.width, rect.h / image.height);
  const w = image.width * scale, h = image.height * scale;
  // Anchor to the top: status bars and headlines matter more than the bottom edge.
  ctx.drawImage(image, rect.x + (rect.w - w) / 2, rect.y, w, h);
}

/** Runs draw() in the device's own portrait coordinates, rotated onto its side for landscape canvases. */
function inPortrait(ctx: CanvasRenderingContext2D, layout: FrameLayout, draw: (screen: Rect, width: number) => void) {
  const body = layout.body!;
  ctx.save();
  if (layout.rotated) {
    ctx.translate(body.x + body.w, body.y);
    ctx.rotate(Math.PI / 2);
    draw({ x: layout.screen.y - body.y, y: body.x + body.w - (layout.screen.x + layout.screen.w), w: layout.screen.h, h: layout.screen.w }, body.h);
  } else {
    ctx.translate(body.x, body.y);
    draw({ x: layout.screen.x - body.x, y: layout.screen.y - body.y, w: layout.screen.w, h: layout.screen.h }, body.w);
  }
  ctx.restore();
}

function drawBezelDetails(ctx: CanvasRenderingContext2D, style: FrameStyle, layout: FrameLayout, tone: DeviceTone) {
  const colors = tones[tone];
  inPortrait(ctx, layout, (screen, width) => {
    const cx = screen.x + screen.w / 2;
    if (style === "home-button") {
      const bottom = screen.y + screen.h, bezel = (layout.rotated ? layout.body!.w : layout.body!.h) - bottom;
      ctx.beginPath(); ctx.arc(cx, bottom + bezel / 2, width * 0.075, 0, Math.PI * 2);
      ctx.lineWidth = width * 0.006; ctx.strokeStyle = colors.rim; ctx.stroke();
      ctx.beginPath(); ctx.roundRect(cx - width * 0.08, screen.y / 2 - width * 0.008, width * 0.16, width * 0.016, width * 0.008);
      ctx.fillStyle = colors.rim; ctx.fill();
    }
    if (style === "ipad") { ctx.beginPath(); ctx.arc(cx, screen.y / 2, width * 0.008, 0, Math.PI * 2); ctx.fillStyle = colors.rim; ctx.fill(); }
    if (style === "mac") {
      ["#ff5f57", "#febc2e", "#28c840"].forEach((color, index) => { ctx.beginPath(); ctx.arc(screen.x + width * (0.018 + index * 0.016), screen.y / 2, width * 0.0055, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); });
    }
  });
}

function drawScreenDetails(ctx: CanvasRenderingContext2D, style: FrameStyle, layout: FrameLayout) {
  inPortrait(ctx, layout, (screen) => {
    const cx = screen.x + screen.w / 2;
    ctx.fillStyle = glass;
    if (style === "dynamic-island") { ctx.beginPath(); ctx.roundRect(cx - screen.w * 0.155, screen.y + screen.w * 0.027, screen.w * 0.31, screen.w * 0.092, screen.w * 0.046); ctx.fill(); }
    if (style === "face-id") { ctx.beginPath(); ctx.roundRect(cx - screen.w * 0.27, screen.y - 1, screen.w * 0.54, screen.w * 0.078, [0, 0, screen.w * 0.05, screen.w * 0.05]); ctx.fill(); }
    if (style === "android") { ctx.beginPath(); ctx.arc(cx, screen.y + screen.w * 0.045, screen.w * 0.024, 0, Math.PI * 2); ctx.fill(); }
  });
}

export type FrameImage = CanvasImageSource & { width: number; height: number };

export function drawFrame(ctx: CanvasRenderingContext2D, settings: FrameSettings, caption: string, image?: FrameImage) {
  const { size, style, tone } = settings;
  const measure = (text: string, fontSize: number) => { ctx.font = captionFont(fontSize); return ctx.measureText(text).width; };
  const layout = layoutFrame(size, style, fitCaption(caption, size, measure), image ? image.width / image.height : undefined);
  ctx.save();
  fillBackground(ctx, size, settings.background);

  if (layout.caption) {
    ctx.font = captionFont(layout.caption.fontSize);
    ctx.fillStyle = settings.textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    layout.caption.lines.forEach((line, index) => ctx.fillText(line, layout.caption!.x, layout.caption!.y + index * layout.caption!.lineHeight));
  }

  if (layout.body) {
    const unit = Math.min(layout.body.w, layout.body.h);
    ctx.save();
    ctx.shadowColor = "rgb(0 0 0 / 28%)";
    ctx.shadowBlur = unit * 0.06;
    ctx.shadowOffsetY = unit * 0.02;
    rounded(ctx, layout.body, layout.bodyRadius);
    ctx.fillStyle = tones[tone].body;
    ctx.fill();
    ctx.restore();
    rounded(ctx, layout.body, layout.bodyRadius);
    ctx.lineWidth = Math.max(1, unit * 0.006);
    ctx.strokeStyle = tones[tone].rim;
    ctx.stroke();
    drawBezelDetails(ctx, style, layout, tone);
  }

  ctx.save();
  rounded(ctx, layout.screen, layout.screenRadius);
  ctx.clip();
  if (image) { ctx.fillStyle = glass; ctx.fill(); drawCover(ctx, image, layout.screen); }
  else {
    ctx.fillStyle = "rgb(255 255 255 / 16%)";
    ctx.fill();
    ctx.fillStyle = settings.textColor;
    ctx.globalAlpha = 0.7;
    ctx.font = captionFont(Math.round(layout.screen.w * 0.07));
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Your screenshot", layout.screen.x + layout.screen.w / 2, layout.screen.y + layout.screen.h / 2);
  }
  ctx.restore();
  if (layout.body) drawScreenDetails(ctx, style, layout);
  ctx.restore();
}
