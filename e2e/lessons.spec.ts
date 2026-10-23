import { test, expect, hasE2eAccount } from "./fixtures/auth";

test.describe("Bloc lessons (member)", () => {
  test.skip(!hasE2eAccount, "E2E_TEST_EMAIL/E2E_TEST_PASSWORD not configured");

  test("the block page presents the video, chapters and reader entry", async ({ authedPage: page }) => {
    for (const id of ["1", "2", "3"]) {
      await page.goto(`/blocs/${id}`);
      await expect(page.getByRole("heading", { name: "Chapitres" })).toBeVisible({ timeout: 10_000 });
      await expect(page.getByRole("radiogroup", { name: "Mode de lecture" })).toHaveCount(0);
      await expect(page.getByTestId("bloc-overview-media")).toBeVisible();
      await expect(page.locator(`a[href^="/blocs/${id}/lire?chapter="]`).first()).toBeVisible();
      await expect(page.getByText("Vidéos liées à ce bloc")).toHaveCount(0);
      await expect(page.locator('a[href^="/videos#"]')).toHaveCount(0);
    }
  });

  test("a section without an imported lesson keeps its text and has no player", async ({ authedPage: page }) => {
    await page.goto("/blocs/1/lire?mode=video");
    await expect(page.getByRole("radiogroup", { name: "Mode de lecture" })).toBeVisible({ timeout: 10_000 });
    const hasLesson = await page.getByTestId("lesson-player").or(page.getByTestId("lesson-unavailable")).or(page.getByTestId("lesson-loading")).count();
    if (hasLesson === 0) {
      await expect(page.getByRole("heading", { name: "La vidéo arrive bientôt. Le texte est déjà là.", exact: true })).toBeVisible();
      await page.getByRole("radio", { name: "Texte" }).click();
      await expect(page.getByRole("button", { name: "Marquer comme lu" })).toBeVisible();
    }
  });

  test("without an imported lesson the Mux player is never downloaded (it is lazy-loaded per lesson)", async ({ authedPage: page }) => {
    const muxRequests: string[] = [];
    page.on("request", (request) => { if (/mux|litix/i.test(request.url())) muxRequests.push(request.url()); });
    await page.goto("/blocs/1/lire?mode=video", { waitUntil: "networkidle" });
    await expect(page.getByRole("radiogroup", { name: "Mode de lecture" })).toBeVisible({ timeout: 10_000 });
    const hasLesson = (await page.getByTestId("lesson-player").or(page.getByTestId("lesson-unavailable")).or(page.getByTestId("lesson-loading")).count()) > 0;
    test.skip(hasLesson, "a lesson is imported: the player is expected on this page");
    expect(muxRequests).toEqual([]);
  });

  test("when a lesson exists the player, watermark, metadata and manual completion remain available", async ({ authedPage: page }) => {
    await page.goto("/blocs/1/lire");
    await expect(page.getByRole("radiogroup", { name: "Mode de lecture" })).toBeVisible({ timeout: 10_000 });
    const player = page.getByTestId("lesson-player").or(page.getByTestId("lesson-unavailable"));
    test.skip((await player.count()) === 0, "no lesson imported yet (npm run mux:import)");
    await expect(player).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId("lesson-meta")).toContainText("min");
    if (await page.getByTestId("lesson-player").count()) {
      await expect(page.getByTestId("lesson-watermark")).toContainText("@");
    }
    await page.getByRole("radio", { name: "Texte" }).click();
    await expect(page.getByRole("button", { name: /Marquer comme lu|Chapitre lu/ })).toBeVisible();
  });

  test("reader shortcuts change chapter, preserve mode and Escape returns to the block", async ({ authedPage: page }) => {
    await page.goto("/blocs/1/lire?chapter=1&mode=text");
    await expect(page.getByRole("radio", { name: "Texte" })).toHaveAttribute("aria-checked", "true");
    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(/\/blocs\/1\/lire\?.*chapter=b1-s1.*mode=text|\/blocs\/1\/lire\?.*mode=text.*chapter=b1-s1/);
    // La navigation vers le chapitre doit être terminée : un changement de mode pendant le vol relit l'état précédent.
    await expect(page.locator('[aria-current="true"]').filter({ hasText: "Une IA utile commence dans le métier" })).toBeVisible();
    await page.getByRole("radio", { name: "Vidéo" }).click();
    await expect(page).toHaveURL(/chapter=b1-s1/);
    await page.keyboard.press("Tab");
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
    await page.goto("/blocs/1/lire?mode=text&chapter=b1-s1");
    await expect(page.getByRole("radio", { name: "Texte" })).toHaveAttribute("aria-checked", "true");
    await page.waitForTimeout(2000);
    expect(writes).toBeLessThan(10);
    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(/chapter=b1-s2/);
  });

  test("text mode is immersive and Escape closes the mobile outline before leaving", async ({ authedPage: page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => localStorage.setItem("btv-reader-outline", "0"));
    await page.goto("/blocs/1/lire?mode=text&chapter=b1-s0");
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
