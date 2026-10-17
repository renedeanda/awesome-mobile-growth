import { formatSize } from "@/lib/storeSpecs";

type Size = [number, number];
const radius: Record<string, number> = { iPhone: 0.13, iPad: 0.05, Mac: 0.02, "Apple TV": 0.01, "Apple Vision Pro": 0.1, "Apple Watch": 0.24, "Google Play": 0.1 };

/**
 * Accepted screenshot sizes drawn to true relative scale, so a 1398 × 2034 Duo outer display sits visibly
 * smaller than its 2007 × 2853 inner one. Shapes are generic outlines, not device art.
 */
export function DeviceSilhouettes({ sizes, device, compact = false }: { sizes: Size[]; device: string; compact?: boolean }) {
  const shown = compact ? [sizes.reduce((best, size) => size[0] * size[1] > best[0] * best[1] ? size : best)] : sizes;
  const height = compact ? 34 : 132;
  const longest = Math.max(...shown.map(([w, h]) => Math.max(w, h)));
  const scale = height / longest;
  const gap = compact ? 0 : 18;
  const boxes = shown.map(([w, h]) => ({ w: w * scale, h: h * scale, label: formatSize([w, h]) }));
  const width = boxes.reduce((sum, box) => sum + box.w, 0) + gap * (boxes.length - 1);
  const labelSpace = compact ? 0 : 22;
  let x = 0;
  return <svg className={`silhouettes${compact ? " silhouettes--compact" : ""}`} viewBox={`-2 -2 ${width + 4} ${height + labelSpace + 4}`} width={compact ? undefined : Math.min(width + 4, 640)} role="img" aria-label={`${device} screenshot sizes to scale: ${shown.map((size) => formatSize(size)).join(", ")} pixels`}>
    {boxes.map((box) => {
      const r = Math.min(box.w, box.h) * (radius[device] ?? 0.08);
      const node = <g key={box.label} transform={`translate(${x} ${height - box.h})`}>
        <rect width={box.w} height={box.h} rx={r} ry={r}/>
        {!compact && <text x={box.w / 2} y={box.h + 16} textAnchor="middle">{box.label.replace(" × ", "×")}</text>}
      </g>;
      x += box.w + gap;
      return node;
    })}
  </svg>;
}
