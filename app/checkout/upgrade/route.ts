import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { isTrustedUpgradeNavigation, resolveUpgradeRedirect } from "@/lib/checkoutUpgrade";
import {
  buildUpgradeCheckoutParams,
  safeStripeCheckoutUrl,
  UPGRADE_CHECKOUT_WINDOW_MS,
  upgradeCheckoutIdempotencyKey,
} from "@/lib/stripeCheckout";
import { createUpgradeCheckoutCache } from "@/lib/upgradeCheckoutCache";
import { requireSiteOrigin } from "@/lib/siteOrigin";

// Réponse propre à chaque personne : jamais mise en cache.
export const dynamic = "force-dynamic";

// Les rejeux de cette navigation GET (lien tiers, prefetch, scanner) ne rappellent pas Stripe dans la fenêtre d'idempotence.
const upgradeUrlCache = createUpgradeCheckoutCache(UPGRADE_CHECKOUT_WINDOW_MS);

/**
 * Porte du complément Fondations vers LE COFFRE. Pour un compte Fondations, le serveur
 * crée une Checkout Session dont les métadonnées lient le paiement au compte authentifié.
 */
export async function GET(request: Request) {
  if (!isTrustedUpgradeNavigation(request.headers)) {
    return new NextResponse(null, {
      status: 303,
      headers: { Location: "/checkout", "Cache-Control": "no-store" },
    });
  }

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

  let upgradeUrl: string | null = null;
  if (user && tier === "beginner" && !profileError) {
    upgradeUrl = upgradeUrlCache.get(user.id);
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_UPGRADE_PRICE_ID;
    if (!upgradeUrl && secretKey && priceId) {
      try {
        const stripe = new Stripe(secretKey);
        const checkout = await stripe.checkout.sessions.create(
          buildUpgradeCheckoutParams({
            userId: user.id,
            userEmail: user.email,
            priceId,
            siteOrigin: requireSiteOrigin(),
          }),
          { idempotencyKey: upgradeCheckoutIdempotencyKey(user.id) },
        );
        upgradeUrl = safeStripeCheckoutUrl(checkout.url);
        if (upgradeUrl) upgradeUrlCache.set(user.id, upgradeUrl);
      } catch {
        console.error("[Checkout] Upgrade session creation failed");
      }
    }
  }

  const target = resolveUpgradeRedirect({
    authenticated: Boolean(user),
    profileError,
    tier,
    upgradeUrl,
  });

  return new NextResponse(null, {
    status: 303,
    headers: { Location: target, "Cache-Control": "no-store" },
  });
}
