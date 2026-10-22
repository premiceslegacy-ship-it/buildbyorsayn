import { hashRateLimitSubject, resolveRateLimitDecision } from "@/lib/mcp/security";
import { createAdminSupabase } from "@/lib/supabase/admin";

export type PrivateDownloadDecision = "allowed" | "denied" | "unavailable";

export async function reservePrivateDownload(
  principal: string,
  signal?: AbortSignal,
): Promise<PrivateDownloadDecision> {
  const pepper = process.env.PRIVATE_DOWNLOAD_RATE_LIMIT_PEPPER ?? "";
  if (pepper.length < 16) return "unavailable";

  const admin = createAdminSupabase({ signal });
  const { data, error } = await admin.rpc("check_mcp_rate_limit", {
    p_subject: hashRateLimitSubject("private-download", principal, pepper),
    p_max_per_window: 30,
    p_window_seconds: 3_600,
  });
  return resolveRateLimitDecision(data, error);
}
