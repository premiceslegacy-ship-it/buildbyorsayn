import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import test, { mock } from "node:test";

if (process.env.REVIEW1_SEARCH_INNER !== "1") {
  test("la réponse JSON de recherche ne contient rien du palier supérieur", () => {
    const result = spawnSync(process.execPath, [
      "--import", "tsx",
      "--experimental-test-module-mocks",
      "--test",
      "tests/review1SearchRoute.test.ts",
    ], {
      encoding: "utf8",
      env: { ...process.env, NODE_ENV: "test", REVIEW1_SEARCH_INNER: "1" },
    });
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  });
} else {
  const file = (path: string) => pathToFileURL(resolve(path)).href;
  let tier: string | null = "free";

  mock.module(file("lib/supabase/server.ts"), {
    namedExports: {
      createClient: async () => {
        const query = {
          select() { return query; },
          eq() { return query; },
          async maybeSingle() { return { data: { tier }, error: null }; },
        };
        return {
          auth: { getUser: async () => ({ data: { user: { id: "123e4567-e89b-42d3-a456-426614174000" } }, error: null }) },
          from: () => query,
        };
      },
    },
  });

  const { GET } = await import("../app/api/search/route");
  const search = async (query: string) => {
    const response = await GET(new Request(`https://build.example/api/search?q=${encodeURIComponent(query)}`));
    assert.equal(response.status, 200);
    return response.json() as Promise<{ results: Array<{ id: string }> }>;
  };

  test("gratuit ne reçoit pas Hermes et Fondations ne reçoit pas le Bloc 2", async () => {
    tier = "free";
    assert.deepEqual((await search("Hermes")).results, []);
    tier = "beginner";
    assert.deepEqual((await search("Bloc 2")).results, []);
  });

  test("LE COFFRE reçoit bien les résultats auxquels il a droit", async () => {
    tier = "full";
    assert.ok((await search("Hermes")).results.some((result) => result.id === "video-hermes"));
  });
}
