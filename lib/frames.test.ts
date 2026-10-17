import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cropShare, fitCaption, frameFileName, frameTargets, getTarget, largestSize, layoutFrame, playRuleCheck, wordCount, wrapCaption, type FrameStyle, type Rect, type Size } from "./frames.ts";
import { appleScreenshotClasses, googlePlayScreenshotPresets } from "./storeSpecs.ts";

// Roughly how wide system sans text runs: about 0.55 em per character.
const measure = (text: string, size: number) => text.length * size * 0.55;
const inside = (inner: Rect, outer: Rect) => inner.x >= outer.x - 0.5 && inner.y >= outer.y - 0.5 && inner.x + inner.w <= outer.x + outer.w + 0.5 && inner.y + inner.h <= outer.y + outer.h + 0.5;

describe("frame studio targets", () => {
  it("covers every Apple class except Apple Watch, with sizes taken from storeSpecs", () => {
    for (const spec of appleScreenshotClasses) {
      const target = getTarget(spec.id);
      if (spec.device === "Apple Watch") assert.equal(target, undefined);
      else assert.deepEqual(target?.sizes, spec.sizes);
    }
  });
  it("exports Google Play at the presets, which pass Play's own rules", () => {
    assert.deepEqual(getTarget("google-play")?.sizes, googlePlayScreenshotPresets.map((preset) => preset.size));
    for (const preset of googlePlayScreenshotPresets) assert.deepEqual(playRuleCheck(preset.size), []);
  });
  it("defaults to the largest size in a class", () => assert.deepEqual(largestSize(getTarget("iphone-dynamic-island-large")!), [1320, 2868]));
  it("checks the Play aspect rule", () => {
    assert.deepEqual(playRuleCheck([1080, 2160]), []);
    assert.equal(playRuleCheck([1080, 2400]).length, 1);
    assert.equal(playRuleCheck([200, 300]).length, 1);
  });
  it("names files by class, size and position", () => assert.equal(frameFileName("ipad-13", [2064, 2752], 0, "png"), "ipad-13-2064x2752-01.png"));
});

describe("caption fitting", () => {
  it("wraps on words and keeps explicit line breaks", () => {
    assert.deepEqual(wrapCaption("Log each frame in one tap", 100, 10, measure), ["Log each frame in", "one tap"]);
    assert.deepEqual(wrapCaption("One\nTwo", 1000, 10, measure), ["One", "Two"]);
  });
  it("shrinks a long caption to at most three lines that fit the width", () => {
    const fit = fitCaption("Plan every launch, write every listing, and check every screenshot size before you upload", [1206, 2622], measure)!;
    assert.ok(fit.lines.length <= 3);
    assert.ok(fit.lines.every((line) => measure(line, fit.fontSize) <= 1206 * 0.84));
  });
  it("returns nothing for an empty caption", () => assert.equal(fitCaption("  ", [1206, 2622], measure), null));
});

describe("frame layout", () => {
  const cases: Array<[Size, FrameStyle]> = [[[1320, 2868], "dynamic-island"], [[2868, 1320], "dynamic-island"], [[1242, 2208], "home-button"], [[2208, 1242], "home-button"], [[2064, 2752], "ipad"], [[2880, 1800], "mac"], [[1080, 1920], "android"], [[1920, 1080], "android"], [[3840, 2160], "none"]];
  for (const [size, style] of cases) it(`keeps a ${style} frame inside ${size.join(" × ")}`, () => {
    const canvas = { x: 0, y: 0, w: size[0], h: size[1] };
    const layout = layoutFrame(size, style, fitCaption("Your words here", size, measure));
    assert.ok(inside(layout.screen, layout.body ?? canvas));
    if (layout.body) assert.ok(inside(layout.body, canvas));
    if (layout.caption) assert.ok(layout.screen.y > layout.caption.y + layout.caption.lines.length * layout.caption.lineHeight);
  });
  it("keeps the device screen's proportions", () => {
    const portrait = layoutFrame([1320, 2868], "dynamic-island", null);
    assert.ok(Math.abs(portrait.screen.w / portrait.screen.h - 1206 / 2622) < 0.001);
    const landscape = layoutFrame([2868, 1320], "dynamic-island", null);
    assert.ok(landscape.rotated);
    assert.ok(Math.abs(landscape.screen.h / landscape.screen.w - 1206 / 2622) < 0.001);
  });
  it("fills the canvas with no frame and no caption", () => assert.deepEqual(layoutFrame([1920, 1080], "none", null).screen, { x: 0, y: 0, w: 1920, h: 1080 }));
  it("pads a capture of another shape instead of cropping it", () => assert.deepEqual(layoutFrame([1080, 1920], "none", null, 1080 / 2400).screen, { x: 108, y: 0, w: 864, h: 1920 }));
  it("fills the canvas when the capture is within 2% of its shape", () => assert.deepEqual(layoutFrame([1206, 2622], "none", null, 1179 / 2556).screen, { x: 0, y: 0, w: 1206, h: 2622 }));
  it("measures how much of a capture a frame crops", () => {
    const landscape = layoutFrame([2868, 1320], "dynamic-island", null).screen;
    assert.ok(cropShare(1206 / 2622, landscape) > 0.5);
    assert.ok(cropShare(1206 / 2622, layoutFrame([1320, 2868], "dynamic-island", null).screen) < 0.01);
  });
  it("breaks a caption with no spaces between characters", () => {
    const lines = wrapCaption("毎日の記録をかんたんに残せる", 50, 10, measure);
    assert.ok(lines.length > 1);
    assert.equal(lines.join(""), "毎日の記録をかんたんに残せる");
    lines.forEach((line) => assert.ok(measure(line, 10) <= 50, line));
  });
  it("marks a caption cut to three lines", () => {
    const fit = fitCaption(Array.from({ length: 60 }, (_, index) => `word${index}`).join(" "), [400, 800], measure);
    assert.equal(fit?.lines.length, 3);
    assert.ok(fit?.truncated);
    assert.ok(fit?.lines[2].endsWith("…"));
  });
  it("counts Japanese caption words", () => assert.ok(wordCount("毎日の記録をかんたんに残せるプライベートな日記アプリ") > 3));
  it("counts caption words", () => { assert.equal(wordCount("  Log each\nframe in one tap "), 6); assert.equal(wordCount(""), 0); });
  it("offers at least one style for every target", () => assert.ok(frameTargets.every((target) => target.styles.length > 0)));
});
