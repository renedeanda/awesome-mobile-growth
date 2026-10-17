import { test, expect } from "@playwright/test";
import fs from "node:fs";
import zlib from "node:zlib";
import { readPngHeader } from "../../lib/png.ts";
import { unzipStored } from "../../lib/zip.ts";

test("home leads to launch, store page and tools", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("store page right");
  await expect(page.getByRole("link", { name: "Start the launch checklist" })).toHaveAttribute("href", "/launch/checklist/");
  await expect(page.getByRole("link", { name: "Check your listing" })).toHaveAttribute("href", "/workbench/");
  await expect(page.getByRole("heading", { name: "What changed recently" })).toBeVisible();
  await expect(page.getByLabel("Example App Store search result")).toBeVisible();
});

test("guides render tables, sources, related links and a closing action list", async ({ page }) => {
  await page.goto("/store-page/creative-assets/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("headers");
  await expect(page.getByRole("region", { name: "Apple creative asset sizes" })).toContainText("3840 × 1646");
  await expect(page.getByText("| Placement |", { exact: false })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Creative assets specifications/i }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Read next" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Do this today" })).toBeVisible();
});

test("AI prompts can be copied", async ({ page, context, browserName }) => {
  test.skip(browserName !== "chromium", "Clipboard permissions are Chromium-only in Playwright");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/store-page/metadata/");
  await page.getByRole("button", { name: "Copy prompt" }).first().click();
  await expect(page.getByRole("button", { name: "Copied" }).first()).toBeVisible();
});

test("launch checklist saves ticks in this browser", async ({ page }) => {
  await page.goto("/launch/checklist/");
  await expect(page.locator(".checklist")).toHaveAttribute("data-ready", "true");
  await page.getByLabel(/Write one sentence: who the app is for/).check();
  await expect(page.getByText(/^1$/).first()).toBeVisible();
  await page.reload();
  await expect(page.locator(".checklist")).toHaveAttribute("data-ready", "true");
  await expect(page.getByLabel(/Write one sentence: who the app is for/)).toBeChecked();
});

test("mobile navigation and hero remain usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Main sections" }).getByRole("link", { name: "Tools" })).toBeVisible();
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog", { name: "Site menu" });
  await expect(menu.getByRole("link", { name: "Google Play", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await page.getByRole("button", { name: "Open menu" }).click();
  await menu.getByRole("link", { name: "Keywords", exact: true }).click();
  await expect(page).toHaveURL(/\/store-page\/keywords\/$/);
  await expect(menu).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test("workbench fits a phone screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/workbench/");
  await expect(page.getByTestId("workbench")).toHaveAttribute("data-ready", "true");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test("launch hub connects the platform guides", async ({ page }) => {
  await page.goto("/launch/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("launch-week surprises");
  await page.getByRole("link", { name: /Launch a Mac app on the Mac App Store/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Mac App Store");
  await expect(page.getByText("2880 × 1800").first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Apple · Add platforms/ })).toBeVisible();
});

test("old URLs are covered by the new structure", async ({ page }) => {
  await page.goto("/learn/metrics/conversion-rate/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("conversion rate");
  await expect(page.getByText("(Total downloads + pre-orders) ÷ unique device impressions")).toBeVisible();
  await page.goto("/changes/");
  await expect(page.getByRole("link", { name: /iPhone Duo screenshots/ })).toBeVisible();
});

test("podcast shelf filters and offers current editorial picks", async ({ page }) => {
  await page.goto("/learn/podcasts/");
  await expect(page.locator(".podcast-explorer")).toHaveAttribute("data-ready", "true");
  await page.getByLabel("Search", { exact: true }).fill("subscription");
  await expect(page.getByRole("link", { name: /Sub Club/ }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Launched/ })).toBeHidden();
  await expect(page.getByRole("link", { name: /Nancy Anderson/ })).toHaveAttribute("href", /revenuecat\.com/);
});

test("workbench validates, stays local, and supports contextual deep links", async ({ page }) => {
  await page.goto("/workbench/?platform=google-play&template=metadata");
  await expect(page.getByTestId("workbench")).toHaveAttribute("data-ready", "true");
  await expect(page.getByRole("tab", { name: "Google Play" })).toHaveAttribute("aria-selected", "true");
  await page.getByLabel("App name").first().fill("A name that is deliberately far too long");
  await expect(page.getByLabel("App name").first()).toHaveAttribute("aria-invalid", "true");
  await page.getByText("Save draft in this browser").click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("awesome-mobile-growth-workbench.v3"))).toBeTruthy();
});

test("Google Play launch, grow and learn sections are connected", async ({ page }) => {
  await page.goto("/launch/google-play/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Google Play");
  await expect(page.getByText(/API level 36/).first()).toBeVisible();
  await page.goto("/grow/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("after the install");
  await page.goto("/learn/");
  await expect(page.getByRole("link", { name: /App Store metrics glossary/ })).toBeVisible();
});

test("keyword checker counts UTF-8 bytes without sending copy away", async ({ page }) => {
  await page.goto("/tools/app-store-keyword-field/");
  await expect(page.getByTestId("browser-tool")).toHaveAttribute("data-ready", "true");
  await page.getByLabel("Keywords").fill("café,notes,notes");
  await expect(page.getByText("Repeated tokens: notes.")).toBeVisible();
  await expect(page.getByText(/bytes available/)).toBeVisible();
});

test("open AI skill explains its trust boundary and exposes complete source", async ({ page }) => {
  await page.goto("/tools/app-store-growth-skill/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("not permission to guess");
  await expect(page.getByText("Invent search volume or rankings")).toBeVisible();
  await page.getByText("Read the raw SKILL.md").click();
  await expect(page.locator(".skill-source pre code")).toContainText("# App Store Growth");
});

test("buttons and standalone links are at least 32px tall on phones", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/", "/launch/iphone/", "/store-page/screenshots/", "/learn/metrics/conversion-rate/", "/launch/checklist/", "/changes/", "/tools/", "/workbench/", "/learn/podcasts/", "/screenshot-sizes/", "/screenshot-sizes/iphone-duo/", "/tools/app-store-keyword-field/", "/tools/screenshot-frames/"]) {
    await page.goto(path);
    if (path === "/tools/screenshot-frames/") await expect(page.getByTestId("frame-studio")).toHaveAttribute("data-ready", "true");
    const small = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>("a, button, summary, input, select, textarea")]
      .filter((el) => {
        const style = getComputedStyle(el);
        // Links inside running text are exempt; a checkbox counts its whole label as the target.
        if (style.display === "inline" || style.visibility === "hidden") return false;
        const target = el instanceof HTMLInputElement && el.closest("label") ? el.closest("label")! : el;
        const box = target.getBoundingClientRect();
        return box.width > 0 && box.height > 0 && box.height < 32;
      })
      .map((el) => `${el.tagName.toLowerCase()}.${el.className} "${(el.textContent ?? "").trim().slice(0, 30)}"`));
    expect(small, `small tap targets on ${path}`).toEqual([]);
  }
});

test("workbench opens on a store preview that flags a clipped name", async ({ page }) => {
  await page.goto("/workbench/");
  await expect(page.getByTestId("workbench")).toHaveAttribute("data-ready", "true");
  await expect(page.getByRole("tab", { name: "Store preview" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("The name fits on one line in the search result.")).toBeVisible();
  await page.getByRole("tab", { name: "Apple" }).click();
  await page.getByLabel("App name").fill("Daybook Private Journal Mood");
  await page.getByLabel("Subtitle").fill("Write a few lines every day, privately and calmly");
  await page.getByRole("tab", { name: "Store preview" }).click();
  await expect(page.getByRole("region", { name: "Store preview" })).toContainText("Daybook Private Journal Mood");
  await expect(page.getByText(/subtitle is cut off/)).toBeVisible();
});

test("keyword packer fills the field in priority order and skips name words", async ({ page }) => {
  await page.goto("/tools/app-store-keyword-field/");
  await expect(page.getByTestId("browser-tool")).toHaveAttribute("data-ready", "true");
  await page.getByLabel("App name and subtitle").fill("Daybook: Private Journal");
  await page.getByLabel("Candidates, most important first").fill("mood tracker\njournal\ngratitude");
  await expect(page.locator(".packer__field code")).toHaveText("mood,tracker,gratitude");
  await expect(page.getByText("journal (already in name or subtitle)", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Check this field above" }).click();
  await expect(page.getByLabel("Keywords")).toHaveValue("mood,tracker,gratitude");
});

test("launch countdown dates each phase and remembers the launch", async ({ page }) => {
  await page.goto("/launch/checklist/");
  await expect(page.locator(".checklist")).toHaveAttribute("data-ready", "true");
  const launch = await page.evaluate(() => { const d = new Date(); d.setDate(d.getDate() + 10); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; });
  await page.getByLabel("Launch date").fill(launch);
  await expect(page.getByText("10 days to launch")).toBeVisible();
  await expect(page.locator(".checklist__group--current h3")).toHaveText([/Store page/, /Testing/]);
  await expect(page.getByRole("button", { name: /Add phases to calendar/ })).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Launch date")).toHaveValue(launch);
});

test("changes marks entries that are new since the last visit", async ({ page }) => {
  await page.addInitScript(() => { if (!sessionStorage.getItem("amg-changes-previous.v1")) localStorage.setItem("amg-changes-visit.v1", "2026-01-01"); });
  await page.goto("/changes/");
  await expect(page.getByText(/new or updated since your last visit on 1 Jan 2026/)).toBeVisible();
  await expect(page.locator(".new-badge").first()).toBeVisible();
});

test("search finds a device size page and opens it", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search the site" }).click();
  await page.getByRole("searchbox", { name: "Search the site" }).fill("iphone duo");
  await expect(page.getByRole("option").first()).toBeVisible();
  await page.getByRole("option", { name: /iPhone Duo screenshot size/ }).click();
  await expect(page).toHaveURL(/\/screenshot-sizes\/iphone-duo\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("iPhone Duo screenshot size");
  await expect(page.getByRole("region", { name: "iPhone Duo screenshot sizes" })).toContainText("2034 × 1398");
});

// A solid-color PNG made in the test, so uploads don't depend on fixture files.
function testPng(width: number, height: number, [r, g, b]: [number, number, number]) {
  const row = Buffer.concat([Buffer.from([0]), Buffer.alloc(width * 3).map((_, i) => [r, g, b][i % 3])]);
  const chunk = (type: string, data: Buffer) => { const body = Buffer.concat([Buffer.from(type), data]); const out = Buffer.alloc(12 + data.length); out.writeUInt32BE(data.length); body.copy(out, 4); out.writeUInt32BE(zlib.crc32(body), 8 + data.length); return out; };
  const header = Buffer.alloc(13); header.writeUInt32BE(width); header.writeUInt32BE(height, 4); header.set([8, 2, 0, 0, 0], 8);
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", header), chunk("IDAT", zlib.deflateSync(Buffer.concat(Array(height).fill(row)))), chunk("IEND", Buffer.alloc(0))]);
}
const shots = [[220, 40, 40], [40, 160, 80], [40, 80, 220]].map((rgb, index) => ({ name: `capture-${index + 1}.png`, mimeType: "image/png", buffer: testPng(118, 256, rgb as [number, number, number]) }));

test("frame studio exports exact-size RGB frames and hands them to the store preview", async ({ page }) => {
  await page.goto("/tools/screenshot-frames/?class=iphone-dynamic-island-large");
  const studio = page.getByTestId("frame-studio");
  await expect(studio).toHaveAttribute("data-ready", "true");
  await expect(page.getByLabel("Store slot")).toHaveValue("iphone-dynamic-island-large");
  await expect(page.getByLabel("Export size")).toHaveValue("1320 × 2868");
  await studio.locator(".frame-drop input").setInputFiles(shots);
  await expect(page.getByRole("status")).toContainText("Added 3 screenshots");
  await page.getByLabel("Frame 1 caption").fill("Plan the week in one view");
  await page.getByText("Paste captions, one per line").click();
  await page.getByLabel("Captions", { exact: true }).fill("Plan the week in one view\nShare a list in two taps\nWorks offline");
  await page.getByRole("button", { name: "Apply to frames in order" }).click();
  await expect(page.getByLabel("Frame 3 caption")).toHaveValue("Works offline");
  const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Export 3 frames" }).click()]);
  expect(download.suggestedFilename()).toBe("iphone-dynamic-island-large-1320x2868.zip");
  const entries = unzipStored(new Uint8Array(fs.readFileSync(await download.path())));
  expect(entries.map((entry) => entry.name)).toEqual(["01", "02", "03"].map((n) => `iphone-dynamic-island-large-1320x2868-${n}.png`));
  for (const entry of entries) expect(readPngHeader(entry.data)).toEqual({ width: 1320, height: 2868, bitDepth: 8, colorType: 2 });
  await page.getByRole("button", { name: "See them in the Store preview" }).click();
  await expect(page).toHaveURL(/\/workbench\/\?from=frames/);
  await expect(page.getByText("Showing 3 frames from the screenshot frame studio.")).toBeVisible();
  await expect(page.locator(".store-shots--result img")).toHaveCount(3);
});

test("frame studio exports a Google Play JPEG and size pages preselect their slot", async ({ page }) => {
  await page.goto("/screenshot-sizes/ipad-13/");
  await page.getByRole("link", { name: "screenshot frame studio" }).click();
  await expect(page.getByTestId("frame-studio")).toHaveAttribute("data-ready", "true");
  await expect(page.getByLabel("Store slot")).toHaveValue("ipad-13");
  await expect(page.getByLabel("Export size")).toHaveValue("2064 × 2752");
  await page.getByLabel("Store slot").selectOption("google-play");
  await expect(page.getByLabel("Export size")).toHaveValue("1080 × 1920");
  await page.getByTestId("frame-studio").locator(".frame-drop input").setInputFiles(shots[0]);
  await page.getByRole("button", { name: "JPEG" }).click();
  const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Export 1 frame" }).click()]);
  expect(download.suggestedFilename()).toBe("google-play-1080x1920-01.jpg");
  const bytes = fs.readFileSync(await download.path());
  expect([...bytes.subarray(0, 2)]).toEqual([0xff, 0xd8]);
});

const phoneUA = {
  apple: "Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1",
  android: "Mozilla/5.0 (Linux; Android 16; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36",
  other: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
};
const chrome = (page: import("@playwright/test").Page) => page.locator(".tab-bar").evaluate((el) => {
  const style = getComputedStyle(el);
  const blur = style.backdropFilter || style.getPropertyValue("-webkit-backdrop-filter");
  return { blur, radius: parseFloat(style.borderTopLeftRadius), height: el.getBoundingClientRect().height, bottom: innerHeight - el.getBoundingClientRect().bottom };
});

for (const platform of ["apple", "android", "other"] as const) test.describe(`${platform} navigation chrome`, () => {
  test.use({ userAgent: phoneUA[platform], viewport: { width: 390, height: 844 } });
  test(`marks the page and styles the tab bar for ${platform}`, async ({ page }) => {
    await page.goto("/store-page/");
    await expect(page.locator("html")).toHaveAttribute("data-platform", platform);
    const bar = await chrome(page);
    if (platform === "apple") { expect(bar.blur).toContain("blur"); expect(bar.radius).toBeGreaterThan(20); expect(bar.bottom).toBeGreaterThanOrEqual(8); }
    if (platform === "android") { expect(bar.blur === "" || bar.blur === "none").toBe(true); expect(bar.height).toBeGreaterThanOrEqual(80); }
    if (platform === "other") expect(bar.radius).toBe(0);
    await page.locator(".tab-bar").screenshot({ path: test.info().outputPath(`tab-bar-${platform}.png`) });
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog", { name: "Site menu" })).toBeVisible();
    await page.screenshot({ path: test.info().outputPath(`menu-${platform}.png`) });
    await page.getByRole("button", { name: "Close", exact: true }).click();
    await page.getByRole("button", { name: "Search the site" }).click();
    await page.getByRole("searchbox").fill("iPhone");
    await page.screenshot({ path: test.info().outputPath(`search-${platform}.png`) });
  });
});

test.describe("glass falls back to solid surfaces", () => {
  test.use({ userAgent: phoneUA.apple, viewport: { width: 390, height: 844 } });
  test("under Increase Contrast and Reduce Transparency", async ({ page, browserName }) => {
    await page.emulateMedia({ contrast: "more" });
    await page.goto("/store-page/");
    expect((await chrome(page)).blur).not.toContain("blur");
    test.skip(browserName !== "chromium", "Only Chromium can emulate prefers-reduced-transparency.");
    await page.emulateMedia({ contrast: "no-preference" });
    const session = await page.context().newCDPSession(page);
    await session.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-transparency", value: "reduce" }] });
    expect((await chrome(page)).blur).not.toContain("blur");
  });
});

// Reads one row of RGB pixels from a PNG written by lib/png.ts (Sub filter on every row).
function pngRow(png: Buffer, y: number) {
  const { width } = readPngHeader(new Uint8Array(png));
  const idat: Buffer[] = [];
  for (let at = 8; at < png.length;) { const length = png.readUInt32BE(at); if (png.toString("ascii", at + 4, at + 8) === "IDAT") idat.push(png.subarray(at + 8, at + 8 + length)); at += 12 + length; }
  const stride = width * 3 + 1, row = zlib.inflateSync(Buffer.concat(idat)).subarray(y * stride, (y + 1) * stride);
  const out = [...row.subarray(1)];
  for (let i = 3; i < out.length; i++) out[i] = (out[i] + out[i - 3]) & 255;
  return (x: number) => out.slice(x * 3, x * 3 + 3);
}

test("frame studio pads a too-tall capture for Play and hides a stale handoff", async ({ page }) => {
  await page.goto("/tools/screenshot-frames/?class=google-play");
  await expect(page.getByTestId("frame-studio")).toHaveAttribute("data-ready", "true");
  await page.getByLabel("Device frame").selectOption("none");
  await page.getByRole("button", { name: "Solid" }).click();
  await page.getByTestId("frame-studio").locator(".frame-drop input").setInputFiles({ name: "tall.png", mimeType: "image/png", buffer: testPng(1080, 2400, [220, 40, 40]) });
  await expect(page.locator(".frame-card__crop")).toHaveCount(0);
  const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Export 1 frame" }).click()]);
  const png = fs.readFileSync(await download.path());
  expect(readPngHeader(new Uint8Array(png))).toEqual({ width: 1080, height: 1920, bitDepth: 8, colorType: 2 });
  // 1080 × 2400 scaled to 1920 tall is 864 wide: 108 px of background on each side, the capture in the middle.
  const pixel = pngRow(png, 960);
  expect(pixel(20)).toEqual([0x1d, 0x5b, 0xd8]);
  expect(pixel(540)).toEqual([220, 40, 40]);
  const handoff = page.getByRole("button", { name: "See them in the Store preview" });
  await expect(handoff).toBeVisible();
  await page.getByLabel("Frame 1 caption").fill("Now with a caption");
  await expect(handoff).toHaveCount(0);
});

test("frame studio warns about cropped captures and long captions", async ({ page }) => {
  await page.goto("/tools/screenshot-frames/");
  await expect(page.getByTestId("frame-studio")).toHaveAttribute("data-ready", "true");
  await page.getByRole("button", { name: "Landscape" }).click();
  await page.getByTestId("frame-studio").locator(".frame-drop input").setInputFiles(shots[0]);
  await expect(page.locator(".frame-card__crop")).toContainText("of this capture is cropped. Use a landscape capture");
  await page.getByLabel("Frame 1 caption").fill("Track every single habit you have in one simple place");
  await expect(page.getByText("10 words · aim for 7 or fewer")).toBeVisible();
});

test.describe("native touches", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("tapping the current tab scrolls back to the top", async ({ page }) => {
    await page.goto("/store-page/");
    await page.evaluate(() => scrollTo(0, 1200));
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(500);
    await page.getByRole("navigation", { name: "Main sections" }).getByRole("link", { name: "Store page" }).click();
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    await expect(page).toHaveURL(/\/store-page\/$/);
  });

  test.describe("on Apple devices", () => {
    test.use({ userAgent: phoneUA.apple });
    test("the tab bar shrinks while scrolling down and returns on the way up", async ({ page }) => {
      await page.goto("/store-page/");
      const bar = page.getByRole("navigation", { name: "Main sections" });
      await expect(bar).not.toHaveAttribute("data-compact");
      await page.evaluate(() => scrollTo(0, 900));
      await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(880);
      await expect(bar).toHaveAttribute("data-compact", "true");
      await expect(bar.getByRole("link", { name: "Tools" })).toBeVisible();
      await page.evaluate(() => scrollTo(0, 500));
      await expect(bar).not.toHaveAttribute("data-compact");
    });
  });

  test.describe("with touch", () => {
    test.use({ hasTouch: true });
    test("swiping the menu sheet down closes it", async ({ page, browserName }) => {
      test.skip(browserName !== "chromium", "Touch gestures are driven through the Chromium DevTools protocol.");
      await page.goto("/store-page/");
      await page.getByRole("button", { name: "Open menu" }).click();
      const sheet = page.getByRole("dialog", { name: "Site menu" });
      await expect(sheet).toBeVisible();
      const box = (await sheet.boundingBox())!;
      const cdp = await page.context().newCDPSession(page);
      const touch = (type: "touchStart" | "touchMove" | "touchEnd", y: number) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x: box.x + box.width / 2, y }] });
      await touch("touchStart", box.y + 20);
      for (let step = 1; step <= 6; step++) await touch("touchMove", box.y + 20 + step * 45);
      await touch("touchEnd", 0);
      await expect(sheet).toBeHidden();
    });
  });
});

test("frame studio pastes screenshots and shares exports through the share sheet", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Synthetic paste events with files need Chromium's DataTransfer.");
  await page.addInitScript(() => {
    const shared: string[] = [];
    Object.assign(window, { __shared: shared });
    Object.assign(navigator, { canShare: () => true, share: async (data: { files: File[] }) => { shared.push(...data.files.map((file) => file.name)); } });
  });
  await page.goto("/tools/screenshot-frames/");
  await expect(page.getByTestId("frame-studio")).toHaveAttribute("data-ready", "true");
  const png = testPng(118, 256, [40, 80, 220]).toString("base64");
  await page.evaluate((data) => {
    const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
    const transfer = new DataTransfer();
    transfer.items.add(new File([bytes], "pasted.png", { type: "image/png" }));
    document.dispatchEvent(new ClipboardEvent("paste", { clipboardData: transfer, bubbles: true }));
  }, png);
  await expect(page.getByRole("status")).toContainText("Added 1 screenshot");
  await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Export 1 frame" }).click()]);
  // iPhones get "Save to Photos" (the share sheet saves there); other devices get "Share frames".
  await page.getByRole("button", { name: /^(Save to Photos|Share frames)$/ }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { __shared: string[] }).__shared)).toEqual(["iphone-dynamic-island-medium-1206x2622-01.png"]);
});
