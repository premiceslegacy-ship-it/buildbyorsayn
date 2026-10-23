import { test, expect } from "@playwright/test";
import { ACCOMPANIMENT_CAL_URL } from "../lib/accompagnements";

test.describe("Accompagnement", () => {
  test("the only action books the free call in a new tab, and nothing else is clickable as an offer", async ({ page }) => {
    await page.goto("/accompagnement");
    const availableOffer = page.getByRole("link", { name: "Réserver mon appel", exact: true });
    await expect(availableOffer).toBeVisible();
    await expect(availableOffer).toHaveAttribute("href", ACCOMPANIMENT_CAL_URL);
    await expect(availableOffer).toHaveAttribute("target", "_blank");
    await expect(availableOffer).toHaveAttribute("rel", /noopener/);
    await expect(page.getByRole("main").getByRole("link", { name: /bientôt|à venir/i })).toHaveCount(0);
  });
});
