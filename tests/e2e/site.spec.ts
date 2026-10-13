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
  await expect(page.getByRole("navigation", { name: "Mobile primary" }).getByRole("link", { name: "Guides" })).toBeVisible();
});

test("podcast shelf filters and links to editorial pages", async ({ page }) => {
  await page.goto("/podcasts/");
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
  await expect.poll(() => page.evaluate(() => localStorage.getItem("awesome-mobile-growth-workbench.v1"))).toBeTruthy();
});
