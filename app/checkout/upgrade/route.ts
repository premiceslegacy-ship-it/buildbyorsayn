import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUpgradeCheckoutLink } from "@/lib/checkoutLinks";
import { resolveUpgradeRedirect } from "@/lib/checkoutUpgrade";

// Réponse propre à chaque personne : jamais mise en cache.
export const dynamic = "force-dynamic";

/**
 * Porte du complément Fondations vers LE COFFRE. Seul un compte Fondations est envoyé vers le paiement ;
 * les autres sont renvoyés vers Fondations ou LE COFFRE. Le lien Stripe n'existe que dans cette réponse de redirection.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let tier: string | null = null;
  let profileError = false;
  if (user) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("tier")
      .eq("id", user.id)
      .maybeSingle();
    profileError = Boolean(error);
    tier = profile?.tier ?? null;
  }

  const target = resolveUpgradeRedirect({
    authenticated: Boolean(user),
    profileError,
    tier,
    upgradeUrl: user ? getUpgradeCheckoutLink(user.id) : null,
  });

  const response = NextResponse.redirect(new URL(target, request.url), 303);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
