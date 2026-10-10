import { resolveMcpIssuer } from "@/lib/mcp/config";
import type { McpTier } from "@/lib/mcpAccess";

export const BUILD_SYNC_CLIENT_ID = "build-sync-cli";
export const BUILD_SYNC_SCOPE = "skills:read";

export function canUseBuildSync(tier: McpTier | null): tier is "beginner" | "full" {
  return tier === "beginner" || tier === "full";
}

export function getBuildSyncIssuer(): string {
  return resolveMcpIssuer(
    process.env.BUILD_SYNC_OAUTH_ISSUER ?? process.env.MCP_OAUTH_ISSUER,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_ENV,
    process.env.VERCEL_URL
  );
}

export function getBuildSyncResourceUrl(): string {
  return `${getBuildSyncIssuer()}/api/build-sync`;
}
