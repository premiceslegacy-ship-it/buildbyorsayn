export type McpClientPresentation = {
  displayName: string;
  destinationLabel: string;
  logoSrc: string | null;
  verified: boolean;
};

const CLAUDE_CALLBACK = "https://claude.ai/api/mcp/auth_callback";

/**
 * Adresses de retour documentées par OpenAI pour les connecteurs ChatGPT
 * (guide d'authentification des plugins MCP) :
 * - l'adresse stable, utilisée quand le serveur d'autorisation renvoie le paramètre `iss` ;
 * - l'adresse propre à chaque connexion, `/connector/oauth/<identifiant>`, sinon.
 * Tout autre chemin, même sur chatgpt.com, reste non vérifié.
 */
const CHATGPT_STABLE_CALLBACK = "https://chatgpt.com/connector_platform_oauth_redirect";
const CHATGPT_PER_CONNECTION_CALLBACK = /^https:\/\/chatgpt\.com\/connector\/oauth\/[A-Za-z0-9_-]{1,128}$/;

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
      logoSrc: "/da/logos/claude.svg",
      verified: true,
    };
  }

  if (redirectUri === CHATGPT_STABLE_CALLBACK || CHATGPT_PER_CONNECTION_CALLBACK.test(redirectUri)) {
    return {
      displayName: "ChatGPT",
      destinationLabel: "chatgpt.com",
      logoSrc: "/da/logos/openai.svg",
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
