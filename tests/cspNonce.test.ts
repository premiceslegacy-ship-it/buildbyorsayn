import assert from "node:assert/strict";
import test from "node:test";
import { API_CONTENT_SECURITY_POLICY, buildContentSecurityPolicy, createCspNonce } from "../lib/csp";
import { isGuardedPath } from "../proxy";
import { createUpgradeCheckoutCache } from "../lib/upgradeCheckoutCache";

const NONCE = "dGVzdC1ub25jZS0xMjM0NQ==";

function directive(policy: string, name: string): string[] {
  const entry = policy.split("; ").find((part) => part.startsWith(`${name} `));
  assert.ok(entry, `directive ${name} manquante`);
  return entry.split(" ").slice(1);
}

test("script-src : nonce, ni unsafe-inline ni unsafe-eval en production", () => {
  const policy = buildContentSecurityPolicy({ nonce: NONCE, deployed: true });
  const scripts = directive(policy, "script-src");
  assert.ok(scripts.includes(`'nonce-${NONCE}'`));
  assert.ok(!scripts.includes("'unsafe-inline'"));
  assert.ok(!scripts.includes("'unsafe-eval'"));
  assert.ok(scripts.includes("https://js.stripe.com") && scripts.includes("https://src.litix.io"));
});

test("unsafe-eval seulement en développement", () => {
  const dev = buildContentSecurityPolicy({ nonce: NONCE, deployed: false, development: true });
  assert.ok(directive(dev, "script-src").includes("'unsafe-eval'"));
  assert.ok(!directive(dev, "script-src").includes("'unsafe-inline'"));
});

test("upgrade-insecure-requests seulement quand deployed (Safari local sans style)", () => {
  assert.ok(buildContentSecurityPolicy({ nonce: NONCE, deployed: true }).includes("upgrade-insecure-requests"));
  assert.ok(!buildContentSecurityPolicy({ nonce: NONCE, deployed: false }).includes("upgrade-insecure-requests"));
});

test("lecture Mux, YouTube et Stripe conservées, framing et objets interdits", () => {
  const policy = buildContentSecurityPolicy({ nonce: NONCE, deployed: true });
  assert.deepEqual(directive(policy, "media-src"), ["'self'", "blob:", "https://*.mux.com"]);
  assert.deepEqual(directive(policy, "worker-src"), ["'self'", "blob:"]);
  assert.ok(directive(policy, "frame-src").includes("https://www.youtube-nocookie.com"));
  assert.ok(directive(policy, "connect-src").includes("https://*.mux.com"));
  assert.deepEqual(directive(policy, "frame-ancestors"), ["'none'"]);
  assert.deepEqual(directive(policy, "object-src"), ["'none'"]);
  assert.deepEqual(directive(policy, "base-uri"), ["'self'"]);
});

test("un nonce qui n'est pas du base64 est refusé (pas d'injection de directive)", () => {
  for (const bad of ["a'; script-src *", "abc def", "", "x;y"]) {
    assert.throws(() => buildContentSecurityPolicy({ nonce: bad, deployed: false }), bad);
  }
});

test("chaque requête reçoit un nonce différent, d'au moins 128 bits", () => {
  const nonces = new Set(Array.from({ length: 200 }, () => createCspNonce()));
  assert.equal(nonces.size, 200);
  for (const nonce of nonces) assert.equal(Buffer.from(nonce, "base64").length, 16);
});

test("la CSP des API n'autorise rien", () => {
  assert.match(API_CONTENT_SECURITY_POLICY, /^default-src 'none'; frame-ancestors 'none'/);
});

test("le garde du proxy couvre les mêmes chemins que l'ancien matcher, y compris encodés", () => {
  const guarded = ["/dashboard", "/dashboard/mcp", "/blocs/1", "/sources", "/skills", "/fin", "/intro", "/videos/tutos", "/videos/tutos/learn/x", "/admin", "/admin/x", "/beginner", "/beginner/s1", "/protocole", "/accompagnement/espace", "/accompagnement/espace/guide", "/mcp/consent", "/build-sync/consent", "/%66in", "/%61dmin/x", "/f%69n"];
  for (const path of guarded) assert.equal(isGuardedPath(path), true, path);
  const open = ["/", "/login", "/checkout", "/checkout/upgrade", "/cgv", "/nouveautes", "/accompagnement", "/accompagnement/site-web", "/skillset", "/dashboards", "/%zz"];
  for (const path of open) assert.equal(isGuardedPath(path), false, path);
});

test("mémoire du complément : une URL par compte et par fenêtre, bornée", () => {
  const cache = createUpgradeCheckoutCache(1_000);
  assert.equal(cache.get("u1", 0), null);
  cache.set("u1", "https://checkout.stripe.com/c/pay/a", 100);
  assert.equal(cache.get("u1", 999), "https://checkout.stripe.com/c/pay/a");
  assert.equal(cache.get("u2", 999), null, "jamais l'URL d'un autre compte");
  assert.equal(cache.get("u1", 1_000), null, "nouvelle fenêtre : nouvelle clé d'idempotence");
  for (let i = 0; i < 600; i += 1) cache.set(`user-${i}`, "https://checkout.stripe.com/c/pay/x", 5);
  assert.ok(cache.size() <= 500);
});
