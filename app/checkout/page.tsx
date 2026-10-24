import { createClient } from "@/lib/supabase/server";
import { DaRoot } from "@/components/da/DaRoot";
import { DaNav } from "@/components/da/DaNav";
import { DaFooter } from "@/components/da/DaFooter";
import { CheckoutView } from "@/components/ui5/CheckoutView";
import { getCheckoutLinks } from "@/lib/checkoutLinks";
import { normalizeProfileTier } from "@/lib/mcpAccess";
import { selectPricingView } from "@/lib/pricingView";
import "./checkout.css";

export const metadata = {
    title: "Choisir mon niveau | BUILD",
};

export default async function CheckoutPage({
    searchParams,
}: {
    searchParams: Promise<{ from?: string | string[]; upgrade?: string | string[] }>;
}) {
    const { from, upgrade } = await searchParams;
    const fromMcp = from === "mcp";
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let tier: string | null = null;
    let accessUnverified = false;
    if (user?.id) {
        const { data: profile, error } = await supabase
            .from("profiles")
            .select("tier")
            .eq("id", user.id)
            .maybeSingle();
        accessUnverified = Boolean(error);
        tier = normalizeProfileTier(profile?.tier ?? null);
    }

    const links = getCheckoutLinks(user?.id);
    const blocks = selectPricingView({ tier, unverified: accessUnverified }).blocks;
    const showsBothOffers = blocks.includes("fondations");
    const notice =
        from === "upgrade" && showsBothOffers
            ? "Le complément est réservé aux comptes Fondations. Choisis Fondations ou LE\u00a0COFFRE."
            : upgrade === "indisponible" && blocks.includes("upgradeCard")
              ? "Le paiement du complément n'est pas disponible pour le moment. Écris-nous et on règle ça."
              : undefined;

    return (
        <DaRoot className="checkout-page">
            <DaNav loggedIn={Boolean(user)} homeBase="/" />
            <CheckoutView blocks={blocks} links={links} loggedIn={Boolean(user)} notice={notice} lede={fromMcp && showsBothOffers ? "Ton compte est prêt. Choisis ton niveau pour connecter ton assistant à BUILD." : undefined} />
            <DaFooter homeBase="/" loggedIn={Boolean(user)} />
        </DaRoot>
    );
}
