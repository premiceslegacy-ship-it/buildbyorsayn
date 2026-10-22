import { createClient } from "@/lib/supabase/server";
import { DaRoot } from "@/components/da/DaRoot";
import { DaNav } from "@/components/da/DaNav";
import { DaFooter } from "@/components/da/DaFooter";
import { PricingSection } from "@/components/da/PricingSection";
import { getCheckoutLinks } from "@/lib/checkoutLinks";
import { normalizeProfileTier } from "@/lib/mcpAccess";
import { selectPricingView } from "@/lib/pricingView";
import { BetaCodeForm } from "./BetaCodeForm";

export const metadata = {
    title: "Choisir mon niveau | BUILD by Orsayn",
};

export default async function CheckoutPage({
    searchParams,
}: {
    searchParams: Promise<{ from?: string | string[] }>;
}) {
    const { from } = await searchParams;
    const fromMcp = from === "mcp";
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let tier: string | null = null;
    if (user?.id) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("tier")
            .eq("id", user.id)
            .single();
        tier = normalizeProfileTier(profile?.tier ?? null);
    }

    const links = getCheckoutLinks(user?.id);
    const showsBothOffers = selectPricingView({ tier }).blocks.includes("fondations");

    return (
        <DaRoot>
            <DaNav loggedIn={Boolean(user)} homeBase="/" />
            <main className="px-page">
                <PricingSection
                    tier={tier}
                    links={links}
                    headingLevel="h1"
                    compact
                    lede={fromMcp && showsBothOffers ? "Ton compte est prêt. Choisis ton niveau pour connecter ton assistant à BUILD." : undefined}
                />
                <div className="wrap">
                    <div className="px-beta"><BetaCodeForm /></div>
                </div>
            </main>
            <DaFooter homeBase="/" />
        </DaRoot>
    );
}
