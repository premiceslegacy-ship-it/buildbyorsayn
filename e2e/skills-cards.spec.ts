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
    const catalogue = page.getByRole("region", { name: "Catalogue" });
    await catalogue.scrollIntoViewIfNeeded();
    const cards = catalogue.getByRole("listitem");
    await expect(cards.first()).toBeVisible({ timeout: 10_000 });
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    for (let index = 0; index < count; index += 1) {
      await expect(cards.nth(index).locator("img")).toBeVisible();
      await expect(cards.nth(index).getByText(/^(Fondations|LE\sCOFFRE|Gratuit)$/)).toBeVisible();
    }
  });
});

test.describe("Skills access states", () => {
  test.skip(
    !hasBeginnerE2eAccount,
    "E2E_BEGINNER_TEST_EMAIL/E2E_BEGINNER_TEST_PASSWORD not configured"
  );

  test("a locked skill shows an unlock CTA instead of a download link", async ({ beginnerPage: page }) => {
    await page.goto("/skills");
    const lockedSkill = page.getByRole("listitem", { name: /ORACLE by Orsayn/ });
    const lockedCta = lockedSkill.getByRole("link", { name: /Passer à LE\sCOFFRE/i });
    await expect(lockedCta).toBeVisible({ timeout: 10_000 });
    await expect(lockedCta).not.toHaveAttribute("href", /\/api\/skills\//);
    await expect(lockedSkill.getByRole("button", { name: "Télécharger" })).toHaveCount(0);
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
