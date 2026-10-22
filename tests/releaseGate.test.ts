import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("la porte de release contrôle le contenu privé après le build", () => {
  const manifest = JSON.parse(readFileSync("package.json", "utf8")) as { scripts: Record<string, string> };
  assert.equal(manifest.scripts["content:private-check"], "tsx scripts/check-private-content.ts");
  const release = manifest.scripts["verify:release"];
  assert.ok(release.indexOf("npm run test:mcp-e2e") < release.indexOf("npm run content:private-check"));
});

test("les pages protégées gardent leur contenu dans des Server Components", () => {
  const requirements: Record<string, string> = {
    "app/intro/page.tsx": 'requirePageAccess("full", "/intro")',
    "app/fin/page.tsx": 'requirePageAccess("full", "/fin")',
    "app/sources/page.tsx": 'requirePageAccess("beginner", "/sources")',
    "app/beginner/page.tsx": 'requirePageAccess("beginner", "/beginner")',
    "app/skills/page.tsx": 'requirePageAccess("authenticated", "/skills")',
  };
  for (const [path, accessCheck] of Object.entries(requirements)) {
    const source = readFileSync(path, "utf8");
    assert.doesNotMatch(source, /^["']use client["'];/m, path);
    assert.ok(source.includes(accessCheck), `${path} doit vérifier son accès côté serveur`);
  }
});
