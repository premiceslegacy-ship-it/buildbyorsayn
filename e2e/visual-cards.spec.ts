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
    const pageMain = page.getByRole("main").filter({ has: page.getByRole("complementary", { name: "À venir" }) });
    await pageMain.scrollIntoViewIfNeeded();
    await expect(pageMain).toHaveScreenshot("accompagnement-grid-mobile.png");
  });
});

authedTest.describe("Diagram visual regression", () => {
  authedTest.skip(!hasE2eAccount, "E2E_TEST_EMAIL/E2E_TEST_PASSWORD not configured");

  authedTest("a Frame diagram never overlaps the BUILD mark with its own content", async ({ authedPage: page }) => {
    // Le chapitre Fondations « Comprendre l'environnement » rend ses schémas via ReaderProse.
    // inline in its markup. Fondations requires a signed-in session.
    await page.goto("/beginner/environnement?mode=text");
    await authedExpect(page.getByRole("radio", { name: "Texte" })).toHaveAttribute("aria-checked", "true");
    const frame = page.getByRole("figure", { name: "La fenêtre de contexte se remplit, puis oublie" });
    await authedExpect(frame).toBeVisible({ timeout: 10_000 });
    await authedExpect(frame.getByRole("img", { name: /La fenêtre de contexte se remplit, puis oublie/ })).toBeVisible();
    await authedExpect(frame).toHaveScreenshot("diagram-frame-no-overlap.png");
  });

  authedTest("a block diagram appears only in its real chapter", async ({ authedPage: page }) => {
    await page.goto("/blocs/1/lire?mode=text&chapter=b1-s0");
    await authedExpect(page.getByRole("figure", { name: "Même demande, deux façons de travailler" })).toBeVisible();
    await authedExpect(page.getByRole("figure", { name: "L'écart grandit chaque mois" })).toBeVisible();
    await authedExpect(page.getByRole("figure", { name: "Tu relies trois choses, l'IA suit" })).toHaveCount(0);
  });

  authedTest("reduced motion leaves the complete diagram visible", async ({ authedPage: page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/beginner/environnement?mode=text");
    const frame = page.getByRole("figure", { name: "La fenêtre de contexte se remplit, puis oublie" });
    await authedExpect(frame).toBeVisible();
    await authedExpect.poll(() => frame.locator("[data-schema-node]").evaluateAll((nodes) => nodes.every((node) => getComputedStyle(node).opacity === "1"))).toBe(true);
  });

  authedTest("the real Fondations chapter 10 receives its diagram", async ({ authedPage: page }) => {
    await page.goto("/beginner/url?mode=text");
    await authedExpect(page.getByRole("figure", { name: "De l'idée à l'URL en ligne" })).toBeVisible();
  });
});

authedTest.describe("Diagram entitlement boundary", () => {
  authedTest.skip(!hasBeginnerE2eAccount, "E2E_BEGINNER_TEST_EMAIL/E2E_BEGINNER_TEST_PASSWORD not configured");

  authedTest("a Fondations account never receives a LE COFFRE diagram", async ({ beginnerPage: page }) => {
    await page.goto("/blocs/2/lire?mode=text&chapter=b2-s1");
    await authedExpect(page.getByRole("figure", { name: "Peu d'outils, bien connus" })).toHaveCount(0);
    await authedExpect(page.getByText("Trois oui", { exact: true })).toHaveCount(0);
  });
});
