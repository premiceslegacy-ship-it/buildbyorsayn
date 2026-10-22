import { test, expect } from "@playwright/test";
import { LEGAL_LINKS } from "../lib/legal/links";

const VIEWPORTS = [390, 834, 1440, 1920] as const;

for (const link of LEGAL_LINKS) {
  test.describe(`Page légale ${link.href}`, () => {
    test("répond 200 avec un seul titre de niveau 1 et le pied de page", async ({ page }) => {
      const response = await page.goto(link.href);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText(link.label);
      await expect(page.locator("footer.pied")).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${link.href}$`));
    });

    test("le pied de page mène aux quatre pages légales", async ({ page }) => {
      await page.goto(link.href);
      for (const target of LEGAL_LINKS) {
        const anchor = page.locator("footer.pied").getByRole("link", { name: target.label, exact: true });
        await expect(anchor).toHaveAttribute("href", target.href);
      }
      const other = LEGAL_LINKS.find((candidate) => candidate.href !== link.href)!;
      await page.locator("footer.pied").getByRole("link", { name: other.label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${other.href}$`));
      await expect(page.locator("h1")).toHaveText(other.label);
    });

    test("le logo de la barre ramène à l'accueil", async ({ page }) => {
      await page.goto(link.href);
      await expect(page.locator("header.barre a.barre__logo")).toHaveAttribute("href", "/");
    });

    for (const width of VIEWPORTS) {
      test(`aucun débordement horizontal à ${width} px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(link.href);
        await page.waitForLoadState("networkidle");
        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

        const overflowing = await page.evaluate(() =>
          [...document.querySelectorAll<HTMLElement>(".texte, .lg-tete, .lg-sommaire, .barre, .pied")]
            .filter((element) => element.getBoundingClientRect().right > window.innerWidth + 1 || element.getBoundingClientRect().left < -1)
            .map((element) => element.className),
        );
        expect(overflowing).toEqual([]);
      });
    }
  });
}

test("le sommaire des pages longues mène à des sections qui existent", async ({ page }) => {
  await page.goto("/cgv");
  const links = page.locator(".lg-sommaire a");
  const count = await links.count();
  expect(count).toBeGreaterThan(6);
  for (let index = 0; index < count; index += 1) {
    const href = await links.nth(index).getAttribute("href");
    expect(href).toMatch(/^#[a-z-]+$/);
    await expect(page.locator(href!)).toHaveCount(1);
  }
});
