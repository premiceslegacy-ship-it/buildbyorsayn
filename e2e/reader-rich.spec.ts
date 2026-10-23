import { test, expect, hasE2eAccount } from "./fixtures/auth";

test.describe("Lecture riche", () => {
  test.skip(!hasE2eAccount, "E2E_TEST_EMAIL/E2E_TEST_PASSWORD not configured");

  test("un chapitre garde une carte et une comparaison, puis un schéma large", async ({ authedPage: page }) => {
    await page.goto("/beginner/copywriting?mode=text");
    await expect(page.getByRole("article", { name: /Lecture de/i })).toBeVisible({ timeout: 10_000 });

    const card = page.getByText("La règle simple", { exact: true }).locator("xpath=ancestor::aside[1]");
    await expect(card).toBeVisible();

    const comparison = page.getByText("Trop flou", { exact: true }).locator("xpath=ancestor::div[contains(@class, 'md:grid-cols-2')][1]");
    await expect(comparison).toBeVisible();
    await expect(comparison.getByText("On comprend la scène", { exact: true })).toBeVisible();

    await page.goto("/beginner/penser?mode=text");
    await expect(page.locator('[data-schema-container="true"]').first()).toBeVisible({ timeout: 10_000 });
  });
});
