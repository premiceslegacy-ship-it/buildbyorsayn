import "server-only";

import { createClient } from "@/lib/supabase/server";
import { resumeForTier } from "@/lib/dashboard/today";

export async function loadResumeItem(userId: string, tier: string | null) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("lesson_progress").select("section_id,position_seconds").eq("user_id", userId).eq("completed", false).order("updated_at", { ascending: false }).limit(1).maybeSingle();
  if (error) throw new Error("today.progress.unavailable");
  return resumeForTier(data, tier);
}
