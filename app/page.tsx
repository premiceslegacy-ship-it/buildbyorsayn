import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { ProtocoleSlider } from "@/components/ui/protocole-slider";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8] flex flex-col relative overflow-hidden">
      {/* Halo ambiant */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(232,213,176,0.06),transparent_70%)] blur-[60px] pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 sm:px-12 sm:py-8 relative z-10">
        <Logo layout="horizontal" />
        <Link
          href="/login"
          className="text-sm text-[#c9b48a] hover:text-[#f0ede8] transition-colors"
        >
          J&apos;ai déjà un compte
        </Link>
      </header>

      {/* Contenu */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 sm:py-24 relative z-10">
        <div className="w-full max-w-2xl flex flex-col gap-16">

          {/* Accroche */}
          <div className="flex flex-col gap-5">
            <p className="text-xs font-semibold uppercase tracking-[3px] text-[#c9b48a]">
              BUILD by Orsayn
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-[#f0ede8]">
              Tu utilises l&apos;IA depuis des mois.<br />
              Tu n&apos;as toujours rien à toi.
            </h1>
            <p className="text-[#8a8070] text-base leading-relaxed max-w-xl">
              Build, c&apos;est la méthode pour arrêter de louer et commencer à posséder. Les fichiers, frameworks, skills et systèmes que j&apos;utilise pour construire mes lignes verticales IA. Tu repars avec du capital organique, pas des prompts jetables.
            </p>
          </div>

          {/* Séparateur */}
          <div className="h-px bg-[#2a2520]" />

          {/* Pour qui / Pas pour qui */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2 max-w-xl">
              <h2 className="text-xs font-semibold uppercase tracking-[3px] text-[#c9b48a]">
                Les builders qui sont déjà là
              </h2>
              <p className="text-[#f0ede8] text-2xl font-semibold leading-tight">
                Les builders qui sont déjà là ont ça en commun.
              </p>
              <p className="text-[#8a8070] text-sm leading-relaxed">
                Ils n&apos;attendent pas une permission. Ils construisent, ils vendent, puis ils distillent ce qui marche.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 items-start">
              <div className="flex flex-col gap-3 h-full">
                <p className="text-xs font-semibold text-[#c9b48a] uppercase tracking-[2px]">Pour toi</p>
                {[
                  "Tu as un projet, une verticale ou un premier client à faire avancer maintenant",
                  "Tu construis des choses concrètes : apps, agents, SaaS, automatisations",
                  "Tu veux aller plus vite en copiant des systèmes qui ont déjà fonctionné",
                  "Tu exécutes cette semaine, pas dans six mois",
                ].map((item, i) => (
                  <LiquidCard key={i} className="p-4 min-h-[96px]">
                    <div className="flex items-start gap-3">
                      <span className="grid size-7 place-items-center rounded-md bg-[#c9b48a] text-[#0e0e0f] font-bold text-xs flex-shrink-0 shadow-[0_2px_0_rgba(112,89,52,0.9),inset_0_1px_0_rgba(255,255,255,0.35)]">{i + 1}</span>
                      <span className="text-sm text-[#c4b89a] leading-relaxed">{item}</span>
                    </div>
                  </LiquidCard>
                ))}
              </div>

              <div className="flex flex-col gap-3 h-full">
                <p className="text-xs font-semibold text-[#8a8070] uppercase tracking-[2px]">Pas encore pour toi</p>
                {[
                  "Tu explores encore l'IA sans avoir choisi de projet à pousser",
                  "Tu veux attendre l'outil parfait avant de prendre une décision",
                  "Tu préfères consommer du contenu plutôt que publier, vendre ou livrer",
                  "Tu as besoin d'accompagnement quotidien avant de passer à l'action",
                ].map((item, i) => (
                  <LiquidCard key={i} className="p-4 min-h-[96px] opacity-65">
                    <div className="flex items-start gap-3">
                      <span className="grid size-7 place-items-center rounded-md border border-[#8a8070]/25 text-[#8a8070] font-bold text-xs flex-shrink-0">{i + 1}</span>
                      <span className="text-sm text-[#8a8070] leading-relaxed">
                        {item}. Les autres ont déjà sauté ce pas.
                      </span>
                    </div>
                  </LiquidCard>
                ))}
              </div>
            </div>

            {/* Stats social proof */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { chiffre: "2 semaines", label: "premières ventes" },
                { chiffre: "7 blocs", label: "méthode complète" },
                { chiffre: "1 système", label: "à copier, puis adapter" },
              ].map((stat) => (
                <LiquidCard key={stat.label} className="p-4 text-center">
                  <p className="text-[#c9b48a] font-bold text-sm sm:text-base">{stat.chiffre}</p>
                  <p className="text-[#8a8070] text-xs mt-1 leading-tight">{stat.label}</p>
                </LiquidCard>
              ))}
            </div>

            {/* Quote courte */}
            <p className="text-xs text-[#8a8070] italic border-l-2 border-[#c9b48a]/30 pl-3 leading-relaxed">
              &ldquo;Je suis passé de savoir faire à montrer que je sais faire. Premières ventes en 2 semaines.&rdquo;
            </p>

            <LiquidCard className="p-5">
              <blockquote className="flex flex-col gap-3">
                <p className="text-[#c4b89a] text-sm leading-relaxed italic">
                  &ldquo;BUILD m&apos;a permis de vraiment comprendre le business IA avec beaucoup de pratique. Je suis passé de savoir faire à montrer que je sais faire. Maintenant j&apos;ai des clients, des commandes, des contacts pour tester mes SaaS et applications.&rdquo;
                </p>
                <footer className="text-xs text-[#8a8070]">
                  Membre BUILD, premières ventes en 2 semaines
                </footer>
              </blockquote>
            </LiquidCard>
          </div>

          {/* Séparateur */}
          <div className="h-px bg-[#2a2520]" />

          {/* Le Protocole Zéro */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <h2 className="text-xs font-semibold uppercase tracking-[3px] text-[#c9b48a]">
                Le Protocole Zéro
              </h2>
              <p className="text-[#f0ede8] text-xl font-semibold leading-tight">
                De zéro à antifragile numérique.
              </p>
              <p className="text-[#8a8070] text-sm mt-1">
                Pas une promesse. Un chemin en trois phases.
              </p>
            </div>

            <ProtocoleSlider />
          </div>

          {/* Séparateur */}
          <div className="h-px bg-[#2a2520]" />

          {/* CTA */}
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[#8a8070]">
              Tu te reconnais dans la première colonne. La suite est là.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-[#c9b48a] hover:bg-[#e8d5b0] text-[#0e0e0f] font-semibold text-sm px-6 py-3 rounded-lg w-fit transition-all duration-[80ms] shadow-[0_4px_0_rgba(140,110,65,0.9),0_6px_16px_rgba(0,0,0,0.35)] active:translate-y-[3px] active:shadow-[0_1px_0_rgba(140,110,65,0.9),0_2px_6px_rgba(0,0,0,0.2)]"
            >
              Accéder à BUILD
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
