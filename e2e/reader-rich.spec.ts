import { test, expect, hasE2eAccount } from "./fixtures/auth";

test.describe("Lecture riche", () => {
  test.skip(!hasE2eAccount, "E2E_TEST_EMAIL/E2E_TEST_PASSWORD not configured");

  test("un chapitre montre une phrase en valeur, une carte à retenir, une paire et des schémas visibles", async ({ authedPage: page }) => {
    await page.goto("/beginner/site-web?mode=text");
    const article = page.getByRole("article", { name: /Lecture de/i });
    await expect(article).toBeVisible({ timeout: 10_000 });

    await expect(article.locator('[data-reader-highlight="true"]').first()).toBeVisible();
    await expect(article.getByRole("heading", { name: "À retenir" }).first()).toBeAttached();
    await expect(article.getByText("Avant", { exact: true }).first()).toBeAttached();

    // Un schéma plus haut que la fenêtre doit devenir visible une fois atteint, jamais rester transparent.
    const schemas = article.locator("figure[data-kit-schema]");
    expect(await schemas.count()).toBeGreaterThan(2);
    const last = schemas.last();
    await last.scrollIntoViewIfNeeded();
    await expect.poll(async () => Number(await last.evaluate((el) => getComputedStyle(el).opacity)), { timeout: 5_000 }).toBeGreaterThan(0.95);
  });
});
