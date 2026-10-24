import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import test, { mock } from "node:test";
import type { AgentPermission, AgentTokenContext } from "../lib/adminAgent/types";

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
  let platformAdminAllowed = true;
  let insertedToken: Record<string, unknown> | null = null;
  let videoRow: Record<string, unknown> | null = null;
  let requestStatus = "pending";
  let publicationCalls = 0;
  let requestCreationCalls = 0;
  let requestCreationFailure: string | null = null;
  let claimCalls = 0;
  const auditEntries: unknown[] = [];

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

  type QueryResult = { data: unknown; error: null };
  type MockChain = {
    select(): MockChain;
    order(): MockChain;
    limit(): Promise<QueryResult>;
    insert(values: Record<string, unknown>): MockChain;
    update(values: Record<string, unknown>): MockChain;
    eq(column: string, value: unknown): MockChain;
    is(): MockChain;
    lte(): MockChain;
    like(): MockChain;
    contains(): MockChain;
    maybeSingle(): Promise<QueryResult>;
    single(): Promise<QueryResult>;
    then(resolveFn: (value: QueryResult) => unknown): Promise<unknown>;
  };
  function table(name: string) {
    const state: { op: string; values?: Record<string, unknown>; filters: Array<[string, unknown]> } = { op: "select", filters: [] };
    const chain: MockChain = {
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
        if (name === "admin_agent_settings" && state.op === "select") return Promise.resolve({ data: { mode: "prepare" }, error: null });
        return Promise.resolve({ data: state.op === "update" ? { id: VIDEO_ID } : null, error: null });
      },
      single() {
        if (name === "admin_agent_tokens" && state.op === "insert") {
          return Promise.resolve({ data: { id: TOKEN_ID, name: state.values?.name, last_four: state.values?.last_four, permissions: state.values?.permissions, expires_at: state.values?.expires_at, created_at: new Date().toISOString() }, error: null });
        }
        return Promise.resolve({ data: null, error: null });
      },
      then(resolveFn: (value: QueryResult) => unknown) {
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
        rpc: async (name: string, args?: Record<string, unknown>) => {
          if (name === "is_platform_admin") return { data: platformAdminAllowed, error: null };
          if (name === "check_admin_agent_rate_limit") return { data: rateAllowed, error: null };
          if (name === "create_admin_agent_request") {
            requestCreationCalls += 1;
            if (requestCreationFailure) return { data: null, error: { message: requestCreationFailure } };
            return {
              data: [{ request_id: args?.p_idempotency_key, request_status: "pending", request_expires_at: new Date().toISOString() }],
              error: null,
            };
          }
          if (name === "claim_admin_agent_request") {
            claimCalls += 1;
            const claimed = requestStatus === "pending";
            if (claimed) requestStatus = "executing";
            return {
              data: [{
                request_id: REQUEST_ID,
                request_kind: "publication",
                request_target_id: VIDEO_ID,
                request_payload: { videoId: VIDEO_ID },
                request_status: requestStatus,
                request_claimed: claimed,
              }],
              error: null,
            };
          }
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
      createMuxAdminClient: () => ({ video: { uploads: {} } }),
      recordAdminAction: async (input: unknown) => {
        auditEntries.push(input);
        return "audit-id";
      },
    },
  });

  const security = await import("../lib/adminAgent/security");
  const execution = await import("../lib/adminAgent/execution");
  const admin = await import("../lib/adminAgent/admin");
  const tools = await import("../lib/adminAgent/tools");
  const toolsRoute = await import("../app/api/agent/tools/route");
  const mcpRoute = await import("../app/api/agent/mcp/route");

  const request = (token = RAW_TOKEN) => new Request("https://build.example/api/agent/tools", {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "x-vercel-forwarded-for": "203.0.113.7" },
  });
  process.env.AGENT_RATE_LIMIT_PEPPER = "pepper-for-tests-long-enough";

  const toolContext = (permissions: AgentPermission[] = [
    "liste_blocs", "envoyer_video", "ecrire_chapitres", "ecrire_resume",
    "choisir_miniature", "demander_publication", "preparer_mail", "statut_video", "journal",
  ]): AgentTokenContext => ({ id: TOKEN_ID, name: "Hermes", lastFour: "aaaa", permissions, createdBy: ADMIN_ID });

  const publishableVideo = () => ({
    id: VIDEO_ID,
    section_id: "b2-s1",
    summary: "Résumé",
    transcript: "Une transcription suffisamment longue.",
    chapters: [{ index: 1, title: "Départ", startSeconds: 0 }],
    thumbnail: "mux:0",
    status: "ready",
    mux_asset_id: "asset",
    playback_id: "playback",
    duration_seconds: 120,
    published_at: null,
  });

  test("jeton absent, révoqué et expiré refusés", async () => {
    await assert.rejects(() => security.authenticateAgentRequest(new Request("https://build.example")), /Jeton requis/);
    tokenRow = { ...validTokenRow(), revoked_at: new Date().toISOString() };
    await assert.rejects(() => security.authenticateAgentRequest(request()), /Jeton invalide/);
    tokenRow = { ...validTokenRow(), expires_at: new Date(Date.now() - 1).toISOString() };
    await assert.rejects(() => security.authenticateAgentRequest(request()), /Jeton invalide/);
    tokenRow = validTokenRow();
  });

  test("la révocation est relue à chaque requête sans cache", async () => {
    tokenRow = validTokenRow();
    await security.authenticateAgentRequest(request());
    tokenRow = { ...validTokenRow(), revoked_at: new Date().toISOString() };
    await assert.rejects(() => security.authenticateAgentRequest(request()), /Jeton invalide/);
    tokenRow = validTokenRow();
  });

  test("le jeton est refusé dès que son créateur n'est plus administrateur", async () => {
    tokenRow = validTokenRow();
    platformAdminAllowed = false;
    await assert.rejects(() => security.authenticateAgentRequest(request()), /Jeton invalide/);
    platformAdminAllowed = true;
  });

  test("la limitation de débit échoue fermée sans poivre ou sans adresse fiable", async () => {
    tokenRow = validTokenRow();
    const validPepper = process.env.AGENT_RATE_LIMIT_PEPPER;
    delete process.env.AGENT_RATE_LIMIT_PEPPER;
    await assert.rejects(() => security.authenticateAgentRequest(request()), /temporairement indisponible/);
    process.env.AGENT_RATE_LIMIT_PEPPER = validPepper;
    const withoutAddress = new Request("https://build.example/api/agent/tools", {
      method: "POST",
      headers: { authorization: `Bearer ${RAW_TOKEN}` },
    });
    await assert.rejects(() => security.authenticateAgentRequest(withoutAddress), /temporairement indisponible/);
  });

  test("la comparaison de hash utilise une comparaison à temps constant", () => {
    assert.equal(security.constantTimeHashMatches(TOKEN_HASH, TOKEN_HASH), true);
    assert.equal(security.constantTimeHashMatches(TOKEN_HASH, "0".repeat(64)), false);
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
    claimCalls = 0;
    await assert.rejects(() => admin.decideRequest(REQUEST_ID, "approve"), /Accès refusé/);
    assert.equal(claimCalls, 0);
    currentUser = { id: ADMIN_ID, app_metadata: { role: "admin" } };
  });

  test("la demande de publication refuse chaque cible invalide avant la file", async () => {
    const cases: Array<[Record<string, unknown> | null, RegExp]> = [
      [null, /n'existe pas/],
      [{ ...publishableVideo(), status: "preparing" }, /n'est pas prête/],
      [{ ...publishableVideo(), published_at: new Date().toISOString() }, /déjà publiée/],
      [{ ...publishableVideo(), transcript: "" }, /manque la transcription/],
      [{ ...publishableVideo(), summary: "" }, /manque le résumé/],
      [{ ...publishableVideo(), chapters: [] }, /manque les chapitres/],
      [{ ...publishableVideo(), thumbnail: null }, /manque la miniature/],
      [{ ...publishableVideo(), transcript: "", summary: "", chapters: [], thumbnail: null }, /transcription, le résumé, la miniature et les chapitres/],
    ];
    for (const [row, expected] of cases) {
      videoRow = row;
      requestCreationCalls = 0;
      const result = await tools.invokeAdminAgentTool("demander_publication", { videoId: VIDEO_ID }, toolContext());
      assert.equal(result.isError, true);
      assert.match(result.content[0].text, expected);
      assert.equal(requestCreationCalls, 0);
    }
  });

  test("une publication prête entre dans la file et les deux plafonds renvoient un message clair", async () => {
    videoRow = publishableVideo();
    requestCreationFailure = null;
    requestCreationCalls = 0;
    const created = await tools.invokeAdminAgentTool("demander_publication", { videoId: VIDEO_ID }, toolContext());
    assert.equal(created.isError, undefined);
    assert.equal(created.structuredContent?.status, "pending");
    assert.equal(requestCreationCalls, 1);

    for (const [failure, expected] of [
      ["agent_pending_token_limit", /20 demandes/],
      ["agent_pending_global_limit", /100 demandes/],
    ] as const) {
      requestCreationFailure = failure;
      const result = await tools.invokeAdminAgentTool("demander_publication", { videoId: VIDEO_ID }, toolContext());
      assert.equal(result.isError, true);
      assert.match(result.content[0].text, expected);
    }
    requestCreationFailure = null;
    requestCreationCalls = 0;
    assert.throws(() => execution.validatePreparedMailForExecution({
      campaignId: REQUEST_ID,
      audience: "free",
      subject: "Sujet",
      body: "🙂".repeat(7_000),
    }), /trop long/);
    const tooLarge = await tools.invokeAdminAgentTool("preparer_mail", {
      audience: "free",
      subject: "Sujet",
      body: "🙂".repeat(7_000),
    }, toolContext());
    assert.equal(tooLarge.isError, true);
    assert.match(tooLarge.content[0].text, /trop long/);
    assert.equal(requestCreationCalls, 0);
  });

  test("le mail refuse un segment inconnu et une audience sans compte actif", async () => {
    await assert.rejects(
      () => tools.invokeAdminAgentTool("preparer_mail", {
        audience: "selected",
        subject: "Sujet",
        body: "Corps",
      }, toolContext()),
      /segment du mail n'est pas autorisé/,
    );
    for (const [failure, expected] of [
      ["agent_mail_no_recipients", /aucun compte actif autorisé/],
      ["agent_mail_too_many_recipients", /trop de destinataires/],
    ] as const) {
      requestCreationFailure = failure;
      await assert.rejects(
        () => tools.ADMIN_AGENT_TOOLS.preparer_mail.run({
          audience: "free",
          subject: "Sujet",
          body: "Corps",
        }, toolContext()),
        expected,
      );
      const result = await tools.invokeAdminAgentTool("preparer_mail", {
        audience: "free",
        subject: "Sujet",
        body: "Corps",
      }, toolContext());
      assert.equal(result.isError, true);
      assert.match(result.content[0].text, expected);
    }
    requestCreationFailure = null;
  });

  test("les autres écritures refusent une vidéo absente, publiée ou non prête", async () => {
    videoRow = null;
    let result = await tools.invokeAdminAgentTool("ecrire_resume", { videoId: VIDEO_ID, summary: "Résumé" }, toolContext());
    assert.match(result.content[0].text, /n'existe pas/);
    videoRow = { ...publishableVideo(), published_at: new Date().toISOString() };
    result = await tools.invokeAdminAgentTool("ecrire_chapitres", {
      videoId: VIDEO_ID,
      chapters: [{ index: 1, title: "Départ", startSeconds: 0 }],
    }, toolContext());
    assert.match(result.content[0].text, /déjà publiée/);
    result = await tools.invokeAdminAgentTool("deposer_miniature", {
      videoId: VIDEO_ID,
      file: { bytesBase64: "not-a-thumbnail" },
    }, toolContext());
    assert.match(result.content[0].text, /déjà publiée/);
    videoRow = { ...publishableVideo(), status: "preparing" };
    result = await tools.invokeAdminAgentTool("choisir_miniature", { videoId: VIDEO_ID, timeSeconds: 1 }, toolContext());
    assert.match(result.content[0].text, /n'est pas prête/);
  });

  test("la publication sans transcription est refusée", async () => {
    videoRow = {
      id: VIDEO_ID, section_id: "b2-s1", summary: "Résumé", transcript: "",
      chapters: [{ index: 1, title: "Départ", startSeconds: 0 }], thumbnail: "mux:0",
      status: "ready", mux_asset_id: "asset", playback_id: "playback", duration_seconds: 120, published_at: null,
    };
    await assert.rejects(() => execution.executeAgentPublication(VIDEO_ID, ADMIN_ID), /manque la transcription/);
    assert.equal(publicationCalls, 0);
  });

  test("une approbation publie une fois et son rejeu reste idempotent", async () => {
    requestStatus = "pending";
    publicationCalls = 0;
    videoRow = publishableVideo();
    assert.equal((await admin.decideRequest(REQUEST_ID, "approve")).status, "approved");
    assert.equal(publicationCalls, 1);
    assert.deepEqual(await admin.decideRequest(REQUEST_ID, "approve"), { status: "approved", replayed: true });
    assert.equal(publicationCalls, 1);
  });

  test("deux approbations concurrentes ne déclenchent qu'une exécution", async () => {
    requestStatus = "pending";
    publicationCalls = 0;
    videoRow = publishableVideo();
    const results = await Promise.all([
      admin.decideRequest(REQUEST_ID, "approve"),
      admin.decideRequest(REQUEST_ID, "approve"),
    ]);
    assert.equal(publicationCalls, 1);
    assert.equal(results.filter((result) => result.status === "approved").length, 1);
    assert.equal(results.filter((result) => result.replayed === true).length, 1);
  });

  test("les routes bornent leurs corps JSON et n'acceptent pas un cookie admin seul", async () => {
    tokenRow = validTokenRow();
    const cookieOnly = new Request("https://build.example/api/agent/tools", {
      method: "POST",
      headers: { "content-type": "application/json", cookie: "session=admin" },
      body: "{}",
    });
    assert.equal((await toolsRoute.POST(cookieOnly)).status, 401);

    const oversized = (url: string) => new Request(url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${RAW_TOKEN}`,
        "content-type": "application/json",
        "content-length": String(64 * 1024 + 1),
        "x-vercel-forwarded-for": "203.0.113.7",
      },
      body: "{}",
    });
    assert.equal((await toolsRoute.POST(oversized("https://build.example/api/agent/tools"))).status, 413);
    assert.equal((await mcpRoute.POST(oversized("https://build.example/api/agent/mcp"))).status, 413);
  });

  test("jeton inconnu et jeton révoqué donnent la même réponse extérieure", async () => {
    const authRequest = () => new Request("https://build.example/api/agent/tools", {
      method: "POST",
      headers: {
        authorization: `Bearer ${RAW_TOKEN}`,
        "content-type": "application/json",
        "x-vercel-forwarded-for": "203.0.113.7",
      },
      body: JSON.stringify({ tool: "liste_blocs", input: {} }),
    });
    tokenRow = null;
    const unknown = await toolsRoute.POST(authRequest());
    tokenRow = { ...validTokenRow(), revoked_at: new Date().toISOString() };
    const revoked = await toolsRoute.POST(authRequest());
    assert.equal(unknown.status, 401);
    assert.equal(revoked.status, 401);
    assert.deepEqual(await unknown.json(), await revoked.json());
    tokenRow = validTokenRow();
  });

  test("aucune réponse agent ne contient le jeton", async () => {
    tokenRow = { ...validTokenRow(), permissions: ["liste_blocs"] };
    const response = await toolsRoute.POST(new Request("https://build.example/api/agent/tools", {
      method: "POST",
      headers: {
        authorization: `Bearer ${RAW_TOKEN}`,
        "content-type": "application/json",
        "x-vercel-forwarded-for": "203.0.113.7",
      },
      body: JSON.stringify({ tool: "liste_blocs", input: {} }),
    }));
    const serializedHeaders = JSON.stringify(Object.fromEntries(response.headers));
    const serializedBody = await response.text();
    assert.equal(response.status, 200);
    assert.doesNotMatch(`${serializedHeaders}${serializedBody}`, new RegExp(RAW_TOKEN));
    assert.doesNotMatch(JSON.stringify(auditEntries), new RegExp(RAW_TOKEN));
  });

  test("l'adaptateur MCP retire le porteur avant le SDK et ne le renvoie jamais", async () => {
    tokenRow = { ...validTokenRow(), permissions: ["liste_blocs"] };
    const response = await mcpRoute.POST(new Request("https://build.example/api/agent/mcp", {
      method: "POST",
      headers: {
        authorization: `Bearer ${RAW_TOKEN}`,
        accept: "application/json, text/event-stream",
        "content-type": "application/json",
        "x-vercel-forwarded-for": "203.0.113.7",
      },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} }),
    }));
    const serializedHeaders = JSON.stringify(Object.fromEntries(response.headers));
    const serializedBody = await response.text();
    assert.equal(response.status, 200);
    assert.doesNotMatch(`${serializedHeaders}${serializedBody}`, new RegExp(RAW_TOKEN));
    assert.equal(response.headers.has("authorization"), false);
    assert.equal(response.headers.has("set-cookie"), false);
  });
}
