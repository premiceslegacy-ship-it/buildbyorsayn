import { hashToken } from "@/lib/mcp/oauth";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { getBuildSyncResourceUrl, BUILD_SYNC_SCOPE } from "@/lib/buildSync/config";
import { resolveMcpProfileTier, type McpTier } from "@/lib/mcpAccess";

export type BuildSyncAuthContext = {
  userId: string;
  tier: McpTier;
  tokenHash: string;
};

export async function resolveBuildSyncAuth(
  request: Request
): Promise<BuildSyncAuthContext | null> {
  const match = /^Bearer\s+(.+)$/i.exec(request.headers.get("authorization") ?? "");
  if (!match) return null;
  const token = match[1].trim();
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return null;

  const tokenHash = hashToken(token);
  const admin = createAdminSupabase({ signal: request.signal });
  const { data: stored, error } = await admin
    .from("build_sync_access_tokens")
    .select("user_id, scope, resource, expires_at, revoked_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (error || !stored || stored.revoked_at) return null;
  if (stored.scope !== BUILD_SYNC_SCOPE || stored.resource !== getBuildSyncResourceUrl()) return null;
  if (!Number.isFinite(Date.parse(stored.expires_at)) || Date.parse(stored.expires_at) <= Date.now()) return null;

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("tier")
    .eq("id", stored.user_id)
    .maybeSingle();
  const tier = resolveMcpProfileTier(profile, profileError);
  if (!tier) return null;

  return { userId: stored.user_id, tier, tokenHash };
}

export function buildSyncChallengeHeader(): string {
  return `Bearer scope="${BUILD_SYNC_SCOPE}"`;
}
