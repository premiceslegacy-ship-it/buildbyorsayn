import { test, expect, hasE2eAccount } from "./fixtures/auth";

test.describe("Bloc lessons (member)", () => {
  test.skip(!hasE2eAccount, "E2E_TEST_EMAIL/E2E_TEST_PASSWORD not configured");

  test("the block page presents its video area, video rails when published and text chapters", async ({ authedPage: page }) => {
    for (const id of ["1", "2", "3"]) {
      await page.goto(`/blocs/${id}`);
      await expect(page.getByRole("heading", { name: "À lire" })).toBeVisible({ timeout: 10_000 });
      await expect(page.getByRole("radiogroup", { name: "Mode de lecture" })).toHaveCount(0);
      await expect(page.getByTestId("bloc-overview-media")).toHaveCount(1);
      await expect(page.getByTestId("bloc-overview-media")).toBeVisible();
      await expect(page.locator(`a[href^="/blocs/${id}/lire?chapter="]`).first()).toBeVisible();
      await expect(page.getByText("Vidéos liées à ce bloc")).toHaveCount(0);
      await expect(page.locator('a[href^="/videos#"]')).toHaveCount(0);
    }
  });

  test("the block reader is text-only and keeps the chapter document available", async ({ authedPage: page }) => {
    await page.goto("/blocs/1/lire?mode=video");
    await expect(page.getByRole("radiogroup", { name: "Mode de lecture" })).toHaveCount(0);
    await expect(page.getByRole("article", { name: /Lecture de/ })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("button", { name: "Marquer comme lu" })).toBeVisible();
  });

  test("the reader shortcuts change chapter without bringing back a video mode", async ({ authedPage: page }) => {
    await page.goto("/blocs/1/lire?chapter=b1-s0");
    await expect(page.getByRole("article", { name: "Lecture de Le décalage se creuse déjà" })).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(/\/blocs\/1\/lire\?.*chapter=b1-s1/);
    await expect(page.getByRole("article", { name: "Lecture de Une IA utile commence dans le métier" })).toBeVisible();
    await page.keyboard.press("End");
    await expect(page).toHaveURL(/chapter=b1-s4/);
    await page.keyboard.press("Home");
    await expect(page).toHaveURL(/chapter=b1-s0/);
    await page.keyboard.press("Escape");
    await expect(page).toHaveURL(/\/blocs\/1$/);
  });

  test("the reader never rewrites the address in a loop", async ({ authedPage: page }) => {
    let writes = 0;
    await page.exposeFunction("recordAddressWrite", () => {
      writes += 1;
    });
    await page.addInitScript(() => {
      const original = history.replaceState.bind(history);
      history.replaceState = (...args: Parameters<History["replaceState"]>) => {
        const record = Reflect.get(window, "recordAddressWrite");
        if (typeof record === "function") record();
        return original(...args);
      };
    });
    await page.goto("/blocs/1/lire?chapter=b1-s1");
    await page.waitForTimeout(2000);
    expect(writes).toBeLessThan(10);
    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(/chapter=b1-s2/);
  });

  test("text mode is immersive and Escape closes the mobile outline before leaving", async ({ authedPage: page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => localStorage.setItem("btv-reader-outline", "0"));
    await page.goto("/blocs/1/lire?chapter=b1-s0");
    await expect(page.getByRole("navigation", { name: "Principal" })).toBeHidden();
    const outlineButton = page.getByRole("button", { name: "Ouvrir le sommaire" });
    await expect(outlineButton).toBeVisible();
    await outlineButton.click();
    await expect(page.getByRole("complementary", { name: "Sommaire" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("complementary", { name: "Sommaire" })).toHaveCount(0);
    await expect(page).toHaveURL(/\/blocs\/1\/lire/);
    await page.keyboard.press("Escape");
    await expect(page).toHaveURL(/\/blocs\/1$/);
  });
});
