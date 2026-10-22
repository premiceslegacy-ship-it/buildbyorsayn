import type { SupabaseClient } from "@supabase/supabase-js";
import {
  hashRateLimitSubject,
  resolveRateLimitDecision,
  trustedClientAddress,
  type RateLimitDecision,
} from "@/lib/mcp/security";

export async function reserveAuthorizationRequest(
  admin: SupabaseClient,
  input: { headers: Headers; userId: string; clientId: string; product: "build-sync" | "mcp" },
): Promise<RateLimitDecision> {
  const pepper = process.env.OAUTH_AUTHORIZE_RATE_LIMIT_PEPPER ?? "";
  const address = trustedClientAddress(input.headers);
  if (pepper.length < 16 || !address) return "unavailable";

  const subjects = [
    { value: `${input.product}:network:${address}`, maximum: 30 },
    { value: `${input.product}:principal:${input.userId}:${input.clientId}`, maximum: 10 },
  ];
  for (const subject of subjects) {
    const { data, error } = await admin.rpc("check_mcp_rate_limit", {
      p_subject: hashRateLimitSubject("oauth-authorize", subject.value, pepper),
      p_max_per_window: subject.maximum,
      p_window_seconds: 300,
    });
    const decision = resolveRateLimitDecision(data, error);
    if (decision !== "allowed") return decision;
  }
  return "allowed";
}
