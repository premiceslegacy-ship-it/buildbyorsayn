import type { SupabaseClient } from "@supabase/supabase-js";
import {
  hashRateLimitSubject,
  resolveRateLimitDecision,
  trustedClientAddress,
  type RateLimitDecision,
} from "@/lib/mcp/security";

export async function reserveAuthorizationNetworkRequest(
  admin: SupabaseClient,
  input: { headers: Headers; product: "build-sync" | "mcp" },
): Promise<RateLimitDecision> {
  const pepper = process.env.OAUTH_AUTHORIZE_RATE_LIMIT_PEPPER ?? "";
  const address = trustedClientAddress(input.headers);
  if (pepper.length < 16 || !address) return "unavailable";
  const { data, error } = await admin.rpc("check_mcp_rate_limit", {
    p_subject: hashRateLimitSubject("oauth-authorize", `${input.product}:network:${address}`, pepper),
    p_max_per_window: 30,
    p_window_seconds: 300,
  });
  return resolveRateLimitDecision(data, error);
}

export async function reserveAuthorizationPrincipal(
  admin: SupabaseClient,
  input: { userId: string; clientId: string; product: "build-sync" | "mcp" },
): Promise<RateLimitDecision> {
  const pepper = process.env.OAUTH_AUTHORIZE_RATE_LIMIT_PEPPER ?? "";
  if (pepper.length < 16) return "unavailable";
  const { data, error } = await admin.rpc("check_mcp_rate_limit", {
    p_subject: hashRateLimitSubject(
      "oauth-authorize",
      `${input.product}:principal:${input.userId}:${input.clientId}`,
      pepper,
    ),
    p_max_per_window: 10,
    p_window_seconds: 300,
  });
  return resolveRateLimitDecision(data, error);
}

export async function reserveAuthorizationRequest(
  admin: SupabaseClient,
  input: { headers: Headers; userId: string; clientId: string; product: "build-sync" | "mcp" },
): Promise<RateLimitDecision> {
  const networkDecision = await reserveAuthorizationNetworkRequest(admin, input);
  if (networkDecision !== "allowed") return networkDecision;
  return reserveAuthorizationPrincipal(admin, input);
}
