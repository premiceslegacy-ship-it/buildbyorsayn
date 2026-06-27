"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { createClient } from "@/lib/supabase/client";
import { getCheckoutUrls } from "@/app/actions/getCheckoutUrls";

import { SectionMindset } from "./sections/SectionMindset";
import { SectionPsychologie } from "./sections/SectionPsychologie";
import { SectionCopywriting } from "./sections/SectionCopywriting";
import { SectionVente } from "./sections/SectionVente";
import { SectionMarketing } from "./sections/SectionMarketing";
import { Section1 } from "./sections/Section1";
import { Section2 } from "./sections/Section2";
import { Section3 } from "./sections/Section3";
import { Section4 } from "./sections/Section4";
import { Section5 } from "./sections/Section5";

const STEPS = [
  { num: 1, label: "L'état d'esprit qui fait l'argent" },
  { num: 2, label: "Comprendre les gens" },
  { num: 3, label: "Écrire pour vendre" },
  { num: 4, label: "Vendre" },
  { num: 5, label: "Capter l'attention" },
  { num: 6, label: "Penser avant de construire" },
  { num: 7, label: "Comprendre l'environnement" },
  { num: 8, label: "Générer des visuels pro" },
  { num: 9, label: "De l'idée à l'URL en ligne" },
  { num: 10, label: "L'angle mort" },
];

export default function BeginnerPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [tier, setTier] = useState<string | null>(null);
  const [upgradeUrl, setUpgradeUrl] = useState<string>("#");
  const [displayEmail, setDisplayEmail] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/"); return; }
      setDisplayEmail(user.email ?? "");
      const { data: profile } = await supabase
        .from("profiles").select("tier").eq("id", user.id).single();
      setTier(profile?.tier ?? null);
      const urls = await getCheckoutUrls();
      const base = urls.upgrade ?? "#";
      setUpgradeUrl(base !== "#" ? `${base}?client_reference_id=${user.id}` : base);
    };
    fetchUser();
  }, [router]);

  const goNext = () => { setStep(s => Math.min(s + 1, 10)); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const goPrev = () => { setStep(s => Math.max(s - 1, 1)); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1c1c1f] via-[#0e0e0f] to-[#0e0e0f] text-[#f0ede8] font-sans">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-[#e8d5b0] opacity-5 blur-[120px] w-[600px] h-[300px] rounded-full pointer-events-none z-0" />

      {/* Nav */}
      <NavBar
        activeLink="beginner"
        tier={tier}
        displayEmail={displayEmail}
        initials={displayEmail ? displayEmail.substring(0, 2).toUpperCase() : "?"}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 pb-32 relative z-10">
        {/* Progress */}
        <div className="pt-6 mb-10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-[0.15em] text-[#e8d5b0]/60 font-semibold">Fondations</p>
            <p className="text-xs text-white/30">{step} / {STEPS.length}</p>
          </div>
          <div className="flex gap-1.5">
            {STEPS.map((s) => (
              <button
                key={s.num}
                onClick={() => { setStep(s.num); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${s.num <= step ? "bg-[#e8d5b0]" : "bg-white/10"}`}
                title={s.label}
              />
            ))}
          </div>
          <p className="text-xs text-white/40 mt-2">{STEPS[step - 1].label}</p>
        </div>

        {/* Section content */}
        {step === 1 && <SectionMindset />}
        {step === 2 && <SectionPsychologie />}
        {step === 3 && <SectionCopywriting />}
        {step === 4 && <SectionVente />}
        {step === 5 && <SectionMarketing />}
        {step === 6 && <Section1 />}
        {step === 7 && <Section2 />}
        {step === 8 && <Section3 />}
        {step === 9 && <Section4 />}
        {step === 10 && <Section5 upgradeUrl={upgradeUrl} isFullUser={tier === "full"} />}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-16 pt-8 border-t border-white/8">
          {step > 1 ? (
            <button onClick={goPrev} className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Partie précédente
            </button>
          ) : <div />}

          {step < 10 ? (
            <button
              onClick={goNext}
              className="group flex items-center gap-2 px-6 py-3 bg-[#e8d5b0] text-[#0e0e0f] font-semibold text-sm rounded-xl hover:bg-[#f0dfc0] transition-all duration-200 shadow-[0_0_24px_rgba(232,213,176,0.2)] hover:shadow-[0_0_36px_rgba(232,213,176,0.35)]"
            >
              Partie suivante
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          ) : (
            tier !== "full" && <div />
          )}
        </div>
      </div>
    </main>
  );
}
