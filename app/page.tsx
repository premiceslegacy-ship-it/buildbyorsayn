"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Logo } from "@/components/Logo";

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
          J'ai deja un compte
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
              Ce n'est pas une formation.<br />
              C'est une bibliotheque d'execution.
            </h1>
            <p className="text-[#8a8070] text-base leading-relaxed max-w-xl">
              Les fichiers, frameworks, skills et prompts que j'utilise pour construire mes lignes verticales IA. Tu repars avec des systemes prets a copier et a deployer sur tes propres projets.
            </p>
          </div>

          {/* Separateur */}
          <div className="h-px bg-[#2a2520]" />

          {/* Pour qui / Pas pour qui */}
          <div className="flex flex-col gap-8">
            <h2 className="text-xs font-semibold uppercase tracking-[3px] text-[#c9b48a]">
              Pour qui
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4">
                <p className="text-sm font-medium text-[#f0ede8]">Tu es au bon endroit si</p>
                <ul className="flex flex-col gap-3">
                  {[
                    "Tu as deja un projet, une verticale ou un premier client",
                    "Tu construis des choses concretement - apps, agents, SaaS, automatisations",
                    "Tu cherches a aller plus vite, pas a comprendre si c'est possible",
                    "Tu es pret a executer cette semaine, pas dans six mois",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-[#8a8070]">
                      <span className="text-[#c9b48a] mt-0.5 flex-shrink-0">+</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-sm font-medium text-[#f0ede8]">Ce n'est pas pour toi si</p>
                <ul className="flex flex-col gap-3">
                  {[
                    "Tu cherches encore \"comment gagner de l'argent avec l'IA\"",
                    "Tu attends que l'IA fasse tout a ta place sans que tu comprennes rien",
                    "Tu n'as pas de projet concret a builder cette semaine",
                    "Tu veux une formation pas a pas avec de la main courante",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-[#8a8070]">
                      <span className="text-[#30261c] mt-0.5 flex-shrink-0 text-[#555]">x</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Separateur */}
          <div className="h-px bg-[#2a2520]" />

          {/* Temoignage */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-semibold uppercase tracking-[3px] text-[#c9b48a]">
              Ce que ca produit
            </h2>
            <blockquote className="border-l-2 border-[#c9b48a] pl-5 flex flex-col gap-3">
              <p className="text-[#c4b89a] text-sm leading-relaxed italic">
                "BUILD m'a permis de vraiment comprendre le business IA avec beaucoup de pratique. Je suis passe de savoir faire a montrer que je sais faire. Maintenant j'ai des clients, des commandes, des contacts pour tester mes SaaS et applications."
              </p>
              <footer className="text-xs text-[#8a8070]">
                Membre BUILD, premieres ventes en 2 semaines
              </footer>
            </blockquote>
          </div>

          {/* Separateur */}
          <div className="h-px bg-[#2a2520]" />

          {/* CTA */}
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[#8a8070]">
              Si tu te reconnais dans la premiere colonne, la suite est la.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-[#c9b48a] hover:bg-[#e8d5b0] text-[#0e0e0f] font-semibold text-sm px-6 py-3 rounded-lg transition-colors w-fit"
            >
              Acceder a BUILD
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
