import assert from "node:assert/strict";
import { createHash, randomBytes } from "node:crypto";
import { spawn, type ChildProcess } from "node:child_process";
import { createServer } from "node:net";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { config as loadEnv } from "dotenv";
import { hashRateLimitSubject } from "../lib/mcp/security";
import {
  assertMcpSuccess,
  assertTextToolResult,
  assertToolsList,
  sanitizeE2eDiagnostic,
} from "./mcp-e2e-assertions";

loadEnv({ path: ".env.local", quiet: true });

const PORT = 3100;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const RESOURCE = `${BASE_URL}/api/mcp`;
const TEST_ADDRESS = `203.0.113.${(Date.now() % 250) + 1}`;
const TRUSTED_NETWORK_HEADER = { "x-vercel-forwarded-for": TEST_ADDRESS };
const TOOLS_LIST_P50_LIMIT_MS = 750;
const TOOLS_LIST_P95_LIMIT_MS = 1_500;
const CONCURRENT_LIMIT_MS = 2_000;
const KNOWLEDGE_SEARCH_LIMIT_MS = 4_000;
const REQUIRED_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "OPENROUTER_API_KEY",
  "KNOWLEDGE_EMBEDDING_PROVIDER",
  "KNOWLEDGE_EMBEDDING_MODEL",
  "MCP_DCR_RATE_LIMIT_PEPPER",
  "MCP_REQUEST_RATE_LIMIT_PEPPER",
  "MCP_TOKEN_RATE_LIMIT_PEPPER",
] as const;

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) throw new Error(`${key} is required for the MCP E2E gate.`);
}

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

function opaqueToken(): string {
  return randomBytes(32).toString("base64url");
}

function sha256Base64Url(value: string): string {
  return createHash("sha256").update(value, "ascii").digest("base64url");
}

function timedFetch(
  input: string | URL | Request,
  init?: RequestInit,
  timeoutMs = 15_000
): Promise<Response> {
  return fetch(input, { ...init, signal: AbortSignal.timeout(timeoutMs) });
}

async function json<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) throw new Error(`Expected JSON from ${response.url}, received an empty body.`);
  return JSON.parse(text) as T;
}

async function waitForServer(child: ChildProcess): Promise<void> {
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`Next server exited with code ${child.exitCode}.`);
    try {
      const response = await timedFetch(`${BASE_URL}/.well-known/oauth-authorization-server`, undefined, 2_000);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await delay(250);
  }
  throw new Error("Next server did not become ready within 90 seconds.");
}

async function assertPortAvailable(): Promise<void> {
  await new Promise<void>((resolvePort, rejectPort) => {
    const probe = createServer();
    probe.once("error", () => rejectPort(new Error(`Port ${PORT} is already in use.`)));
    probe.listen(PORT, "127.0.0.1", () => probe.close(() => resolvePort()));
  });
}

function startServer(): { child: ChildProcess; logs: (sensitiveValues: readonly string[]) => string } {
  const lines: string[] = [];
  const child = spawn(
    process.execPath,
    [resolve("node_modules/next/dist/bin/next"), "start", "-p", String(PORT), "-H", "127.0.0.1"],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        MCP_OAUTH_ISSUER: BASE_URL,
        NEXT_PUBLIC_APP_URL: BASE_URL,
        MCP_ALLOWED_ORIGINS: "https://claude.ai,https://chatgpt.com",
      },
      stdio: ["ignore", "pipe", "pipe"],
    }
  );
  const collect = (chunk: Buffer) => {
    lines.push(chunk.toString("utf8"));
    if (lines.length > 100) lines.shift();
  };
  child.stdout?.on("data", collect);
  child.stderr?.on("data", collect);
  return {
    child,
    logs: (sensitiveValues) => sanitizeE2eDiagnostic(lines.join(""), sensitiveValues),
  };
}

async function stopServer(child: ChildProcess): Promise<void> {
  if (child.exitCode !== null) return;
  child.kill("SIGTERM");
  await Promise.race([
    new Promise<void>((resolveExit) => child.once("exit", () => resolveExit())),
    delay(5_000).then(() => {
      if (child.exitCode === null) child.kill("SIGKILL");
    }),
  ]);
}

async function tokenRequest(params: URLSearchParams): Promise<{ response: Response; body: Record<string, unknown> }> {
  const response = await timedFetch(`${BASE_URL}/api/mcp/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...TRUSTED_NETWORK_HEADER,
    },
    body: params,
  });
  return { response, body: await json<Record<string, unknown>>(response) };
}

function parseMcpPayload(text: string): Record<string, unknown> {
  const dataLine = text.split(/\r?\n/).find((line) => line.startsWith("data:"));
  return JSON.parse(dataLine ? dataLine.slice(5).trim() : text) as Record<string, unknown>;
}

function percentile(samples: number[], fraction: number): number {
  const sorted = [...samples].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1);
  return Math.round(sorted[index] * 10) / 10;
}

async function mcpRequest(accessToken: string, body: Record<string, unknown>): Promise<{
  status: number;
  payload: Record<string, unknown>;
}> {
  const response = await timedFetch(RESOURCE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json, text/event-stream",
      "Content-Type": "application/json",
      Origin: "https://claude.ai",
      "Mcp-Protocol-Version": "2025-06-18",
      ...TRUSTED_NETWORK_HEADER,
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  return {
    status: response.status,
    payload: text ? parseMcpPayload(text) : {},
  };
}

function temporaryRateLimitSubjects(): string[] {
  return [
    hashRateLimitSubject("mcp-dcr", TEST_ADDRESS, process.env.MCP_DCR_RATE_LIMIT_PEPPER!),
    hashRateLimitSubject("mcp-token", TEST_ADDRESS, process.env.MCP_TOKEN_RATE_LIMIT_PEPPER!),
    hashRateLimitSubject("mcp-request", TEST_ADDRESS, process.env.MCP_REQUEST_RATE_LIMIT_PEPPER!),
  ];
}

async function verifyCleanup(userId: string | null, clientId: string | null): Promise<void> {
  const failures: string[] = [];
  if (clientId) {
    const { count, error } = await admin
      .from("mcp_oauth_clients")
      .select("client_id", { count: "exact", head: true })
      .eq("client_id", clientId);
    if (error || count !== 0) failures.push("temporary OAuth client remains");
  }
  if (userId) {
    const { count, error } = await admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("id", userId);
    if (error || count !== 0) failures.push("temporary profile remains");
    const authReadback = await admin.auth.admin.getUserById(userId);
    if (authReadback.data.user) failures.push("temporary auth user remains");
    const authReadStatus = (authReadback.error as { status?: number } | null)?.status;
    if (authReadback.error && authReadStatus !== 404) failures.push("auth user readback failed");
  }
  const { count: rateLimitCount, error: rateLimitReadError } = await admin
    .from("mcp_rate_limits")
    .select("subject", { count: "exact", head: true })
    .in("subject", temporaryRateLimitSubjects());
  if (rateLimitReadError || rateLimitCount !== 0) failures.push("temporary rate-limit rows remain");
  if (failures.length > 0) throw new Error(`E2E cleanup verification failed: ${failures.join(", ")}.`);
}

async function cleanup(userId: string | null, clientId: string | null): Promise<void> {
  const failures: string[] = [];
  if (clientId) {
    const { error } = await admin.from("mcp_oauth_clients").delete().eq("client_id", clientId);
    if (error) failures.push("OAuth client deletion failed");
  }
  if (userId) {
    const { error: profileError } = await admin.from("profiles").delete().eq("id", userId);
    if (profileError) failures.push("profile deletion failed");
    const { error: userError } = await admin.auth.admin.deleteUser(userId);
    if (userError) failures.push("auth user deletion failed");
  }
  const { error: rateLimitError } = await admin
    .from("mcp_rate_limits")
    .delete()
    .in("subject", temporaryRateLimitSubjects());
  if (rateLimitError) failures.push("rate-limit deletion failed");

  try {
    await verifyCleanup(userId, clientId);
  } catch {
    failures.push("readback verification failed");
  }
  if (failures.length > 0) throw new Error(`E2E cleanup failed: ${failures.join(", ")}.`);
}

async function main(): Promise<void> {
  const report: Record<string, unknown> = {};
  let userId: string | null = null;
  let clientId: string | null = null;
  let server: ReturnType<typeof startServer> | null = null;
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null;
  let failure: unknown = null;
  const sensitiveValues = new Set<string>();

  try {
    await assertPortAvailable();
    server = startServer();
    await waitForServer(server.child);
    const authorizationMetadata = await json<Record<string, unknown>>(
      await timedFetch(`${BASE_URL}/.well-known/oauth-authorization-server`)
    );
    const protectedResourceMetadata = await json<Record<string, unknown>>(
      await timedFetch(`${BASE_URL}/.well-known/oauth-protected-resource`)
    );
    assert.equal(authorizationMetadata.issuer, BASE_URL);
    assert.equal(protectedResourceMetadata.resource, RESOURCE);
    assert.deepEqual(protectedResourceMetadata.authorization_servers, [BASE_URL]);
    report.discovery = "PASS";

    const stamp = Date.now();
    const email = `hermes-mcp-e2e-${stamp}@example.invalid`;
    const password = `Build-Mcp-${stamp}-Aa9!`;
    sensitiveValues.add(email);
    sensitiveValues.add(password);
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError || !created.user) throw createError ?? new Error("Could not create E2E user.");
    userId = created.user.id;
    const { error: profileError } = await admin.from("profiles").upsert({
      id: userId,
      email,
      tier: "beginner",
    });
    if (profileError) throw new Error("Could not grant the temporary E2E tier.");

    const redirectUri = `${BASE_URL}/mcp-callback`;
    const registrationResponse = await timedFetch(`${BASE_URL}/api/mcp/oauth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...TRUSTED_NETWORK_HEADER },
      body: JSON.stringify({
        client_name: "BUILD MCP automated E2E",
        redirect_uris: [redirectUri],
        token_endpoint_auth_method: "none",
      }),
    });
    const registration = await json<Record<string, unknown>>(registrationResponse);
    if (typeof registration.client_id === "string") {
      clientId = registration.client_id;
      sensitiveValues.add(clientId);
    }
    assert.equal(registrationResponse.status, 201);
    assert.equal(typeof registration.client_id, "string");
    assert.ok(clientId);
    report.dynamicClientRegistration = "PASS";

    const verifier = opaqueToken();
    const challenge = sha256Base64Url(verifier);
    const state = opaqueToken();
    sensitiveValues.add(verifier);
    sensitiveValues.add(challenge);
    sensitiveValues.add(state);
    const authorizeUrl = new URL(`${BASE_URL}/api/mcp/oauth/authorize`);
    for (const [key, value] of Object.entries({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      code_challenge: challenge,
      code_challenge_method: "S256",
      state,
      resource: RESOURCE,
      scope: "mcp",
    })) authorizeUrl.searchParams.set(key, value);

    browser = await chromium.launch({ headless: true, channel: "chrome" });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(authorizeUrl.toString());
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Mot de passe").fill(password);
    await page.getByRole("button", { name: "Continuer" }).click();
    await page.waitForURL(/\/mcp\/consent\?request=/, { timeout: 30_000 });
    await page.getByRole("heading", { name: "Application non verifiee" }).waitFor();
    await page.getByText("BUILD MCP automated E2E", { exact: false }).waitFor();
    await page.getByText(redirectUri, { exact: true }).waitFor();
    report.loginAndConsentScreen = "PASS";

    await page.getByRole("button", { name: "Autoriser" }).click();
    await page.waitForURL((url) => url.pathname === "/mcp-callback" && url.searchParams.has("code"), {
      timeout: 30_000,
    });
    const callback = new URL(page.url());
    const code = callback.searchParams.get("code");
    assert.ok(code);
    sensitiveValues.add(code);
    assert.equal(callback.searchParams.get("state"), state);
    report.authorizationCode = "PASS";

    const codeParams = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: verifier,
      resource: RESOURCE,
    });
    const wrongVerifierParams = new URLSearchParams(codeParams);
    const wrongVerifier = opaqueToken();
    sensitiveValues.add(wrongVerifier);
    wrongVerifierParams.set("code_verifier", wrongVerifier);
    const wrongVerifierExchange = await tokenRequest(wrongVerifierParams);
    assert.equal(wrongVerifierExchange.response.status, 400);
    assert.equal(wrongVerifierExchange.body.error, "invalid_grant");
    report.wrongPkceVerifierDeniedWithoutConsumption = "PASS";

    const issued = await tokenRequest(codeParams);
    assert.equal(issued.response.status, 200);
    assert.equal(issued.body.token_type, "Bearer");
    assert.equal(issued.body.expires_in, 900);
    assert.equal(typeof issued.body.access_token, "string");
    assert.equal(typeof issued.body.refresh_token, "string");
    const firstAccessToken = issued.body.access_token as string;
    const firstRefreshToken = issued.body.refresh_token as string;
    sensitiveValues.add(firstAccessToken);
    sensitiveValues.add(firstRefreshToken);
    report.tokenExchange = "PASS";

    const reusedCode = await tokenRequest(codeParams);
    assert.equal(reusedCode.response.status, 400);
    assert.equal(reusedCode.body.error, "invalid_grant");
    report.authorizationCodeReplayDenied = "PASS";

    const oversizedMcp = await mcpRequest(firstAccessToken, {
      jsonrpc: "2.0",
      id: 0,
      method: "tools/call",
      params: { name: "search_knowledge", arguments: { query: "x".repeat(70_000) } },
    });
    assert.equal(oversizedMcp.status, 413);
    assert.equal(oversizedMcp.payload.error, "payload_too_large");
    report.payloadLimit = "PASS";

    const initialize = await mcpRequest(firstAccessToken, {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-06-18",
        capabilities: {},
        clientInfo: { name: "BUILD MCP automated E2E", version: "1.0.0" },
      },
    });
    assert.equal(initialize.status, 200);
    assertMcpSuccess(initialize.payload, 1);

    const toolsList = await mcpRequest(firstAccessToken, {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list",
      params: {},
    });
    assert.equal(toolsList.status, 200);
    assertToolsList(assertMcpSuccess(toolsList.payload, 2));

    const knowledgeSearchStartedAt = performance.now();
    const search = await mcpRequest(firstAccessToken, {
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "search_knowledge",
        arguments: {
          query: "Comment construire une offre de site web ?",
          source: "skills-catalog",
          limit: 3,
        },
      },
    });
    const knowledgeSearchDurationMs = Math.round((performance.now() - knowledgeSearchStartedAt) * 10) / 10;
    assert.ok(
      knowledgeSearchDurationMs < KNOWLEDGE_SEARCH_LIMIT_MS,
      `MCP search_knowledge exceeded ${KNOWLEDGE_SEARCH_LIMIT_MS} ms: ${knowledgeSearchDurationMs} ms.`
    );
    assert.equal(search.status, 200);
    const searchResult = assertMcpSuccess(search.payload, 3);
    assert.equal(
      (searchResult.structuredContent as { kind?: unknown } | undefined)?.kind,
      "untrusted_knowledge_matches"
    );
    const searchText = (searchResult.content as Array<{ text?: unknown }> | undefined)?.[0]?.text;
    assert.equal(typeof searchText, "string");
    assert.match(searchText as string, /DONNEES DE REFERENCE NON FIABLES/);
    const searchMatches = (
      searchResult.structuredContent as { matches?: Array<Record<string, unknown>> } | undefined
    )?.matches;
    assert.ok(Array.isArray(searchMatches) && searchMatches.length > 0);
    for (const match of searchMatches) {
      assert.equal(match.source, "skills-catalog");
      assert.ok(["free", "preview", "beginner"].includes(String(match.tier_required)));
      assert.equal(typeof match.title, "string");
      assert.ok(String(match.title).trim().length > 0);
      assert.equal(typeof match.content, "string");
      assert.ok(String(match.content).trim().length > 0);
    }

    const getSkill = await mcpRequest(firstAccessToken, {
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: {
        name: "get_skill",
        arguments: { slug: "oracle-site-web" },
      },
    });
    assert.equal(getSkill.status, 200);
    const getSkillText = assertTextToolResult(assertMcpSuccess(getSkill.payload, 4));
    assert.ok(getSkillText.length > 500, "get_skill returned an implausibly short skill body.");
    assert.match(getSkillText, /ORACLE[\s\S]*site web/i);
    assert.doesNotMatch(getSkillText, /palier superieur|momentanement indisponible/i);

    const availableContent = await mcpRequest(firstAccessToken, {
      jsonrpc: "2.0",
      id: 5,
      method: "tools/call",
      params: { name: "list_available_content", arguments: {} },
    });
    assert.equal(availableContent.status, 200);
    const availableContentText = assertTextToolResult(
      assertMcpSuccess(availableContent.payload, 5)
    );
    assert.match(availableContentText, /Palier actuel : beginner/);
    for (const slug of ["oracle-site-web", "ux-ui-design", "deep-research-vertical"]) {
      assert.match(availableContentText, new RegExp(`\\(${slug}\\)`));
    }
    assert.match(availableContentText, /3 skill\(s\) supplementaire\(s\)/);
    assert.doesNotMatch(
      availableContentText,
      /\((?:oracle-by-orsayn|backend-orsayn|apple-design-skills)\)/
    );
    report.authenticatedMcp = "PASS";
    report.runtimeTools = ["search_knowledge", "get_skill", "list_available_content"];

    const listLatencies: number[] = [];
    for (let index = 0; index < 20; index += 1) {
      const startedAt = performance.now();
      const response = await mcpRequest(firstAccessToken, {
        jsonrpc: "2.0",
        id: 100 + index,
        method: "tools/list",
        params: {},
      });
      listLatencies.push(performance.now() - startedAt);
      assert.equal(response.status, 200);
      assertToolsList(assertMcpSuccess(response.payload, 100 + index));
    }
    const p50 = percentile(listLatencies, 0.5);
    const p95 = percentile(listLatencies, 0.95);
    assert.ok(p50 < TOOLS_LIST_P50_LIMIT_MS, `MCP tools/list p50 exceeded ${TOOLS_LIST_P50_LIMIT_MS} ms: ${p50} ms.`);
    assert.ok(p95 < TOOLS_LIST_P95_LIMIT_MS, `MCP tools/list p95 exceeded ${TOOLS_LIST_P95_LIMIT_MS} ms: ${p95} ms.`);

    const concurrentStartedAt = performance.now();
    const concurrentResponses = await Promise.all(Array.from({ length: 8 }, (_, index) =>
      mcpRequest(firstAccessToken, {
        jsonrpc: "2.0",
        id: 200 + index,
        method: "tools/list",
        params: {},
      })
    ));
    const concurrentDuration = Math.round((performance.now() - concurrentStartedAt) * 10) / 10;
    assert.ok(concurrentResponses.every((response) => response.status === 200));
    concurrentResponses.forEach((response, index) => {
      assertToolsList(assertMcpSuccess(response.payload, 200 + index));
    });
    assert.ok(concurrentDuration < CONCURRENT_LIMIT_MS, `Eight concurrent MCP requests exceeded ${CONCURRENT_LIMIT_MS} ms: ${concurrentDuration} ms.`);
    report.performance = {
      toolsListSamples: listLatencies.length,
      toolsListP50Ms: p50,
      toolsListP95Ms: p95,
      concurrentRequests: concurrentResponses.length,
      concurrentDurationMs: concurrentDuration,
      knowledgeSearchDurationMs,
    };

    const refreshParams = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: firstRefreshToken,
      client_id: clientId,
      resource: RESOURCE,
    });
    const rotated = await tokenRequest(refreshParams);
    assert.equal(rotated.response.status, 200);
    assert.equal(typeof rotated.body.access_token, "string");
    assert.equal(typeof rotated.body.refresh_token, "string");
    const secondAccessToken = rotated.body.access_token as string;
    const secondRefreshToken = rotated.body.refresh_token as string;
    sensitiveValues.add(secondAccessToken);
    sensitiveValues.add(secondRefreshToken);
    report.refreshRotation = "PASS";

    const secondAccessBeforeReplay = await mcpRequest(secondAccessToken, {
      jsonrpc: "2.0",
      id: 6,
      method: "tools/list",
      params: {},
    });
    assert.equal(secondAccessBeforeReplay.status, 200);
    assertToolsList(assertMcpSuccess(secondAccessBeforeReplay.payload, 6));
    report.rotatedAccessValidBeforeReplay = "PASS";

    const replayedRefresh = await tokenRequest(refreshParams);
    assert.equal(replayedRefresh.response.status, 400);
    assert.equal(replayedRefresh.body.error, "invalid_grant");
    report.refreshReplayDetected = "PASS";

    const revokedFamilyCall = await mcpRequest(secondAccessToken, {
      jsonrpc: "2.0",
      id: 7,
      method: "tools/list",
      params: {},
    });
    assert.equal(revokedFamilyCall.status, 401);
    assert.equal(revokedFamilyCall.payload.error, "unauthorized");
    report.familyRevocation = "PASS";

    const revocationVerifier = opaqueToken();
    const revocationChallenge = sha256Base64Url(revocationVerifier);
    const revocationState = opaqueToken();
    sensitiveValues.add(revocationVerifier);
    sensitiveValues.add(revocationChallenge);
    sensitiveValues.add(revocationState);
    const revocationAuthorizeUrl = new URL(authorizeUrl);
    revocationAuthorizeUrl.searchParams.set("code_challenge", revocationChallenge);
    revocationAuthorizeUrl.searchParams.set("state", revocationState);
    await page.goto(revocationAuthorizeUrl.toString());
    if (new URL(page.url()).pathname === "/login") {
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Mot de passe").fill(password);
      await page.getByRole("button", { name: "Continuer" }).click();
    }
    await page.waitForURL(/\/mcp\/consent\?request=/, { timeout: 30_000 });
    await page.getByRole("button", { name: "Autoriser" }).click();
    await page.waitForURL(
      (url) => url.pathname === "/mcp-callback" && url.searchParams.has("code"),
      { timeout: 30_000 }
    );
    const revocationCallback = new URL(page.url());
    const revocationCode = revocationCallback.searchParams.get("code");
    assert.ok(revocationCode);
    sensitiveValues.add(revocationCode);
    assert.equal(revocationCallback.searchParams.get("state"), revocationState);
    const revocationIssued = await tokenRequest(new URLSearchParams({
      grant_type: "authorization_code",
      code: revocationCode,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: revocationVerifier,
      resource: RESOURCE,
    }));
    assert.equal(revocationIssued.response.status, 200);
    assert.equal(typeof revocationIssued.body.access_token, "string");
    assert.equal(typeof revocationIssued.body.refresh_token, "string");
    const revocationAccessToken = revocationIssued.body.access_token as string;
    const revocationRefreshToken = revocationIssued.body.refresh_token as string;
    sensitiveValues.add(revocationAccessToken);
    sensitiveValues.add(revocationRefreshToken);
    const { error: userRevocationError } = await admin.rpc("revoke_mcp_user_connections", {
      p_user_id: userId,
    });
    assert.equal(userRevocationError, null);
    const revokedUserCall = await mcpRequest(revocationAccessToken, {
      jsonrpc: "2.0",
      id: 8,
      method: "tools/list",
      params: {},
    });
    assert.equal(revokedUserCall.status, 401);
    assert.equal(revokedUserCall.payload.error, "unauthorized");
    const revokedUserRefresh = await tokenRequest(new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: revocationRefreshToken,
      client_id: clientId,
      resource: RESOURCE,
    }));
    assert.equal(revokedUserRefresh.response.status, 400);
    assert.equal(revokedUserRefresh.body.error, "invalid_grant");
    report.userWideRevocation = "PASS";
  } catch (error) {
    failure = error;
  } finally {
    try {
      await browser?.close();
    } catch {
      failure ??= new Error("Could not close the E2E browser.");
    }
    try {
      await cleanup(userId, clientId);
      report.cleanup = "PASS";
    } catch (cleanupError) {
      failure ??= cleanupError;
    }
    try {
      if (server) await stopServer(server.child);
    } catch {
      failure ??= new Error("Could not stop the E2E server.");
    }
  }

  if (failure) {
    console.error(JSON.stringify({
      verdict: "FAIL",
      completed: report,
      failure: sanitizeE2eDiagnostic(failure, [...sensitiveValues]),
      serverLogs: server?.logs([...sensitiveValues]) ?? "Server was not started.",
    }, null, 2));
    process.exitCode = 1;
    return;
  }
  console.log(JSON.stringify({ verdict: "PASS", ...report }, null, 2));
}

await main();
