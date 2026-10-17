// Renders a social card with the site's vendored Geist fonts (assets/fonts, OFL), so weights and glyphs don't
// depend on fetching fonts at build time.
import fs from "node:fs";
import path from "node:path";
import type { ReactElement } from "react";
import { ImageResponse } from "next/og";

const font = (file: string) => fs.readFileSync(path.join(process.cwd(), "assets/fonts", file));

export function cardImage(card: ReactElement) {
  return new ImageResponse(card, {
    width: 1200, height: 630,
    fonts: [
      { name: "Geist", data: font("Geist-Regular.ttf"), weight: 400, style: "normal" },
      { name: "Geist", data: font("Geist-Bold.ttf"), weight: 700, style: "normal" },
      { name: "Geist Mono", data: font("GeistMono-Medium.ttf"), weight: 500, style: "normal" },
    ],
  });
}
