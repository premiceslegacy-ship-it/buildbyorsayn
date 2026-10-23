import "server-only";

import { createClient } from "@/lib/supabase/server";
import { resumeForTier } from "@/lib/dashboard/today";
import { SECTIONS } from "@/app/beginner/sections.data";
import { BLOCS_DATA } from "@/lib/blocCatalog";

export async function loadResumeItem(userId: string, tier: string | null) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("lesson_progress").select("section_id,position_seconds").eq("user_id", userId).eq("completed", false).order("updated_at", { ascending: false }).limit(1).maybeSingle();
  if (error) throw new Error("today.progress.unavailable");
  return resumeForTier(data, tier);
}

export async function loadDashboardProgress(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("lesson_progress").select("section_id").eq("user_id", userId).eq("completed", true);
  if (error) throw new Error("dashboard.progress.unavailable");
  const completed = new Set((data ?? []).map((row) => row.section_id));
  const ratio = (ids: readonly string[]) => ids.length === 0 ? 0 : Math.round(ids.filter((id) => completed.has(id)).length / ids.length * 100);
  return {
    "fondations-1": ratio(SECTIONS.slice(0, 5).map((section) => section.id)),
    "fondations-2": ratio(SECTIONS.slice(5).map((section) => section.id)),
    ...Object.fromEntries(BLOCS_DATA.map((bloc) => [`bloc-${bloc.id}`, ratio(bloc.sections.map((section) => section.id))])),
  };
}
