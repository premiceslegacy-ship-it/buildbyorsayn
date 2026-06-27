"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, Loader2, X } from "lucide-react";

type State = "polling" | "confirmed" | "timeout";

export function UpgradedBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<State>("polling");
  const [visible, setVisible] = useState(false);

  const isUpgrade = searchParams.get("upgraded") === "true";

  useEffect(() => {
    if (!isUpgrade) return;
    setVisible(true);

    const supabase = createClient();
    let attempts = 0;
    const MAX = 12; // 12 × 2.5s = 30s max

    const poll = async () => {
      attempts++;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("tier")
        .eq("id", user.id)
        .single();

      if (profile?.tier === "full") {
        setState("confirmed");
        // Nettoie l'URL sans rechargement
        const url = new URL(window.location.href);
        url.searchParams.delete("upgraded");
        window.history.replaceState({}, "", url.toString());
        // Masque la bannière après 4s
        setTimeout(() => setVisible(false), 4000);
        return;
      }

      if (attempts >= MAX) {
        setState("timeout");
        return;
      }

      setTimeout(poll, 2500);
    };

    poll();
  }, [isUpgrade]);

  if (!visible || !isUpgrade) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
      <div className="relative overflow-hidden flex items-center gap-3 bg-gradient-to-b from-white/[0.07] to-white/[0.03] border border-white/10 rounded-2xl px-4 py-3.5 shadow-[0_16px_48px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e8d5b0]/25 to-transparent" />

        {state === "polling" && (
          <>
            <Loader2 className="w-4 h-4 text-[#c9b48a] animate-spin flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#f0ede8]">Activation en cours...</p>
              <p className="text-xs text-[#8a8070]">Ton accès Système Complet est en train d&apos;être activé.</p>
            </div>
          </>
        )}

        {state === "confirmed" && (
          <>
            <CheckCircle className="w-4 h-4 text-[#c9b48a] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#f0ede8]">Accès Système Complet activé.</p>
              <p className="text-xs text-[#8a8070]">Tout le contenu est maintenant débloqué.</p>
            </div>
            <button onClick={() => setVisible(false)} className="text-[#8a8070] hover:text-[#f0ede8] transition-colors flex-shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {state === "timeout" && (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-[#c9b48a]/50 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#f0ede8]">Paiement reçu.</p>
              <p className="text-xs text-[#8a8070]">Ton accès sera activé dans quelques instants. Rafraîchis la page si nécessaire.</p>
            </div>
            <button onClick={() => router.refresh()} className="text-xs text-[#c9b48a] hover:text-[#e8d5b0] font-semibold flex-shrink-0 transition-colors">
              Rafraîchir
            </button>
          </>
        )}
      </div>
    </div>
  );
}
