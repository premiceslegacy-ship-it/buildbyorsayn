export const MCP_TIERS = ["free", "preview", "beginner", "full"] as const;

export type McpTier = (typeof MCP_TIERS)[number];

const TIER_RANK: Record<McpTier, number> = {
  free: 0,
  preview: 1,
  beginner: 2,
  full: 3,
};

function isKnownTier(value: unknown): value is McpTier {
  return typeof value === "string" && (MCP_TIERS as readonly string[]).includes(value);
}

/**
 * `admin` exists in profiles.tier (see app/protocole/page.tsx) but is not an
 * MCP tier. It is treated as `full` here without touching proxy.ts or
 * protocole/page.tsx, which already have their own (slightly inconsistent)
 * handling of it.
 */
export function normalizeProfileTier(rawTier: string | null | undefined): McpTier | null {
  if (rawTier === "admin") return "full";
  if (isKnownTier(rawTier)) return rawTier;
  return null;
}

/**
 * Fail-closed normalization used by server prechecks and UI gates. The MCP
 * authorization boundary remains the PostgreSQL entitlement lookup derived
 * from the active bearer token. Missing, null, or unknown tiers are denied.
 */
export function resolveMcpProfileTier(
  profile: { tier: string | null } | null,
  lookupError: unknown
): McpTier | null {
  if (lookupError || profile === null || profile.tier === null) return null;
  return normalizeProfileTier(profile.tier);
}

/**
 * Fail-closed: an unrecognized or missing tier always resolves to the
 * lowest rank, never to unrestricted access.
 */
export function tierRank(tier: unknown): number {
  return isKnownTier(tier) ? TIER_RANK[tier] : -1;
}

export function canAccess(userTier: unknown, requiredTier: McpTier): boolean {
  return tierRank(userTier) >= tierRank(requiredTier);
}
