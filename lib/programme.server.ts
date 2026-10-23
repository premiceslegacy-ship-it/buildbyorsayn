import "server-only";

import { createClient } from "@/lib/supabase/server";
import { completedBlocCount } from "@/lib/programme";

export async function loadProgrammeProgress(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("lesson_progress").select("section_id").eq("user_id", userId).eq("completed", true);
  if (error) throw new Error("programme.progress.unavailable");
  return completedBlocCount((data ?? []).map((row) => row.section_id));
}
