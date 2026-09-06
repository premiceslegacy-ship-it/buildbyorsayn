import { normalizeProfileTier } from "@/lib/mcpAccess";
import type { McpConnectionStatus } from "@/lib/mcp/connectionStatus";

export type McpDashboardEntryState =
  | "hidden"
  | "locked"
  | "checking"
  | McpConnectionStatus;

export function resolveMcpDashboardEntryState({
  visible,
  profileReady,
  tier,
  status,
}: {
  visible: boolean;
  profileReady: boolean;
  tier: string | null;
  status: McpConnectionStatus | null;
}): McpDashboardEntryState {
  if (!visible || !profileReady) return "hidden";

  const normalizedTier = normalizeProfileTier(tier);
  if (normalizedTier === null) return "unknown";
  const eligible = normalizedTier === "beginner" || normalizedTier === "full";
  if (!eligible) return "locked";
  return status ?? "checking";
}
