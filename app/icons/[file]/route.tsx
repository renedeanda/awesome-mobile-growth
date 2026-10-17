import { ImageResponse } from "next/og";
import { BrandMark, FramesMark } from "@/components/BrandMark";

export const dynamic = "force-static";
export const dynamicParams = false;

// PNG icons for the manifest and iOS. Maskable icons keep the glyph inside the 80% safe zone Android crops to;
// iOS rounds Home Screen icons itself and shows transparency as black, so its icon is square and full-bleed.
const icons: Record<string, { size: number; radius: number; inset: number; mark?: "frames" }> = {
  "apple-touch-icon.png": { size: 180, radius: 0, inset: 0.06 },
  "192.png": { size: 192, radius: 0.22, inset: 0 },
  "512.png": { size: 512, radius: 0.22, inset: 0 },
  "maskable-512.png": { size: 512, radius: 0, inset: 0.16 },
  // Manifest shortcut icon for the Frame studio.
  "frames-192.png": { size: 192, radius: 0.22, inset: 0, mark: "frames" },
};

export function generateStaticParams() {
  return Object.keys(icons).map((file) => ({ file }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { size, radius, inset, mark } = icons[(await params).file];
  const glyph = mark === "frames" ? <FramesMark size={size} radius={radius}/> : <BrandMark size={size} radius={radius} inset={inset}/>;
  return new ImageResponse(glyph, { width: size, height: size });
}
