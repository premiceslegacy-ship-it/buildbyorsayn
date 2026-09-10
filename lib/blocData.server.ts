import "server-only";
import { createClient } from "@/lib/supabase/server";
import { resolveMcpProfileTier } from "@/lib/mcpAccess";
import { projectBlocForTier } from "@/lib/blocAccess";

export async function getBlocForCurrentUser(id: string) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  const { data: profile, error: profileError } = await supabase.from("profiles")
    .select("tier").eq("id", user.id).maybeSingle();
  const tier = resolveMcpProfileTier(profile, profileError);
  const { BLOCS_DATA } = await import("@/lib/mockData");
  const bloc = BLOCS_DATA.find(item => item.id === id);
  return { userId: user.id, tier, bloc: bloc ? projectBlocForTier(bloc, tier) : null };
}