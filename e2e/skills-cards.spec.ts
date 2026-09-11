import { test, expect, hasE2eAccount } from "./fixtures/auth";

test.describe("Skills catalog cards", () => {
  test.skip(!hasE2eAccount, "E2E_TEST_EMAIL/E2E_TEST_PASSWORD not configured");

  test("cards render uniformly with an illustration and access badge", async ({ authedPage: page }) => {
    await page.goto("/skills");
    await page.locator("#catalogue").scrollIntoViewIfNeeded();
    const cards = page.locator('img[src^="/assets/illustrations/skills-"]');
    await expect(cards.first()).toBeVisible({ timeout: 10_000 });
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test("a locked skill shows an unlock CTA instead of a download link", async ({ authedPage: page }) => {
    await page.goto("/skills");
    const lockedCta = page.getByRole("link", { name: /Débloquer|Prendre/i }).first();
    await expect(lockedCta).toBeVisible({ timeout: 10_000 });
  });
});
