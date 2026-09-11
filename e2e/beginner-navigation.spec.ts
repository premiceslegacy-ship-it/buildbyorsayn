import { test, expect, hasE2eAccount } from "./fixtures/auth";

test.describe("Fondations navigation", () => {
  test.skip(!hasE2eAccount, "E2E_TEST_EMAIL/E2E_TEST_PASSWORD not configured");

  test("opens a section detail route and offers a next-section CTA", async ({ authedPage: page }) => {
    await page.goto("/beginner");
    const mindsetCard = page.locator('a[href="/beginner/mindset"]');
    await expect(mindsetCard).toBeVisible({ timeout: 10_000 });
    await mindsetCard.click();
    await page.waitForURL("/beginner/mindset");
    await expect(page.locator("h2").first()).toBeVisible();

    const next = page.getByRole("link", { name: /suivant/i });
    await expect(next).toBeVisible();
    await next.click();
    await page.waitForURL("/beginner/psychologie");
  });

  test("walking every section eventually reaches a disabled last-item state", async ({ authedPage: page }) => {
    await page.goto("/beginner/url");
    // "url" is the last of the nine core sections - its next CTA should
    // point at the closing "seuil" section, not a disabled dead end yet.
    const next = page.getByRole("link", { name: /suivant/i });
    await expect(next).toBeVisible();
    await next.click();
    await page.waitForURL("/beginner/angle-mort");
  });
});
