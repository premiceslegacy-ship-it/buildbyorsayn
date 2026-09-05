import { createMcpSupabaseAdmin } from "@/lib/mcp/supabaseAdmin";
import { getMcpResourceUrl } from "@/lib/mcp/config";
import { hashToken } from "@/lib/mcp/oauth";
import { isExactMcpResource } from "@/lib/mcp/security";
import { resolveMcpProfileTier, type McpTier } from "@/lib/mcpAccess";

export type McpAuthContext = {
  userId: string;
  clientId: string;
  tokenHash: string;
  tier: McpTier;
  scope: "mcp";
};

/**
 * Resolves the Bearer token on an incoming MCP request into an
 * authorization context. Every failure path returns null so the caller can
 * uniformly respond 401 with a WWW-Authenticate challenge - this is what
 * triggers OAuth discovery in Claude and ChatGPT.
 */
export async function resolveMcpAuth(request: Request): Promise<McpAuthContext | null> {
  const authHeader = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(authHeader);
  if (!match) return null;

  const token = match[1].trim();
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
  const tokenHash = hashToken(token);

  const admin = createMcpSupabaseAdmin({ signal: request.signal });
  const { data: tokenRow, error: tokenError } = await admin
    .from("mcp_access_tokens")
    .select("client_id, user_id, scope, resource, expires_at, revoked_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (tokenError || !tokenRow) return null;
  if (tokenRow.revoked_at) return null;
  if (tokenRow.scope !== "mcp") return null;
  const expiresAtMs = Date.parse(tokenRow.expires_at);
  if (!Number.isFinite(expiresAtMs) || expiresAtMs <= Date.now()) return null;

  // The token must be valid specifically for this resource server (RFC
  // 8707): a token minted for a different MCP server must never work here.
  if (!isExactMcpResource(tokenRow.resource, getMcpResourceUrl())) return null;

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("tier")
    .eq("id", tokenRow.user_id)
    .maybeSingle();

  const tier = resolveMcpProfileTier(profile, profileError);
  if (!tier) return null;

  return {
    userId: tokenRow.user_id,
    clientId: tokenRow.client_id,
    tokenHash,
    tier,
    scope: "mcp",
  };
}

export function wwwAuthenticateHeader(): string {
  const resourceMetadataUrl = `${getMcpResourceUrl().replace(/\/api\/mcp$/, "")}/.well-known/oauth-protected-resource`;
  return `Bearer resource_metadata="${resourceMetadataUrl}"`;
}
