import { CURSOR_MCP_CALLBACK } from "@/lib/mcp/oauth";

export type McpClientTrust = "verified" | "documented" | "local" | "unrecognized";

export type McpClientPresentation = {
  displayName: string;
  destinationLabel: string;
  logoSrc: string | null;
  trust: McpClientTrust;
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
const CURSOR_DESKTOP_CALLBACK = "http://localhost:8787/callback";
const CURSOR_WEB_CALLBACK = "https://www.cursor.com/agents/mcp/oauth/callback";
const LOCAL_MCP_CLIENTS = {
  "Hermes Agent": {
    displayName: "Hermes Agent",
    logoSrc: "/da/logos/hermes.svg",
  },
  "oh-my-pi": {
    displayName: "Oh My Pi",
    logoSrc: "/da/logos/omp.svg",
  },
} as const;

function isDocumentedLoopbackCallback(redirectUri: string): boolean {
  let url: URL;
  try {
    url = new URL(redirectUri);
  } catch {
    return false;
  }

  return (
    redirectUri === url.toString() &&
    url.protocol === "http:" &&
    (url.hostname === "127.0.0.1" || url.hostname === "localhost") &&
    url.port !== "" &&
    url.pathname === "/callback" &&
    url.search === "" &&
    url.hash === "" &&
    url.username === "" &&
    url.password === ""
  );
}

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
      trust: "unrecognized",
      verified: false,
    };
  }

  if (redirectUri === CLAUDE_CALLBACK) {
    return {
      displayName: "Claude",
      destinationLabel: "claude.ai",
      logoSrc: "/da/logos/claude.svg",
      trust: "verified",
      verified: true,
    };
  }

  if (redirectUri === CHATGPT_STABLE_CALLBACK || CHATGPT_PER_CONNECTION_CALLBACK.test(redirectUri)) {
    return {
      displayName: "ChatGPT",
      destinationLabel: "chatgpt.com",
      logoSrc: "/da/logos/openai.svg",
      trust: "verified",
      verified: true,
    };
  }

  const localClient = LOCAL_MCP_CLIENTS[clientName as keyof typeof LOCAL_MCP_CLIENTS];
  if (localClient && isDocumentedLoopbackCallback(redirectUri)) {
    return {
      ...localClient,
      destinationLabel: "ton ordinateur",
      trust: "local",
      verified: false,
    };
  }

  if (
    clientName === "Cursor" &&
    (redirectUri === CURSOR_MCP_CALLBACK || redirectUri === CURSOR_DESKTOP_CALLBACK)
  ) {
    return {
      displayName: "Cursor",
      destinationLabel: "ton ordinateur",
      logoSrc: "/da/logos/cursor.svg",
      trust: "local",
      verified: false,
    };
  }

  if (clientName === "Cursor" && redirectUri === CURSOR_WEB_CALLBACK) {
    return {
      displayName: "Cursor",
      destinationLabel: "cursor.com",
      logoSrc: "/da/logos/cursor.svg",
      trust: "documented",
      verified: false,
    };
  }

  return {
    displayName: clientName,
    destinationLabel,
    logoSrc: null,
    trust: "unrecognized",
    verified: false,
  };
}
