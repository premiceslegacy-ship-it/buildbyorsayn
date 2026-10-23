import { test, expect, type Locator, type Page } from "@playwright/test";
import { test as authedTest, expect as authedExpect, hasBeginnerE2eAccount, hasE2eAccount } from "./fixtures/auth";

async function waitForStableCardGrid(page: Page, grid: Locator) {
  await grid.scrollIntoViewIfNeeded();
  await authedExpect(grid.locator("img").first()).toBeVisible({ timeout: 10_000 });
  await page.evaluate(async () => {
    await document.fonts?.ready;
  });
  await authedExpect
    .poll(
      async () =>
        grid.evaluate((element) => {
          const items = Array.from(element.children);
          return (
            items.length > 0 &&
            items.every((item) => {
              const style = window.getComputedStyle(item);
              const images = Array.from(item.querySelectorAll("img"));
              return (
                style.opacity === "1" &&
                images.every((image) => image.complete && image.naturalWidth > 0)
              );
            })
          );
        }),
      { timeout: 10_000 }
    )
    .toBe(true);
}

authedTest.describe("IllustratedCard visual regression (skills, requires a session)", () => {
  authedTest.skip(!hasE2eAccount, "E2E_TEST_EMAIL/E2E_TEST_PASSWORD not configured");

  authedTest("a skills card grid renders consistently", async ({ authedPage: page }) => {
    await page.goto("/skills");
    const grid = page.getByRole("region", { name: "Catalogue" }).getByRole("list");
    await authedExpect(grid).toBeVisible({ timeout: 10_000 });
    await waitForStableCardGrid(page, grid);
    await authedExpect(grid).toHaveScreenshot("skills-card-grid.png");
  });
});

test.describe("IllustratedCard visual regression (accompagnement, public page)", () => {
  test("accompagnement page renders on mobile width", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/accompagnement");
    const pageMain = page.getByRole("main");
    await pageMain.scrollIntoViewIfNeeded();
    await expect(pageMain).toHaveScreenshot("accompagnement-grid-mobile.png");
  });
});

authedTest.describe("Diagram visual regression", () => {
  authedTest.skip(!hasE2eAccount, "E2E_TEST_EMAIL/E2E_TEST_PASSWORD not configured");

  authedTest("every schema of a long chapter stays inside its card", async ({ authedPage: page }) => {
    await page.goto("/beginner/site-web?mode=text");
    const figures = page.locator("article figure[data-kit-schema]");
    await authedExpect(figures.first()).toBeAttached({ timeout: 10_000 });
    const overflowing = await figures.evaluateAll((nodes) => nodes.filter((node) => node.scrollWidth > node.clientWidth + 1).map((node) => node.getAttribute("aria-label")));
    authedExpect(overflowing).toEqual([]);
  });

  authedTest("a LE COFFRE chapter receives its own schemas", async ({ authedPage: page }) => {
    await page.goto("/blocs/1/lire?mode=text&chapter=b1-s0");
    await authedExpect(page.getByRole("article", { name: /Lecture de/ })).toBeVisible();
    authedExpect(await page.locator("article figure[data-kit-schema]").count()).toBeGreaterThan(0);
  });

  authedTest("reduced motion leaves every schema fully visible", async ({ authedPage: page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/beginner/environnement?mode=text");
    const figures = page.locator("article figure[data-kit-schema]");
    await authedExpect(figures.first()).toBeAttached({ timeout: 10_000 });
    await authedExpect.poll(() => figures.evaluateAll((nodes) => nodes.every((node) => getComputedStyle(node).opacity === "1"))).toBe(true);
  });
});

authedTest.describe("Diagram entitlement boundary", () => {
  authedTest.skip(!hasBeginnerE2eAccount, "E2E_BEGINNER_TEST_EMAIL/E2E_BEGINNER_TEST_PASSWORD not configured");

  authedTest("a Fondations account never receives a LE COFFRE schema", async ({ beginnerPage: page }) => {
    await page.goto("/blocs/2/lire?mode=text&chapter=b2-s1");
    await authedExpect(page.locator("figure[data-kit-schema]")).toHaveCount(0);
    await authedExpect(page.getByRole("article", { name: /Lecture de/ })).toHaveCount(0);
  });
});
