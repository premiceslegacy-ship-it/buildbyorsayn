import { test as base, type Page } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

/**
 * E2E auth fixtures. Require a dedicated Supabase test account (tier: full)
 * via env vars - never a real user's credentials, and never committed.
 * Missing env vars skip auth-gated tests rather than failing the whole run,
 * so the suite still runs (minus gated specs) in environments without the
 * fixture account configured.
 */
export const E2E_EMAIL = process.env.E2E_TEST_EMAIL;
export const E2E_PASSWORD = process.env.E2E_TEST_PASSWORD;
export const hasE2eAccount = Boolean(E2E_EMAIL && E2E_PASSWORD);

const STORAGE_STATE_PATH = path.join(process.cwd(), "e2e", ".auth", "user.json");

async function loginViaUi(page: Page) {
  if (!E2E_EMAIL || !E2E_PASSWORD) {
    throw new Error("E2E_TEST_EMAIL / E2E_TEST_PASSWORD are not set");
  }
  await page.goto("/login");
  await page.getByLabel(/e.?mail|identifiant/i).fill(E2E_EMAIL);
  await page.locator('input[name="password"]').fill(E2E_PASSWORD);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 15_000 });
}

/** Reuses a cached logged-in session across the whole run when possible. */
export async function ensureAuthState(page: Page): Promise<void> {
  fs.mkdirSync(path.dirname(STORAGE_STATE_PATH), { recursive: true });
  await loginViaUi(page);
  await page.context().storageState({ path: STORAGE_STATE_PATH });
}

export const test = base.extend<{ authedPage: Page }>({
  authedPage: async ({ browser }, use) => {
    const context = fs.existsSync(STORAGE_STATE_PATH)
      ? await browser.newContext({ storageState: STORAGE_STATE_PATH })
      : await browser.newContext();
    const page = await context.newPage();
    if (!fs.existsSync(STORAGE_STATE_PATH)) {
      await ensureAuthState(page);
    }
    await use(page);
    await context.close();
  },
});

export { expect } from "@playwright/test";
