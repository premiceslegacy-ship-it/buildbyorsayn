function isLoopback(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

export function resolveMcpIssuer(
  oauthIssuer: string | undefined,
  publicAppUrl: string | undefined,
  vercelEnvironment?: string,
  vercelUrl?: string
): string {
  let configured = oauthIssuer?.trim();
  if (!configured && vercelEnvironment === "preview") {
    const previewHost = vercelUrl?.trim();
    if (!previewHost || !/^[A-Za-z0-9.-]+$/.test(previewHost)) {
      throw new Error("The Vercel preview MCP OAuth issuer is invalid.");
    }
    configured = `https://${previewHost}`;
  }
  configured ||= publicAppUrl?.trim();
  if (!configured) throw new Error("MCP_OAUTH_ISSUER or NEXT_PUBLIC_APP_URL is required.");

  let url: URL;
  try {
    url = new URL(configured);
  } catch {
    throw new Error("The MCP OAuth issuer is invalid.");
  }

  if (url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("The MCP OAuth issuer must be an origin without credentials, path, query or fragment.");
  }
  if (url.protocol !== "https:" && !(url.protocol === "http:" && isLoopback(url.hostname))) {
    throw new Error("The MCP OAuth issuer must use HTTPS or loopback HTTP.");
  }
  return url.origin;
}

export function getMcpIssuer(): string {
  return resolveMcpIssuer(
    process.env.MCP_OAUTH_ISSUER,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_ENV,
    process.env.VERCEL_URL
  );
}

export function getMcpResourceUrl(): string {
  return `${getMcpIssuer()}/api/mcp`;
}

export function parseMcpAllowedOrigins(configured: string | undefined): string[] {
  const values = configured
    ? configured.split(",").map((origin) => origin.trim()).filter(Boolean)
    : ["https://claude.ai", "https://chatgpt.com"];

  const unique = new Set<string>();
  for (const value of values) {
    if (value === "*") throw new Error("Wildcard MCP CORS origins are forbidden.");
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      throw new Error("MCP_ALLOWED_ORIGINS contains an invalid origin.");
    }
    if (url.origin !== value || (url.protocol !== "https:" && !(url.protocol === "http:" && isLoopback(url.hostname)))) {
      throw new Error("MCP_ALLOWED_ORIGINS must contain exact HTTPS or loopback origins.");
    }
    unique.add(value);
  }
  if (unique.size === 0) throw new Error("MCP_ALLOWED_ORIGINS cannot be empty.");
  return [...unique];
}

export function getMcpAllowedOrigins(): string[] {
  return parseMcpAllowedOrigins(process.env.MCP_ALLOWED_ORIGINS);
}
