import { test, expect, hasE2eAccount } from "./fixtures/auth";

test.describe("Blocs navigation", () => {
  test.skip(!hasE2eAccount, "E2E_TEST_EMAIL/E2E_TEST_PASSWORD not configured");

  test("clicking a bloc card opens its detail route", async ({ authedPage: page }) => {
    await page.goto("/dashboard");
    const firstCard = page.locator('a[href^="/blocs/"], button[aria-label*="La logique"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10_000 });
    await firstCard.click();
    await page.waitForURL(/\/blocs\/\d+/);
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });
});
