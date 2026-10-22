import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  findUnlistedHosts,
  HOST_ALLOWLIST,
  hostsInLine,
  isAllowedHost,
  ownHosts,
  scanDomainReferences,
} from "../scripts/check-domain-references";
import { BUILD_SYNC_SCRIPT_DEFAULT_ORIGIN } from "../lib/buildSync/installCommands";

async function fixture(files: Record<string, string>) {
  const root = await mkdtemp(path.join(os.tmpdir(), "domain-check-"));
  for (const [file, content] of Object.entries(files)) {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await writeFile(path.join(root, file), content);
  }
  return root;
}

test("hosts are read from URLs and e-mail addresses, and documentation hosts are ignored", () => {
  assert.deepEqual(hostsInLine(`fetch("https://Api.Stripe.com/v1/x?y=1") // build@orsayn.fr`), ["api.stripe.com", "orsayn.fr"]);
  assert.deepEqual(hostsInLine("https://example.com https://app.example.org https://x.invalid http://localhost:3000 http://127.0.0.1:49152/callback"), []);
  assert.deepEqual(hostsInLine("import logo from 'logo@2x.png'"), []);
});

test("the checker reports a hard-coded host that is not on the allowlist, with its file and line", async () => {
  const root = await fixture({
    "lib/a.ts": `export const known = "https://claude.ai/x";\nexport const sneaky = "https://nouveau-domaine-pas-declare.fr/api";\n`,
    "public/build-sync/install.sh": `ORIGIN="\${BASE:-https://surprise-hote.vercel.app}"\n`,
  });
  try {
    const unlisted = findUnlistedHosts(scanDomainReferences(root));
    assert.deepEqual([...unlisted.keys()].sort(), ["nouveau-domaine-pas-declare.fr", "surprise-hote.vercel.app"]);
    assert.deepEqual(unlisted.get("nouveau-domaine-pas-declare.fr"), [{ file: path.join("lib", "a.ts"), line: 2 }]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("the checker skips tests, docs, dependencies and build output", async () => {
  const root = await fixture({
    "tests/x.test.ts": `"https://hote-de-test.fr"`,
    "lib/y.test.ts": `"https://hote-de-test-2.fr"`,
    "docs/z.md": `https://hote-de-doc.fr`,
    "node_modules/m/index.js": `"https://hote-de-dependance.fr"`,
    ".next/static/c.js": `"https://hote-de-build.fr"`,
    "lib/ok.ts": `"https://js.stripe.com/v3"`,
  });
  try {
    assert.deepEqual([...findUnlistedHosts(scanDomainReferences(root)).keys()], []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("wildcard entries cover the domain and its subdomains but never a lookalike", () => {
  assert.ok(isAllowedHost("stripe.com"));
  assert.ok(isAllowedHost("js.stripe.com"));
  assert.ok(isAllowedHost("abc.supabase.co"));
  assert.equal(isAllowedHost("stripe.com.evil.fr"), false);
  assert.equal(isAllowedHost("notstripe.com"), false);
  assert.equal(isAllowedHost("build-system-three.vercel.app"), true);
  assert.equal(isAllowedHost("autre.vercel.app"), false);
});

test("every allowlist entry says why it is there and is declared once", () => {
  const seen: string[] = [];
  for (const entry of HOST_ALLOWLIST) {
    assert.ok(entry.why.trim().length >= 10, `${entry.host}: missing reason`);
    assert.ok(!seen.includes(entry.host), `${entry.host}: declared twice`);
    seen.push(entry.host);
  }
});

test("the real repository has no undeclared hard-coded host", () => {
  const unlisted = findUnlistedHosts(scanDomainReferences(process.cwd()));
  assert.deepEqual(
    [...unlisted].map(([host, where]) => `${host} (${where[0].file}:${where[0].line})`),
    [],
  );
});

test("the BUILD hosts of the allowlist are exactly the ones the repository still uses, and the script default is among them", () => {
  const references = scanDomainReferences(process.cwd());
  for (const host of ownHosts()) assert.ok(references.has(host), `${host} is on the allowlist as ours but no file cites it any more`);
  assert.ok(ownHosts().includes(new URL(BUILD_SYNC_SCRIPT_DEFAULT_ORIGIN).host));
  // Tout hôte qui se termine comme nos domaines est déclaré comme le nôtre, pas comme un service tiers.
  for (const host of references.keys()) {
    if (/(?:^|\.)(?:vercel\.app|orsayn\.fr|orsayn\.com|buildbyorsayn\.com)$/.test(host)) {
      assert.ok(ownHosts().includes(host), `${host} looks like ours and must be declared with kind "own"`);
    }
  }
});

test("DOMAIN-MIGRATION.md cites every host of ours from the allowlist and keeps the writing rules", async () => {
  const runbook = await readFile("DOMAIN-MIGRATION.md", "utf8");
  for (const host of ownHosts()) assert.ok(runbook.includes(host), `${host} is on the allowlist but not cited in DOMAIN-MIGRATION.md`);
  assert.doesNotMatch(runbook, /[\u2014\u2013\u2022\u00b7\u25e6\u25aa\u2023]/, "no long dash, no bullet character");
  assert.doesNotMatch(runbook, /^\s*\*\s/m, "no markdown star list");
  for (const heading of ["1) Pré-requis et décisions", "2) Inventaire des endroits", "3) Ordre de bascule", "4) Double période", "5) Vérifications après bascule", "6) Retour arrière", "7) Ce qui ne se rattrape pas"]) {
    assert.ok(runbook.includes(`## ${heading}`), `missing section: ${heading}`);
  }
});

test("every variable and file that the runbook tells you to touch exists in the repository", async () => {
  const runbook = await readFile("DOMAIN-MIGRATION.md", "utf8");
  const files = [...runbook.matchAll(/`((?:app|lib|components|public|scripts|tests)\/[A-Za-z0-9_./\[\]()-]+\.[a-z]+)`/g)].map((match) => match[1]);
  assert.ok(files.length > 10);
  for (const file of new Set(files)) await readFile(file, "utf8").catch(() => assert.fail(`DOMAIN-MIGRATION.md cites a missing file: ${file}`));
  const envExample = await readFile(".env.example", "utf8");
  for (const variable of ["MCP_OAUTH_ISSUER", "BUILD_SYNC_OAUTH_ISSUER", "MUX_PLAYBACK_RESTRICTION_ID", "RESEND_FROM_EMAIL", "CRON_SECRET", "STRIPE_WEBHOOK_SECRET"]) {
    assert.ok(runbook.includes(variable) && envExample.includes(variable), `${variable} must be in the runbook and in .env.example`);
  }
});
