import { test, expect } from "@playwright/test";

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
  for (const path of ["/", "/launch/iphone/", "/store-page/screenshots/", "/learn/metrics/conversion-rate/", "/launch/checklist/", "/changes/", "/tools/", "/workbench/", "/learn/podcasts/", "/screenshot-sizes/", "/screenshot-sizes/iphone-duo/", "/tools/app-store-keyword-field/"]) {
    await page.goto(path);
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
