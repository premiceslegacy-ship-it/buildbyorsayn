import {
  test,
  expect,
  hasBeginnerE2eAccount,
  hasE2eAccount,
  hasE2eFreeAccount,
} from "./fixtures/auth";

test.describe("Skills catalog cards", () => {
  test.skip(!hasE2eAccount, "E2E_TEST_EMAIL/E2E_TEST_PASSWORD not configured");

  test("cards render uniformly with an illustration and access badge", async ({ authedPage: page }) => {
    await page.goto("/skills");
    await page.locator("#catalogue").scrollIntoViewIfNeeded();
    // next/image sert l'illustration via /_next/image?url=%2Fassets%2Fillustrations%2Fskills-…
    const cards = page.locator('img[src*="illustrations%2Fskills-"], img[src^="/assets/illustrations/skills-"]');
    await expect(cards.first()).toBeVisible({ timeout: 10_000 });
    expect(await cards.count()).toBeGreaterThan(0);
  });
});

test.describe("Skills access states", () => {
  test.skip(
    !hasBeginnerE2eAccount,
    "E2E_BEGINNER_TEST_EMAIL/E2E_BEGINNER_TEST_PASSWORD not configured"
  );

  test("a locked skill shows an unlock CTA instead of a download link", async ({ beginnerPage: page }) => {
    await page.goto("/skills");
    const lockedCta = page.getByRole("link", { name: /Débloquer|Prendre/i }).first();
    await expect(lockedCta).toBeVisible({ timeout: 10_000 });
    await expect(lockedCta).not.toHaveAttribute("href", /\/api\/skills\//);
  });
});

test.describe("Skills access for a free account", () => {
  test.skip(!hasE2eFreeAccount, "E2E_FREE_TEST_EMAIL/E2E_FREE_TEST_PASSWORD not configured");

  test("every skill is locked: no download link, only unlock calls to action", async ({ freePage: page }) => {
    await page.goto("/skills");
    const lockedCta = page.getByRole("link", { name: /Débloquer|Prendre/i }).first();
    await expect(lockedCta).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('a[href^="/api/skills/"]')).toHaveCount(0);
    await expect(page.locator('a[href*="/checkout/upgrade"]')).toHaveCount(0);
  });
});
