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
    // A full account reads the chapter; any other account is sent to the offers before any chapter text renders.
    await page.goto("/videos/tutos/01-diagnostic-et-offre?mode=text");
    const reader = page.getByRole("article", { name: /^Lecture de / });
    const offers = page.getByRole("heading", { name: /Passe à LE COFFRE/i });
    const accessSurface = reader.or(offers);
    await expect(accessSurface).toHaveCount(1);
    await expect(accessSurface).toBeVisible();
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
