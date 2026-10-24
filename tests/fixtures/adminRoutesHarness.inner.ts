// Exécuté dans un processus enfant avec --experimental-test-module-mocks (voir adminRoutes.test.ts).
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import test, { mock } from "node:test";

type Call = { kind: string; payload?: unknown };
const calls: Call[] = [];
const muxCalls: Call[] = [];
const processedMuxEvents = new Set<string>();
let muxVideoStatus = "waiting";
let muxProcessError: { message: string } | null = null;
let currentUser: { id: string; app_metadata: Record<string, unknown> } | null = null;
let videoRow: Record<string, unknown> | null = null;
const file = (path: string) => pathToFileURL(resolve(path)).href;

mock.module("next/cache", { namedExports: { revalidatePath: (path: string) => { calls.push({ kind: "revalidate", payload: path }); } } });
mock.module(file("lib/supabase/server.ts"), {
  namedExports: { createClient: async () => ({ auth: { getUser: async () => ({ data: { user: currentUser }, error: null }) } }) },
});

function table(name: string) {
  const state: { op: string; values?: unknown; filters: string[] } = { op: "select", filters: [] };
  const chain: Record<string, unknown> = {
    select() { return chain; },
    order() { return chain; },
    limit() { return Promise.resolve({ data: [], error: null }); },
    insert(values: unknown) { calls.push({ kind: `insert:${name}`, payload: values }); return Promise.resolve({ error: null }); },
    update(values: unknown) { state.op = "update"; state.values = values; return chain; },
    delete() { state.op = "delete"; return chain; },
    eq(column: string, value: unknown) { state.filters.push(`${column}=${String(value)}`); return chain; },
    is(column: string) { state.filters.push(`${column} is null`); return chain; },
    maybeSingle() {
      if (state.op === "update") {
        calls.push({ kind: `update:${name}`, payload: { values: state.values, filters: state.filters } });
        return Promise.resolve({ data: { id: "x" }, error: null });
      }
      return Promise.resolve({ data: videoRow, error: null });
    },
    then(resolveFn: (value: unknown) => unknown) {
      if (state.op === "update") calls.push({ kind: `update:${name}`, payload: { values: state.values, filters: state.filters } });
      return Promise.resolve({ data: null, error: null }).then(resolveFn);
    },
  };
  return chain;
}
mock.module(file("lib/supabase/admin.ts"), {
  namedExports: {
    createAdminSupabase: () => ({
      from: table,
      rpc: async (name: string, args: unknown) => {
        calls.push({ kind: `rpc:${name}`, payload: args });
        if (name === "process_mux_asset_webhook") {
          if (muxProcessError) return { data: null, error: muxProcessError };
          const payload = args && typeof args === "object" ? args : {};
          const eventId = "p_event_id" in payload && typeof payload.p_event_id === "string" ? payload.p_event_id : "";
          const eventType = "p_event_type" in payload && typeof payload.p_event_type === "string" ? payload.p_event_type : "";
          const update = "p_update" in payload && payload.p_update && typeof payload.p_update === "object" ? payload.p_update : {};
          const nextStatus = "status" in update && typeof update.status === "string" ? update.status : "";
          if (processedMuxEvents.has(eventId)) return { data: "duplicate", error: null };
          processedMuxEvents.add(eventId);
          if (eventType === "video.asset.created" && (muxVideoStatus === "ready" || muxVideoStatus === "errored")) {
            return { data: "noop", error: null };
          }
          if (nextStatus) muxVideoStatus = nextStatus;
          return { data: "processed", error: null };
        }
        if (name === "record_admin_action") return { data: "00000000-0000-4000-8000-000000000000", error: null };
        if (name === "publish_video_lesson") return { data: [{ section_id: "b2-s1", previous_mux_asset_id: "old-asset" }], error: null };
        if (name === "set_admin_user_tier") return { data: true, error: null };
        return { data: null, error: null };
      },
    }),
  },
});

const realMux = (await import("@mux/ts")).default;
mock.module("@mux/ts", {
  defaultExport: class FakeMux {
    webhooks: InstanceType<typeof realMux>["webhooks"];
    video = {
      uploads: {
        create: async (body: unknown) => { muxCalls.push({ kind: "uploads.create", payload: body }); return { id: "upload-1", url: "https://storage.example.invalid/upload" }; },
        cancel: async (id: string) => { muxCalls.push({ kind: "uploads.cancel", payload: id }); },
      },
    };
    constructor(options: { webhookSecret?: string }) {
      this.webhooks = new realMux({ webhookSecret: options.webhookSecret, tokenId: "x", tokenSecret: "y" }).webhooks;
    }
  },
});

process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:1";
process.env.SUPABASE_SERVICE_ROLE_KEY = "fake";
process.env.MUX_TOKEN_ID = "id";
process.env.MUX_TOKEN_SECRET = "secret";
process.env.MUX_WEBHOOK_SECRET = "whsec-test";

const { NextRequest } = await import("next/server");
const videosRoute = await import("../../app/api/admin/videos/route");
const publishRoute = await import("../../app/api/admin/videos/[id]/publish/route");
const deleteRoute = await import("../../app/api/admin/videos/[id]/route");
const webhookRoute = await import("../../app/api/mux/webhook/route");

const VIDEO_ID = "123e4567-e89b-42d3-a456-426614174000";
const create = (sectionId: string) => new NextRequest("http://localhost/api/admin/videos", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    sectionId, title: "Une vidéo", summary: "", transcript: "[0:00] Une transcription relue assez longue.",
    deliverables: [], chapters: [{ index: 1, title: "Départ", startSeconds: 0 }],
    file: { name: "a.mp4", size: 1000, type: "video/mp4" },
  }),
});
const reset = () => { calls.length = 0; muxCalls.length = 0; processedMuxEvents.clear(); muxVideoStatus = "waiting"; muxProcessError = null; videoRow = null; };

test("un non admin (palier COFFRE, rôle absent ou autre) est refusé partout avant Mux et la base", async () => {
  for (const user of [null, { id: "u1", app_metadata: {} }, { id: "u1", app_metadata: { role: "trainer" } }, { id: "u1", app_metadata: { tier: "full" } }]) {
    reset();
    currentUser = user;
    assert.equal((await videosRoute.GET()).status, 403);
    assert.equal((await videosRoute.POST(create("b2-s1"))).status, 403);
    const ctx = { params: Promise.resolve({ id: VIDEO_ID }) };
    const publishReq = () => new NextRequest("http://localhost/x", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ approved: true, confirmation: "PUBLIER" }) });
    assert.equal((await publishRoute.POST(publishReq(), ctx)).status, 403);
    assert.equal((await deleteRoute.DELETE(new NextRequest("http://localhost/x", { method: "DELETE" }), ctx)).status, 403);
    assert.deepEqual(muxCalls, []);
    assert.deepEqual(calls, []);
  }
});

test("un admin crée un envoi Mux signé, le palier vient du serveur, l'action est journalisée", async () => {
  currentUser = { id: "admin-1", app_metadata: { role: "admin" } };
  for (const [section, tier] of [["b1-s0", "preview"], ["b1-s2", "beginner"], ["b2-s1", "full"]] as const) {
    reset();
    const response = await videosRoute.POST(create(section));
    assert.equal(response.status, 201, section);
    const created = muxCalls.find((c) => c.kind === "uploads.create")?.payload as { new_asset_settings: { playback_policies: string[]; passthrough: string } };
    assert.deepEqual(created.new_asset_settings.playback_policies, ["signed"]);
    const inserted = calls.find((c) => c.kind === "insert:video_lessons")?.payload as Record<string, unknown>;
    assert.equal(inserted.tier_required, tier);
    assert.equal(inserted.status, "waiting");
    assert.equal(inserted.created_by, "admin-1");
    assert.equal(created.new_asset_settings.passthrough, `build-video:${inserted.id}`);
    assert.ok(calls.some((c) => c.kind === "rpc:record_admin_action"));
  }
  reset();
  assert.equal((await videosRoute.POST(create("b99-s9"))).status, 400);
  assert.deepEqual(muxCalls, []);
});

test("un admin publie via la RPC uniquement avec la confirmation PUBLIER", async () => {
  currentUser = { id: "admin-1", app_metadata: { role: "admin" } };
  const ctx = { params: Promise.resolve({ id: VIDEO_ID }) };
  const req = (body: unknown) => new NextRequest("http://localhost/x", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  reset();
  assert.equal((await publishRoute.POST(req({ approved: true, confirmation: "publier" }), ctx)).status, 409);
  assert.equal(calls.some((c) => c.kind === "rpc:publish_video_lesson"), false);
  videoRow = { id: VIDEO_ID, section_id: "b2-s1", status: "ready", playback_id: "pb", duration_seconds: 300, chapters: [{ index: 1, title: "A", startSeconds: 0 }], published_at: null };
  const ok = await publishRoute.POST(req({ approved: true, confirmation: "PUBLIER" }), ctx);
  assert.equal(ok.status, 200);
  assert.deepEqual(calls.find((c) => c.kind === "rpc:publish_video_lesson")?.payload, { p_video_id: VIDEO_ID, p_actor_user_id: "admin-1" });
  videoRow = { ...videoRow, status: "preparing" };
  reset(); videoRow = { id: VIDEO_ID, section_id: "b2-s1", status: "preparing", playback_id: null, duration_seconds: null, chapters: [], published_at: null };
  assert.equal((await publishRoute.POST(req({ approved: true, confirmation: "PUBLIER" }), ctx)).status, 409);
});

test("le webhook Mux refuse sans signature valide et met à jour avec une signature valide", async () => {
  const body = JSON.stringify({
    type: "video.asset.ready", id: "evt-1",
    data: { id: "asset-1", upload_id: "upload-1", passthrough: `build-video:${VIDEO_ID}`, duration: 120.4, playback_ids: [{ id: "pb-signed", policy: "signed" }] },
  });
  const post = (headers: Record<string, string>) => webhookRoute.POST(new NextRequest("http://localhost/api/mux/webhook", { method: "POST", headers: { "content-type": "application/json", ...headers }, body }));
  reset();
  assert.equal((await post({})).status, 400);
  assert.equal((await post({ "mux-signature": `t=${Math.floor(Date.now() / 1000)},v1=${"0".repeat(64)}` })).status, 400);
  assert.deepEqual(calls, []);
  const t = Math.floor(Date.now() / 1000);
  const signature = createHmac("sha256", "whsec-test").update(`${t}.${body}`).digest("hex");
  assert.equal((await post({ "mux-signature": `t=${t},v1=${signature}` })).status, 200);
  const transaction = calls.find((c) => c.kind === "rpc:process_mux_asset_webhook")?.payload as {
    p_update: Record<string, unknown>;
    p_event_type: string;
  };
  assert.equal(transaction.p_event_type, "video.asset.ready");
  assert.equal(transaction.p_update.status, "ready");
  assert.equal(transaction.p_update.playback_id, "pb-signed");
  assert.equal(transaction.p_update.duration_seconds, 120);
});

test("le traitement Mux est monotone, idempotent et reprend après une erreur transactionnelle", async () => {
  const postEvent = async (eventId: string, type: "video.asset.created" | "video.asset.ready") => {
    const body = JSON.stringify({
      type,
      id: eventId,
      data: {
        id: "asset-1",
        upload_id: "upload-1",
        passthrough: `build-video:${VIDEO_ID}`,
        duration: 120,
        playback_ids: [{ id: "pb-signed", policy: "signed" }],
      },
    });
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createHmac("sha256", "whsec-test").update(`${timestamp}.${body}`).digest("hex");
    return webhookRoute.POST(new NextRequest("http://localhost/api/mux/webhook", {
      method: "POST",
      headers: { "content-type": "application/json", "mux-signature": `t=${timestamp},v1=${signature}` },
      body,
    }));
  };

  reset();
  assert.equal((await postEvent("evt-ready", "video.asset.ready")).status, 200);
  assert.equal((await postEvent("evt-created-after-ready", "video.asset.created")).status, 200);
  assert.equal(muxVideoStatus, "ready");
  assert.equal((await postEvent("evt-ready", "video.asset.ready")).status, 200);

  reset();
  muxProcessError = { message: "video write failed" };
  assert.equal((await postEvent("evt-write-error", "video.asset.ready")).status, 503);
  muxProcessError = null;
  assert.equal((await postEvent("evt-write-error", "video.asset.ready")).status, 200);

  reset();
  muxProcessError = { message: "audit write failed" };
  assert.equal((await postEvent("evt-audit-error", "video.asset.ready")).status, 503);
  muxProcessError = null;
  assert.equal((await postEvent("evt-audit-error", "video.asset.ready")).status, 200);
});

test("le changement de palier refuse un non admin et passe par la RPC journalisée pour un admin", async () => {
  const { setUserTier } = await import("../../app/actions/setUserTier");
  const target = "223e4567-e89b-42d3-a456-426614174000";
  reset();
  currentUser = { id: "u1", app_metadata: { tier: "full" } };
  await assert.rejects(() => setUserTier(target, "full"), /refusé/);
  assert.deepEqual(calls, []);
  currentUser = { id: "admin-1", app_metadata: { role: "admin" } };
  await assert.rejects(() => setUserTier(target, "preview"), /Niveau invalide|invalid/i);
  await setUserTier(target, "beginner");
  assert.deepEqual(calls.find((c) => c.kind === "rpc:set_admin_user_tier")?.payload, { p_actor_user_id: "admin-1", p_target_user_id: target, p_tier: "beginner" });
});
