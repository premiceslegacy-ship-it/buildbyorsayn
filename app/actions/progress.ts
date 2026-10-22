"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { BLOCS_DATA } from "@/lib/mockData";
import { normalizeProfileTier } from "@/lib/mcpAccess";

const VALID_BLOC_IDS = new Set(BLOCS_DATA.map((bloc) => Number(bloc.id)));

export async function toggleBlocCompletion(
  blocId: number
): Promise<{ success: boolean; completedBlocks: number[] }> {
  if (
    typeof blocId !== "number" ||
    !Number.isInteger(blocId) ||
    !VALID_BLOC_IDS.has(blocId)
  ) {
    return { success: false, completedBlocks: [] };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, completedBlocks: [] };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .maybeSingle();
  const tier = profileError ? null : normalizeProfileTier(profile?.tier);
  const canComplete = tier === "full" || (tier === "beginner" && blocId === 1);
  if (!canComplete) return { success: false, completedBlocks: [] };

  const { data, error } = await supabase.rpc("toggle_block_progress", {
    p_bloc_id: blocId,
  });
  const updated = Array.isArray(data)
    ? data.filter((value): value is number => typeof value === "number" && VALID_BLOC_IDS.has(value))
    : [];

  if (error || !Array.isArray(data)) return { success: false, completedBlocks: [] };

  revalidatePath("/", "layout");

  return { success: true, completedBlocks: updated };
}
