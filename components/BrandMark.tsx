// The site's mark: an "A" with an app badge. One drawing for the favicon, Home Screen icons, header and social cards.
// Plain SVG elements only, so Satori (ImageResponse) can render it too.
export const brand = { blue: "#1557d6", paper: "#f8f5ed", coral: "#ff7651" };

type Props = {
  size: number;
  /** Corner radius as a share of the size: 0 for full-bleed icons the OS masks itself. */
  radius?: number;
  /** Shrinks the glyph toward the centre, for maskable icons whose edges may be cropped. */
  inset?: number;
};

export function BrandMark({ size, radius = 0.22, inset = 0 }: Props) {
  const scale = 1 - inset * 2, shift = 32 * inset * 2;
  return <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="64" height="64" rx={64 * radius} fill={brand.blue}/>
    <g transform={`translate(${shift} ${shift}) scale(${scale})`}>
      <path d="M13 51 27.5 13h9L51 51H40.6l-2.8-8H26.2l-2.8 8Zm16.1-16.5h5.8L32 25.9Z" fill={brand.paper}/>
      <circle cx="50" cy="14" r="8.5" fill={brand.coral} stroke={brand.blue} strokeWidth="3.5"/>
    </g>
  </svg>;
}
