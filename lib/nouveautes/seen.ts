import type { SupabaseClient, User } from "@supabase/supabase-js";

const NOUVEAUTES_BADGE_CAP = 9;

export function isNewVideo(publishedAt: string, seenAt: string): boolean {
  const published = Date.parse(publishedAt);
  const seen = Date.parse(seenAt);
  return Number.isFinite(published) && Number.isFinite(seen) && published > seen;
}

/** Null hides the badge; counts above the cap render as `9+`. */
export function formatNouveautesBadge(count: number | null): string | null {
  if (!count || count <= 0) return null;
  return count > NOUVEAUTES_BADGE_CAP ? `${NOUVEAUTES_BADGE_CAP}+` : String(count);
}

/** Last visit of /nouveautes, falling back to the account creation date. */
export async function readNouveautesSeenAt(supabase: SupabaseClient, user: Pick<User, "id" | "created_at">): Promise<string> {
  const { data, error } = await supabase.from("member_nouveautes_seen")
    .select("seen_at").eq("user_id", user.id).maybeSingle();
  if (error) throw error;
  return data?.seen_at ?? user.created_at;
}

export async function markNouveautesSeen(supabase: SupabaseClient, userId: string, now = new Date()): Promise<void> {
  const { error } = await supabase.from("member_nouveautes_seen")
    .upsert({ user_id: userId, seen_at: now.toISOString() }, { onConflict: "user_id" });
  if (error) throw error;
}
