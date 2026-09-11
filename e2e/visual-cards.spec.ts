import { test, expect } from "@playwright/test";
import { test as authedTest, expect as authedExpect, hasE2eAccount } from "./fixtures/auth";

authedTest.describe("IllustratedCard visual regression (skills, requires a session)", () => {
  authedTest.skip(!hasE2eAccount, "E2E_TEST_EMAIL/E2E_TEST_PASSWORD not configured");

  authedTest("a skills card grid renders consistently", async ({ authedPage: page }) => {
    await page.goto("/skills");
    const grid = page.locator("#catalogue").locator("xpath=following-sibling::div[1]");
    await authedExpect(grid).toBeVisible({ timeout: 10_000 });
    await authedExpect(grid).toHaveScreenshot("skills-card-grid.png");
  });
});

test.describe("IllustratedCard visual regression (accompagnement, public page)", () => {
  test("accompagnement card grid renders on mobile width", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/accompagnement");
    const grid = page.locator("#accompagnements");
    await grid.scrollIntoViewIfNeeded();
    await expect(grid).toHaveScreenshot("accompagnement-grid-mobile.png");
  });
});

authedTest.describe("Diagram visual regression", () => {
  authedTest.skip(!hasE2eAccount, "E2E_TEST_EMAIL/E2E_TEST_PASSWORD not configured");

  authedTest("a Frame diagram never overlaps the BUILD mark with its own content", async ({ authedPage: page }) => {
    // Section2 (Fondations "Démystifier le LLM") renders PromptContextDiagram
    // inline in its markup. Fondations requires a signed-in session.
    await page.goto("/beginner/environnement");
    const frame = page.locator("figure").first();
    await authedExpect(frame).toBeVisible({ timeout: 10_000 });
    await authedExpect(frame).toHaveScreenshot("diagram-frame-no-overlap.png");
  });
});
