import { test, expect } from "@playwright/test";
import { ACCOMPANIMENT_CAL_URL } from "../lib/accompagnements";

test.describe("Accompagnement cards", () => {
  test("the 'soon' card is not a link, the available offer is", async ({ page }) => {
    await page.goto("/accompagnement");
    const availableOffer = page.getByRole("link", { name: "Réserver mon appel", exact: true });
    await expect(availableOffer).toBeVisible();
    await expect(availableOffer).toHaveAttribute("href", ACCOMPANIMENT_CAL_URL);
    await expect(availableOffer).toHaveAttribute("target", "_blank");
    await expect(availableOffer).toHaveAttribute("rel", /noopener/);

    const soonOffer = page.getByRole("complementary", { name: "À venir" });
    await expect(soonOffer).toBeVisible();
    await expect(soonOffer.locator("a, button")).toHaveCount(0);
  });

  test("the 'soon' offer renders as a non-interactive placeholder card", async ({ page }) => {
    await page.goto("/accompagnement");
    const soonOffer = page.getByRole("complementary", { name: "À venir" });
    await expect(soonOffer).toContainText("Bientôt disponible");
    await expect(soonOffer.locator("a, button")).toHaveCount(0);
  });
});
