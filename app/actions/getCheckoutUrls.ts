"use server";

import { readCheckoutBaseLinks } from "@/lib/checkoutLinks";
import { normalizeProfileTier } from "@/lib/mcpAccess";
import { createClient } from "@/lib/supabase/server";

/**
 * Liens Stripe de base pour le compte connecté.
 * Le lien du complément (Fondations vers LE COFFRE) n'est donné qu'à un compte Fondations : le webhook accorde LE COFFRE
 * pour ce paiement, il ne doit donc pas être distribué à un compte gratuit.
 */
export async function getCheckoutUrls() {
  const links = readCheckoutBaseLinks();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ...links, upgrade: null };

  const { data: profile } = await supabase.from("profiles").select("tier").eq("id", user.id).maybeSingle();
  const tier = normalizeProfileTier(profile?.tier ?? null);
  return tier === "beginner" ? links : { ...links, upgrade: null };
}
