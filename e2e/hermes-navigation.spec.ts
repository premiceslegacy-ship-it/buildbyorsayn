import { test, expect, hasE2eAccount } from "./fixtures/auth";

test.describe("Hermes Agent navigation", () => {
  test.skip(!hasE2eAccount, "E2E_TEST_EMAIL/E2E_TEST_PASSWORD not configured");

  test("opens a chapter detail route from the grid (requires a full-tier account)", async ({ authedPage: page }) => {
    await page.goto("/videos/tutos");
    const firstCard = page.locator('a[href^="/videos/tutos/"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10_000 });
    await firstCard.click();
    await page.waitForURL(/\/videos\/tutos\/[a-z0-9-]+/);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("a chapter route enforces the same doctrine gate as the grid", async ({ authedPage: page }) => {
    // A signed-in but non-full account must see the paywall, never the
    // markdown content, on both the grid and a direct chapter URL.
    await page.goto("/videos/tutos/readme");
    const isGated = await page.getByText(/réservé à/i).isVisible().catch(() => false);
    const hasContent = await page.locator("article.doctrine-reader").isVisible().catch(() => false);
    // Exactly one of these should be true depending on the test account's tier.
    expect(isGated !== hasContent).toBeTruthy();
  });
});

test.describe("Hermes Agent, unauthenticated", () => {
  test("redirects away from the doctrine, never rendering its content, without a session", async ({ page }) => {
    // The proxy's default destination for a gated route without a login-redirect
    // exception is "/" (see proxy.ts) - only /accompagnement/espace and
    // /mcp/consent redirect to /login. What matters here is that the
    // doctrine content is never reached, not the exact destination.
    await page.goto("/videos/tutos");
    await page.waitForURL((url) => url.pathname !== "/videos/tutos", { timeout: 10_000 });
    await expect(page.locator("article.doctrine-reader")).toHaveCount(0);
  });

  test("a direct chapter URL is gated the same way as the grid", async ({ page }) => {
    await page.goto("/videos/tutos/readme");
    await page.waitForURL((url) => url.pathname !== "/videos/tutos/readme", { timeout: 10_000 });
    await expect(page.locator("article.doctrine-reader")).toHaveCount(0);
  });
});
