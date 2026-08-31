"use server";

import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isAccompanimentAdminUser } from "@/lib/accompanimentAccess";

const userTierSchema = z.object({
  userId: z.string().uuid("Utilisateur invalide."),
  tier: z.enum(["beginner", "full"]).nullable(),
});

export async function setUserTier(userId: string, tier: string | null) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAccompanimentAdminUser(user)) throw new Error("Accès administrateur refusé.");
  const parsed = userTierSchema.safeParse({ userId, tier });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Niveau invalide.");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) throw new Error("Configuration administrateur incomplète.");
  const supabaseAdmin = createSupabaseAdmin(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update({ tier: parsed.data.tier })
    .eq("id", parsed.data.userId)
    .select("id")
    .maybeSingle();

  if (error || !data) throw new Error("La mise à jour du niveau a échoué.");

  revalidatePath("/admin");
}
