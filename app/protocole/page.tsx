import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ExternalLink, Play } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { LiquidCard } from "@/components/ui/liquid-glass-card";

export const metadata = {
  title: "Le Protocole Zéro : BUILD by Orsayn",
  description: "De zéro compétence à antifragile numérique. La méthode en trois phases pour construire du capital organique avec l'IA.",
};

const PHASES = [
  {
    num: "01",
    titre: "L'Absorption",
    label: "La Méthode Sharingan",
    duree: "2 à 4 semaines",
    douleur: "Tu pars de zéro. Les compétences des meilleurs te semblent inaccessibles. Tu n'as pas des années devant toi pour les acquérir.",
    solution:
      "Tu ne les acquiers pas. Tu les greffes. Dans Naruto, le Sharingan est un œil qui copie une technique observée et la rend permanente. C'est exactement ce mécanisme. Tu identifies les compétences cibles : copywriting, design, vente, développement web. Tu récupères les meilleures sources disponibles : vidéos YouTube, PDFs, articles des experts du domaine. Tu les charges dans NotebookLM, tu extrais les principes, les frameworks, les erreurs à éviter. Tu encodes tout ça dans des skills. Des fichiers structurés qui t'appartiennent. Pas loués. Pas empruntés.",
    output: "Une bibliothèque de compétences greffées, encodée en skills réutilisables.",
    citation: "McLuhan avait raison : nous façonnons nos outils, puis nos outils nous façonnent. La Méthode Sharingan inverse le rapport. C'est toi qui formes l'outil.",
  },
  {
    num: "02",
    titre: "Le Sprint Cash",
    label: "Premiers 10k€",
    duree: "3 à 6 mois",
    douleur: "Tu as des compétences. Tu n'as pas encore de cashflow. Sans une base financière, tout le reste est fragile.",
    solution:
      "Tes skills greffés plus les pioches en leasing disponibles, Claude, ChatGPT et les meilleurs modèles IA actuels, te permettent de produire à un niveau qui était inaccessible il y a trois ans. Tu utilises cette puissance pour générer du cash rapidement. Peu importe le format : création de sites à 500-1000€, automatisations pour des niches locales, services répétables dans un secteur précis, SaaS simple validé avec un client avant d'être construit. L'objectif n'est pas de construire l'entreprise parfaite. L'objectif est une dignité financière de base, l'équivalent d'un à deux ans de salaire d'un cadre dynamique. Une fois ce coussin en place, tout le reste devient possible.",
    output: "Premier cashflow, expérience terrain, patterns identifiés, process qui se répètent.",
    citation: "En phase 2, tu es locataire numérique volontaire et temporaire. Tu utilises les pioches en leasing sciemment, en sachant que c'est transitoire. Tu prépares ta phase 3 pendant que tu sprintes.",
  },
  {
    num: "03",
    titre: "La Grande Distillation",
    label: "Capital organique",
    duree: "Continu, s'améliore dans le temps",
    douleur: "Tu as du cash. Tu as de l'expérience. Mais tout ça est dans ta tête et dans des process informels. Si les outils changent, tu dois recommencer. Si tu veux déléguer, tu ne peux pas.",
    solution:
      "Tu distilles. Tout ce que tu as appris en phase 2, les process qui ont fonctionné, les patterns de vente, les architectures techniques, les objections clients, tu l'encodes dans des systèmes qui t'appartiennent. Des SOPs claires pour chaque tâche répétitive. Des skills encodés dans des fichiers markdown structurés : un skill par compétence maîtrisée. Un second cerveau IA construit sur tes données réelles, pas sur des bases génériques. Gary Becker appelait ça le capital humain : l'investissement en formation qui génère des rendements durables. C'est ça, mais en version 2.0. Ton expertise encodée dans des systèmes qui travaillent sans toi, qui se répliquent, qui s'améliorent par la donnée.",
    output: "Capital organique constitué. Infrastructure IA personnelle. Indépendance des plateformes.",
    citation: "Ce qui est distillé ne peut pas être retiré. Personne ne peut supprimer ton skill de vente, ton process de livraison, ton second cerveau IA. Il t'appartient entièrement.",
  },
];

export default async function ProtocolePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .single();

  const userTier = profile?.tier ?? null;

  if (userTier !== "full" && userTier !== "beginner" && userTier !== "admin") {
    redirect("/checkout");
  }

  const email = user.email ?? "";
  const displayName =
    (user.user_metadata?.first_name as string) ||
    (user.user_metadata?.full_name as string)?.split(" ")[0] ||
    email.split("@")[0];
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8] flex flex-col relative overflow-hidden">
      {/* Halos */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(232,213,176,0.05),transparent_70%)] blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(50,80,200,0.04),transparent_70%)] blur-[80px] pointer-events-none" />

      <NavBar
        activeLink="protocole"
        tier={userTier}
        displayName={displayName}
        displayEmail={email}
        initials={initials}
      />

      <div className="flex-1 px-6 sm:px-12 pb-24 relative z-10">
        <div className="max-w-2xl mx-auto flex flex-col gap-20 pt-8">

          {/* Hero */}
          <div className="flex flex-col gap-5">
            <p className="text-xs font-semibold uppercase tracking-[3px] text-[#c9b48a]">
              Le Protocole Zéro
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-[#f0ede8]">
              Pendant que les autres louent leur intelligence,<br className="hidden sm:block" />
              toi tu la distilles.
            </h1>
            <p className="text-[#8a8070] text-base leading-relaxed max-w-xl">
              La plupart des gens utilisent l&apos;IA sans la comprendre, sans la posséder, sans construire d&apos;infrastructure propre. Ils optimisent des pioches en leasing. Quand les outils changent, régulation, arrêt de modèle, décision de plateforme, ils redeviennent zéro.
            </p>
            <p className="text-[#8a8070] text-base leading-relaxed max-w-xl">
              La bonne stratégie pendant la fenêtre actuelle n&apos;est pas de consommer plus de puissance IA. C&apos;est de distiller. Encoder ses compétences, ses processus, ses systèmes dans une infrastructure qu&apos;on possède réellement.
            </p>
          </div>

          {/* La thèse */}
          <div className="flex flex-col gap-6">
            <h2 className="text-xs font-semibold uppercase tracking-[3px] text-[#c9b48a]">
              La thèse
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <LiquidCard className="p-6">
                <p className="text-xs text-[#c9b48a] uppercase tracking-[2px] font-medium mb-3">Le locataire numérique</p>
                <p className="text-sm text-[#8a8070] leading-relaxed">
                  Utilise des outils IA puissants qu&apos;il ne comprend pas, ne possède pas et ne maîtrise pas. Quand les outils changent, il recommence à zéro. Illich avait nommé ça la contre-productivité : l&apos;outil crée la dépendance au lieu de l&apos;autonomie.
                </p>
              </LiquidCard>
              <LiquidCard className="p-6">
                <p className="text-xs text-[#c9b48a] uppercase tracking-[2px] font-medium mb-3">Le capital organique</p>
                <p className="text-sm text-[#c4b89a] leading-relaxed">
                  Ce qu&apos;on construit par la distillation. L&apos;expertise encodée, les systèmes documentés, la data propriétaire. S&apos;accumule dans le temps. Résiste aux changements d&apos;outils. Appartient entièrement à son propriétaire.
                </p>
              </LiquidCard>
            </div>
            <LiquidCard className="p-5">
              <p className="text-sm text-[#8a8070] leading-relaxed italic">
                &ldquo;Nous façonnons nos outils, puis nos outils nous façonnent.&rdquo; Formule attribuée à John Culkin, dans la lignée de McLuhan. La distillation est l&apos;acte de garder la main sur cette co-évolution. Tu formes le modèle avant qu&apos;il te forme.
              </p>
            </LiquidCard>
          </div>

          <div className="h-px bg-[#2a2520]" />

          {/* Les 3 phases */}
          <div className="flex flex-col gap-14">
            <h2 className="text-xs font-semibold uppercase tracking-[3px] text-[#c9b48a]">
              Les trois phases
            </h2>

            {PHASES.map((phase, idx) => (
              <div key={phase.num} className="flex flex-col gap-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-[#c9b48a]/40 font-mono font-bold text-2xl">{phase.num}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-[#f0ede8]">{phase.titre}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-[#c9b48a] opacity-70">{phase.label}</span>
                      <span className="text-xs text-[#555]">·</span>
                      <span className="text-xs text-[#555]">{phase.duree}</span>
                    </div>
                  </div>
                </div>

                <LiquidCard className="p-5">
                  <p className="text-xs text-[#c9b48a]/60 uppercase tracking-[2px] font-medium mb-2">La douleur</p>
                  <p className="text-sm text-[#8a8070] leading-relaxed">{phase.douleur}</p>
                </LiquidCard>

                <div className="flex flex-col gap-2">
                  <p className="text-xs text-[#c9b48a] uppercase tracking-[2px] font-medium">La réponse</p>
                  <p className="text-sm text-[#c4b89a] leading-relaxed">{phase.solution}</p>
                </div>

                <LiquidCard className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-[#c9b48a] text-xs font-semibold uppercase tracking-[2px] flex-shrink-0 mt-0.5">Output</span>
                    <p className="text-sm text-[#8a8070]">{phase.output}</p>
                  </div>
                </LiquidCard>

                <p className="text-xs text-[#8a8070] italic border-l-2 border-[#c9b48a]/30 pl-3 leading-relaxed">
                  {phase.citation}
                </p>

                {idx < PHASES.length - 1 && <div className="h-px bg-[#2a2520] mt-4" />}
              </div>
            ))}
          </div>

          {/* État final */}
          <div className="flex flex-col gap-6">
            <div className="flex items-baseline gap-3">
              <span className="text-[#c9b48a]/40 font-mono font-bold text-2xl">∞</span>
              <div>
                <h3 className="text-xl font-semibold text-[#f0ede8]">L&apos;état final</h3>
                <span className="text-xs text-[#c9b48a] opacity-70">Antifragile numérique</span>
              </div>
            </div>

            <p className="text-sm text-[#c4b89a] leading-relaxed">
              Taleb distingue trois types de systèmes : le fragile qui se brise sous le stress, le robuste qui résiste sans en bénéficier, et l&apos;antifragile qui gagne en force sous la volatilité. Le capital organique est antifragile par construction. Chaque changement de modèle IA, chaque régulation, chaque disruption de plateforme renforce tes systèmes au lieu de les détruire.
            </p>

            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { titre: "Lignes verticales IA", desc: "Tu lances des verticales dans des niches précises avec tes systèmes." },
                { titre: "Investissement réel", desc: "Pierre, équity, actifs physiques. Tu joues sur plusieurs terrains." },
                { titre: "Liberté totale", desc: "Tu ne subis plus rien. Tu choisis." },
              ].map((item) => (
                <LiquidCard key={item.titre} className="p-5">
                  <p className="text-sm font-semibold text-[#f0ede8] mb-2">{item.titre}</p>
                  <p className="text-xs text-[#8a8070] leading-relaxed">{item.desc}</p>
                </LiquidCard>
              ))}
            </div>
          </div>

          <div className="h-px bg-[#2a2520]" />

          {/* Vidéo liée */}
          <LiquidCard className="p-5">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[#e8d5b0]/20 bg-[#e8d5b0]/10">
                  <Play className="h-4 w-4 text-[#e8d5b0]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#f0ede8]">Voir la vidéo du Protocole Zéro</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#8a8070]">
                    La version vidéo complète est disponible dans la bibliothèque.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/videos#fondations"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#c9b48a] px-4 py-2.5 text-sm font-semibold text-[#0e0e0f] transition-colors hover:bg-[#e8d5b0]"
                >
                  Ouvrir dans BUILD
                  <Play className="h-3.5 w-3.5" />
                </Link>
                <a
                  href="https://www.youtube.com/watch?v=tcFGu_zNsPE"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white/75"
                >
                  YouTube
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </LiquidCard>

          <div className="h-px bg-[#2a2520]" />

          {/* CTA */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-[#f0ede8] font-semibold text-lg mb-2">
                BUILD contient les assets pour chaque phase.
              </p>
              <p className="text-[#8a8070] text-sm leading-relaxed">
                Les skills, frameworks, systèmes et méthodes pour construire du capital organique. Tout est dans les blocs.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-[#c9b48a] hover:bg-[#e8d5b0] text-[#0e0e0f] font-semibold text-sm px-6 py-3 rounded-lg w-fit transition-all duration-[80ms] shadow-[0_4px_0_rgba(140,110,65,0.9),0_6px_16px_rgba(0,0,0,0.35)] active:translate-y-[3px] active:shadow-[0_1px_0_rgba(140,110,65,0.9),0_2px_6px_rgba(0,0,0,0.2)]"
            >
              Aller au dashboard
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
