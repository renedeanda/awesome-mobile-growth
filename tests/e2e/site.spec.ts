import { test, expect } from "@playwright/test";

test("home presents a useful route into the field guide", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("store page");
  await expect(page.getByRole("link", { name: /private workbench/i })).toBeVisible();
  await expect(page.getByText("What are they trying to find?")).toBeVisible();
  await expect(page.getByRole("link", { name: /Start with ASO/i })).toHaveAttribute("href", "/app-store-optimization/");
});

test("MDX guide renders semantic comparison content instead of markdown syntax", async ({ page }) => {
  await page.goto("/guides/app-store-creative-assets/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("creative assets");
  await expect(page.getByLabel("Apple creative asset delivery matrix")).toBeVisible();
  await expect(page.getByText("| Placement |", { exact: false })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Creative asset specifications/i })).toBeVisible();
});

test("mobile navigation and hero remain usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByText("Menu", { exact: true }).click();
  await expect(page.getByRole("navigation", { name: "Mobile primary" }).getByRole("link", { name: "Library", exact: true })).toBeVisible();
});

test("Apple launch desk connects the platform guides", async ({ page }) => {
  await page.goto("/apple-platforms/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Three very different launches");
  await expect(page.getByRole("link", { name: /Plan a Mac launch/i })).toBeVisible();
  await page.getByRole("link", { name: /Plan a Mac launch/i }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("macOS app");
  await expect(page.getByText("1280 × 800")).toBeVisible();
  await expect(page.getByRole("link", { name: /Apple · Add platforms/i })).toBeVisible();
});

test("Universal Purchase guide makes the irreversible decisions explicit", async ({ page }) => {
  await page.goto("/apple-platforms/universal-purchase/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Universal Purchase");
  await expect(page.getByText("Existing records cannot be merged later. Stop before creating a second record if one relationship is the goal.", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Universal Purchase app record model")).toBeVisible();
});

test("podcast shelf filters and links to editorial pages", async ({ page }) => {
  await page.goto("/podcasts/");
  await expect(page.locator(".podcast-explorer")).toHaveAttribute("data-ready", "true");
  await page.getByLabel("Search").fill("subscription");
  await expect(page.getByRole("link", { name: "Sub Club" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Launched" })).toBeHidden();
  await page.getByRole("link", { name: "Sub Club" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Sub Club" })).toBeVisible();
  await expect(page.getByRole("link", { name: /official show/i })).toBeVisible();
});

test("workbench validates, stays local, and supports contextual deep links", async ({ page }) => {
  await page.goto("/workbench/?platform=google-play&template=metadata");
  await expect(page.getByTestId("workbench")).toHaveAttribute("data-ready", "true");
  await expect(page.getByRole("tab", { name: "Google Play" })).toHaveAttribute("aria-selected", "true");
  await page.getByLabel("App name").first().fill("A name that is deliberately far too long");
  await expect(page.getByLabel("App name").first()).toHaveAttribute("aria-invalid", "true");
  await page.getByText("Save draft in this browser").click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("awesome-mobile-growth-workbench.v2"))).toBeTruthy();
});

test("Google Play desk, growth loop, and reference library are connected", async ({ page }) => {
  await page.goto("/google-play/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Play on its own terms");
  await expect(page.getByRole("link", { name: /Android launch/i })).toBeVisible();
  await page.goto("/growth/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("larger system");
  await expect(page.getByText("Discover", { exact: true })).toBeVisible();
  await page.goto("/reference/keyword-field/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("keyword field");
});

test("keyword checker counts UTF-8 bytes without sending copy away", async ({ page }) => {
  await page.goto("/tools/app-store-keyword-field/");
  await page.getByLabel("Keywords").fill("café,notes,notes");
  await expect(page.getByText("Repeated tokens: notes.")).toBeVisible();
  await expect(page.getByText(/bytes available/)).toBeVisible();
});

test("open AI skill explains its trust boundary and exposes complete source", async ({ page }) => {
  await page.goto("/ai/skills/app-store-growth/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("not permission to guess");
  await expect(page.getByText("Invented search volume")).toBeVisible();
  await page.getByText("Read the raw SKILL.md").click();
  await expect(page.locator(".skill-source pre code")).toContainText("# App Store Growth");
});
