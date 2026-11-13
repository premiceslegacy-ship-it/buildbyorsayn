/// <reference lib="es2024.promise" />
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createServer, type Server } from "node:http";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { main } from "../public/build-sync/build.mjs";

async function listen(server: Server): Promise<string> {
  const { promise, resolve, reject } = Promise.withResolvers<void>();
  server.once("error", reject);
  server.listen(0, "127.0.0.1", resolve);
  await promise;
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  return `http://127.0.0.1:${address.port}`;
}

async function withState(baseUrl: string, expired: boolean, run: (home: string) => Promise<void>) {
  const home = await mkdtemp(path.join(os.tmpdir(), "build-sync-security-"));
  const state = path.join(home, "state");
  const previous = { HOME: process.env.HOME, BUILD_SYNC_HOME: process.env.BUILD_SYNC_HOME };
  try {
    await mkdir(state);
    await writeFile(path.join(state, "config.json"), JSON.stringify({ baseUrl, agents: ["codex"], schedulerEnabled: false }));
    await writeFile(path.join(state, "credentials.json"), JSON.stringify({
      baseUrl, accessToken: "synthetic-access", refreshToken: "synthetic-refresh",
      accessExpiresAt: expired ? 0 : Date.now() + 600_000,
    }));
    process.env.HOME = home;
    process.env.BUILD_SYNC_HOME = state;
    await run(home);
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
    await rm(home, { recursive: true, force: true });
  }
}

test("token refresh refuses redirects before a credential body reaches another origin, while direct refresh works", async () => {
  let leakedRequests = 0;
  let redirect = true;
  const receiver = createServer((_request, response) => {
    leakedRequests += 1;
    response.writeHead(400).end();
  });
  const receiverUrl = await listen(receiver);
  let refreshed = 0;
  const server = createServer((request, response) => {
    if (request.url === "/api/build-sync/oauth/token") {
      if (redirect) response.writeHead(307, { location: `${receiverUrl}/collect` }).end();
      else {
        refreshed += 1;
        response.setHeader("content-type", "application/json");
        response.end(JSON.stringify({ access_token: "fresh-access", refresh_token: "fresh-refresh", expires_in: 900 }));
      }
      return;
    }
    assert.equal(request.headers.authorization, "Bearer fresh-access");
    response.setHeader("content-type", "application/json");
    response.end(JSON.stringify({ releaseId: "local", artifacts: [] }));
  });
  const baseUrl = await listen(server);
  try {
    await withState(baseUrl, true, async (home) => {
      await assert.rejects(main(["update", "--quiet"]));
      assert.equal(leakedRequests, 0, "refresh credentials must never leave their original endpoint");
      redirect = false;
      await main(["update", "--quiet"]);
      assert.equal(refreshed, 1);
      const credentials = JSON.parse(await readFile(path.join(home, "state", "credentials.json"), "utf8"));
      assert.equal(credentials.refreshToken, "fresh-refresh");
    });
  } finally {
    const closing = [server, receiver].map((target) => {
      const { promise, resolve } = Promise.withResolvers<void>();
      target.close(() => resolve());
      return promise;
    });
    await Promise.all(closing);
  }
});

test("artifact download stops and cancels an oversized stream before buffering it all, while a valid skill installs", async () => {
  const priorFetch = globalThis.fetch;
  const bytes = Buffer.from("---\nname: sample\n---\nA legitimate skill.\n");
  let oversized = true;
  let pulls = 0;
  let cancelled = false;
  const maxBytes = 50 * 1024 * 1024;
  const chunk = new Uint8Array(1024 * 1024);
  const baseUrl = "http://127.0.0.1:35439";
  globalThis.fetch = async (input) => {
    const url = new URL(String(input));
    assert.equal(url.origin, baseUrl);
    if (url.pathname.endsWith("/catalog")) return Response.json({ releaseId: "local", artifacts: [{
      slug: "sample", title: "Sample", fileName: "sample.md",
      sha256: createHash("sha256").update(bytes).digest("hex"), downloadUrl: "/api/build-sync/artifacts/sample",
    }] });
    if (!oversized) return new Response(bytes);
    return new Response(new ReadableStream({
      pull(controller) {
        pulls += 1;
        if (pulls <= 60) controller.enqueue(chunk); else controller.close();
      },
      cancel() { cancelled = true; },
    }, { highWaterMark: 0 }));
  };
  try {
    await withState(baseUrl, false, async (home) => {
      await assert.rejects(main(["update", "--quiet"]), /volumineuse/i);
      assert.equal(cancelled, true, "oversized response must be cancelled");
      assert.ok(pulls <= maxBytes / chunk.byteLength + 1, "do not consume the remainder after crossing the limit");
      oversized = false;
      await main(["update", "--quiet"]);
      const installed = await readFile(path.join(home, ".codex", "skills", "sample", "SKILL.md"), "utf8");
      assert.ok(installed.includes("A legitimate skill."));
    });
  } finally {
    globalThis.fetch = priorFetch;
  }
});
