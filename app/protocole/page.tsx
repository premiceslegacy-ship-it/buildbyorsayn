import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Play } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { NavBar } from "@/components/NavBar";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { PHASES } from "@/lib/protocoleContent";
import { ProtocolePipelineDiagram, LocataireVsCapitalDiagram } from "./diagrams";

export const metadata = {
  title: "Le protocole zéro : BUILD by Orsayn",
  description: "De zéro compétence à antifragile numérique. La méthode en trois phases pour construire du capital organique avec l'IA.",
};

const REFERENCE_BOOKS = [
  {
    author: "Marshall McLuhan",
    title: "Understanding Media",
    note: "Un outil ne se contente pas de t'aider. Il change aussi ta façon de travailler.",
    cover: "/assets/protocole-references/marshall-mcluhan-understanding-media.jpg",
  },
  {
    author: "Ivan Illich",
    title: "Tools for Conviviality",
    note: "Un bon outil doit augmenter ton autonomie, pas organiser ta dépendance.",
    cover: "/assets/protocole-references/ivan-illich-tools-for-conviviality.jpg",
  },
  {
    author: "Gary Becker",
    title: "Human Capital",
    note: "Une compétence devient un actif quand elle continue de produire de la valeur.",
    cover: "/assets/protocole-references/gary-becker-human-capital.jpg",
  },
  {
    author: "Nassim Nicholas Taleb",
    title: "Antifragile",
    note: "Le but n'est pas seulement de résister aux changements, mais d'en sortir plus fort.",
    cover: "/assets/protocole-references/nassim-taleb-antifragile.jpg",
  },
];

export default async function ProtocolePage() {
  const supabase = await createClient();
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
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8] flex flex-col relative overflow-x-clip">
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
        <div className="max-w-4xl mx-auto flex flex-col gap-20 sm:gap-28 pt-12">
          <header id="introduction" className="scroll-mt-24 flex flex-col gap-5 max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#c9b48a]">
              LE PROTOCOLE ZÉRO
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold leading-[1.08] text-[#f0ede8]">
              Pendant que les autres louent leur intelligence, tu la distilles.
            </h1>
            <p className="text-[#8a8070] text-base leading-relaxed max-w-2xl">
              La plupart des gens utilisent l&apos;IA sans la comprendre, sans la posséder et sans construire d&apos;infrastructure à eux. Ils louent des pioches puissantes. Quand l&apos;outil change, ils repartent de zéro.
            </p>
            <p className="text-[#8a8070] text-base leading-relaxed max-w-2xl">
              La bonne stratégie n&apos;est pas de consommer toujours plus de puissance. C&apos;est de transformer ce que tu apprends en compétences, en méthodes et en systèmes que tu peux garder, améliorer et réutiliser.
            </p>
          </header>

          <section id="these" className="scroll-mt-24 flex flex-col gap-7">
            <div className="flex flex-col gap-3 max-w-3xl">
              <p className="text-xs font-semibold tracking-[0.18em] text-[#c9b48a]">LA THÈSE</p>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#f0ede8]">
                Le même outil peut créer une dépendance ou un actif.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 border-y border-white/[0.1]">
              <article className="py-6 sm:pr-8 sm:border-r border-white/[0.1]">
                <p className="text-sm font-semibold text-white/65 mb-3">LE LOCATAIRE NUMÉRIQUE</p>
                <p className="text-sm text-[#8a8070] leading-relaxed">
                  Il utilise des outils puissants sans garder ce qu&apos;ils lui ont appris. Quand l&apos;outil disparaît, son savoir-faire disparaît avec lui. Comme quelqu&apos;un qui loue tout son atelier et ne possède aucune de ses machines.
                </p>
              </article>
              <article className="py-6 sm:pl-8">
                <p className="text-sm font-semibold text-[#c9b48a] mb-3">LE CAPITAL ORGANIQUE</p>
                <p className="text-sm text-[#c4b89a] leading-relaxed">
                  Il transforme chaque session en méthode, chaque vente en expérience et chaque expérience en système. Les outils peuvent changer, mais ce qui a été appris reste disponible et continue de s&apos;accumuler.
                </p>
              </article>
            </div>

            <p className="text-sm text-[#8a8070] leading-relaxed max-w-2xl">
              La différence ne vient donc pas du modèle utilisé. Elle vient de ce que tu gardes une fois la session terminée. Tu peux laisser l&apos;IA faire le travail à ta place, ou lui faire t&apos;aider à construire une façon de travailler qui t&apos;appartient.
            </p>
            <LocataireVsCapitalDiagram />
            <p className="text-sm text-[#8a8070] italic leading-[1.7] max-w-2xl">
              « Nous façonnons nos outils, puis nos outils nous façonnent. » La distillation consiste à garder la main sur cette relation : tu formes l&apos;outil avant qu&apos;il ne forme tes habitudes.
            </p>
          </section>

          <section id="references" className="scroll-mt-24 flex flex-col gap-7">
            <div className="flex flex-col gap-3 max-w-3xl">
              <p className="text-xs font-semibold tracking-[0.18em] text-[#c9b48a]">LES RÉFÉRENCES</p>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#f0ede8]">
                Les idées derrière le protocole
              </h2>
              <p className="text-sm sm:text-base text-[#8a8070] leading-relaxed">
                Le protocole ne sort pas d&apos;un prompt. Il croise des idées sur les outils, l&apos;autonomie, l&apos;apprentissage et la façon de devenir plus solide quand le contexte change.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6">
              {REFERENCE_BOOKS.map((book) => (
                <figure key={book.title} className="group min-w-0">
                  <div className="relative aspect-[3/4.5] overflow-hidden border border-white/[0.1] bg-white/[0.03] shadow-[0_10px_28px_rgba(0,0,0,0.28)] transition-transform duration-300 group-hover:-translate-y-1">
                    <Image
                      src={book.cover}
                      alt={`Couverture de ${book.title}, ${book.author}`}
                      fill
                      sizes="(min-width: 640px) 160px, 42vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="pt-3">
                    <p className="text-xs font-semibold text-[#f0ede8] leading-snug">{book.title}</p>
                    <p className="mt-1 text-[11px] text-[#c9b48a]/80">{book.author}</p>
                    <p className="mt-2 text-[11px] leading-relaxed text-white/40">{book.note}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section id="phases" className="scroll-mt-24 flex flex-col gap-14">
            <div className="flex flex-col gap-4 max-w-3xl">
              <p className="text-xs font-semibold tracking-[0.18em] text-[#c9b48a]">LES TROIS PHASES</p>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#f0ede8]">
                Tu absorbes, tu produis, tu distilles.
              </h2>
              <p className="text-sm sm:text-base text-[#8a8070] leading-relaxed">
                Chaque phase prépare la suivante. Tu ne construis pas un système dans le vide : tu apprends, tu le mets à l&apos;épreuve avec de vrais problèmes, puis tu gardes ce qui fonctionne.
              </p>
              <ProtocolePipelineDiagram />
            </div>

            <div className="flex flex-col gap-16">
              {PHASES.map((phase) => (
                <section key={phase.num} id={`phase-${phase.num}`} className="scroll-mt-24 border-t border-white/[0.1] pt-8 sm:pt-10">
                  <div className="flex items-start gap-5 sm:gap-7">
                    <span className="text-5xl sm:text-7xl font-light tabular-nums leading-none tracking-tighter bg-gradient-to-b from-[#e8d5b0] to-[#c9b48a]/40 bg-clip-text text-transparent select-none">
                      {phase.num}
                    </span>
                    <div className="flex flex-col gap-2 pt-1">
                      <h3 className="text-2xl sm:text-3xl font-semibold text-[#f0ede8] tracking-tight">{phase.titre}</h3>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-medium text-[#0e0e0f] bg-[#c9b48a] rounded-full px-2.5 py-1">{phase.label.toUpperCase()}</span>
                        <span className="text-xs text-[#8a8070]">{phase.duree}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] gap-8 sm:gap-12">
                    <div className="flex flex-col gap-2">
                      <p className="text-[11px] text-[#c9b48a]/75 tracking-[0.16em] font-semibold">LE POINT DE DÉPART</p>
                      <p className="text-[15px] text-[#8a8070] leading-[1.7]">{phase.douleur}</p>
                    </div>
                    <div className="flex flex-col gap-3.5">
                      <p className="text-[11px] text-[#c9b48a] tracking-[0.16em] font-semibold">CE QUE TU FAIS</p>
                      {phase.solution.map((paragraph, i) => (
                        <p key={i} className="text-[15px] text-[#c4b89a] leading-[1.75]">{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  <p className="mt-7 text-sm text-[#8a8070] italic leading-[1.7] max-w-3xl">
                    « {phase.citation} »
                  </p>
                </section>
              ))}
            </div>
          </section>

          <section id="etat-final" className="scroll-mt-24 flex flex-col gap-8 border-t border-white/[0.1] pt-10">
            <div className="flex items-start gap-5 sm:gap-7">
              <span className="text-5xl sm:text-7xl font-light leading-none bg-gradient-to-b from-[#e8d5b0] to-[#c9b48a]/40 bg-clip-text text-transparent select-none">∞</span>
              <div className="flex flex-col gap-2 pt-1">
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#f0ede8] tracking-tight">L&apos;état final</h2>
                <span className="text-xs font-medium text-[#0e0e0f] bg-[#c9b48a] rounded-full px-2.5 py-1 w-fit">ANTIFRAGILE NUMÉRIQUE</span>
              </div>
            </div>

            <p className="text-[15px] text-[#c4b89a] leading-[1.75] max-w-3xl">
              Un système fragile se brise quand le contexte change. Un système robuste encaisse sans bouger. Un système antifragile apprend du changement et en sort plus fort. Le capital organique suit cette logique : une nouvelle version d&apos;un modèle, une nouvelle règle ou une plateforme qui ferme devient une occasion d&apos;améliorer tes propres méthodes.
            </p>

            <div className="divide-y divide-[#c9b48a]/10 border-y border-[#c9b48a]/10">
              {[
                { num: "01", titre: "Des lignes verticales", desc: "Tu peux lancer des offres dans des niches précises avec des systèmes déjà éprouvés." },
                { num: "02", titre: "Des actifs réels", desc: "Tu transformes le cashflow en temps, en pierre, en parts ou en autres actifs que tu contrôles." },
                { num: "03", titre: "Plus de choix", desc: "Tu ne dépends plus d'un seul outil, d'une seule plateforme ou d'une seule façon de travailler." },
              ].map((item) => (
                <div key={item.titre} className="flex items-start gap-4 py-5">
                  <span className="text-lg font-light tabular-nums leading-none text-[#c9b48a]/50 pt-0.5">{item.num}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#f0ede8] mb-1">{item.titre}</p>
                    <p className="text-xs text-[#8a8070] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="video" className="scroll-mt-24 border-y border-white/[0.1] py-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[#e8d5b0]/20 bg-[#e8d5b0]/10">
                  <Play className="h-4 w-4 text-[#e8d5b0]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#f0ede8]">Voir la vidéo du protocole zéro</p>
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
          </section>

          <section id="suite" className="scroll-mt-24 flex flex-col gap-5">
            <div>
              <p className="text-[#f0ede8] font-semibold text-lg mb-2">BUILD contient les outils pour chaque phase.</p>
              <p className="text-[#8a8070] text-sm leading-relaxed">
                Les skills, frameworks, systèmes et méthodes pour apprendre plus vite, vendre sur le terrain et transformer ce qui fonctionne en capital organique.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-[#c9b48a] hover:bg-[#e8d5b0] text-[#0e0e0f] font-semibold text-sm px-6 py-3 rounded-lg w-fit transition-all duration-[80ms] shadow-[0_4px_0_rgba(140,110,65,0.9),0_6px_16px_rgba(0,0,0,0.35)] active:translate-y-[3px] active:shadow-[0_1px_0_rgba(140,110,65,0.9),0_2px_6px_rgba(0,0,0,0.2)]"
            >
              Aller au dashboard
            </Link>
          </section>
        </div>
      </div>

      <ScrollProgress
        sections={[
          { id: "introduction", label: "INTRODUCTION" },
          { id: "these", label: "LA THÈSE" },
          { id: "references", label: "LES RÉFÉRENCES" },
          { id: "phases", label: "LES TROIS PHASES" },
          { id: "etat-final", label: "L'ÉTAT FINAL" },
          { id: "suite", label: "LA SUITE" },
        ]}
      />
      <ScrollToTop />
    </main>
  );
}
