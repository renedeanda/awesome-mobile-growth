// Text on platform chrome must pass WCAG AA in light and dark. Glass is translucent, so it is
// checked over the worst content behind it: pure black and pure white.
import assert from "node:assert/strict";
import fs from "node:fs";
import { describe, it } from "node:test";

const css = fs.readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const block = (start: number) => css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
const tokens = (text: string) => Object.fromEntries([...text.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()]));
const themes = {
  light: tokens(block(css.indexOf(":root {"))),
  dark: tokens(block(css.indexOf(":root {", css.indexOf("prefers-color-scheme: dark")))),
};

type RGB = [number, number, number];
const hex = (value: string): RGB => { const m = value.match(/^#([0-9a-f]{6})$/i); assert.ok(m, `expected a hex color, got ${value}`); return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)) as RGB; };
const rgba = (value: string) => { const m = value.match(/^rgb\((\d+) (\d+) (\d+) \/ (\d+)%\)$/); assert.ok(m, `expected rgb(r g b / a%), got ${value}`); return { rgb: [+m[1], +m[2], +m[3]] as RGB, alpha: +m[4] / 100 }; };
const over = ({ rgb, alpha }: { rgb: RGB; alpha: number }, behind: RGB): RGB => rgb.map((c, i) => c * alpha + behind[i] * (1 - alpha)) as RGB;
const luminance = (rgb: RGB) => { const [r, g, b] = rgb.map((c) => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a: RGB, b: RGB) => { const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };

for (const [theme, t] of Object.entries(themes)) describe(`${theme} platform chrome contrast`, () => {
  for (const content of [[0, 0, 0], [255, 255, 255]] as RGB[]) {
    const behind = content[0] ? "white" : "black";
    it(`Apple tab labels over glass on ${behind}`, () => {
      const glass = over(rgba(t["glass-tint"]), content);
      assert.ok(ratio(hex(t["glass-label"]), glass) >= 4.5);
      assert.ok(ratio(hex(t.blue), glass) >= 4.5);
    });
    it(`Apple sheet and dialog text over glass on ${behind}`, () => {
      const glass = over(rgba(t["glass-tint-strong"]), content);
      assert.ok(ratio(hex(t.ink), glass) >= 4.5);
      assert.ok(ratio(hex(t.muted), glass) >= 4.5);
    });
  }
  it("Android labels on tonal surfaces", () => {
    for (const surface of ["m3-surface", "m3-surface-high"]) for (const text of ["ink", "muted"]) assert.ok(ratio(hex(t[text]), hex(t[surface])) >= 4.5, `${text} on ${surface}`);
    assert.ok(ratio(hex(t.ink), hex(t["m3-indicator"])) >= 4.5);
  });
});
