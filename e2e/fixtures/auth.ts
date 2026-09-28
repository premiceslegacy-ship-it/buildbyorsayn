import { test as base, type Browser, type Page } from "@playwright/test";
import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs";

/**
 * E2E auth fixtures. Require dedicated Supabase test accounts via env vars -
 * never a real user's credentials, and never committed.
 * Missing env vars skip auth-gated tests rather than failing the whole run,
 * so the suite still runs (minus gated specs) in environments without the
 * fixture accounts configured.
 */
export const E2E_EMAIL = process.env.E2E_TEST_EMAIL;
export const E2E_PASSWORD = process.env.E2E_TEST_PASSWORD;
export const hasE2eAccount = Boolean(E2E_EMAIL && E2E_PASSWORD);

export const BEGINNER_E2E_EMAIL = process.env.E2E_BEGINNER_TEST_EMAIL;
export const BEGINNER_E2E_PASSWORD = process.env.E2E_BEGINNER_TEST_PASSWORD;
export const hasBeginnerE2eAccount = Boolean(BEGINNER_E2E_EMAIL && BEGINNER_E2E_PASSWORD);

const STORAGE_STATE_PATH = path.join(process.cwd(), "e2e", ".auth", "user.json");
const BEGINNER_STORAGE_STATE_PATH = path.join(process.cwd(), "e2e", ".auth", "beginner.json");
type AuthStateKey = "full" | "beginner";

type AuthStateMetadata = {
  accountKey: AuthStateKey;
  emailHash: string;
  stateHash: string;
};

function sha256(value: string | Buffer): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function metadataPath(storageStatePath: string): string {
  return `${storageStatePath}.meta.json`;
}

function hasBoundAuthState(storageStatePath: string, accountKey: AuthStateKey, email: string | undefined): boolean {
  if (!email || !fs.existsSync(storageStatePath) || !fs.existsSync(metadataPath(storageStatePath))) return false;
  try {
    const metadata = JSON.parse(fs.readFileSync(metadataPath(storageStatePath), "utf8")) as AuthStateMetadata;
    const stateHash = sha256(fs.readFileSync(storageStatePath));
    return metadata.accountKey === accountKey
      && metadata.emailHash === sha256(email.trim().toLowerCase())
      && metadata.stateHash === stateHash;
  } catch {
    return false;
  }
}

async function saveBoundAuthState(page: Page, storageStatePath: string, accountKey: AuthStateKey, email: string): Promise<void> {
  await page.context().storageState({ path: storageStatePath });
  const metadata: AuthStateMetadata = {
    accountKey,
    emailHash: sha256(email.trim().toLowerCase()),
    stateHash: sha256(fs.readFileSync(storageStatePath)),
  };
  fs.writeFileSync(metadataPath(storageStatePath), `${JSON.stringify(metadata)}\n`, { mode: 0o600 });
}

async function loginViaUi(page: Page, email: string | undefined, password: string | undefined) {
  if (!email || !password) {
    throw new Error("The requested E2E account variables are not set");
  }
  await page.goto("/login");
  await page.getByLabel(/e.?mail|identifiant/i).fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 15_000 });
}

async function openAuthenticatedPage(
  browser: Browser,
  storageStatePath: string,
  accountKey: AuthStateKey,
  email: string | undefined,
  password: string | undefined
): Promise<{ page: Page; close: () => Promise<void> }> {
  const hasState = hasBoundAuthState(storageStatePath, accountKey, email);
  const context = hasState
    ? await browser.newContext({ storageState: storageStatePath })
    : await browser.newContext();
  const page = await context.newPage();
  if (!hasState) {
    await loginViaUi(page, email, password);
    await saveBoundAuthState(page, storageStatePath, accountKey, email!);
  }
  return { page, close: () => context.close() };
}

/** Reuses a cached logged-in session across the whole run when possible. */
export async function ensureAuthState(page: Page): Promise<void> {
  fs.mkdirSync(path.dirname(STORAGE_STATE_PATH), { recursive: true });
  await loginViaUi(page, E2E_EMAIL, E2E_PASSWORD);
  await saveBoundAuthState(page, STORAGE_STATE_PATH, "full", E2E_EMAIL!);
}

export const test = base.extend<{ authedPage: Page; beginnerPage: Page }>({
  authedPage: async ({ browser }, use) => {
    fs.mkdirSync(path.dirname(STORAGE_STATE_PATH), { recursive: true });
    const session = await openAuthenticatedPage(browser, STORAGE_STATE_PATH, "full", E2E_EMAIL, E2E_PASSWORD);
    await use(session.page);
    await session.close();
  },
  beginnerPage: async ({ browser }, use) => {
    fs.mkdirSync(path.dirname(BEGINNER_STORAGE_STATE_PATH), { recursive: true });
    const session = await openAuthenticatedPage(
      browser,
      BEGINNER_STORAGE_STATE_PATH,
      "beginner",
      BEGINNER_E2E_EMAIL,
      BEGINNER_E2E_PASSWORD
    );
    await use(session.page);
    await session.close();
  },
});

export { expect } from "@playwright/test";
