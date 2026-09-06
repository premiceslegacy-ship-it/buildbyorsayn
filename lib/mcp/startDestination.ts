import { normalizeProfileTier } from "@/lib/mcpAccess";

export type McpStartDecision =
  | { kind: "redirect"; destination: string }
  | { kind: "unavailable" };

export function resolveMcpStartDecision({
  connectorVisible,
  authenticated,
  tier,
  lookupFailed,
}: {
  connectorVisible: boolean;
  authenticated: boolean;
  tier: string | null;
  lookupFailed: boolean;
}): McpStartDecision {
  if (!connectorVisible) return { kind: "redirect", destination: "/" };
  if (!authenticated) {
    return { kind: "redirect", destination: "/login?next=%2Fmcp%2Fstart" };
  }
  if (lookupFailed || tier === null) return { kind: "unavailable" };

  const normalizedTier = normalizeProfileTier(tier);
  if (normalizedTier === "beginner" || normalizedTier === "full") {
    return { kind: "redirect", destination: "/dashboard/mcp" };
  }
  if (tier === null || normalizedTier === "free" || normalizedTier === "preview") {
    return { kind: "redirect", destination: "/checkout?from=mcp" };
  }
  return { kind: "unavailable" };
}
