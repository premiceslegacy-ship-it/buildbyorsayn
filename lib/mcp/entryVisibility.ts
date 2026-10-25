/**
 * Visibilité des points d'entrée du connecteur (menu, compte, cartes, e-mails).
 *
 * Tant que le connecteur n'est pas ouvert, aucun lien ne doit mener à
 * `/dashboard/mcp`. Les variables NEXT_PUBLIC_* sont remplacées au build : cette
 * constante est donc utilisable côté client comme côté serveur. Elle ne remplace
 * pas le gate serveur (`MCP_CONNECTOR_LAUNCHED`), qui reste le seul qui ouvre les routes.
 */
export function isMcpEntryVisible(env: Record<string, string | undefined>): boolean {
  return env.NEXT_PUBLIC_MCP_CONNECTOR_BETA_VISIBLE === "true"
    || env.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED === "true";
}

export const MCP_ENTRY_VISIBLE =
  process.env.NEXT_PUBLIC_MCP_CONNECTOR_BETA_VISIBLE === "true"
  || process.env.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED === "true";
