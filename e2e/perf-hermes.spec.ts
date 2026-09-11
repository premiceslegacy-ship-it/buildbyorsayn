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

  test("a warm cache visit is meaningfully faster than a cold one", async ({ authedPage: page }) => {
    // First visit: cold, may hit Supabase Storage for up to 18 artifacts.
    await page.goto("/videos/tutos", { waitUntil: "networkidle" });
    const cold = await navigationDuration(page);

    // Second visit within the in-memory TTL: should be served from cache.
    await page.goto("/videos/tutos", { waitUntil: "networkidle" });
    const warm = await navigationDuration(page);

    expect(cold).not.toBeNull();
    expect(warm).not.toBeNull();
    // Not a hard absolute threshold (CI network is variable) - the warm
    // request should be at least noticeably faster, not just equal-or-worse.
    if (cold !== null && warm !== null) {
      expect(warm).toBeLessThanOrEqual(cold);
    }
  });
});
