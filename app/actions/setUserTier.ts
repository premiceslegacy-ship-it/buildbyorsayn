"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isPlatformAdminUser } from "@/lib/accompanimentAccess";

const userTierSchema = z.object({
  userId: z.string().uuid("Utilisateur invalide."),
  tier: z.enum(["beginner", "full"]).nullable(),
});

export async function setUserTier(userId: string, tier: string | null) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isPlatformAdminUser(user)) throw new Error("Accès administrateur refusé.");
  const parsed = userTierSchema.safeParse({ userId, tier });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Niveau invalide.");

  const supabaseAdmin = createAdminSupabase();
  const { data, error } = await supabaseAdmin.rpc("set_admin_user_tier", {
    p_actor_user_id: user.id,
    p_target_user_id: parsed.data.userId,
    p_tier: parsed.data.tier,
  });

  if (error || data !== true) throw new Error("La mise à jour du niveau a échoué.");

  revalidatePath("/admin");
}
