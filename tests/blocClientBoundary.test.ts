import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { BLOCS_DATA as corpus } from "../lib/mockData";
import { BLOCS_DATA as catalog } from "../lib/blocCatalog";
import * as access from "../lib/blocAccess";
import * as tiers from "../lib/mcpAccess";

test("client entry points never import the private bloc corpus", () => {
  for (const path of ["app/blocs/[id]/page.tsx", "app/blocs/[id]/BlocClient.tsx", "app/dashboard/page.tsx", "app/videos/page.tsx", "hooks/useProgress.ts", "lib/blocCatalog.ts"]) {
    const source = readFileSync(path, "utf8");
    assert.ok(!source.includes('@/lib/mockData'), path);
  }
});

test("public catalog preserves navigation and first-block videos without bodies or private videos", () => {
  assert.deepEqual(catalog, corpus.map(({ id, titre, displayNumber, sections, videos }) => ({
    id, titre, displayNumber, sections: sections.map(({ id, title }) => ({ id, title })), videos: id === "1" ? videos : [],
  })));
  assert.doesNotMatch(JSON.stringify(catalog), /"content"|"code"|"skillFiles"/);
});

// Execute the actual server modules with only the Supabase transport replaced.
function loadServer(path: string, tier: string | null, authenticated = true, profileError = false) {
  const calls: string[] = [];
  const query = {
    select() { return query; },
    eq(key: string, value: string) { assert.equal(key, "id"); assert.equal(value, "verified-user"); return query; },
    async maybeSingle() { calls.push("profile"); return { data: { tier }, error: profileError ? new Error("lookup failed") : null }; },
  };
  const supabase = {
    auth: { async getUser() { calls.push("auth"); return { data: { user: authenticated ? { id: "verified-user" } : null }, error: null }; } },
    from(table: string) { assert.equal(table, "profiles"); return query; },
  };
  const output = ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports: Record<string, (...args: any[]) => Promise<any>> = {};
  runInNewContext(output, { exports, require(name: string) {
    if (name === "server-only") return {};
    if (name === "@/lib/supabase/server") return { createClient: async () => supabase };
    if (name === "@/lib/mcpAccess") return tiers;
    if (name === "@/lib/blocAccess") return access;
    if (name === "@/lib/mockData") { calls.push("corpus"); return { BLOCS_DATA: corpus }; }
    throw new Error(`Unexpected import: ${name}`);
  } });
  return { exports, calls };
}

test("server loader authenticates and projects exact tier scope, including profile errors", async () => {
  const anon = loadServer("lib/blocData.server.ts", "full", false);
  assert.equal(await anon.exports.getBlocForCurrentUser("1"), null);
  assert.deepEqual(anon.calls, ["auth"]);
  for (const tier of [null, "free", "preview", "beginner", "full", "admin", "unknown"]) {
    for (const bloc of corpus) {
      const loader = loadServer("lib/blocData.server.ts", tier);
      const result = await loader.exports.getBlocForCurrentUser(bloc.id);
      const expected = tier === "full" || tier === "admin" ? bloc.sections :
        bloc.id === "1" && tier === "beginner" ? bloc.sections :
        bloc.id === "1" && tier === "preview" ? bloc.sections.filter(s => s.id === "b1-s0") : [];
      assert.deepEqual(result.bloc.sections, expected, `${tier}/${bloc.id}`);
      assert.deepEqual(loader.calls, ["auth", "profile", "corpus"]);
    }
  }
  const failed = loadServer("lib/blocData.server.ts", "full", true, true);
  const result = await failed.exports.getBlocForCurrentUser("1");
  assert.equal(result.bloc.sections.length, 0);
  assert.equal(result.bloc.videos.length, 0);
});

test("video action returns no reserved metadata anonymously or below entitlement", async () => {
  for (const tier of [null, "free", "preview", "beginner", "full", "admin", "unknown"]) {
    const loader = loadServer("lib/blocVideos.ts", tier);
    const result = await loader.exports.getBlocVideoLibrary();
    assert.equal(result.foundations.length, ["beginner", "full", "admin"].includes(tier ?? "") ? 2 : 0);
    assert.equal(result.blocs.length, ["full", "admin"].includes(tier ?? "") ? corpus.filter(b => b.id !== "1" && b.videos.length).length : 0);
    assert.doesNotMatch(JSON.stringify(result), /"sections"|"content"|"skillFiles"/);
  }
  for (const [authenticated, profileError] of [[false, false], [true, true]]) {
    const result = await loadServer("lib/blocVideos.ts", "full", authenticated, profileError).exports.getBlocVideoLibrary();
    assert.equal(result.foundations.length, 0);
    assert.equal(result.blocs.length, 0);
  }
});