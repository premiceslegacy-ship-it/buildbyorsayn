export type McpClientPresentation = {
  displayName: string;
  destinationLabel: string;
  logoSrc: string | null;
  verified: boolean;
};

const CLAUDE_CALLBACK = "https://claude.ai/api/mcp/auth_callback";

export function resolveMcpClientPresentation(
  clientName: string,
  redirectUri: string,
): McpClientPresentation {
  let destinationLabel = "Adresse non reconnue";
  try {
    destinationLabel = new URL(redirectUri).hostname;
  } catch {
    return {
      displayName: clientName,
      destinationLabel,
      logoSrc: null,
      verified: false,
    };
  }

  if (redirectUri === CLAUDE_CALLBACK) {
    return {
      displayName: "Claude",
      destinationLabel: "claude.ai",
      logoSrc: "/brand-logos/claude.svg",
      verified: true,
    };
  }

  return {
    displayName: clientName,
    destinationLabel,
    logoSrc: null,
    verified: false,
  };
}
