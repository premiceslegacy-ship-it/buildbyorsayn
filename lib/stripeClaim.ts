import type { SupabaseClient } from "@supabase/supabase-js";
import { hashRateLimitSubject, resolveRateLimitDecision, type RateLimitDecision } from "@/lib/mcp/security";

export type StripeClaimResult = {
  decision: RateLimitDecision;
  claimed: number;
};

/**
 * Claims pending purchases only after Auth has confirmed the exact email address.
 * The peppered quota runs before the claim RPC and all failures stay generic.
 */
export async function claimVerifiedStripePurchases(
  admin: SupabaseClient,
  input: { userId: string; email: string },
): Promise<StripeClaimResult> {
  const pepper = process.env.STRIPE_CLAIM_RATE_LIMIT_PEPPER?.trim() ?? "";
  if (pepper.length < 16) return { decision: "unavailable", claimed: 0 };

  const { data: allowed, error: quotaError } = await admin.rpc("check_mcp_rate_limit", {
    p_subject: hashRateLimitSubject("stripe-claim", input.userId, pepper),
    p_max_per_window: 5,
    p_window_seconds: 300,
  });
  const decision = resolveRateLimitDecision(allowed, quotaError);
  if (decision !== "allowed") return { decision, claimed: 0 };

  const { data, error } = await admin.rpc("claim_stripe_purchase_for_verified_email", {
    p_user_id: input.userId,
    p_email: input.email,
  });
  if (error || typeof data !== "number") return { decision: "unavailable", claimed: 0 };
  return { decision: "allowed", claimed: data };
}
