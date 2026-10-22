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

  // Le lien Stripe du complément n'est jamais dans la page : la carte passe par la porte serveur.
  const card = zone.locator("article.offre");
  await expect(card.locator('a.btn[href="/checkout/upgrade"]')).toBeVisible();
  await expect(card.locator('a[href*="buy.stripe.com"]')).toHaveCount(0);
  expect(await page.content()).not.toContain("buy.stripe.com");
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

  test("la porte /checkout/upgrade envoie vers le paiement du complément, sans que le lien soit dans une page", async ({ beginnerPage: page }) => {
    const response = await page.request.get("/checkout/upgrade", { maxRedirects: 0 });
    expect(response.status()).toBe(303);
    const location = response.headers()["location"] ?? "";
    // Stripe si le lien est configuré, sinon page honnête : jamais un lien mort.
    expect(location).toMatch(/^https:\/\/buy\.stripe\.com\/.*client_reference_id=|\/checkout\?upgrade=indisponible$/);
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
