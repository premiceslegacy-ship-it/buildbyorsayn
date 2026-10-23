import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import test, { mock } from "node:test";

if (process.env.ADMIN_AGENT_INNER !== "1") {
  test("agent admin : sécurité, approbation et idempotence avec frontières simulées", () => {
    const result = spawnSync(process.execPath, [
      "--import", "./tests/fixtures/serverOnlyStub.mjs",
      "--import", "tsx",
      "--experimental-test-module-mocks",
      "--test",
      "tests/adminAgentRoutes.test.ts",
    ], {
      encoding: "utf8",
      env: { ...process.env, NODE_ENV: "test", ADMIN_AGENT_INNER: "1" },
    });
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  });
} else {
  const file = (path: string) => pathToFileURL(resolve(path)).href;
  const RAW_TOKEN = `btv_agt_${"a".repeat(43)}`;
  const TOKEN_HASH = createHash("sha256").update(RAW_TOKEN).digest("hex");
  const TOKEN_ID = "123e4567-e89b-42d3-a456-426614174000";
  const ADMIN_ID = "223e4567-e89b-42d3-a456-426614174000";
  const VIDEO_ID = "323e4567-e89b-42d3-a456-426614174000";
  const REQUEST_ID = "423e4567-e89b-42d3-a456-426614174000";

  let currentUser: { id: string; app_metadata: { role?: string } } | null = { id: ADMIN_ID, app_metadata: { role: "admin" } };
  let tokenRow: Record<string, unknown> | null;
  let rateAllowed = true;
  let insertedToken: Record<string, unknown> | null = null;
  let videoRow: Record<string, unknown> | null = null;
  let requestStatus = "pending";
  let publicationCalls = 0;

  const validTokenRow = () => ({
    id: TOKEN_ID,
    name: "Hermes",
    token_hash: TOKEN_HASH,
    last_four: "aaaa",
    permissions: ["liste_blocs"],
    expires_at: new Date(Date.now() + 60_000).toISOString(),
    revoked_at: null,
    created_by: ADMIN_ID,
  });
  tokenRow = validTokenRow();

  function table(name: string) {
    const state: { op: string; values?: Record<string, unknown>; filters: Array<[string, unknown]> } = { op: "select", filters: [] };
    const chain: any = {
      select() { return chain; },
      order() { return chain; },
      limit() { return Promise.resolve({ data: [], error: null }); },
      insert(values: Record<string, unknown>) { state.op = "insert"; state.values = values; if (name === "admin_agent_tokens") insertedToken = values; return chain; },
      update(values: Record<string, unknown>) { state.op = "update"; state.values = values; return chain; },
      eq(column: string, value: unknown) { state.filters.push([column, value]); return chain; },
      is() { return chain; },
      lte() { return chain; },
      like() { return chain; },
      contains() { return chain; },
      maybeSingle() {
        if (name === "admin_agent_tokens" && state.op === "select") return Promise.resolve({ data: tokenRow, error: null });
        if (name === "video_lessons" && state.op === "select") return Promise.resolve({ data: videoRow, error: null });
        return Promise.resolve({ data: state.op === "update" ? { id: TOKEN_ID } : null, error: null });
      },
      single() {
        if (name === "admin_agent_tokens" && state.op === "insert") {
          return Promise.resolve({ data: { id: TOKEN_ID, name: state.values?.name, last_four: state.values?.last_four, permissions: state.values?.permissions, expires_at: state.values?.expires_at, created_at: new Date().toISOString() }, error: null });
        }
        return Promise.resolve({ data: null, error: null });
      },
      then(resolveFn: (value: unknown) => unknown) {
        if (name === "admin_agent_requests" && state.op === "update" && state.values?.status === "approved") requestStatus = "approved";
        return Promise.resolve({ data: null, error: null }).then(resolveFn);
      },
    };
    return chain;
  }

  mock.module(file("lib/supabase/admin.ts"), {
    namedExports: {
      createAdminSupabase: () => ({
        from: table,
        rpc: async (name: string) => {
          if (name === "is_platform_admin") return { data: true, error: null };
          if (name === "check_admin_agent_rate_limit") return { data: rateAllowed, error: null };
          if (name === "claim_admin_agent_request") return {
            data: [{
              request_id: REQUEST_ID,
              request_kind: "publication",
              request_target_id: VIDEO_ID,
              request_payload: { videoId: VIDEO_ID },
              request_status: requestStatus === "pending" ? "executing" : requestStatus,
              request_claimed: requestStatus === "pending",
            }],
            error: null,
          };
          if (name === "publish_video_lesson") {
            publicationCalls += 1;
            return { data: [{ section_id: "b2-s1", previous_mux_asset_id: null }], error: null };
          }
          if (name === "refuse_admin_agent_request") return { data: "refused", error: null };
          return { data: null, error: null };
        },
      }),
    },
  });
  mock.module(file("lib/mux/adminServer.ts"), {
    namedExports: {
      getVerifiedAdmin: async () => currentUser?.app_metadata.role === "admin" ? currentUser : null,
      recordAdminAction: async () => "audit-id",
    },
  });

  const security = await import("../lib/adminAgent/security");
  const execution = await import("../lib/adminAgent/execution");
  const admin = await import("../lib/adminAgent/admin");

  const request = (token = RAW_TOKEN) => new Request("https://build.example/api/agent/tools", {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "x-vercel-forwarded-for": "203.0.113.7" },
  });
  process.env.AGENT_RATE_LIMIT_PEPPER = "pepper-for-tests-long-enough";

  test("jeton absent, révoqué et expiré refusés", async () => {
    await assert.rejects(() => security.authenticateAgentRequest(new Request("https://build.example")), /Jeton requis/);
    tokenRow = { ...validTokenRow(), revoked_at: new Date().toISOString() };
    await assert.rejects(() => security.authenticateAgentRequest(request()), /Jeton invalide/);
    tokenRow = { ...validTokenRow(), expires_at: new Date(Date.now() - 1).toISOString() };
    await assert.rejects(() => security.authenticateAgentRequest(request()), /Jeton invalide/);
    tokenRow = validTokenRow();
  });

  test("droit manquant et débit limité refusés", async () => {
    const context = await security.authenticateAgentRequest(request());
    assert.throws(() => security.requireAgentPermission(context, "preparer_mail"), /Droit manquant/);
    rateAllowed = false;
    await assert.rejects(() => security.authenticateAgentRequest(request()), /Débit limité/);
    rateAllowed = true;
  });

  test("la création ne place que le hash en base", async () => {
    currentUser = { id: ADMIN_ID, app_metadata: { role: "admin" } };
    const created = await admin.createAgentToken({ name: "Hermes", permissions: ["liste_blocs"] });
    assert.match(created.token, /^btv_agt_/);
    assert.equal(typeof insertedToken?.token_hash, "string");
    assert.equal("token" in (insertedToken ?? {}), false);
    assert.notEqual(insertedToken?.token_hash, created.token);
  });

  test("un non admin ne crée pas de jeton et l'agent ne possède aucune approbation", async () => {
    currentUser = { id: ADMIN_ID, app_metadata: {} };
    await assert.rejects(() => admin.createAgentToken({ name: "Refusé", permissions: [] }), /Accès refusé/);
    currentUser = { id: ADMIN_ID, app_metadata: { role: "admin" } };
  });

  test("la publication sans transcription est refusée", async () => {
    videoRow = {
      id: VIDEO_ID, section_id: "b2-s1", summary: "Résumé", transcript: "",
      chapters: [{ index: 1, title: "Départ", startSeconds: 0 }], thumbnail: "mux:0",
      status: "ready", mux_asset_id: "asset", playback_id: "playback", duration_seconds: 120,
    };
    await assert.rejects(() => execution.executeAgentPublication(VIDEO_ID, ADMIN_ID), /transcription/);
    assert.equal(publicationCalls, 0);
  });

  test("une approbation publie une fois et son rejeu reste idempotent", async () => {
    requestStatus = "pending";
    publicationCalls = 0;
    videoRow = {
      id: VIDEO_ID, section_id: "b2-s1", summary: "Résumé", transcript: "Une transcription suffisamment longue.",
      chapters: [{ index: 1, title: "Départ", startSeconds: 0 }], thumbnail: "mux:0",
      status: "ready", mux_asset_id: "asset", playback_id: "playback", duration_seconds: 120,
    };
    assert.equal((await admin.decideRequest(REQUEST_ID, "approve")).status, "approved");
    assert.equal(publicationCalls, 1);
    assert.deepEqual(await admin.decideRequest(REQUEST_ID, "approve"), { status: "approved", replayed: true });
    assert.equal(publicationCalls, 1);
  });
}
