import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { verifyMcpCleanupAuthorization } from "../lib/mcp/cronAuth";

const root = path.resolve(import.meta.dirname, "..");
const config = JSON.parse(readFileSync(path.join(root, "vercel.json"), "utf8")) as { crons?: Array<{ path: string; schedule: string }> };
const crons = config.crons ?? [];

function withCronSecret<T>(value: string | undefined, run: () => Promise<T>): Promise<T> {
  const previous = process.env.CRON_SECRET;
  if (value === undefined) delete process.env.CRON_SECRET;
  else process.env.CRON_SECRET = value;
  return run().finally(() => {
    if (previous === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = previous;
  });
}

test("every cron declared in vercel.json maps to a route and every cron route is declared", () => {
  assert.ok(crons.length >= 2);
  for (const cron of crons) {
    assert.match(cron.path, /^\/api\/cron\/[a-z0-9-]+$/);
    assert.ok(existsSync(path.join(root, "app", cron.path, "route.ts")), `${cron.path} has no route`);
  }
  const routeDirs = readdirSync(path.join(root, "app/api/cron")).filter((name) => statSync(path.join(root, "app/api/cron", name)).isDirectory());
  assert.deepEqual(routeDirs.map((name) => `/api/cron/${name}`).sort(), crons.map((cron) => cron.path).sort(), "an undeclared cron route is an unscheduled public endpoint");
});

test("cron routes deny every request without the exact Bearer secret, before any work, and stay closed when CRON_SECRET is unset or short", async () => {
  const secret = "s".repeat(40);
  for (const cron of crons) {
    const { GET, POST } = (await import(`../app/${cron.path}/route`)) as { GET: (request: Request) => Promise<Response>; POST?: unknown };
    assert.equal(POST, undefined, `${cron.path} must expose GET only`);
    const call = (headers: Record<string, string>) => GET(new Request(`https://build.example${cron.path}`, { headers }));
    await withCronSecret(secret, async () => {
      for (const headers of [
        {},
        { authorization: "Bearer " },
        { authorization: `Bearer ${"x".repeat(40)}` },
        { authorization: `Bearer ${secret}x` },
        { authorization: `Bearer ${secret.slice(0, -1)}` },
        { authorization: secret },
        { authorization: `Basic ${secret}` },
        { authorization: `bearer ${secret}` },
        { "x-vercel-cron": "1" },
        { "x-vercel-forwarded-for": "76.76.21.21", "user-agent": "vercel-cron/1.0" },
      ]) {
        const response = await call(headers);
        assert.equal(response.status, 401, `${cron.path} ${JSON.stringify(headers)}`);
        assert.equal(response.headers.get("cache-control"), "no-store");
      }
    });
    for (const configured of [undefined, "", "short", "s".repeat(31)]) {
      await withCronSecret(configured, async () => {
        const response = await call({ authorization: `Bearer ${configured ?? ""}` });
        assert.equal(response.status, 401, `${cron.path} with CRON_SECRET=${JSON.stringify(configured)}`);
      });
    }
  }
});

test("cron authorization compares in constant time and refuses secrets under 32 characters", () => {
  const secret = "k".repeat(32);
  assert.equal(verifyMcpCleanupAuthorization(`Bearer ${secret}`, secret), true);
  assert.equal(verifyMcpCleanupAuthorization(`Bearer ${"k".repeat(31)}j`, secret), false);
  assert.equal(verifyMcpCleanupAuthorization(`Bearer ${secret}`, secret.slice(1)), false);
  const source = readFileSync(path.join(root, "lib/mcp/cronAuth.ts"), "utf8");
  assert.doesNotMatch(source, /===\s*configuredSecret|configuredSecret\s*===|provided\s*===/, "no short-circuit string comparison of the secret");
  for (const cron of crons) {
    const route = readFileSync(path.join(root, "app", cron.path, "route.ts"), "utf8") + readFileSync(path.join(root, "lib/mcp/cleanupRoute.ts"), "utf8");
    assert.doesNotMatch(route, /CRON_SECRET[^\n]*===|===[^\n]*CRON_SECRET/, `${cron.path}: CRON_SECRET must go through verifyMcpCleanupAuthorization`);
  }
});

test("cron schedules are well-formed and the retention cleanup is scheduled", () => {
  for (const cron of crons) assert.match(cron.schedule, /^[\d*/,-]+( [\d*/,-]+){4}$/, cron.path);
  assert.ok(crons.some((cron) => cron.path === "/api/cron/mcp-cleanup"), "the retention cleanup must be scheduled");
});
