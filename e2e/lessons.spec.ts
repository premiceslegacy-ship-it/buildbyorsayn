import { test, expect, hasE2eAccount } from "./fixtures/auth";

test.describe("Bloc lessons (member)", () => {
  test.skip(!hasE2eAccount, "E2E_TEST_EMAIL/E2E_TEST_PASSWORD not configured");

  test("the old linked-videos block is gone and no /videos library link remains", async ({ authedPage: page }) => {
    for (const id of ["1", "2", "3"]) {
      await page.goto(`/blocs/${id}`);
      await expect(page.locator("section[id]").first()).toBeVisible({ timeout: 10_000 });
      await expect(page.getByText("Vidéos liées à ce bloc")).toHaveCount(0);
      await expect(page.locator('a[href^="/videos#"]')).toHaveCount(0);
    }
  });

  test("a section without an imported lesson keeps its text and has no player", async ({ authedPage: page }) => {
    await page.goto("/blocs/1");
    const first = page.locator("section[id]").first();
    await expect(first).toBeVisible({ timeout: 10_000 });
    const hasLesson = await page.getByTestId("lesson-player").or(page.getByTestId("lesson-unavailable")).or(page.getByTestId("lesson-loading")).count();
    if (hasLesson === 0) {
      await expect(first.locator("p").first()).toBeVisible();
      await expect(first.getByRole("button", { name: /J'ai assimilé cette partie/ })).toBeVisible();
    }
  });

  test("without an imported lesson the Mux player is never downloaded (it is lazy-loaded per lesson)", async ({ authedPage: page }) => {
    const muxRequests: string[] = [];
    page.on("request", (request) => { if (/mux|litix/i.test(request.url())) muxRequests.push(request.url()); });
    await page.goto("/blocs/1", { waitUntil: "networkidle" });
    await expect(page.locator("section[id]").first()).toBeVisible({ timeout: 10_000 });
    const hasLesson = (await page.getByTestId("lesson-player").or(page.getByTestId("lesson-unavailable")).or(page.getByTestId("lesson-loading")).count()) > 0;
    test.skip(hasLesson, "a lesson is imported: the player is expected on this page");
    expect(muxRequests).toEqual([]);
  });

  test("when a lesson exists the player, watermark and transcript fold are rendered and the checkbox still works", async ({ authedPage: page }) => {
    await page.goto("/blocs/1");
    await expect(page.locator("section[id]").first()).toBeVisible({ timeout: 10_000 });
    const lessonSections = page.locator("section[id]").filter({ has: page.locator("details > summary", { hasText: "Transcription" }) });
    test.skip((await lessonSections.count()) === 0, "no lesson imported yet (npm run mux:import)");

    const section = lessonSections.first();
    await expect(section.getByTestId("lesson-player").or(section.getByTestId("lesson-unavailable"))).toBeVisible({ timeout: 15_000 });
    await expect(section.getByTestId("lesson-meta")).toContainText("min");
    await expect(section.getByRole("button", { name: /J'ai assimilé cette partie/ })).toBeVisible();
    if (await section.getByTestId("lesson-player").count()) {
      await expect(section.getByTestId("lesson-watermark")).toContainText("@");
    }
  });
});
