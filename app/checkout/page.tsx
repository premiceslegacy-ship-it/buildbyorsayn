import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/Logo";
import { ArrowRight, Lock, Zap, Layers, Users } from "lucide-react";
import { BetaCodeForm } from "./BetaCodeForm";

const STRIPE_BASE_URL = "https://buy.stripe.com/dRm28s2lo59vdRyaqc5AQ01";

const FEATURES = [
    { icon: Layers, label: "6 blocs de système complets" },
    { icon: Zap, label: "Méthodes actionnables & directes" },
    { icon: Users, label: "Accès à la communauté privée" },
];

export default async function CheckoutPage() {
    // Récupère le user_id Supabase pour le passer en paramètre custom
    // afin que le webhook puisse identifier l'acheteur directement par UUID
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const checkoutUrl = user?.id
        ? `${STRIPE_BASE_URL}?client_reference_id=${user.id}`
        : STRIPE_BASE_URL;

    return (
        <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1c1c1f] via-[#0e0e0f] to-[#0e0e0f] text-[#f0ede8] font-sans flex flex-col items-center justify-center relative overflow-hidden px-6">
            {/* Halos décoratifs — identiques au dashboard */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#e8d5b0] opacity-5 blur-[120px] w-[600px] h-[300px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 bg-blue-500 opacity-5 blur-[120px] w-[400px] h-[400px] rounded-full pointer-events-none" />

            {/* Logo */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2">
                <Logo layout="horizontal" className="h-6" hideText={false} />
            </div>

            {/* Card principale */}
            <div className="relative z-10 w-full max-w-md mt-16">
                {/* Icône verrou */}
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl">
                        <Lock className="w-7 h-7 text-[#e8d5b0] drop-shadow-[0_0_10px_rgba(232,213,176,0.6)]" />
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-semibold tracking-tight text-[#f0ede8] mb-3">
                        Accès réservé
                    </h1>
                    <p className="text-[rgba(240,237,232,0.55)] text-base leading-relaxed">
                        Ce contenu est disponible uniquement pour les membres de{" "}
                        <span className="text-[#e8d5b0] font-medium">BUILD</span>.
                        Débloque l&apos;accès en une fois pour rejoindre le système.
                    </p>
                </div>

                {/* Features list */}
                <ul className="space-y-3 mb-10">
                    {FEATURES.map(({ icon: Icon, label }) => (
                        <li
                            key={label}
                            className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3"
                        >
                            <div className="flex-shrink-0 w-8 h-8 bg-[#e8d5b0]/10 rounded-lg flex items-center justify-center">
                                <Icon className="w-4 h-4 text-[#e8d5b0]" strokeWidth={1.5} />
                            </div>
                            <span className="text-sm text-[rgba(240,237,232,0.75)]">{label}</span>
                        </li>
                    ))}
                </ul>

                {/* Prix + CTA */}
                <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-xl">
                    <div className="flex items-baseline justify-between mb-6">
                        <span className="text-white/40 text-sm">Accès à vie</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-[#f0ede8]">67€</span>
                            <span className="text-white/40 text-sm">TTC</span>
                        </div>
                    </div>

                    <a
                        href={checkoutUrl}
                        className="group flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl font-semibold text-[#0e0e0f] bg-[#e8d5b0] hover:bg-[#f0dfc0] transition-all duration-200 shadow-[0_0_24px_rgba(232,213,176,0.25)] hover:shadow-[0_0_32px_rgba(232,213,176,0.4)]"
                    >
                        Débloquer l&apos;accès
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </a>

                    <p className="text-center text-xs text-white/25 mt-4">
                        Paiement sécurisé via Stripe · Satisfait ou remboursé 30 jours
                    </p>

                    <BetaCodeForm />
                </div>
            </div>
        </main>
    );
}
