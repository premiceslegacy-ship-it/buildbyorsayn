import { test, expect } from "@playwright/test";

// Exercise the real UI/SDK against an isolated Auth transport, never a customer account.
test("an eight-digit recovery code can set a password without truncation", async ({ page }) => {
  const code = "01234567";
  const user = {
    id: "11111111-1111-4111-8111-111111111111", aud: "authenticated", role: "authenticated",
    email: "recovery@example.test", email_confirmed_at: "2026-01-01T00:00:00Z",
    app_metadata: {}, user_metadata: {}, created_at: "2026-01-01T00:00:00Z",
  };
  const token = [
    { alg: "HS256", typ: "JWT" },
    { sub: user.id, exp: 4102444800, aud: "authenticated", role: "authenticated" },
  ].map((part) => Buffer.from(JSON.stringify(part)).toString("base64url")).join(".") + ".isolated-test";

  await page.route("**/api/activity", (route) => route.fulfill({ status: 204 }));
  await page.route("https://*.supabase.co/**", async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    const headers = {
      "access-control-allow-origin": new URL(page.url()).origin,
      "access-control-allow-headers": "*", "access-control-allow-methods": "GET,POST,PUT,OPTIONS",
      "access-control-expose-headers": "x-supabase-api-version", "x-supabase-api-version": "2024-01-01",
    };
    const respond = (body: unknown, status = 200) => route.fulfill({ status, headers, json: body });
    if (request.method() === "OPTIONS") return respond({});
    if (path === "/auth/v1/recover") return respond({});
    if (path === "/auth/v1/verify") {
      const input = request.postDataJSON();
      if (input.token !== code || input.email !== user.email || input.type !== "recovery") {
        return respond({ code: "otp_expired", message: "Invalid code" }, 403);
      }
      return respond({ access_token: token, refresh_token: "isolated-refresh", expires_in: 3600, token_type: "bearer", user });
    }
    if (path === "/auth/v1/user" && request.method() === "PUT" && request.postDataJSON().password === "UniqueRecovery42") {
      return respond(user);
    }
    return respond({ code: "unexpected_request" }, 400);
  });

  await page.goto("/forgot-password");
  await page.getByLabel("E‑mail", { exact: true }).fill(user.email);
  await page.getByRole("button", { name: "Envoyer le code", exact: true }).click();
  const input = page.getByLabel("Code de vérification", { exact: true });
  await input.fill("0123456");
  await page.getByRole("button", { name: "Vérifier le code", exact: true }).click();
  await expect(page.locator(".ui3-auth-alert[role=\"alert\"]")).toBeVisible();
  await expect(page).toHaveURL(/\/forgot-password$/);
  await input.fill(code);
  await page.getByRole("button", { name: "Vérifier le code", exact: true }).click();
  await expect(page).toHaveURL(/\/update-password$/);
  await page.getByLabel("Nouveau mot de passe", { exact: true }).fill("UniqueRecovery42");
  await page.getByLabel("Écris-le encore une fois", { exact: true }).fill("UniqueRecovery42");
  await page.getByRole("button", { name: "Enregistrer le mot de passe", exact: true }).click();
  await expect(page.getByRole("link", { name: "Accéder à mon espace", exact: true })).toHaveAttribute("href", "/dashboard");
});
