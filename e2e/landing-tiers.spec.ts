import { test, expect, hasBeginnerE2eAccount, hasE2eAccount, hasE2eFreeAccount } from "./fixtures/auth";
import type { Page } from "@playwright/test";

// La zone d'offres s'adapte à l'accès : un compte gratuit voit les deux offres, Fondations ne voit que la montée,
// l'accès complet ne voit aucun achat. Le complément n'ouvre le paiement qu'aux comptes Fondations (porte /checkout/upgrade).

const STRIPE_URL = /https:\/\/buy\.stripe\.com\/[^"'\s<>\\]+/g;

/** Bloque toute requête vers Stripe (aucun paiement ne part) et garde la liste de ce qui a été demandé. */
async function blockStripe(page: Page): Promise<string[]> {
  const hits: string[] = [];
  await page.route("https://buy.stripe.com/**", async (route) => {
    hits.push(route.request().url());
    await route.abort();
  });
  return hits;
}

/** Le HTML brut d'une page ne contient que les liens Stripe affichés sur les cartes, jamais celui du complément. */
async function expectNoUpgradeStripeLink(page: Page, path: string) {
  const response = await page.goto(path);
  const html = (await response?.text()) ?? "";
  const shown = await page.locator('a[href*="buy.stripe.com"]').evaluateAll((links) => links.map((a) => (a as HTMLAnchorElement).href));
  for (const url of html.match(STRIPE_URL) ?? []) {
    expect(shown, `lien Stripe inattendu dans le HTML de ${path}`).toContain(url.replace(/&amp;/g, "&"));
  }
  const upgradeLink = process.env.STRIPE_UPGRADE_CHECKOUT_LINK;
  if (upgradeLink) expect(html).not.toContain(upgradeLink);
}

async function expectBothOffersAndBand(page: Page, scope: string) {
  const zone = page.locator(scope);
  const fondations = zone.locator("article.offre").filter({ has: page.locator("#px-f") });
  const coffre = zone.locator("article.offre").filter({ has: page.locator("#px-c") });
  await expect(fondations).toBeVisible();
  await expect(fondations).toContainText(/97\s€/);
  await expect(coffre).toBeVisible();
  await expect(coffre).toContainText(/267\s€/);
  await expect(coffre).toContainText("Recommandé");
  await expect(zone.locator(".montee")).toContainText(/170\s€/);
  await expect(zone.locator("#px-up")).toHaveCount(0);
}

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

  test("la porte /checkout/upgrade mène au paiement du complément, avec l'identifiant du compte", async ({ beginnerPage: page }) => {
    // On lit la redirection sans la suivre : on ne navigue jamais vers le vrai Stripe.
    const response = await page.request.get("/checkout/upgrade", { maxRedirects: 0 });
    expect(response.status()).toBe(303);
    const location = response.headers()["location"] ?? "";
    if (location.startsWith("https://")) {
      const url = new URL(location);
      expect(url.hostname).toBe("buy.stripe.com");
      expect(url.searchParams.get("client_reference_id")).toBeTruthy();
    } else {
      // Lien du complément absent ou invalide : page honnête, jamais un lien mort.
      expect(location).toBe("/checkout?upgrade=indisponible");
    }
  });

  test("le HTML de l'accueil et de /checkout ne contient pas le lien du complément", async ({ beginnerPage: page }) => {
    await expectNoUpgradeStripeLink(page, "/");
    await expectNoUpgradeStripeLink(page, "/checkout");
  });
});

test.describe("Offres pour un compte gratuit", () => {
  test.skip(!hasE2eFreeAccount, "E2E_FREE_TEST_EMAIL/E2E_FREE_TEST_PASSWORD not configured");

  test("l'accueil montre les deux offres et la montée de niveau", async ({ freePage: page }) => {
    await page.goto("/");
    await expectBothOffersAndBand(page, "section#prix");
  });

  test("/checkout montre les deux offres et la montée de niveau", async ({ freePage: page }) => {
    await page.goto("/checkout");
    await expectBothOffersAndBand(page, "main");
  });

  test("la porte /checkout/upgrade refuse et renvoie vers les offres, sans jamais atteindre Stripe", async ({ freePage: page }) => {
    const stripeHits = await blockStripe(page);
    await page.goto("/checkout/upgrade");

    await expect(page).toHaveURL(/\/checkout\?from=upgrade$/);
    await expect(page.getByRole("status").filter({ hasText: "Le complément est réservé aux comptes Fondations" })).toBeVisible();
    await expectBothOffersAndBand(page, "main");
    expect(stripeHits, "aucune requête vers buy.stripe.com").toEqual([]);
  });

  test("le HTML de l'accueil et de /checkout ne contient pas le lien du complément", async ({ freePage: page }) => {
    await expectNoUpgradeStripeLink(page, "/");
    await expectNoUpgradeStripeLink(page, "/checkout");
  });

  test("le tableau de bord s'ouvre pour un compte gratuit et sa fenêtre montre les deux offres", async ({ freePage: page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/dashboard");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Bienvenue");
    await expect(page.getByText("Gratuit", { exact: true }).first()).toBeVisible();
    await page.getByRole("button", { name: /Voir les offres/ }).click();
    const dialog = page.getByRole("dialog", { name: "Les offres BUILD" });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("button", { name: "Fermer" })).toBeFocused();
    await expectBothOffersAndBand(page, '[role="dialog"]');
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    expect(errors).toEqual([]);
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

  test("la porte /checkout/upgrade renvoie au tableau de bord, sans Stripe", async ({ authedPage: page }) => {
    const stripeHits = await blockStripe(page);
    await page.goto("/checkout/upgrade");
    await expect(page).toHaveURL(/\/dashboard$/);
    expect(stripeHits).toEqual([]);
  });
});
