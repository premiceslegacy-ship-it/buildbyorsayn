import { createHmac } from "node:crypto";

export type RateLimitDecision = "allowed" | "denied" | "unavailable";

export function hashRateLimitSubject(prefix: string, value: string, pepper: string): string {
  if (!prefix || !value || pepper.length < 16) throw new Error("Invalid rate-limit subject input");
  return `${prefix}:${createHmac("sha256", pepper).update(value, "utf8").digest("hex")}`;
}

export function trustedClientAddress(headers: Headers): string | null {
  const value = headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  if (!value || value.length > 128) return null;
  return value;
}

export function buildNetworkRateLimitInput(
  prefix: string,
  headers: Headers,
  pepper: string,
  maxPerWindow: number,
  windowSeconds: number
): { p_subject: string; p_max_per_window: number; p_window_seconds: number } | null {
  const address = trustedClientAddress(headers);
  if (!address || pepper.length < 16) return null;
  return {
    p_subject: hashRateLimitSubject(prefix, address, pepper),
    p_max_per_window: maxPerWindow,
    p_window_seconds: windowSeconds,
  };
}

export function resolveRateLimitDecision(data: unknown, error: unknown): RateLimitDecision {
  if (error || typeof data !== "boolean") return "unavailable";
  return data ? "allowed" : "denied";
}

export function isRateLimitAllowed(data: unknown, error: unknown): boolean {
  return resolveRateLimitDecision(data, error) === "allowed";
}

export function isExactMcpResource(
  tokenResource: string | null | undefined,
  expectedResource: string
): boolean {
  return typeof tokenResource === "string" && tokenResource === expectedResource;
}

export function corsHeadersForRequest(
  request: Request,
  allowedOrigins: readonly string[]
): Record<string, string> {
  if (allowedOrigins.includes("*")) {
    throw new Error("Wildcard MCP CORS origins are forbidden.");
  }

  const origin = request.headers.get("origin") ?? "";
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Authorization, Content-Type, Mcp-Session-Id, Mcp-Protocol-Version",
    "Access-Control-Expose-Headers": "WWW-Authenticate, Mcp-Session-Id",
  };
  if (origin && allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers.Vary = "Origin";
  }
  return headers;
}
