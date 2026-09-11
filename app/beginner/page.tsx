"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import { createClient } from "@/lib/supabase/client";
import { getCheckoutUrls } from "@/app/actions/getCheckoutUrls";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { HermesInstall } from "@/components/HermesInstall";
import { FoundationSection } from "./FoundationSection";

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
  {
    id: "mindset",
    num: "01",
    label: "L'état d'esprit qui fait l'argent",
    summary: "Avant la technique, avant les outils, il y a la tête. Ces principes ne changent pas dans le temps.",
    Component: SectionMindset,
  },
  {
    id: "psychologie",
    num: "02",
    label: "Comprendre les gens",
    summary: "On répète qu'il faut résoudre un problème. C'est vrai, mais c'est incomplet.",
    Component: SectionPsychologie,
  },
  {
    id: "copywriting",
    num: "03",
    label: "Écrire pour vendre",
    summary: "Le copywriting, c'est l'art d'écrire pour vendre. Pas pour faire joli.",
    Component: SectionCopywriting,
  },
  {
    id: "vente",
    num: "04",
    label: "Vendre",
    summary: "La vente fait peur parce qu'on l'imagine comme du baratin de marchand de tapis. C'est l'inverse.",
    Component: SectionVente,
  },
  {
    id: "marketing",
    num: "05",
    label: "Capter l'attention",
    summary: "Le meilleur produit du monde ne sert à rien si personne ne le connaît.",
    Component: SectionMarketing,
  },
  {
    id: "penser",
    num: "06",
    label: "Penser avant de construire",
    summary: "Avant de toucher un seul outil, je pose le cadre. C'est l'étape que tout le monde saute.",
    Component: Section1,
  },
  {
    id: "environnement",
    num: "07",
    label: "Comprendre l'environnement",
    summary: "Pas besoin d'être développeur. Mais comprendre les bases change radicalement la qualité des résultats.",
    Component: Section2,
  },
  {
    id: "visuels",
    num: "08",
    label: "Générer des visuels pro",
    summary: "Créer une direction visuelle cohérente avec le message, la conversion et le design system.",
    Component: Section3,
  },
  {
    id: "url",
    num: "09",
    label: "De l'idée à l'URL en ligne",
    summary: "La section la plus concrète. À la fin, tu sais mettre un site en ligne, même si tu n'as jamais codé.",
    Component: Section4,
  },
] as const;

export default function BeginnerPage() {
  const router = useRouter();
  const [tier, setTier] = useState<string | null>(null);
  const [upgradeUrl, setUpgradeUrl] = useState<string>("#");
  const [displayEmail, setDisplayEmail] = useState<string>("");
  const [openId, setOpenId] = useState<string | null>("mindset");

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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pb-32 relative z-10">
        <div className="pt-6 mb-10">
          <p className="text-xs uppercase tracking-[0.15em] text-[#e8d5b0]/60 font-semibold">Fondations</p>
          <p className="mt-2 text-sm text-white/40 leading-relaxed max-w-xl">
            Les dix blocs, dans l'ordre d'apprentissage. Ouvre celui dont tu as besoin, referme-le pour passer au suivant.
          </p>
        </div>

        <div className="mb-16">
          <HermesInstall />
        </div>

        <div className="flex flex-col gap-3">
          {SECTIONS.map(({ id, num, label, summary, Component }) => (
            <section key={id} id={id} className="scroll-mt-24">
              <FoundationSection
                num={num}
                title={label}
                summary={summary}
                isOpen={openId === id}
                onToggle={() => setOpenId((current) => (current === id ? null : id))}
              >
                <Component />
              </FoundationSection>
            </section>
          ))}
          <section id="angle-mort" className="scroll-mt-24">
            <FoundationSection
              num="10"
              title="Le seuil"
              summary="Tu as les Fondations entre les mains. Regarde maintenant ce qui te fait sortir de la dépendance pour de bon."
              isOpen={openId === "angle-mort"}
              onToggle={() => setOpenId((current) => (current === "angle-mort" ? null : "angle-mort"))}
            >
              <Section5 upgradeUrl={upgradeUrl} isFullUser={tier === "full"} />
            </FoundationSection>
          </section>
        </div>
      </div>

      <ScrollProgress
        sections={[...SECTIONS.map((s) => ({ id: s.id, label: s.label })), { id: "angle-mort", label: "L'angle mort" }]}
      />
      <ScrollToTop />
    </main>
  );
}
