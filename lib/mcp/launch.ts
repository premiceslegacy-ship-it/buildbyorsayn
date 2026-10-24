const TRUE = "true";

function parseAllowlist(value: string | undefined): Set<string> {
  return new Set(
    (value ?? "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean),
  );
}

/**
 * The connector gate is deliberately server-only in its inputs. A public
 * beta flag may alter presentation, but it never opens an OAuth or MCP route.
 */
export function isMcpConnectorLaunched(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.MCP_CONNECTOR_LAUNCHED === TRUE;
}

export function isMcpConnectorAccountAllowed(
  userId: string | null | undefined,
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  if (isMcpConnectorLaunched(env)) return true;
  if (!userId) return false;
  return parseAllowlist(env.MCP_CONNECTOR_ALLOWED_ACCOUNT_IDS).has(userId);
}

export function hasMcpConnectorAllowlist(env: NodeJS.ProcessEnv = process.env): boolean {
  return parseAllowlist(env.MCP_CONNECTOR_ALLOWED_ACCOUNT_IDS).size > 0;
}


export function isMcpBetaAssetVisible(env: NodeJS.ProcessEnv = process.env): boolean {
  return isMcpConnectorLaunched(env)
    && env.NEXT_PUBLIC_MCP_CONNECTOR_BETA_VISIBLE === TRUE;
}
