"use server";

import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function toggleBlocCompletion(
  blocId: number
): Promise<{ success: boolean; completedBlocks: number[] }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, completedBlocks: [] };

  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("completed_blocks")
    .eq("id", user.id)
    .single();

  const current: number[] = profile?.completed_blocks ?? [];
  const isCompleted = current.includes(blocId);
  const updated = isCompleted
    ? current.filter((id) => id !== blocId)
    : [...current, blocId];

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ completed_blocks: updated })
    .eq("id", user.id);

  if (error) return { success: false, completedBlocks: current };
  return { success: true, completedBlocks: updated };
}
