import { test, expect, hasE2eAccount } from "./fixtures/auth";
import { test as publicTest, expect as publicExpect } from "@playwright/test";

publicTest.describe("Nouveautés (public)", () => {
  publicTest("is reachable without an account and never shows a member badge", async ({ page }) => {
    const response = await page.goto("/nouveautes");
    publicExpect(response?.status()).toBe(200);
    await publicExpect(page.getByRole("heading", { level: 1, name: "Nouveautés" })).toBeVisible();
    // Either the empty state (table empty or not migrated yet) or the real feed.
    await publicExpect(page.getByTestId("nouveautes-empty").or(page.locator("[data-video-card]").first())).toBeVisible();
    await publicExpect(page.getByTestId("nouveautes-badge")).toHaveCount(0);
  });

  publicTest("YouTube links leave the site safely", async ({ page }) => {
    await page.goto("/nouveautes");
    const links = page.locator('[data-testid="nouveautes-grid"] a[href^="https://www.youtube.com/watch?v="]');
    for (const link of await links.all()) {
      await publicExpect(link).toHaveAttribute("target", "_blank");
      await publicExpect(link).toHaveAttribute("rel", /noopener/);
    }
  });

  publicTest("the main navigation offers Nouveautés instead of Vidéos", async ({ page }) => {
    await page.goto("/nouveautes");
    const nav = page.getByRole("navigation", { name: "Navigation secondaire" });
    await publicExpect(nav.or(page.getByRole("navigation", { name: "Navigation principale" })).first()).toBeVisible();
    await publicExpect(page.locator('a[href="/nouveautes"]').first()).toBeAttached();
    await publicExpect(page.locator('a[href="/videos"]')).toHaveCount(0);
    await publicExpect(page.locator('a[href="/videos/tutos"]').first()).toBeAttached();
  });

  publicTest("/videos permanently redirects to /nouveautes without touching /videos/tutos", async ({ request }) => {
    const moved = await request.get("/videos", { maxRedirects: 0 });
    publicExpect(moved.status()).toBe(308);
    publicExpect(new URL(moved.headers()["location"], "http://x").pathname).toBe("/nouveautes");

    const hermes = await request.get("/videos/tutos", { maxRedirects: 0 });
    publicExpect(hermes.headers()["location"] ?? "").not.toContain("/nouveautes");
  });

  publicTest("production CSP allows Mux HLS playback and nothing wider than needed", async ({ request }) => {
    const csp = (await request.get("/nouveautes")).headers()["content-security-policy"];
    publicExpect(csp).toBeTruthy();
    publicExpect(csp).toMatch(/connect-src [^;]*https:\/\/\*\.mux\.com/);
    publicExpect(csp).toMatch(/connect-src [^;]*https:\/\/\*\.litix\.io/);
    publicExpect(csp).toMatch(/script-src [^;]*https:\/\/src\.litix\.io/);
    publicExpect(csp).toMatch(/media-src 'self' blob: https:\/\/\*\.mux\.com/);
    publicExpect(csp).toMatch(/worker-src 'self' blob:/);
    publicExpect(csp).toMatch(/frame-ancestors 'none'/);
  });

  publicTest("the Mux webhook-style endpoints reject unauthenticated callers", async ({ request }) => {
    const cron = await request.get("/api/cron/youtube-sync");
    publicExpect(cron.status()).toBe(401);
    const forged = await request.post("/api/youtube/websub", { data: "<feed/>", headers: { "x-hub-signature": "sha1=00" } });
    publicExpect([202, 500]).toContain(forged.status());
    const probe = await request.get("/api/youtube/websub?hub.mode=subscribe&hub.topic=https://evil.example/&hub.challenge=x");
    publicExpect(probe.status()).toBe(404);
  });
});

// Fulfilled cross-origin responses still go through CORS, so every mock must carry these.
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "*",
  "access-control-allow-methods": "GET, HEAD, POST, PATCH, OPTIONS",
  "access-control-expose-headers": "content-range",
};

publicTest.describe("Nouveautés (security and performance)", () => {
  publicTest("the HTML never carries a server secret or a Mux identifier", async ({ request }) => {
    const html = await (await request.get("/nouveautes")).text();
    publicExpect(html).not.toMatch(/SUPABASE_SERVICE_ROLE|service_role|MUX_PRIVATE_KEY|MUX_TOKEN|YOUTUBE_WEBSUB_SECRET|CRON_SECRET/);
    publicExpect(html).not.toMatch(/stream\.mux\.com|playbackId|muxAssetId/);
  });

  publicTest("the page ships no video-player code and stays within a transfer and latency budget", async ({ page }) => {
    const requests: string[] = [];
    let scriptBytes = 0;
    page.on("response", async (response) => {
      requests.push(response.url());
      // Own bundle only: the YouTube player (an embed we do not ship) loads its own scripts inside the iframe.
      if (response.request().resourceType() === "script" && new URL(response.url()).origin === new URL(page.url()).origin) {
        const length = Number(response.headers()["content-length"] ?? 0);
        scriptBytes += length || (await response.body().catch(() => Buffer.alloc(0))).length;
      }
    });
    await page.goto("/nouveautes", { waitUntil: "networkidle" });
    publicExpect(requests.filter((url) => /mux|litix/i.test(url))).toEqual([]);
    publicExpect(scriptBytes, "own JS transferred on first visit (bytes)").toBeLessThan(900_000);
    const timing = await page.evaluate(() => {
      const [navigation] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
      return { ttfb: navigation.responseStart - navigation.startTime, dcl: navigation.domContentLoadedEventEnd - navigation.startTime };
    });
    publicExpect(timing.ttfb, "time to first byte (ms)").toBeLessThan(1_500);
    publicExpect(timing.dcl, "DOMContentLoaded (ms)").toBeLessThan(3_000);
  });

  publicTest("repeat requests are served fast: the video list comes from the shared data cache", async ({ request }) => {
    await request.get("/nouveautes");
    const timings: number[] = [];
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const started = Date.now();
      const response = await request.get("/nouveautes");
      publicExpect(response.status()).toBe(200);
      timings.push(Date.now() - started);
    }
    timings.sort((a, b) => a - b);
    publicExpect(timings[2], `median of 5 warm requests (ms): ${timings.join(",")}`).toBeLessThan(600);
  });

  publicTest("the featured YouTube player really loads under the site's isolation headers (COEP)", async ({ page }) => {
    await page.goto("/nouveautes");
    publicTest.skip((await page.locator("iframe").count()) === 0, "no video published yet: nothing to embed");
    await publicExpect.poll(
      () => page.frames().map((frame) => frame.url()),
      { message: "the embed must navigate to YouTube, not to a Chromium error page", timeout: 20_000 },
    ).toContainEqual(publicExpect.stringMatching(/^https:\/\/www\.youtube-nocookie\.com\/embed\//));
    publicExpect(page.frames().map((frame) => frame.url()).filter((url) => url.startsWith("chrome-error:"))).toEqual([]);
  });

  publicTest("an oversized WebSub body is refused without work", async ({ request }) => {
    const response = await request.post("/api/youtube/websub", { data: "x".repeat(300 * 1024), headers: { "content-type": "application/atom+xml" } });
    publicExpect(response.status()).toBe(413);
  });

  publicTest("lessons are unreachable anonymously: /blocs/1 redirects away without rendering", async ({ request }) => {
    const response = await request.get("/blocs/1", { maxRedirects: 0 });
    publicExpect([301, 302, 303, 307, 308]).toContain(response.status());
    publicExpect(["/", "/login"]).toContain(new URL(response.headers()["location"], "http://x").pathname);
  });
});

test.describe("Nouveautés badge (member)", () => {
  test.skip(!hasE2eAccount, "E2E_TEST_EMAIL/E2E_TEST_PASSWORD not configured");

  test("counts unseen videos in the nav, caps at 9+, and clears after visiting /nouveautes", async ({ authedPage: page }) => {
    let seenAt: string | null = "2020-01-01T00:00:00Z";
    let upserted = false;

    await page.route("**/rest/v1/member_nouveautes_seen**", async (route) => {
      const method = route.request().method();
      if (method === "OPTIONS") {
        await route.fulfill({ status: 204, headers: CORS });
      } else if (method === "GET") {
        await route.fulfill({ status: 200, headers: CORS, contentType: "application/json", body: seenAt ? JSON.stringify({ seen_at: seenAt }) : "null" });
      } else {
        upserted = true;
        seenAt = new Date().toISOString();
        await route.fulfill({ status: 201, headers: CORS, body: "" });
      }
    });
    await page.route("**/rest/v1/youtube_videos**", async (route) => {
      if (route.request().method() === "OPTIONS") return route.fulfill({ status: 204, headers: CORS });
      const unseen = seenAt && new Date(seenAt).getFullYear() > 2020 ? 0 : 12;
      await route.fulfill({ status: 200, headers: { ...CORS, "content-range": unseen === 0 ? "*/0" : "0-0/12" }, contentType: "application/json", body: "[]" });
    });

    await page.goto("/dashboard");
    await expect(page.getByTestId("nouveautes-badge").first()).toHaveText("9+", { timeout: 10_000 });

    await page.goto("/nouveautes");
    await expect.poll(() => upserted, { timeout: 10_000 }).toBe(true);

    await page.goto("/dashboard");
    await expect(page.getByTestId("nouveautes-badge")).toHaveCount(0);
  });

  test("a failing lookup shows no badge instead of a wrong one", async ({ authedPage: page }) => {
    await page.route("**/rest/v1/member_nouveautes_seen**", (route) => route.fulfill({ status: route.request().method() === "OPTIONS" ? 204 : 500, headers: CORS, contentType: "application/json", body: "{}" }));
    await page.goto("/dashboard");
    // Attached, not visible: below the xl breakpoint the links live in the collapsed hamburger menu.
    await expect(page.locator('a[href="/nouveautes"]').first()).toBeAttached();
    await expect(page.getByTestId("nouveautes-badge")).toHaveCount(0);
  });
});
