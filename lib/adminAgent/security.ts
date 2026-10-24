import "server-only";

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { trustedClientAddress } from "@/lib/mcp/security";
import { AGENT_PERMISSION_VALUES, type AgentPermission, type AgentTokenContext } from "./types";

const AGENT_TOKEN_PREFIX = "btv_agt_";
export const DEFAULT_AGENT_TOKEN_DAYS = 90;
export const AGENT_MAX_BODY_BYTES = 2_200_000;
const AGENT_TOKEN_PATTERN = /^btv_agt_[A-Za-z0-9_-]{43}$/;

const storedTokenSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  token_hash: z.string().regex(/^[0-9a-f]{64}$/),
  last_four: z.string().length(4),
  permissions: z.array(z.enum(AGENT_PERMISSION_VALUES)),
  expires_at: z.string(),
  revoked_at: z.string().nullable(),
  created_by: z.string().uuid(),
}).strict();

export class AgentAuthError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

export function generateAgentToken(): string {
  return `${AGENT_TOKEN_PREFIX}${randomBytes(32).toString("base64url")}`;
}

export function hashAgentToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function constantTimeHashMatches(expectedHex: string, actualHex: string): boolean {
  if (!/^[0-9a-f]{64}$/.test(expectedHex) || !/^[0-9a-f]{64}$/.test(actualHex)) return false;
  return timingSafeEqual(Buffer.from(expectedHex, "hex"), Buffer.from(actualHex, "hex"));
}

function rateSubject(kind: "token" | "address", value: string, pepper: string): string {
  return `admin-agent-${kind}:${createHmac("sha256", pepper).update(value, "utf8").digest("hex")}`;
}

function readBearerToken(headers: Headers): string | null {
  const value = headers.get("authorization") ?? "";
  const match = /^Bearer ([^\s]+)$/.exec(value);
  return match && AGENT_TOKEN_PATTERN.test(match[1]) ? match[1] : null;
}

export async function authenticateAgentRequest(
  request: Request,
  options: { maxPerMinute?: number } = {},
): Promise<AgentTokenContext> {
  const token = readBearerToken(request.headers);
  if (!token) throw new AgentAuthError(401, "Jeton requis.");
  const address = trustedClientAddress(request.headers);
  const pepper = process.env.AGENT_RATE_LIMIT_PEPPER?.trim() ?? "";
  if (!address || pepper.length < 16) throw new AgentAuthError(503, "Service temporairement indisponible.");

  const hash = hashAgentToken(token);
  const admin = createAdminSupabase({ signal: request.signal });
  const { data, error } = await admin
    .from("admin_agent_tokens")
    .select("id,name,token_hash,last_four,permissions,expires_at,revoked_at,created_by")
    .eq("token_hash", hash)
    .maybeSingle();
  const parsed = storedTokenSchema.safeParse(data);
  const storedHash = parsed.success ? parsed.data.token_hash : "0".repeat(64);
  const hashMatches = constantTimeHashMatches(storedHash, hash);
  if (error || !parsed.success || !hashMatches) {
    throw new AgentAuthError(401, "Jeton invalide.");
  }
  const expiresAt = new Date(parsed.data.expires_at).getTime();
  if (parsed.data.revoked_at || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    throw new AgentAuthError(401, "Jeton invalide.");
  }

  const { data: stillAdmin, error: adminError } = await admin.rpc("is_platform_admin", {
    p_user_id: parsed.data.created_by,
  });
  if (adminError || stillAdmin !== true) throw new AgentAuthError(401, "Jeton invalide.");

  const limit = options.maxPerMinute ?? 60;
  for (const [kind, value] of [["token", parsed.data.id], ["address", address]] as const) {
    const { data: allowed, error: limitError } = await admin.rpc("check_admin_agent_rate_limit", {
      p_subject: rateSubject(kind, value, pepper),
      p_max_per_window: limit,
      p_window_seconds: 60,
    });
    if (limitError || typeof allowed !== "boolean") {
      throw new AgentAuthError(503, "Service temporairement indisponible.");
    }
    if (!allowed) throw new AgentAuthError(429, "Débit limité.");
  }

  await admin
    .from("admin_agent_tokens")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", parsed.data.id)
    .is("revoked_at", null);

  return {
    id: parsed.data.id,
    name: parsed.data.name,
    lastFour: parsed.data.last_four,
    permissions: parsed.data.permissions as AgentPermission[],
    createdBy: parsed.data.created_by,
  };
}

export function requireAgentPermission(context: AgentTokenContext, permission: AgentPermission) {
  if (!context.permissions.includes(permission)) {
    throw new AgentAuthError(403, "Droit manquant.");
  }
}
