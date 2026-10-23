import assert from "node:assert/strict";
import { mkdtemp, readFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

test("la CLI refuse HTTP hors boucle locale et normalise les origines sûres", async () => {
  const { normalizeOrigin } = await import("../scripts/build-admin/client.mjs");
  assert.throws(() => normalizeOrigin("http://example.com"), /HTTPS/);
  assert.equal(normalizeOrigin("http://127.0.0.1:3200/path"), "http://127.0.0.1:3200");
  assert.equal(normalizeOrigin("https://build.example/path"), "https://build.example");
});

test("la CLI refuse une redirection inter-origines avant de renvoyer la requête", async () => {
  const { requestWithOriginPolicy } = await import("../scripts/build-admin/client.mjs");
  let calls = 0;
  const fakeFetch = async () => {
    calls += 1;
    return new Response(null, { status: 302, headers: { location: "https://evil.example/collect" } });
  };
  await assert.rejects(
    () => requestWithOriginPolicy("https://build.example/api/agent/tools", { headers: { authorization: "Bearer secret" } }, { fetch: fakeFetch }),
    /autre origine/,
  );
  assert.equal(calls, 1);
});

test("le login écrit un fichier 0600 hors dépôt sans transformer le jeton", async () => {
  const directory = await mkdtemp(join(tmpdir(), "build-admin-test-"));
  process.env.BUILD_ADMIN_CONFIG_PATH = join(directory, "config.json");
  const moduleUrl = new URL(`../scripts/build-admin/client.mjs?config=${Date.now()}`, import.meta.url);
  const { CONFIG_PATH, saveConfig } = await import(moduleUrl.href);
  const token = `btv_agt_${"a".repeat(43)}`;
  await saveConfig("https://build.example", token);
  const mode = (await stat(CONFIG_PATH)).mode & 0o777;
  assert.equal(mode, 0o600);
  assert.deepEqual(JSON.parse(await readFile(CONFIG_PATH, "utf8")), { origin: "https://build.example", token });
  delete process.env.BUILD_ADMIN_CONFIG_PATH;
});

test("le login refuse de stocker le jeton dans le dépôt", async () => {
  process.env.BUILD_ADMIN_CONFIG_PATH = join(process.cwd(), ".agent-token-test.json");
  const moduleUrl = new URL(`../scripts/build-admin/client.mjs?inside=${Date.now()}`, import.meta.url);
  const { saveConfig } = await import(moduleUrl.href);
  await assert.rejects(
    () => saveConfig("https://build.example", `btv_agt_${"a".repeat(43)}`),
    /hors du dépôt/,
  );
  delete process.env.BUILD_ADMIN_CONFIG_PATH;
});
