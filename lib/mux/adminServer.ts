import "server-only";

import Mux from "@mux/ts";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isPlatformAdminUser } from "@/lib/accompanimentAccess";

export type AdminVideoLessonRow = {
  id: string;
  bloc_id: string;
  position: number;
  title: string;
  summary: string;
  transcript: string;
  transcript_segments: unknown;
  transcript_source: "automatic" | "manual";
  deliverables: string[];
  chapters: unknown;
  thumbnail?: string | null;
  thumbnailUrl?: string | null;
  tier_required: "preview" | "beginner" | "full";
  status: "waiting" | "preparing" | "ready" | "errored" | "cancelled";
  mux_upload_id: string;
  mux_asset_id: string | null;
  playback_id: string | null;
  duration_seconds: number | null;
  error_code: string | null;
  published_at: string | null;
  replaced_at?: string | null;
  approved_at: string | null;
  created_at: string;
};

export async function getVerifiedAdmin(): Promise<User | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  return !error && isPlatformAdminUser(user) ? user : null;
}

export function createMuxAdminClient(options: { webhook?: boolean } = {}) {
  const tokenId = process.env.MUX_TOKEN_ID?.trim();
  const tokenSecret = process.env.MUX_TOKEN_SECRET?.trim();
  const webhookSecret = process.env.MUX_WEBHOOK_SECRET?.trim();
  if (!options.webhook && (!tokenId || !tokenSecret)) {
    throw new Error("Configuration Mux incomplète.");
  }
  if (options.webhook && !webhookSecret) {
    throw new Error("Configuration du webhook Mux incomplète.");
  }
  return new Mux({
    tokenId,
    tokenSecret,
    webhookSecret,
    timeout: 15_000,
    maxRetries: 0,
  });
}

export async function recordAdminAction(input: {
  actorUserId: string;
  action: string;
  targetType: string;
  targetId: string;
  result: "pending" | "approved" | "completed" | "refused" | "failed" | "cancelled";
  approved?: boolean;
  details?: Record<string, string | number | boolean | null>;
}) {
  const admin = createAdminSupabase();
  const { data, error } = await admin.rpc("record_admin_action", {
    p_actor_user_id: input.actorUserId,
    p_action: input.action,
    p_target_type: input.targetType,
    p_target_id: input.targetId,
    p_result: input.result,
    p_approved_by: input.approved ? input.actorUserId : null,
    p_details: input.details ?? {},
  });
  if (error || typeof data !== "string") throw new Error("Journal administrateur indisponible.");
  return data;
}
