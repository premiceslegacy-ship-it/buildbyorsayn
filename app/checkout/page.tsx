import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/Logo";
import { ArrowRight, Zap, Layers, Users, GraduationCap, Lock } from "lucide-react";
import { BetaCodeForm } from "./BetaCodeForm";

const STRIPE_FULL_URL = "https://buy.stripe.com/aFa28saRUgSdaFm69W5AQ02";
// These will be set once you create the products in Stripe:
const STRIPE_BEGINNER_URL = process.env.STRIPE_BEGINNER_CHECKOUT_LINK ?? "#";
const STRIPE_UPGRADE_URL = process.env.STRIPE_UPGRADE_CHECKOUT_LINK ?? "#";

const BEGINNER_FEATURES = [
    { icon: GraduationCap, label: "5 modules fondations complets" },
    { icon: Zap, label: "De zéro à un site en ligne" },
    { icon: Layers, label: "IA, GitHub, IDE, Vercel" },
];

const FULL_FEATURES = [
    { icon: Layers, label: "7 blocs de système complets" },
    { icon: Zap, label: "Méthodes actionnables et directes" },
    { icon: Users, label: "Accès à la communauté privée" },
    { icon: GraduationCap, label: "Fondations incluses" },
];

export default async function CheckoutPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check current tier for upgrade flow
    let currentTier: string | null = null;
    if (user?.id) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("tier")
            .eq("id", user.id)
            .single();
        currentTier = profile?.tier ?? null;
    }

    const beginnerUrl = user?.id
        ? `${STRIPE_BEGINNER_URL}${STRIPE_BEGINNER_URL !== "#" ? "?client_reference_id=" + user.id : ""}`
        : STRIPE_BEGINNER_URL;

    const fullUrl = user?.id
        ? `${STRIPE_FULL_URL}?client_reference_id=${user.id}`
        : STRIPE_FULL_URL;

    const upgradeUrl = user?.id
        ? `${STRIPE_UPGRADE_URL}${STRIPE_UPGRADE_URL !== "#" ? "?client_reference_id=" + user.id : ""}`
        : STRIPE_UPGRADE_URL;

    const isUpgrading = currentTier === "beginner";
    const alreadyFull = currentTier === "full";

    return (
        <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1c1c1f] via-[#0e0e0f] to-[#0e0e0f] text-[#f0ede8] font-sans flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6">
            {/* Halos */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#e8d5b0] opacity-5 blur-[120px] w-[600px] h-[300px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 bg-blue-500 opacity-5 blur-[120px] w-[400px] h-[400px] rounded-full pointer-events-none" />

            {/* Logo */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2">
                <Logo layout="horizontal" className="h-6" hideText={false} />
            </div>

            <div className="relative z-10 w-full max-w-2xl mt-20 pb-16">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-semibold tracking-tight text-[#f0ede8] mb-3">
                        {alreadyFull ? "Tu as déjà l'accès complet" : isUpgrading ? "Passe au système complet" : "Accès réservé"}
                    </h1>
                    <p className="text-[rgba(240,237,232,0.55)] text-base leading-relaxed">
                        {alreadyFull
                            ? "Tu as accès à l'ensemble du système Build, y compris les fondations."
                            : isUpgrading
                            ? "Tu as les fondations. Débloque les 7 blocs, les sources et la communauté pour 70€."
                            : "Choisis le niveau d'accès qui te correspond."}
                    </p>
                </div>

                {alreadyFull ? (
                    /* Already full — show dashboard link */
                    <div className="bg-white/[0.04] border border-[#e8d5b0]/20 rounded-2xl p-6 sm:p-8 backdrop-blur-xl text-center">
                        <p className="text-white/50 text-sm mb-6">Retourne au tableau de bord pour accéder à tes blocs, tes sources et la communauté.</p>
                        <a href="/dashboard" className="group inline-flex items-center justify-center gap-2 py-4 px-8 rounded-xl font-semibold text-[#0e0e0f] bg-[#e8d5b0] hover:bg-[#f0dfc0] transition-all duration-200 shadow-[0_0_24px_rgba(232,213,176,0.25)]">
                            Tableau de bord
                        </a>
                    </div>
                ) : isUpgrading ? (
                    /* Upgrade flow — beginner → full */
                    <div className="bg-white/[0.04] border border-[#e8d5b0]/20 rounded-2xl p-6 backdrop-blur-xl">
                        <ul className="space-y-3 mb-8">
                            {FULL_FEATURES.map(({ icon: Icon, label }) => (
                                <li key={label} className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-[#e8d5b0]/10 rounded-lg flex items-center justify-center">
                                        <Icon className="w-4 h-4 text-[#e8d5b0]" strokeWidth={1.5} />
                                    </div>
                                    <span className="text-sm text-[rgba(240,237,232,0.75)]">{label}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex items-baseline justify-between mb-6">
                            <span className="text-white/40 text-sm">Complément accès complet</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-[#f0ede8]">70€</span>
                                <span className="text-white/40 text-sm">TTC</span>
                            </div>
                        </div>
                        <a href={upgradeUrl} className="group flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl font-semibold text-[#0e0e0f] bg-[#e8d5b0] hover:bg-[#f0dfc0] transition-all duration-200 shadow-[0_0_24px_rgba(232,213,176,0.25)] hover:shadow-[0_0_32px_rgba(232,213,176,0.4)]">
                            Passer au complet
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </a>
                    </div>
                ) : (
                    /* Standard flow — 2 options */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Beginner */}
                        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-xl flex flex-col">
                            <div className="mb-5">
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#e8d5b0] bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 rounded-full px-3 py-1 mb-4">
                                    <GraduationCap className="w-3 h-3" /> Fondations
                                </span>
                                <div className="flex items-baseline gap-1 mb-1">
                                    <span className="text-3xl font-bold text-[#f0ede8]">30€</span>
                                    <span className="text-white/40 text-sm">TTC</span>
                                </div>
                                <span className="text-white/40 text-xs">Accès à vie aux fondations</span>
                            </div>
                            <ul className="space-y-2 mb-6 flex-1">
                                {BEGINNER_FEATURES.map(({ icon: Icon, label }) => (
                                    <li key={label} className="flex items-center gap-2.5">
                                        <Icon className="w-3.5 h-3.5 text-[#e8d5b0] flex-shrink-0" strokeWidth={1.5} />
                                        <span className="text-xs text-[rgba(240,237,232,0.65)]">{label}</span>
                                    </li>
                                ))}
                                <li className="flex items-center gap-2.5 opacity-40">
                                    <Lock className="w-3.5 h-3.5 text-white/40 flex-shrink-0" strokeWidth={1.5} />
                                    <span className="text-xs text-white/40">Blocs & sources (non inclus)</span>
                                </li>
                                <li className="flex items-center gap-2.5 opacity-40">
                                    <Lock className="w-3.5 h-3.5 text-white/40 flex-shrink-0" strokeWidth={1.5} />
                                    <span className="text-xs text-white/40">Communauté Telegram (non inclus)</span>
                                </li>
                            </ul>
                            <a href={beginnerUrl} className="group flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl font-semibold text-[#0e0e0f] bg-[#e8d5b0]/80 hover:bg-[#e8d5b0] transition-all duration-200 text-sm">
                                Commencer pour 30€
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                            </a>
                        </div>

                        {/* Full */}
                        <div className="bg-white/[0.04] border border-[#e8d5b0]/25 rounded-2xl p-6 backdrop-blur-xl flex flex-col relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="text-xs font-semibold text-[#0e0e0f] bg-[#e8d5b0] rounded-full px-3 py-1">Recommandé</span>
                            </div>
                            <div className="mb-5">
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#e8d5b0] bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 rounded-full px-3 py-1 mb-4">
                                    <Zap className="w-3 h-3" /> Complet
                                </span>
                                <div className="flex items-baseline gap-1 mb-1">
                                    <span className="text-3xl font-bold text-[#f0ede8]">100€</span>
                                    <span className="text-white/40 text-sm">TTC</span>
                                </div>
                                <span className="text-white/40 text-xs">Accès à vie à tout le système</span>
                            </div>
                            <ul className="space-y-2 mb-6 flex-1">
                                {FULL_FEATURES.map(({ icon: Icon, label }) => (
                                    <li key={label} className="flex items-center gap-2.5">
                                        <Icon className="w-3.5 h-3.5 text-[#e8d5b0] flex-shrink-0" strokeWidth={1.5} />
                                        <span className="text-xs text-[rgba(240,237,232,0.65)]">{label}</span>
                                    </li>
                                ))}
                            </ul>
                            <a href={fullUrl} className="group flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl font-semibold text-[#0e0e0f] bg-[#e8d5b0] hover:bg-[#f0dfc0] transition-all duration-200 shadow-[0_0_24px_rgba(232,213,176,0.25)] hover:shadow-[0_0_32px_rgba(232,213,176,0.4)] text-sm">
                                Débloquer l&apos;accès complet
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                            </a>
                        </div>
                    </div>
                )}

                <p className="text-center text-xs text-white/25 mt-6">Paiement sécurisé via Stripe · Satisfait ou remboursé 30 jours</p>
                <BetaCodeForm />
            </div>
        </main>
    );
}
