import { test, expect, hasBeginnerE2eAccount, hasE2eAccount } from "./fixtures/auth";
import type { Page } from "@playwright/test";

// La zone d'offres s'adapte à l'accès : Fondations ne voit que la montée, l'accès complet ne voit aucun achat.

async function expectOnlyUpgradeCard(page: Page, scope: string) {
  const zone = page.locator(scope);
  await expect(zone.locator("#px-up")).toBeVisible();
  await expect(zone.locator("#px-f")).toHaveCount(0);
  await expect(zone.locator("#px-c")).toHaveCount(0);
  await expect(zone.locator(".montee")).toHaveCount(0);
  await expect(zone).not.toContainText(/97\s€/);
  await expect(zone.locator("article.offre")).toHaveCount(1);
  await expect(zone.locator("article.offre")).toContainText(/170\s€/);

  const card = zone.locator("article.offre");
  const link = card.locator('a.btn[href^="https://buy.stripe.com/"]');
  const off = card.locator("button.btn[disabled]");
  await expect(link.or(off)).toHaveCount(1);
  if (await link.count()) {
    await expect(link).toHaveAttribute("href", /client_reference_id=/);
  } else {
    await expect(card.getByRole("status")).toContainText(/pas disponible/);
  }
}

async function expectNoPurchaseCard(page: Page, scope: string) {
  const zone = page.locator(scope);
  await expect(zone.locator("#px-ok")).toBeVisible();
  await expect(zone.locator("#px-f, #px-c, #px-up")).toHaveCount(0);
  await expect(zone.locator(".montee")).toHaveCount(0);
  await expect(zone.locator('a[href^="https://buy.stripe.com/"]')).toHaveCount(0);
  await expect(zone.locator('a[href="/dashboard"]')).toBeVisible();
}

test.describe("Offres pour un compte Fondations", () => {
  test.skip(!hasBeginnerE2eAccount, "E2E_BEGINNER_TEST_EMAIL/E2E_BEGINNER_TEST_PASSWORD not configured");

  test("l'accueil ne montre que la carte de montée vers LE COFFRE", async ({ beginnerPage: page }) => {
    await page.goto("/");
    await expect(page.locator('header a[href="/dashboard"]')).toBeVisible();
    await expectOnlyUpgradeCard(page, "section#prix");
  });

  test("/checkout ne montre que la carte de montée vers LE COFFRE", async ({ beginnerPage: page }) => {
    await page.goto("/checkout");
    await expectOnlyUpgradeCard(page, "main");
  });
});

test.describe("Offres pour un compte LE COFFRE", () => {
  test.skip(!hasE2eAccount, "E2E_TEST_EMAIL/E2E_TEST_PASSWORD not configured");

  test("l'accueil ne montre aucune carte d'achat", async ({ authedPage: page }) => {
    await page.goto("/");
    await expectNoPurchaseCard(page, "section#prix");
  });

  test("/checkout ne montre aucune carte d'achat", async ({ authedPage: page }) => {
    await page.goto("/checkout");
    await expectNoPurchaseCard(page, "main");
  });
});
