export type McpConnectionStatus = "connected" | "disconnected" | "unknown";

export type McpCredentialCount = {
  count: number | null;
  error: unknown;
};

export function resolveMcpConnectionStatus(
  refreshTokens: McpCredentialCount,
  accessTokens: McpCredentialCount,
): McpConnectionStatus {
  if ((refreshTokens.count ?? 0) > 0 || (accessTokens.count ?? 0) > 0) return "connected";
  if (refreshTokens.error || accessTokens.error) return "unknown";
  return "disconnected";
}
