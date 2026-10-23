import { test, expect, hasBeginnerE2eAccount, hasE2eAccount, hasE2eFreeAccount } from "./fixtures/auth";
import type { Page } from "@playwright/test";
import {
  COFFRE_PRICE,
  FONDATIONS_PRICE,
  UPGRADE_PATH,
  UPGRADE_PRICE,
} from "../lib/pricing";

// La zone d'offres s'adapte à l'accès : un compte gratuit voit les deux offres, Fondations ne voit que la montée,
// l'accès complet ne voit aucun achat. Le complément n'ouvre le paiement qu'aux comptes Fondations (porte /checkout/upgrade).

const STRIPE_URL = /https:\/\/buy\.stripe\.com\/[^"'\s<>\\]+/g;
const euro = (amount: number) => new RegExp(`${amount}\\s*€`);

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
  await expect(page.getByRole("heading", { name: "Chargement des niveaux…" })).toHaveCount(0);
  const shown = await page.getByRole("link", { name: /^Prendre (Fondations|LE\sCOFFRE)$/ }).evaluateAll((links) => links.map((a) => (a as HTMLAnchorElement).href));
  for (const url of html.match(STRIPE_URL) ?? []) {
    expect(shown, `lien Stripe inattendu dans le HTML de ${path}`).toContain(url.replace(/&amp;/g, "&"));
  }
}

/** `main` désigne la page rendue : pendant le streaming deux `main` peuvent coexister (gabarit de chargement puis page), la page vient en dernier. */
function zoneOf(page: Page, scope: string) {
  return scope === "main" ? page.locator("main:not([aria-busy])").last() : page.locator(scope);
}

async function expectBothOffersAndBand(page: Page, scope: string) {
  const zone = zoneOf(page, scope);
  const fondations = zone.getByRole("article", { name: /^Fondations$/ });
  const coffre = zone.getByRole("article", { name: /^LE\sCOFFRE$/ });
  await expect(fondations).toBeVisible();
  await expect(fondations).toContainText(euro(FONDATIONS_PRICE));
  await expect(coffre).toBeVisible();
  await expect(coffre).toContainText(euro(COFFRE_PRICE));
  await expect(coffre).toContainText("Recommandé");
  // Sur mobile la montée est dans un carrousel : le prix peut être dans une diapositive hors champ.
  await expect(zone.getByText(euro(UPGRADE_PRICE)).first()).toBeAttached();
  const upgradeAction = zone.getByRole("link", { name: /Passer à LE\sCOFFRE/ });
  const upgradeBand = zone.getByText("la différence", { exact: true });
  await expect(upgradeAction.or(upgradeBand).first()).toBeVisible();
}

async function expectOnlyUpgradeCard(page: Page, scope: string) {
  const zone = zoneOf(page, scope);
  await expect(zone.getByRole("link", { name: /^Prendre (Fondations|LE\sCOFFRE)$/ })).toHaveCount(0);
  await expect(zone).not.toContainText(euro(FONDATIONS_PRICE));
  await expect(zone.getByText(euro(UPGRADE_PRICE)).first()).toBeAttached();

  // Le lien Stripe du complément n'est jamais dans la page : la carte passe par la porte serveur.
  await expect(zone.getByRole("link", { name: /Passer à LE\sCOFFRE/ })).toHaveAttribute("href", UPGRADE_PATH);
  await expect(zone.locator('a[href*="buy.stripe.com"]')).toHaveCount(0);
  expect(await page.content()).not.toContain("buy.stripe.com");
}

async function expectNoPurchaseCard(page: Page, scope: string) {
  const zone = zoneOf(page, scope);
  await expect(page.getByRole("heading", { name: "Chargement des niveaux…" })).toHaveCount(0, { timeout: 15_000 });
  await expect(zone.getByRole("heading", { name: "Tu as tout BUILD." }).last()).toBeVisible({ timeout: 15_000 });
  await expect(zone.getByRole("link", { name: /^(Prendre|Passer à)/ })).toHaveCount(0);
  await expect(zone.locator('a[href^="https://buy.stripe.com/"]')).toHaveCount(0);
  await expect(zone.getByRole("link", { name: "Ouvrir mon espace" })).toHaveAttribute("href", "/dashboard");
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
  test("la confirmation /fin reste atteignable après l'achat de Fondations", async ({ beginnerPage: page }) => {
    await page.goto("/fin");
    await expect(page).toHaveURL(/\/fin$/);
    await expect(page.getByRole("heading", { name: "C'est débloqué." })).toBeVisible();
    await expect(page.getByText(/Fondations est activé sur ton compte/)).toBeVisible();
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

  test("le tableau de bord s'ouvre pour un compte gratuit et mène vers les offres", async ({ freePage: page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/dashboard");

    await expect(page.getByRole("heading", { level: 1, name: "Aujourd'hui" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Voir l'accès", exact: true })).toHaveAttribute("href", "/checkout");
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
