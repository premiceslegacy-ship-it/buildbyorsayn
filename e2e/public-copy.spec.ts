import { test, expect } from "@playwright/test";

const PUBLIC_PAGES = ["/", "/login", "/checkout", "/cgv", "/confidentialite"] as const;

test("les pages publiques gardent les espaces insécables visibles", async ({ page }) => {
  for (const path of PUBLIC_PAGES) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toBeVisible();
    const visibleText = await page.locator("body").innerText();
    expect(visibleText, path).not.toMatch(/(?<!\u00a0) [?!:;]/u);
  }
});
