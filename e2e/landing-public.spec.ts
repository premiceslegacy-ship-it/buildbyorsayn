import { test, expect, type Page } from "@playwright/test";

const SECTION_IDS = ["pourquoi", "contenu", "prix", "faq"] as const;
const LEGAL_ROUTES = ["/cgv", "/mentions-legales", "/confidentialite", "/cookies"] as const;

// Aucune variable d'environnement requise : la page est publique et visiteur déconnecté.

async function openLanding(page: Page) {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
}

test.describe("Accueil public", () => {
  test("les sections et leurs ancres existent, la barre y mène", async ({ page }) => {
    await openLanding(page);
    for (const id of SECTION_IDS) {
      await expect(page.locator(`section#${id}`)).toHaveCount(1);
      await expect(page.locator(`header a[href="#${id}"]`)).toHaveCount(1);
    }
    await expect(page.locator('header a[href="/login?mode=signup"]')).toBeVisible();
  });

  test("les deux offres et la montée de niveau sont visibles", async ({ page }) => {
    await openLanding(page);
    const prix = page.locator("section#prix");
    await prix.scrollIntoViewIfNeeded();

    const fondations = prix.getByRole("article").filter({ has: page.getByRole("heading", { name: "Fondations", level: 3 }) });
    await expect(fondations).toBeVisible();
    await expect(fondations).toContainText(/97\s€/);

    const coffre = prix.getByRole("article").filter({ has: page.getByRole("heading", { name: /LE\sCOFFRE/, level: 3 }) });
    await expect(coffre).toBeVisible();
    await expect(coffre).toContainText(/267\s€/);
    await expect(coffre).toContainText("Recommandé");

    const montee = prix.locator(".montee");
    await expect(montee).toBeVisible();
    await expect(montee).toContainText(/De Fondations à LE\sCOFFRE/);
    await expect(montee).toContainText(/170\s€/);
  });

  test("un bouton d'achat est soit un vrai lien Stripe, soit éteint avec une explication", async ({ page }) => {
    await openLanding(page);
    const cards = page.locator("section#prix article.offre");
    await expect(cards).toHaveCount(2);
    for (let i = 0; i < 2; i++) {
      const card = cards.nth(i);
      const link = card.locator('a.btn[href^="https://buy.stripe.com/"]');
      const off = card.locator("button.btn[disabled]");
      await expect(link.or(off)).toHaveCount(1);
      if (await off.count()) {
        await expect(card.getByRole("status")).toContainText(/pas disponible/);
      }
    }
  });

  test("la FAQ a ses six questions", async ({ page }) => {
    await openLanding(page);
    await expect(page.locator("section#faq details")).toHaveCount(6);
  });

  test("le pied de page mène aux quatre pages légales", async ({ page }) => {
    await openLanding(page);
    for (const route of LEGAL_ROUTES) {
      await expect(page.locator(`footer a[href="${route}"]`)).toHaveCount(1);
    }
  });

  test("aucun débordement horizontal à cette largeur", async ({ page }) => {
    await openLanding(page);
    await page.evaluate(() => document.querySelectorAll("details").forEach((d) => { d.open = true; }));
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test("le texte visible n'a ni tiret cadratin ni demi-cadratin", async ({ page }) => {
    await openLanding(page);
    await page.evaluate(() => document.querySelectorAll("details").forEach((d) => { d.open = true; }));
    const text = await page.locator("body").innerText();
    expect(text.includes("\u2014"), "tiret cadratin").toBe(false);
    expect(text.includes("\u2013"), "tiret demi-cadratin").toBe(false);
  });
});
