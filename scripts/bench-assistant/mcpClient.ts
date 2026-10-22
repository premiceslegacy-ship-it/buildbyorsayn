import assert from "node:assert/strict";
import { createHash, randomBytes } from "node:crypto";
import { chromium, type Browser } from "@playwright/test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { hashRateLimitSubject } from "../../lib/mcp/security";
import { canAccess } from "../../lib/mcpAccess";
import { chunkText } from "../../lib/knowledge/chunk";
import {
  collectAccompagnementDocuments,
  collectBlocsDocuments,
  collectProtocoleDocuments,
  collectSkillsCatalogDocuments,
} from "../../lib/knowledge/sources";
import {
  ARCHIVED_SKILL_MESSAGE,
  formatUntrustedKnowledgeResults,
  type KnowledgeMatch,
} from "../../lib/mcp/server";
import { COFFRE_LABEL, COFFRE_PRICE, FONDATIONS_LABEL, FONDATIONS_PRICE, UPGRADE_PRICE, formatEuro } from "../../lib/pricing";
import { getSkillBySlug, SKILLS_CATALOG } from "../../lib/skillsCatalog";
import type { BenchTier, BenchToolCall } from "./cases";

type McpPayload = Record<string, unknown>;

export type ToolObservation = {
  name: BenchToolCall["name"];
  arguments: Record<string, unknown>;
  durationMs: number;
  text: string;
  isError: boolean;
  matches: Array<{
    title: string;
    content: string;
    source: string;
    tier_required: string;
    similarity: number;
  }>;
};

export type ConnectedTier = {
  tier: BenchTier;
  instructions: string;
  toolNames: string[];
  callTool(call: BenchToolCall): Promise<ToolObservation>;
  close(): Promise<void>;
};

function offlineTokens(value: string): string[] {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().match(/[a-z0-9]+/g)?.filter((token) => token.length >= 3) ?? [];
}

let offlineCorpusPromise: Promise<KnowledgeMatch[]> | null = null;

function offlineCorpus(): Promise<KnowledgeMatch[]> {
  offlineCorpusPromise ??= Promise.all([
    collectBlocsDocuments(),
    collectProtocoleDocuments(),
    collectAccompagnementDocuments(),
    collectSkillsCatalogDocuments(),
  ]).then((groups) => groups.flatMap((documents) => documents.flatMap((document) =>
    chunkText(document.title, document.content).map((chunk) => ({
      title: chunk.title,
      content: chunk.content,
      source: document.source as KnowledgeMatch["source"],
      tier_required: document.tier,
      similarity: 0,
    })),
  )));
  return offlineCorpusPromise;
}

function offlineSimilarity(query: string, match: KnowledgeMatch): number {
  const queryTokens = [...new Set(offlineTokens(query))];
  const title = new Set(offlineTokens(match.title));
  const content = new Set(offlineTokens(match.content));
  if (queryTokens.length === 0) return 0;
  const points = queryTokens.reduce((score, token) => score + (title.has(token) ? 2 : content.has(token) ? 1 : 0), 0);
  return points / (queryTokens.length * 2);
}

export async function createOfflineTier({
  tier,
  instructions,
  baseline,
}: {
  tier: BenchTier;
  instructions: string;
  baseline: boolean;
}): Promise<ConnectedTier> {
  const corpus = await offlineCorpus();
  return {
    tier,
    instructions,
    toolNames: ["get_skill", "list_available_content", "search_knowledge"],
    async callTool(call) {
      const startedAt = performance.now();
      let text = "";
      let isError = false;
      let matches: ToolObservation["matches"] = [];
      if (call.name === "search_knowledge") {
        const limit = typeof call.arguments.limit === "number" ? call.arguments.limit : 8;
        const candidates = corpus
          .filter((match) => canAccess(tier, match.tier_required as "free" | "preview" | "beginner" | "full"))
          .filter((match) => !call.arguments.source || match.source === call.arguments.source)
          .map((match) => ({ ...match, similarity: offlineSimilarity(call.arguments.query, match) }))
          .filter((match) => match.similarity > 0)
          .sort((left, right) => right.similarity - left.similarity)
          .slice(0, 20);
        const selected: KnowledgeMatch[] = candidates.slice(0, limit);
        matches = selected;
        text = selected.length > 0
          ? formatUntrustedKnowledgeResults(selected).text
          : "Aucun résultat pour cette recherche à ton palier d'accès actuel.";
      } else if (call.name === "list_available_content") {
        const skills = SKILLS_CATALOG.filter((skill) => canAccess(tier, skill.access));
        const lines = [
          `Palier actuel : ${tier}`,
          "",
          ...(!baseline ? [
            "Offres BUILD :",
            `- ${FONDATIONS_LABEL} : ${formatEuro(FONDATIONS_PRICE)}`,
            `- ${COFFRE_LABEL} : ${formatEuro(COFFRE_PRICE)}`,
            `- Complément : ${formatEuro(UPGRADE_PRICE)}`,
            "",
          ] : []),
          "Skills accessibles :",
          ...skills.map((skill, index) => `${index + 1}) ${skill.title} (${skill.slug}) : ${skill.description}`),
          "",
          `${SKILLS_CATALOG.length - skills.length} skill(s) supplémentaire(s) existent à un palier supérieur.`,
        ];
        text = lines.join("\n");
      } else {
        const skill = getSkillBySlug(call.arguments.slug);
        if (!skill) {
          text = "Skill inconnu.";
          isError = true;
        } else if (!canAccess(tier, skill.access)) {
          text = `Ce skill (palier ${skill.access}) est au-dessus du palier actuel (${tier}). Son contenu reste verrouillé.`;
        } else if (!skill.fileName.endsWith(".md")) {
          text = ARCHIVED_SKILL_MESSAGE;
        } else {
          text = await readFile("docs/oracle-site-web.md", "utf8").catch(() => "Ce skill est momentanément indisponible.");
        }
      }
      return {
        name: call.name,
        arguments: call.arguments,
        durationMs: Math.round((performance.now() - startedAt) * 10) / 10,
        text,
        isError,
        matches,
      };
    },
    async close() {},
  };
}

type ConnectOptions = {
  baseUrl: string;
  tier: BenchTier;
  email: string;
  password: string;
  address: string;
};

const ENV_BY_TIER = {
  free: ["E2E_FREE_TEST_EMAIL", "E2E_FREE_TEST_PASSWORD"],
  beginner: ["E2E_BEGINNER_TEST_EMAIL", "E2E_BEGINNER_TEST_PASSWORD"],
  full: ["E2E_TEST_EMAIL", "E2E_TEST_PASSWORD"],
} as const;

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

export function credentialsForTier(tier: BenchTier): { email: string; password: string } {
  const [emailKey, passwordKey] = ENV_BY_TIER[tier];
  return { email: requiredEnv(emailKey), password: requiredEnv(passwordKey) };
}

function opaqueToken(): string {
  return randomBytes(32).toString("base64url");
}

function sha256Base64Url(value: string): string {
  return createHash("sha256").update(value, "ascii").digest("base64url");
}

function sha256Hex(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function parseMcpPayload(text: string): McpPayload {
  const dataLine = text.split(/\r?\n/).find((line) => line.startsWith("data:"));
  return JSON.parse(dataLine ? dataLine.slice(5).trim() : text) as McpPayload;
}

function resultOf(payload: McpPayload, expectedId: number): Record<string, unknown> {
  assert.equal(payload.id, expectedId);
  assert.equal(Object.hasOwn(payload, "error"), false);
  assert.equal(typeof payload.result, "object");
  assert.notEqual(payload.result, null);
  return payload.result as Record<string, unknown>;
}

async function json(response: Response): Promise<Record<string, unknown>> {
  const body = await response.text();
  if (!body) throw new Error("Expected a JSON response, received an empty body.");
  return JSON.parse(body) as Record<string, unknown>;
}

function createAdmin(): SupabaseClient {
  return createClient(
    requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } },
  );
}

async function cleanupClient({
  admin,
  clientId,
  userId,
  address,
}: {
  admin: SupabaseClient;
  clientId: string;
  userId: string | null;
  address: string;
}): Promise<void> {
  const subjects = [
    hashRateLimitSubject("mcp-dcr", address, requiredEnv("MCP_DCR_RATE_LIMIT_PEPPER")),
    hashRateLimitSubject("mcp-token", address, requiredEnv("MCP_TOKEN_RATE_LIMIT_PEPPER")),
    hashRateLimitSubject("mcp-request", address, requiredEnv("MCP_REQUEST_RATE_LIMIT_PEPPER")),
  ];
  if (userId) {
    const principal = JSON.stringify([userId, clientId]);
    subjects.push(
      hashRateLimitSubject("mcp-search", `minute:${principal}`, requiredEnv("MCP_PRINCIPAL_RATE_LIMIT_PEPPER")),
      hashRateLimitSubject("mcp-search", `hour:${principal}`, requiredEnv("MCP_PRINCIPAL_RATE_LIMIT_PEPPER")),
    );
  }

  const { error: clientError } = await admin.from("mcp_oauth_clients").delete().eq("client_id", clientId);
  if (clientError) throw new Error("Could not remove the temporary benchmark OAuth client.");
  const { error: rateError } = await admin.from("mcp_rate_limits").delete().in("subject", subjects);
  if (rateError) throw new Error("Could not remove temporary benchmark rate-limit rows.");

  const { count: clientsRemaining, error: clientReadError } = await admin
    .from("mcp_oauth_clients")
    .select("client_id", { count: "exact", head: true })
    .eq("client_id", clientId);
  if (clientReadError || clientsRemaining !== 0) {
    throw new Error("Temporary benchmark OAuth client cleanup was not verified.");
  }
  for (const table of [
    "mcp_authorization_requests",
    "mcp_authorization_codes",
    "mcp_access_tokens",
    "mcp_refresh_tokens",
  ]) {
    const { count, error } = await admin
      .from(table)
      .select("client_id", { count: "exact", head: true })
      .eq("client_id", clientId);
    if (error || count !== 0) throw new Error("Temporary benchmark OAuth child cleanup was not verified.");
  }
}

async function mcpRequest({
  resource,
  token,
  address,
  body,
}: {
  resource: string;
  token: string;
  address: string;
  body: Record<string, unknown>;
}): Promise<McpPayload> {
  const response = await fetch(resource, {
    method: "POST",
    signal: AbortSignal.timeout(30_000),
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json, text/event-stream",
      "Content-Type": "application/json",
      Origin: "https://claude.ai",
      "Mcp-Protocol-Version": "2025-06-18",
      "x-vercel-forwarded-for": address,
    },
    body: JSON.stringify(body),
  });
  const responseText = await response.text();
  if (!response.ok) throw new Error(`MCP request failed with HTTP ${response.status}.`);
  return parseMcpPayload(responseText);
}

async function authorize({
  baseUrl,
  resource,
  clientId,
  email,
  password,
  address,
}: ConnectOptions & { resource: string; clientId: string }): Promise<string> {
  const redirectUri = `${baseUrl}/mcp-callback`;
  const verifier = opaqueToken();
  const challenge = sha256Base64Url(verifier);
  const state = opaqueToken();
  const authorizeUrl = new URL(`${baseUrl}/api/mcp/oauth/authorize`);
  for (const [key, value] of Object.entries({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    code_challenge: challenge,
    code_challenge_method: "S256",
    state,
    resource,
    scope: "mcp",
  })) authorizeUrl.searchParams.set(key, value);

  let browser: Browser | null = null;
  try {
    browser = await chromium.launch({ headless: true, channel: "chrome" });
    const context = await browser.newContext({ extraHTTPHeaders: { "x-vercel-forwarded-for": address } });
    const page = await context.newPage();
    await page.goto(authorizeUrl.toString());
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Mot de passe").fill(password);
    await page.getByRole("button", { name: "Continuer" }).click();
    await page.waitForURL(/\/mcp\/consent\?request=/, { timeout: 30_000 });
    await page.getByRole("button", { name: /Autoriser/ }).click();
    await page.waitForURL(
      (url) => url.pathname === "/mcp-callback" && url.searchParams.has("code"),
      { timeout: 30_000 },
    );
    const callback = new URL(page.url());
    assert.equal(callback.searchParams.get("state"), state);
    const code = callback.searchParams.get("code");
    assert.ok(code);

    const response = await fetch(`${baseUrl}/api/mcp/oauth/token`, {
      method: "POST",
      signal: AbortSignal.timeout(15_000),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-vercel-forwarded-for": address,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: verifier,
        resource,
      }),
    });
    const issued = await json(response);
    assert.equal(response.status, 200);
    assert.equal(typeof issued.access_token, "string");
    return issued.access_token as string;
  } finally {
    await browser?.close();
  }
}

export async function connectTier(options: ConnectOptions): Promise<ConnectedTier> {
  const { baseUrl, tier, address } = options;
  const resource = `${baseUrl}/api/mcp`;
  const admin = createAdmin();
  const registrationResponse = await fetch(`${baseUrl}/api/mcp/oauth/register`, {
    method: "POST",
    signal: AbortSignal.timeout(15_000),
    headers: {
      "Content-Type": "application/json",
      "x-vercel-forwarded-for": address,
    },
    body: JSON.stringify({
      client_name: `BUILD assistant benchmark ${tier}`,
      redirect_uris: [`${baseUrl}/mcp-callback`],
      token_endpoint_auth_method: "none",
      scope: "mcp",
    }),
  });
  const registration = await json(registrationResponse);
  assert.equal(registrationResponse.status, 201);
  assert.equal(typeof registration.client_id, "string");
  const clientId = registration.client_id as string;

  let token = "";
  let userId: string | null = null;
  let closed = false;
  let sequence = 0;
  try {
    token = await authorize({ ...options, resource, clientId });
    const tokenHash = sha256Hex(token);
    const { data: tokenRow, error: tokenReadError } = await admin
      .from("mcp_access_tokens")
      .select("user_id")
      .eq("token_hash", tokenHash)
      .maybeSingle();
    if (tokenReadError) throw new Error("Could not resolve the benchmark OAuth owner for cleanup.");
    userId = typeof tokenRow?.user_id === "string" ? tokenRow.user_id : null;

    const initialize = resultOf(await mcpRequest({
      resource,
      token,
      address,
      body: {
        jsonrpc: "2.0",
        id: ++sequence,
        method: "initialize",
        params: {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "BUILD assistant benchmark", version: "1.0.0" },
        },
      },
    }), sequence);
    const instructions = initialize.instructions;
    if (typeof instructions !== "string" || instructions.length === 0) {
      throw new Error("The MCP initialize response did not contain assistant instructions.");
    }

    const listed = resultOf(await mcpRequest({
      resource,
      token,
      address,
      body: { jsonrpc: "2.0", id: ++sequence, method: "tools/list", params: {} },
    }), sequence);
    const tools = listed.tools;
    if (!Array.isArray(tools)) throw new Error("The MCP tools list is invalid.");
    const toolNames = tools.map((tool) => String((tool as Record<string, unknown>).name)).sort();

    return {
      tier,
      instructions,
      toolNames,
      async callTool(call) {
        const startedAt = performance.now();
        const result = resultOf(await mcpRequest({
          resource,
          token,
          address,
          body: {
            jsonrpc: "2.0",
            id: ++sequence,
            method: "tools/call",
            params: { name: call.name, arguments: call.arguments },
          },
        }), sequence);
        const durationMs = Math.round((performance.now() - startedAt) * 10) / 10;
        const content = Array.isArray(result.content) ? result.content : [];
        const text = content
          .filter((item) => typeof item === "object" && item !== null && (item as Record<string, unknown>).type === "text")
          .map((item) => String((item as Record<string, unknown>).text ?? ""))
          .join("\n");
        const structured = result.structuredContent;
        const rawMatches =
          typeof structured === "object" && structured !== null && Array.isArray((structured as Record<string, unknown>).matches)
            ? (structured as { matches: unknown[] }).matches
            : [];
        const matches = rawMatches.flatMap((raw) => {
          if (typeof raw !== "object" || raw === null) return [];
          const row = raw as Record<string, unknown>;
          if (
            typeof row.title !== "string" || typeof row.content !== "string" ||
            typeof row.source !== "string" || typeof row.tier_required !== "string" ||
            typeof row.similarity !== "number"
          ) return [];
          return [{
            title: row.title,
            content: row.content,
            source: row.source,
            tier_required: row.tier_required,
            similarity: row.similarity,
          }];
        });
        return {
          name: call.name,
          arguments: call.arguments,
          durationMs,
          text,
          isError: result.isError === true,
          matches,
        };
      },
      async close() {
        if (closed) return;
        closed = true;
        token = "";
        await cleanupClient({ admin, clientId, userId, address });
      },
    };
  } catch (error) {
    token = "";
    try {
      await cleanupClient({ admin, clientId, userId, address });
    } catch (cleanupError) {
      throw new AggregateError(
        [error, cleanupError],
        "Benchmark connection failed and its temporary OAuth data could not be verified as cleaned.",
      );
    }
    throw error;
  }
}
