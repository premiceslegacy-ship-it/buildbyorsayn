import type { Page } from "@playwright/test";
import { test, expect, hasE2eAccount } from "./fixtures/auth";
import { test as publicTest, expect as publicExpect } from "@playwright/test";

/**
 * La CSP des pages porte un nonce par requête (proxy.ts, lib/csp.ts) : aucun script inline sans nonce,
 * aucune violation dans la console, une seule politique par réponse.
 */
const PUBLIC_PATHS = ["/", "/login", "/checkout", "/cgv", "/mentions-legales", "/confidentialite", "/cookies", "/nouveautes"];
const MEMBER_PATHS = ["/dashboard", "/blocs/1", "/skills", "/checkout"];

async function watchViolations(page: Page): Promise<() => string[]> {
  const hits: string[] = [];
  await page.exposeFunction("reportCspViolation", (entry: string) => {
    hits.push(entry);
  });
  page.on("console", (message) => {
    if (/content security policy|refused to (execute|load|apply|connect|frame)/i.test(message.text())) hits.push(message.text());
  });
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (event) => {
      void Reflect.get(window, "reportCspViolation")(`${event.violatedDirective} ${event.blockedURI}`);
    });
  });
  return () => hits;
}

publicTest.describe("CSP à nonce (public)", () => {
  for (const path of PUBLIC_PATHS) {
    publicTest(`${path} : aucune violation CSP`, async ({ page }) => {
      const violations = await watchViolations(page);
      const response = await page.goto(path, { waitUntil: "load" });
      publicExpect(response?.status()).toBe(200);
      await page.waitForTimeout(1_000);
      publicExpect(violations()).toEqual([]);
    });
  }

  publicTest("une seule CSP, nonce différent à chaque requête, tous les scripts inline le portent, pas d'unsafe-inline en script", async ({ request }) => {
    const first = await request.get("/login");
    const second = await request.get("/login");
    const policy = first.headers()["content-security-policy"] ?? "";
    publicExpect(policy.match(/script-src [^;]*/)?.[0]).not.toContain("'unsafe-inline'");
    publicExpect(policy.match(/script-src [^;]*/)?.[0]).not.toContain("'unsafe-eval'");
    const nonceOf = (value: string) => /'nonce-([^']+)'/.exec(value)?.[1];
    const nonce = nonceOf(policy);
    publicExpect(nonce).toBeTruthy();
    publicExpect(nonce).not.toBe(nonceOf(second.headers()["content-security-policy"] ?? ""));
    const html = await first.text();
    const inlineScripts = [...html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>/g)].map((match) => match[0]);
    publicExpect(inlineScripts.length).toBeGreaterThan(0);
    for (const tag of inlineScripts) publicExpect(tag).toContain(`nonce="${nonce}"`);
  });

  publicTest("les API répondent avec une CSP qui n'autorise rien", async ({ request }) => {
    const response = await request.get("/api/skills/metadata");
    publicExpect(response.headers()["content-security-policy"]).toBe("default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
  });
});

test.describe("CSP à nonce (membre)", () => {
  test.skip(!hasE2eAccount, "E2E_TEST_EMAIL/E2E_TEST_PASSWORD not configured");

  for (const path of MEMBER_PATHS) {
    test(`${path} : aucune violation CSP`, async ({ authedPage: page }) => {
      const violations = await watchViolations(page);
      const response = await page.goto(path, { waitUntil: "load" });
      expect(response?.status()).toBe(200);
      await page.waitForTimeout(1_000);
      expect(violations()).toEqual([]);
    });
  }
});
