import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

const RANDOM_TOKEN_BYTES = 32;
const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;

export function generateOpaqueToken(): string {
  return randomBytes(RANDOM_TOKEN_BYTES).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export { ACCESS_TOKEN_TTL_SECONDS };

/**
 * PKCE S256 verification. Constant-time comparison to avoid leaking
 * information about how much of the challenge matched via response timing.
 */
export function isValidS256CodeChallenge(value: string): boolean {
  return /^[A-Za-z0-9_-]{43}$/.test(value);
}

export function verifyCodeChallenge(
  codeVerifier: string,
  codeChallenge: string
): boolean {
  if (!codeVerifier || !isValidS256CodeChallenge(codeChallenge)) return false;
  if (!/^[A-Za-z0-9._~-]{43,128}$/.test(codeVerifier)) return false;

  const computed = createHash("sha256").update(codeVerifier, "ascii").digest("base64url");
  const computedBuffer = Buffer.from(computed, "utf8");
  const expectedBuffer = Buffer.from(codeChallenge, "utf8");

  if (computedBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(computedBuffer, expectedBuffer);
}

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/**
 * Redirect URIs must match one of the client's registered URIs by exact
 * string equality. No prefix matching, no wildcards, no "same origin is
 * good enough" - that class of shortcut is the most common way hand-rolled
 * OAuth servers get exploited via open redirect.
 *
 * Loopback HTTP is registrable, but its port remains part of the exact URI
 * so the application and PostgreSQL enforce the same rule.
 */
export function isRedirectUriAllowed(
  candidate: string,
  registeredUris: readonly string[]
): boolean {
  let candidateUrl: URL;
  try {
    candidateUrl = new URL(candidate);
  } catch {
    return false;
  }

  if (
    candidateUrl.username ||
    candidateUrl.password ||
    candidateUrl.hash ||
    !isRedirectUriRegistrable(candidate)
  ) {
    return false;
  }
  return registeredUris.includes(candidate);
}

export function isRedirectUriRegistrable(candidate: string): boolean {
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return false;
  }
  if (url.username || url.password || url.hash) return false;
  if (url.protocol === "https:") return true;
  if (url.protocol === "http:" && LOOPBACK_HOSTS.has(url.hostname)) return true;
  return false;
}

const MAX_CLIENT_NAME_LENGTH = 100;

/**
 * Client names are attacker-controlled input (DCR is an unauthenticated
 * write endpoint) and are rendered on the consent screen. Strip anything
 * that isn't plain text before it ever reaches JSX.
 */
export function sanitizeClientName(rawName: unknown): string {
  const name = typeof rawName === "string" ? rawName : "Application inconnue";
  return name
    .replace(/[<>]/g, "")
    .slice(0, MAX_CLIENT_NAME_LENGTH)
    .trim() || "Application inconnue";
}
