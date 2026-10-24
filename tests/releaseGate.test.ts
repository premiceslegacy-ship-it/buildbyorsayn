import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";

test("la porte de release contrôle le contenu privé après le build", () => {
  const manifest = JSON.parse(readFileSync("package.json", "utf8")) as { scripts: Record<string, string> };
  assert.equal(manifest.scripts["content:private-check"], "tsx scripts/check-private-content.ts");
  const release = manifest.scripts["verify:release"];
  assert.ok(release.indexOf("npm run test:mcp-e2e") < release.indexOf("npm run content:private-check"));
});

test("la porte de release ne référence que des sous-commandes déclarées", () => {
  const manifest = JSON.parse(readFileSync("package.json", "utf8")) as { scripts: Record<string, string> };
  assert.equal(manifest.scripts["verify:stripe-pricing"], "tsx scripts/verify-stripe-pricing.ts");
  const release = manifest.scripts["verify:release"];
  for (const match of release.matchAll(/npm run ([a-z0-9:_-]+)/g)) {
    assert.ok(manifest.scripts[match[1]], `sous-commande absente: ${match[1]}`);
  }
});

test("la porte de release vérifie les identifiants Resend du préflight local/CI", () => {
  const manifest = JSON.parse(readFileSync("package.json", "utf8")) as { scripts: Record<string, string> };
  const preflight = readFileSync("scripts/check-release-email-env.ts", "utf8");
  assert.equal(manifest.scripts["check:release-email-env"], "tsx scripts/check-release-email-env.ts --production");
  assert.match(manifest.scripts["verify:release"], /npm run check:release-email-env/);
  assert.match(preflight, /RESEND_API_KEY/);
  assert.match(preflight, /RESEND_FROM_EMAIL/);
  assert.match(preflight, /does not inspect or confirm Vercel/);
});

test("le préflight production accepte une configuration Resend complète", () => {
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "scripts/check-release-email-env.ts", "--production"],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        RESEND_API_KEY: "test",
        RESEND_FROM_EMAIL: "BUILD <updates@example.test>",
      },
    },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /configuration is present/);
});

test("le préflight production refuse une configuration Resend absente", () => {
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "scripts/check-release-email-env.ts", "--production"],
    {
      encoding: "utf8",
      env: { ...process.env, RESEND_API_KEY: "", RESEND_FROM_EMAIL: "" },
    },
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Production email configuration is missing/);
});

test("les pages protégées gardent leur contenu dans des Server Components", () => {
  const requirements: Record<string, string> = {
    "app/intro/page.tsx": 'requirePageAccess("full", "/intro")',
    "app/sources/page.tsx": 'requirePageAccess("beginner", "/sources")',
    "app/beginner/page.tsx": 'requirePageAccess("beginner", "/beginner")',
    "app/skills/page.tsx": 'requirePageAccess("authenticated", "/skills")',
    "app/dashboard/page.tsx": 'requirePageAccess("authenticated", "/dashboard")',
    "app/programme/page.tsx": 'requirePageAccess("authenticated", "/programme")',
  };
  for (const [path, accessCheck] of Object.entries(requirements)) {
    const source = readFileSync(path, "utf8");
    assert.doesNotMatch(source, /^["']use client["'];/m, path);
    assert.ok(source.includes(accessCheck), `${path} doit vérifier son accès côté serveur`);
  }

  const purchaseConfirmation = readFileSync("app/fin/page.tsx", "utf8");
  assert.doesNotMatch(purchaseConfirmation, /^["']use client["'];/m);
  assert.match(purchaseConfirmation, /auth\.getUser\(\)/);
  assert.match(purchaseConfirmation, /from\("profiles"\)/);
  assert.match(purchaseConfirmation, /normalizeProfileTier/);
  assert.doesNotMatch(purchaseConfirmation, /searchParams|params\.niveau|params\.etat/);
});
