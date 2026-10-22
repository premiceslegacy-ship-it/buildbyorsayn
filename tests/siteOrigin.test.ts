import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { DEV_SITE_ORIGIN, getSiteOrigin, optionalSiteOrigin, parseSiteOrigin, requireSiteOrigin, resolveSiteOrigin } from "../lib/siteOrigin";

function withEnv<T>(values: Record<string, string | undefined>, run: () => T): T {
  const saved: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(values)) {
    saved[key] = process.env[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    return run();
  } finally {
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test("the origin is normalized: trailing slashes and case are dropped", () => {
  assert.equal(parseSiteOrigin("https://Build.Example.com/"), "https://build.example.com");
  assert.equal(parseSiteOrigin("  https://build.example.com  "), "https://build.example.com");
  assert.equal(parseSiteOrigin("http://localhost:3000"), "http://localhost:3000");
});

test("an origin with a path, credentials, a query or plain HTTP on a real host is refused", () => {
  for (const bad of ["https://build.example.com/app", "https://u:p@build.example.com", "https://build.example.com/?x=1", "http://build.example.com", "build.example.com", "ftp://build.example.com"]) {
    assert.throws(() => parseSiteOrigin(bad), /NEXT_PUBLIC_APP_URL/, bad);
  }
});

test("production without the variable fails with a clear message, development falls back to localhost", () => {
  assert.throws(() => resolveSiteOrigin(undefined, "production"), /NEXT_PUBLIC_APP_URL is required in production/);
  assert.throws(() => resolveSiteOrigin("   ", "production"), /required in production/);
  assert.equal(resolveSiteOrigin(undefined, "development"), DEV_SITE_ORIGIN);
  assert.equal(resolveSiteOrigin(undefined, "test"), DEV_SITE_ORIGIN);
  assert.equal(resolveSiteOrigin("https://build.example.com/", "production"), "https://build.example.com");
});

test("getSiteOrigin and requireSiteOrigin read NEXT_PUBLIC_APP_URL, and the strict one never invents a host", () => {
  withEnv({ NEXT_PUBLIC_APP_URL: "https://build.example.com/", NODE_ENV: "production" }, () => {
    assert.equal(getSiteOrigin(), "https://build.example.com");
    assert.equal(requireSiteOrigin(), "https://build.example.com");
  });
  withEnv({ NEXT_PUBLIC_APP_URL: undefined, NODE_ENV: "test" }, () => {
    assert.equal(getSiteOrigin(), DEV_SITE_ORIGIN);
    assert.throws(() => requireSiteOrigin(), /NEXT_PUBLIC_APP_URL is not configured/);
  });
  withEnv({ NEXT_PUBLIC_APP_URL: undefined, NODE_ENV: "production" }, () => {
    assert.throws(() => getSiteOrigin(), /required in production/);
  });
});

test("optionalSiteOrigin returns undefined when unset and the parsed origin otherwise", () => {
  withEnv({ NEXT_PUBLIC_APP_URL: undefined }, () => assert.equal(optionalSiteOrigin(), undefined));
  withEnv({ NEXT_PUBLIC_APP_URL: "https://build.example.com/" }, () => assert.equal(optionalSiteOrigin(), "https://build.example.com"));
  withEnv({ NEXT_PUBLIC_APP_URL: "https://build.example.com/x" }, () => assert.throws(() => optionalSiteOrigin(), /origin only/));
});

test("no source file reads NEXT_PUBLIC_APP_URL directly outside the shared helpers", async () => {
  const allowed = new Set([
    "lib/siteOrigin.ts", // la source unique
    "lib/mcp/config.ts", // issuer MCP : variable propre, repli sur le site
    "lib/buildSync/config.ts", // issuer BUILD Sync : idem
    "components/BuildSyncInstall.tsx", // composant client : lecture littérale obligatoire pour Next
    "components/AdminMailComposer.tsx", // composant client : idem
  ]);
  const files = [
    "app/layout.tsx", "app/page.tsx", "app/robots.ts", "app/sitemap.ts",
    "app/api/webhooks/stripe/route.ts", "lib/youtube/feed.ts",
  ];
  for (const file of files) {
    assert.ok(!allowed.has(file));
    assert.doesNotMatch(await readFile(file, "utf8"), /process\.env\.NEXT_PUBLIC_APP_URL|process\.env\[["']NEXT_PUBLIC_APP_URL/, `${file} must use lib/siteOrigin.ts`);
  }
});
