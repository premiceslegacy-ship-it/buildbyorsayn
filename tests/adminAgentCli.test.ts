import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
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

test("la CLI envoie uniquement les en-têtes attendus à la route et masque un jeton renvoyé par erreur", async () => {
  const { callTool } = await import("../scripts/build-admin/client.mjs");
  const token = `btv_agt_${"b".repeat(43)}`;
  let observedUrl = "";
  let observedHeaders = new Headers();
  const fakeFetch = async (input: URL | RequestInfo, init?: RequestInit) => {
    observedUrl = String(input);
    observedHeaders = new Headers(init?.headers);
    return Response.json({ ok: false, error: `Jeton refusé : ${token}` }, { status: 401 });
  };
  await assert.rejects(
    () => callTool("journal", { limit: 1 }, {
      config: { origin: "https://build.example", token },
      fetch: fakeFetch,
    }),
    (error: Error) => !error.message.includes(token) && error.message.includes("jeton masqué"),
  );
  assert.equal(observedUrl, "https://build.example/api/agent/tools");
  assert.equal(observedHeaders.get("authorization"), `Bearer ${token}`);
  assert.equal(observedHeaders.get("content-type"), "application/json");
  assert.equal(observedHeaders.has("x-vercel-forwarded-for"), false);
});

test("le login n'affiche jamais le jeton et les commandes statut et journal sont câblées", async () => {
  const directory = await mkdtemp(join(tmpdir(), "build-admin-login-"));
  const configPath = join(directory, "config.json");
  const token = `btv_agt_${"c".repeat(43)}`;
  const result = spawnSync(process.execPath, [
    "scripts/build-admin/build-admin.mjs",
    "login",
    "--origin", "https://build.example",
    "--token", token,
    "--json",
  ], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: { ...process.env, BUILD_ADMIN_CONFIG_PATH: configPath },
  });
  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(`${result.stdout}${result.stderr}`, new RegExp(token));
  const source = await readFile("scripts/build-admin/build-admin.mjs", "utf8");
  assert.match(source, /command === "statut"[\s\S]*callTool\("statut_video"/);
  assert.match(source, /command === "journal"[\s\S]*callTool\("journal"/);
});
test("video envoyer transmet le titre et la validation uploadInput au premier appel", async () => {
  const directory = await mkdtemp(join(tmpdir(), "build-admin-video-"));
  const file = join(directory, "cours.mp4");
  await writeFile(file, "video");
  const { uploadVideo } = await import(`../scripts/build-admin/client.mjs?upload=${Date.now()}`);
  const calls: Array<{ tool: string; input: Record<string, unknown> }> = [];
  const fakeFetch = async (input: URL | RequestInfo, init?: RequestInit) => {
    const url = String(input);
    if (url === "https://build.example/api/agent/tools") {
      const payload = JSON.parse(String(init?.body)) as { tool: string; input: Record<string, unknown> };
      calls.push(payload);
      if (payload.tool === "envoyer_video") {
        assert.equal(payload.input.title, "Chapitre test");
        return Response.json({ ok: true, result: { structuredContent: { videoId: "123e4567-e89b-42d3-a456-426614174000", uploadUrl: "https://mux.example/upload" } } });
      }
      assert.equal(payload.tool, "statut_video");
      return Response.json({ ok: true, result: { structuredContent: { status: "ready" } } });
    }
    assert.equal(url, "https://mux.example/upload");
    return new Response(null, { status: 200 });
  };
  const result = await uploadVideo(file, 3, 1, "Chapitre test", {
    config: { origin: "https://build.example", token: `btv_agt_${"d".repeat(43)}` },
    fetch: fakeFetch,
    timeoutMs: 1_000,
    pollIntervalMs: 1,
  });
  assert.deepEqual(result, { videoId: "123e4567-e89b-42d3-a456-426614174000", status: "ready" });
  assert.deepEqual(calls.map((call) => call.tool), ["envoyer_video", "statut_video"]);
});
