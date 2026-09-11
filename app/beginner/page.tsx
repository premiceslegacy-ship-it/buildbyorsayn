"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import { createClient } from "@/lib/supabase/client";
import { getCheckoutUrls } from "@/app/actions/getCheckoutUrls";
import { ScrollProgress } from "@/components/ui/scroll-progress";

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

const SECTIONS = [
  { id: "mindset", label: "L'état d'esprit qui fait l'argent", Component: SectionMindset },
  { id: "psychologie", label: "Comprendre les gens", Component: SectionPsychologie },
  { id: "copywriting", label: "Écrire pour vendre", Component: SectionCopywriting },
  { id: "vente", label: "Vendre", Component: SectionVente },
  { id: "marketing", label: "Capter l'attention", Component: SectionMarketing },
  { id: "penser", label: "Penser avant de construire", Component: Section1 },
  { id: "environnement", label: "Comprendre l'environnement", Component: Section2 },
  { id: "visuels", label: "Générer des visuels pro", Component: Section3 },
  { id: "url", label: "De l'idée à l'URL en ligne", Component: Section4 },
] as const;

export default function BeginnerPage() {
  const router = useRouter();
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
        <div className="pt-6 mb-14">
          <p className="text-xs uppercase tracking-[0.15em] text-[#e8d5b0]/60 font-semibold">Fondations</p>
          <p className="mt-2 text-sm text-white/40 leading-relaxed max-w-xl">
            Les dix blocs, dans l'ordre d'apprentissage. Lis-les à la suite ou saute directement à celui dont tu as besoin.
          </p>
        </div>

        <div className="flex flex-col gap-20">
          {SECTIONS.map(({ id, Component }) => (
            <section key={id} id={id} className="scroll-mt-24">
              <Component />
            </section>
          ))}
          <section id="angle-mort" className="scroll-mt-24">
            <Section5 upgradeUrl={upgradeUrl} isFullUser={tier === "full"} />
          </section>
        </div>
      </div>

      <ScrollProgress
        sections={[...SECTIONS.map((s) => ({ id: s.id, label: s.label })), { id: "angle-mort", label: "L'angle mort" }]}
      />
    </main>
  );
}
