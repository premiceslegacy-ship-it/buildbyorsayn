import "server-only";
import { createClient } from "@/lib/supabase/server";
import { normalizeProfileTier } from "@/lib/mcpAccess";
import type { User } from "@supabase/supabase-js";

export type NavIdentity = {
  tier: string | null;
  isAdmin: boolean;
  displayName: string;
  displayEmail: string;
  initials: string;
};

/**
 * Reads the current user's tier and display identity for the NavBar,
 * from within a Server Component. Returns null when there is no session.
 * `knownUser` : the page already called `auth.getUser()`; passing its result skips a second round trip to the Auth server.
 */
export async function navIdentity(knownUser?: User | null): Promise<NavIdentity | null> {
  const supabase = await createClient();
  const user = knownUser !== undefined
    ? knownUser
    : (await supabase.auth.getUser()).data.user;

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .maybeSingle();

  const email = user.email ?? "";
  const displayName =
    (user.user_metadata?.first_name as string) ||
    (user.user_metadata?.full_name as string)?.split(" ")[0] ||
    email.split("@")[0];

  return {
    tier: normalizeProfileTier(profile?.tier ?? null),
    isAdmin: user.app_metadata?.role === "admin",
    displayName,
    displayEmail: email,
    initials: displayName.substring(0, 2).toUpperCase(),
  };
}
