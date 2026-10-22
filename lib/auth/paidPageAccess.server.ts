import "server-only";

import { redirect } from "next/navigation";
import { normalizeProfileTier, type McpTier } from "@/lib/mcpAccess";
import { createClient } from "@/lib/supabase/server";

export type PageAccessRequirement = "authenticated" | "beginner" | "full";

export async function requirePageAccess(
  requirement: PageAccessRequirement,
  pathname: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(`/login?next=${encodeURIComponent(pathname)}`);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .maybeSingle();
  const tier = profileError ? null : normalizeProfileTier(profile?.tier);

  const allowed =
    requirement === "authenticated" ||
    (requirement === "beginner" && (tier === "beginner" || tier === "full")) ||
    (requirement === "full" && tier === "full");

  if (!allowed) redirect("/checkout");

  const email = user.email ?? "";
  const displayName =
    (user.user_metadata?.first_name as string) ||
    (user.user_metadata?.full_name as string)?.split(" ")[0] ||
    email.split("@")[0];

  return {
    user,
    tier: tier as McpTier | null,
    displayName,
    displayEmail: email,
    initials: displayName.substring(0, 2).toUpperCase(),
    isAdmin: user.app_metadata?.role === "admin",
  };
}
