import type { Page } from "@playwright/test";
import { test, expect, hasE2eAccount } from "./fixtures/auth";

async function navigationDuration(page: Page): Promise<number | null> {
  return page.evaluate(() => {
    const [nav] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    return nav ? nav.responseEnd - nav.requestStart : null;
  });
}

test.describe("Hermes Agent performance", () => {
  test.skip(!hasE2eAccount, "E2E_TEST_EMAIL/E2E_TEST_PASSWORD not configured");

  test("cold and warm visits render the Hermes library", async ({ authedPage: page }) => {
    // The first visit may verify and load up to 18 published artifacts.
    await page.goto("/videos/tutos", { waitUntil: "networkidle" });
    const cold = await navigationDuration(page);

    // The second visit exercises the in-memory cache without making a brittle
    // wall-clock promise: browser scheduling and Supabase latency can vary.
    await page.goto("/videos/tutos", { waitUntil: "networkidle" });
    const warm = await navigationDuration(page);

    expect(cold).not.toBeNull();
    expect(warm).not.toBeNull();
    expect(cold ?? 0).toBeGreaterThan(0);
    expect(warm ?? 0).toBeGreaterThan(0);
    await expect(
      page.getByRole("heading", { name: "Hermes Agent, une IA qui comprend le travail." })
    ).toBeVisible();

    test.info().annotations.push({
      type: "navigation-timing",
      description: `cold=${cold?.toFixed(1)}ms warm=${warm?.toFixed(1)}ms`,
    });
  });
});
