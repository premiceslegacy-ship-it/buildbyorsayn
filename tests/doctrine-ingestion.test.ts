import test from "node:test";
import assert from "node:assert/strict";
import { DOCTRINE_INVENTORIES } from "../lib/doctrine/inventory";
import type { DoctrineRow } from "../lib/knowledge/doctrineIngestion";
const files = (): { path: string; content: string }[] => DOCTRINE_INVENTORIES["socle-v1"].map(path => ({ path, content: "# Title\n\nSynthetic doctrine." }));
const fingerprint = "b".repeat(64);
const fixture = () => {
  let stored: DoctrineRow[] = [];
  const calls: string[] = [];
  const deps = {
    readPublished: async () => files(),
    readPage: async (offset: number, limit: number) => ({ rows: stored.filter(r => r.source === "doctrine").slice(offset, offset + limit), total: stored.filter(r => r.source === "doctrine").length }),
    fingerprint,
    embed: async (texts: string[]): Promise<number[][]> => { calls.push("embed"); return texts.map(() => Array.from({ length: 768 }, (_, i) => i === 0 ? 1 : 0)); },
    lock: async <T>(operation: () => Promise<T>) => { calls.push("lock"); const result = await operation(); calls.push("unlock"); return result; },
    apply: async (payload: { rows: DoctrineRow[]; inventory: DoctrineRow[]; deleteStale: boolean }) => {
      calls.push("apply");
      const k = (r: DoctrineRow) => JSON.stringify([r.source, r.source_id, r.chunk_index]);
      const selected = new Set(payload.rows.map(k));
      const inventory = new Set(payload.inventory.map(k));
      stored = stored.filter(r => !selected.has(k(r)) && (!payload.deleteStale || r.source !== "doctrine" || inventory.has(k(r))));
      stored.push(...payload.rows);
    },
  };
  return { deps, calls, get rows() { return stored; }, set rows(rows: DoctrineRow[]) { stored = rows; } };
};
test("dry run computes a complete differential without lock, embeddings or mutations", async () => {
  const mod = await api(); assert.ok(mod);
  assert.equal(typeof mod.runDoctrineIngestion, "function");
  const f = fixture();
  const result = await mod.runDoctrineIngestion(f.deps, { apply: false });
  assert.equal(result.status, "dry-run");
  assert.equal(result.toEmbed.length, 9);
  assert.equal(result.expected.length, 9);
  assert.deepEqual(f.calls, []);
});

const applyOptions = { apply: true, exclusiveWritersConfirmed: true, lockSchemaConfirmed: true };
test("apply verifies exact rows under lock and unchanged rerun never embeds", async () => {
  const mod = await api(); assert.ok(mod); const f = fixture();
  const result = await mod.runDoctrineIngestion(f.deps, applyOptions);
  assert.equal(result.status, "complete");
  assert.equal(f.rows.length, 9);
  assert.deepEqual(f.calls, ["lock", "embed", "apply", "unlock"]);
  f.calls.length = 0;
  const second = await mod.runDoctrineIngestion(f.deps, applyOptions);
  assert.equal(second.toEmbed.length, 0);
  assert.deepEqual(f.calls, ["lock", "unlock"]);
});

test("capped update preserves every deferred and stale row, reports partial, then converges scoped", async () => {
  const mod = await api(); assert.ok(mod); const f = fixture();
  await mod.runDoctrineIngestion(f.deps, applyOptions);
  const before = structuredClone(f.rows);
  const other = { ...before[0], source: "skills-content" };
  const stale = { ...before[0], source_id: "retired.md" };
  f.rows = [...before, stale, other];
  f.deps.readPublished = async () => files().map(file => ({ ...file, content: file.content + " Updated." }));
  const partial = await mod.runDoctrineIngestion(f.deps, { ...applyOptions, maxChunks: 1 });
  assert.equal(partial.status, "partial"); assert.equal(partial.deferred, 8);
  assert.deepEqual(f.rows.filter(row => row.source_id !== before[0].source_id), [...before.slice(1), stale]);
  assert.ok(f.rows.some(row => row.source === "skills-content"));
  const complete = await mod.runDoctrineIngestion(f.deps, applyOptions);
  assert.equal(complete.status, "complete");
  assert.equal(f.rows.length, 10); assert.deepEqual(f.rows.find(row => row.source === "skills-content"), other);
});

test("apply refuses unconfirmed SQL/writer prerequisites before any access", async () => {
  const mod = await api(); assert.ok(mod); const f = fixture();
  await assert.rejects(mod.runDoctrineIngestion(f.deps, { apply: true }), /prerequisite/);
  assert.deepEqual(f.calls, []);
});
test("invalid cap, fingerprint, empty chapter and oversize title fail closed", async () => {
  const mod = await api(); assert.ok(mod);
  for (const cap of [0, -1, NaN, 1.5]) {
    await assert.rejects(mod.runDoctrineIngestion(fixture().deps, { apply: false, maxChunks: cap }));
  }
  const f = fixture(); f.deps.fingerprint = "bad";
  await assert.rejects(mod.runDoctrineIngestion(f.deps, { apply: false }));
  for (const content of [" ", "# " + "x".repeat(501)]) {
    const f = fixture(); f.deps.readPublished = async () => files().map(file => ({ ...file, content }));
    await assert.rejects(mod.runDoctrineIngestion(f.deps, { apply: false }));
  }
});
test("provider failure and corrupt vectors cannot mutate and retain acquired lock", async () => {
  const mod = await api(); assert.ok(mod);
  for (const embed of [async () => { throw new Error("provider failed"); }, async () => Array.from({ length: 9 }, () => Array(768).fill(NaN))]) {
    const f = fixture(); f.deps.embed = embed;
    await assert.rejects(mod.runDoctrineIngestion(f.deps, applyOptions));
    assert.deepEqual(f.calls, ["lock"]); assert.equal(f.rows.length, 0);
  }
});
test("readback mismatch in each exact field retains lock", async () => {
  const mod = await api(); assert.ok(mod);
  for (const field of ["title", "content", "content_hash", "tier_required", "metadata"] as const) {
    const f = fixture(); const apply = f.deps.apply;
    f.deps.apply = async payload => { await apply(payload); Object.assign(f.rows[0], { [field]: field === "metadata" ? { embeddingFingerprint: "a".repeat(64) } : "wrong" }); };
    await assert.rejects(mod.runDoctrineIngestion(f.deps, applyOptions));
    assert.ok(!f.calls.includes("unlock"));
  }
});
test("source or inventory drift before mutation aborts under retained lock", async () => {
  const mod = await api(); assert.ok(mod); const f = fixture(); let reads = 0;
  f.deps.readPublished = async () => ++reads === 1 ? files() : files().map(file => ({ ...file, content: "changed" }));
  await assert.rejects(mod.runDoctrineIngestion(f.deps, applyOptions), /drift/);
  assert.ok(!f.calls.includes("apply")); assert.ok(!f.calls.includes("unlock"));
});
test("same doctrine publisher lock excludes concurrent ingesters", async () => {
  const mod = await api(); assert.ok(mod);
  const { withDoctrinePublicationLock } = await import("../lib/doctrine/publication");
  let owner: string | null = null;
  const client = { rpc: async (name: string, args: { requested_lock_key: string; requested_lock_token: string }) => {
    assert.equal(args.requested_lock_key, "doctrine");
    if (name.startsWith("acquire")) { if (owner) return { data: false, error: null }; owner = args.requested_lock_token; return { data: true, error: null }; }
    assert.equal(owner, args.requested_lock_token); owner = null; return { data: true, error: null };
  } };
  const f = fixture(); f.deps.lock = operation => withDoctrinePublicationLock(client, operation);
  let resume!: () => void; let started!: () => void;
  const entered = new Promise<void>(resolve => { started = resolve; });
  const gate = new Promise<void>(resolve => { resume = resolve; });
  const embed = f.deps.embed;
  f.deps.embed = async texts => { started(); await gate; return embed(texts); };
  const first = mod.runDoctrineIngestion(f.deps, applyOptions);
  try {
    await entered;
    await assert.rejects(mod.runDoctrineIngestion(f.deps, applyOptions), /lock unavailable/);
  } finally {
    resume();
    await first;
  }
  assert.equal(owner, null); assert.equal(f.calls.filter(c => c === "apply").length, 1);
});

test("CLI parses strict options and adapter paginates/filter-scopes real SDK HTTP requests", async () => {
  const cli = await import("../scripts/ingest-doctrine").catch(() => null);
  assert.ok(cli, "dedicated CLI required");
  assert.deepEqual(cli.parseDoctrineArgs(["--max-chunks=2"]), { apply: false, maxChunks: 2, exclusiveWritersConfirmed: false, lockSchemaConfirmed: false });
  for (const args of [["--source=skills"], ["--max-chunks=NaN"], ["--apply", "--apply"], ["--max-chunks=1e2"]]) assert.throws(() => cli.parseDoctrineArgs(args));
  const { createClient } = await import("@supabase/supabase-js");
  const calls: { url: URL; method: string; body: Record<string, unknown> | null }[] = [];
  const admin = createClient("https://synthetic.invalid", "synthetic", { global: { fetch: async (input, init) => {
    const url = new URL(String(input)); calls.push({ url, method: init?.method ?? "GET", body: init?.body ? JSON.parse(String(init.body)) : null });
    if (url.pathname.endsWith("knowledge_chunks")) return new Response("[]", { status: 200, headers: { "content-type": "application/json", "content-range": "*/0" } });
    return new Response(JSON.stringify({ upserted_count: 0, deleted_count: 0 }), { headers: { "content-type": "application/json" } });
  } } });
  const deps = cli.createDoctrineDependencies(admin, fingerprint, async () => []);
  await deps.readPage(500, 500);
  assert.equal(calls[0].url.searchParams.get("source"), "eq.doctrine");
  assert.equal(calls[0].url.searchParams.get("offset"), "500");
  assert.equal(calls[0].url.searchParams.get("order"), "source_id.asc,chunk_index.asc");
  await deps.apply({ rows: [], inventory: [], deleteStale: false });
  assert.deepEqual(calls[1].body?.p_scanned_sources, ["doctrine"]);
  assert.equal(calls[1].body?.p_delete_stale, false);
});
test("exact18 succeeds; partial, duplicate or unapproved Storage inventory cannot delete", async () => {
  const mod = await api(); assert.ok(mod);
  const f = fixture(); f.deps.readPublished = async () => DOCTRINE_INVENTORIES["agentique-v1"].map(path => ({ path, content: "# Eighteen" }));
  assert.equal((await mod.runDoctrineIngestion(f.deps, applyOptions)).expected.length, 18);
  for (const invalid of [files().slice(1), [...files().slice(1), files()[1]], files().map((file, i) => i ? file : { ...file, path: "unknown.md" })]) {
    const f = fixture(); f.deps.readPublished = async () => invalid;
    await assert.rejects(mod.runDoctrineIngestion(f.deps, applyOptions)); assert.ok(!f.calls.includes("apply"));
  }
});

test("inventory read errors, duplicate rows, count drift and premature EOF fail closed", async () => {
  const mod = await api(); assert.ok(mod); const f = fixture();
  await mod.runDoctrineIngestion(f.deps, applyOptions); const row = f.rows[0];
  for (const read of [
    async () => { throw new Error("DB unavailable"); },
    async () => ({ rows: [row, row], total: 2 }),
    async () => ({ rows: [], total: 1 }),
    async (offset: number) => offset ? ({ rows: [], total: 3 }) : ({ rows: [row], total: 2 }),
    async () => ({ rows: [{ ...row, source: "skills-content" }], total: 1 }),
  ]) await assert.rejects(mod.readDoctrineInventory(read));
});
test("DB drift after embeddings prevents apply", async () => {
  const mod = await api(); assert.ok(mod); const f = fixture();
  await mod.runDoctrineIngestion(f.deps, applyOptions); f.calls.length = 0;
  f.deps.readPublished = async () => files().map(file => ({ ...file, content: file.content + " Updated" }));
  const embed = f.deps.embed;
  f.deps.embed = async texts => { const vectors = await embed(texts); f.rows[0].title = "concurrent"; return vectors; };
  await assert.rejects(mod.runDoctrineIngestion(f.deps, applyOptions), /drift/);
  assert.ok(!f.calls.includes("apply")); assert.ok(!f.calls.includes("unlock"));
});

test("SDK inventory crosses 1000 with exact count and honors a smaller server cap", async () => {
  const { createClient } = await import("@supabase/supabase-js");
  const { createDoctrineDependencies } = await import("../scripts/ingest-doctrine");
  const mod = await api(); assert.ok(mod);
  const f = fixture(); await mod.runDoctrineIngestion(f.deps, applyOptions);
  const rows = Array.from({ length: 1207 }, (_, chunk_index) => ({ ...f.rows[0], chunk_index }));
  const offsets: number[] = [];
  const admin = createClient("https://synthetic.invalid", "synthetic", { global: { fetch: async (input, init) => {
    const url = new URL(String(input));
    assert.equal(url.pathname, "/rest/v1/knowledge_chunks");
    assert.equal(url.searchParams.get("source"), "eq.doctrine");
    assert.equal(url.searchParams.get("limit"), "500");
    assert.match(new Headers(init?.headers).get("prefer") ?? "", /count=exact/);
    const offset = Number(url.searchParams.get("offset")); offsets.push(offset);
    const page = rows.slice(offset, offset + 300);
    return new Response(JSON.stringify(page), { status: 206, headers: { "content-type": "application/json", "content-range": `${offset}-${offset + page.length - 1}/${rows.length}` } });
  } } });
  const deps = createDoctrineDependencies(admin, fingerprint, async () => { throw new Error("No provider allowed"); });
  assert.deepEqual(await mod.readDoctrineInventory(deps.readPage), rows);
  assert.deepEqual(offsets, [0, 300, 600, 900, 1200]);
});

test("SDK inventory and snapshot errors or false counts never report success", async () => {
  const { createClient } = await import("@supabase/supabase-js");
  const { createDoctrineDependencies } = await import("../scripts/ingest-doctrine");
  for (const response of [
    () => new Response(JSON.stringify({ message: "unavailable" }), { status: 403 }),
    () => new Response("[]", { headers: { "content-type": "application/json" } }),
    () => { throw new Error("network timeout"); },
  ]) {
    const admin = createClient("https://synthetic.invalid", "synthetic", { global: { fetch: async () => response() } });
    const deps = createDoctrineDependencies(admin, fingerprint, async () => []);
    await assert.rejects(deps.readPage(0, 500));
    await assert.rejects(deps.apply({ rows: [], inventory: [], deleteStale: false }));
  }
  for (const data of [null, { upserted_count: 1, deleted_count: 0 }, { upserted_count: 0, deleted_count: 1 }, { upserted_count: 0, deleted_count: -1 }]) {
    const admin = createClient("https://synthetic.invalid", "synthetic", { global: { fetch: async () => new Response(JSON.stringify(data), { headers: { "content-type": "application/json" } }) } });
    await assert.rejects(createDoctrineDependencies(admin, fingerprint, async () => []).apply({ rows: [], inventory: [], deleteStale: false }));
  }
});

test("actual lock wrapper retains ownership after ambiguous apply or readback failure", async () => {
  const mod = await api(); assert.ok(mod);
  const { withDoctrinePublicationLock } = await import("../lib/doctrine/publication");
  for (const failure of ["apply", "readback"]) {
    const f = fixture(); let owner: string | null = null; let releases = 0; let applied = false;
    const client = { rpc: async (name: string, args: { requested_lock_key: string; requested_lock_token: string }) => {
      assert.equal(args.requested_lock_key, "doctrine");
      if (name.startsWith("acquire")) { if (owner) return { data: false, error: null }; owner = args.requested_lock_token; return { data: true, error: null }; }
      releases++; owner = null; return { data: true, error: null };
    } };
    f.deps.lock = operation => withDoctrinePublicationLock(client, operation);
    const apply = f.deps.apply; const read = f.deps.readPage;
    f.deps.apply = async payload => { await apply(payload); applied = true; if (failure === "apply") throw new Error("ambiguous apply"); };
    f.deps.readPage = async (offset, limit) => { if (applied && failure === "readback") throw new Error("readback unavailable"); return read(offset, limit); };
    try {
      await assert.rejects(mod.runDoctrineIngestion(f.deps, applyOptions));
      assert.ok(owner); assert.equal(releases, 0);
      await assert.rejects(mod.runDoctrineIngestion(f.deps, applyOptions), /lock unavailable/);
      assert.equal(f.calls.filter(c => c === "apply").length, 1);
    } finally { owner = null; f.rows = []; }
    assert.equal(owner, null); assert.equal(f.rows.length, 0);
  }
});

test("release happens only after final exact readback, and release failure rejects", async () => {
  const mod = await api(); assert.ok(mod);
  const { withDoctrinePublicationLock } = await import("../lib/doctrine/publication");
  for (const releaseOK of [true, false]) {
    const f = fixture(); let applied = false; let verified = false;
    const apply = f.deps.apply; const read = f.deps.readPage;
    f.deps.apply = async payload => { await apply(payload); applied = true; };
    f.deps.readPage = async (offset, limit) => { const page = await read(offset, limit); if (applied) verified = true; return page; };
    const client = { rpc: async (name: string) => { if (name.startsWith("release")) { assert.equal(verified, true); return { data: releaseOK, error: null }; } return { data: true, error: null }; } };
    f.deps.lock = operation => withDoctrinePublicationLock(client, operation);
    if (releaseOK) assert.equal((await mod.runDoctrineIngestion(f.deps, applyOptions)).status, "complete");
    else await assert.rejects(mod.runDoctrineIngestion(f.deps, applyOptions), /release unverified/);
  }
});

test("stale-only full run deletes doctrine without embeddings even with a cap", async () => {
  const mod = await api(); assert.ok(mod); const f = fixture();
  await mod.runDoctrineIngestion(f.deps, applyOptions);
  const other = { ...f.rows[0], source: "obsidian", tier_required: "beginner" };
  f.rows = [...f.rows, { ...f.rows[0], source_id: "retired.md" }, other];
  f.calls.length = 0;
  const preview = await mod.runDoctrineIngestion(f.deps, { apply: false, maxChunks: 1 });
  assert.equal(preview.stale.length, 1); assert.equal(preview.toEmbed.length, 0);
  assert.equal(preview.deleteStale, true); assert.deepEqual(f.calls, []);
  const result = await mod.runDoctrineIngestion(f.deps, { ...applyOptions, maxChunks: 1 });
  assert.equal(result.status, "complete"); assert.deepEqual(f.calls, ["lock", "apply", "unlock"]);
  assert.deepEqual(f.rows.find(row => row.source === "obsidian"), other);
  assert.equal(f.rows.filter(row => row.source === "doctrine").length, 9);
});

test("fresh capped ingestion preserves absent deferred identities and fingerprint changes reembed", async () => {
  const mod = await api(); assert.ok(mod); const f = fixture();
  const partial = await mod.runDoctrineIngestion(f.deps, { ...applyOptions, maxChunks: 1 });
  assert.equal(partial.status, "partial"); assert.equal(partial.deferred, 8);
  assert.equal(partial.deleteStale, false); assert.equal(f.rows.length, 1);
  await mod.runDoctrineIngestion(f.deps, applyOptions);
  f.calls.length = 0; f.deps.fingerprint = "c".repeat(64);
  const preview = await mod.runDoctrineIngestion(f.deps, { apply: false });
  assert.equal(preview.toEmbed.length, 9); assert.deepEqual(f.calls, []);
  await mod.runDoctrineIngestion(f.deps, applyOptions);
  assert.ok(f.rows.every(row => row.tier_required === "full" && row.metadata.embeddingFingerprint === f.deps.fingerprint));
});

test("published objects reused by an adapter cannot hide source mutation", async () => {
  const mod = await api(); assert.ok(mod); const f = fixture(); const published = files();
  f.deps.readPublished = async () => published;
  const embed = f.deps.embed;
  f.deps.embed = async texts => { published[0].content += " Changed"; return embed(texts); };
  await assert.rejects(mod.runDoctrineIngestion(f.deps, applyOptions), /drift/);
  assert.ok(!f.calls.includes("apply")); assert.ok(!f.calls.includes("unlock"));
});

// Dynamic import makes the first RED an assertion about the missing capability.
async function api() { return import("../lib/knowledge/doctrineIngestion").catch(() => null); }
test("complete inventory pagination crosses 1000 even with a smaller server page cap", async () => {
  const mod = await api();
  assert.ok(mod, "doctrine ingestion capability must exist");
  const rows = Array.from({ length: 1207 }, (_, n) => ({ source: "doctrine", source_id: "00-parcours.md", chunk_index: n, title: "T", content: "C", content_hash: "a".repeat(64), tier_required: "full", metadata: { embeddingFingerprint: "b".repeat(64) } }));
  const offsets: number[] = [];
  const actual = await mod.readDoctrineInventory(async (offset: number) => {
    offsets.push(offset); return { rows: rows.slice(offset, offset + 300), total: rows.length };
  });
  assert.equal(actual.length, 1207);
  assert.deepEqual(offsets, [0, 300, 600, 900, 1200]);
});
