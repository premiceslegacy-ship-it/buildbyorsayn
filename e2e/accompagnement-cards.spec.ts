import { test, expect } from "@playwright/test";

test.describe("Accompagnement cards", () => {
  test("the 'soon' card is not a link, the available offer is", async ({ page }) => {
    await page.goto("/accompagnement");
    const availableCard = page.getByRole("link", { name: /Construire et vendre des sites web/i });
    await expect(availableCard).toBeVisible();
    await availableCard.click();
    await page.waitForURL("/accompagnement/site-web");
  });

  test("the 'soon' offer renders as a non-interactive placeholder card", async ({ page }) => {
    await page.goto("/accompagnement");
    const soonCard = page.getByText("Bientôt disponible", { exact: false });
    await expect(soonCard).toBeVisible();
    // It must not be wrapped in an <a> or <button> - no href to follow.
    const soonLink = page.getByRole("link", { name: /Bientôt disponible/i });
    await expect(soonLink).toHaveCount(0);
  });
});
