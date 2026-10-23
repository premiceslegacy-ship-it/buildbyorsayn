import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NavBar } from "@/components/NavBar";
import { DaRoot } from "@/components/da/DaRoot";
import { ReaderView } from "@/components/reader/ReaderView";
import { parseReaderMode } from "@/components/reader/readerModel";
import { VideoCard } from "@/components/VideoCard";
import { PHASES } from "@/lib/protocoleContent";
import { ProtocolePipelineDiagram, LocataireVsCapitalDiagram } from "./diagrams";
import { normalizeProfileTier } from "@/lib/mcpAccess";

export const metadata = {
  title: "Le protocole zéro : BUILD by Orsayn",
  description: "De zéro compétence à antifragile numérique. La méthode en trois phases pour construire du capital organique avec l'IA.",
};

const REFERENCE_BOOKS = [
  {
    author: "Médias et outils",
    title: "Understanding Media",
    note: "Un outil ne se contente pas de t'aider. Il change aussi ta façon de travailler.",
    cover: "/assets/protocole-references/marshall-mcluhan-understanding-media.jpg",
  },
  {
    author: "Autonomie et outils",
    title: "Tools for Conviviality",
    note: "Un bon outil doit augmenter ton autonomie, pas organiser ta dépendance.",
    cover: "/assets/protocole-references/ivan-illich-tools-for-conviviality.jpg",
  },
  {
    author: "Capital humain",
    title: "Human Capital",
    note: "Une compétence devient un actif quand elle continue de produire de la valeur.",
    cover: "/assets/protocole-references/gary-becker-human-capital.jpg",
  },
  {
    author: "Adaptation au changement",
    title: "Antifragile",
    note: "Le but n'est pas seulement de résister aux changements, mais d'en sortir plus fort.",
    cover: "/assets/protocole-references/nassim-taleb-antifragile.jpg",
  },
];

export default async function ProtocolePage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const query = await searchParams;
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

  const userTier = normalizeProfileTier(profile?.tier ?? null);

  if (userTier !== "beginner" && userTier !== "full") {
    redirect("/checkout");
  }

  const email = user.email ?? "";
  const displayName =
    (user.user_metadata?.first_name as string) ||
    (user.user_metadata?.full_name as string)?.split(" ")[0] ||
    email.split("@")[0];
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <DaRoot className="da-app has-tabbar">
      <NavBar
        activeLink="protocole"
        tier={userTier}
        isAdmin={user.app_metadata?.role === "admin"}
        displayName={displayName}
        displayEmail={email}
        initials={initials}
      />
      <ReaderView
        title="Le protocole zéro"
        toolbarTitle="Le protocole zéro"
        backLabel="Protocole"
        backHref="/programme"
        initialMode={parseReaderMode(query.mode)}
        sections={[{
          id: "protocole-zero",
          number: "01",
          title: "Le protocole zéro",
          summary: "Tu absorbes une compétence, tu la confrontes au terrain, puis tu gardes ce qui fonctionne dans un système que tu contrôles.",
          hideArticleHeader: true,
          video: <VideoCard title="Le protocole zéro" youtubeId="tcFGu_zNsPE" description="La méthode complète, de l’absorption à la distillation." />,
          content: <div className="flex flex-col gap-20 sm:gap-28">
          <header id="introduction" className="scroll-mt-24 flex flex-col gap-5 max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-[var(--em)]">
              LE PROTOCOLE ZÉRO
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold leading-[1.08] text-[var(--encre)]">
              Pendant que les autres louent leur intelligence, tu la distilles.
            </h1>
            <p className="text-[var(--t2)] text-base leading-relaxed max-w-2xl">
              La plupart des gens utilisent l&apos;IA sans la comprendre, sans la posséder et sans construire d&apos;infrastructure à eux. Ils louent des pioches puissantes. Quand l&apos;outil change, ils repartent de zéro.
            </p>
            <p className="text-[var(--t2)] text-base leading-relaxed max-w-2xl">
              La bonne stratégie n&apos;est pas de consommer toujours plus de puissance. C&apos;est de transformer ce que tu apprends en compétences, en méthodes et en systèmes que tu peux garder, améliorer et réutiliser.
            </p>
          </header>

          <section id="these" className="scroll-mt-24 flex flex-col gap-7">
            <div className="flex flex-col gap-3 max-w-3xl">
              <p className="text-xs font-semibold tracking-[0.18em] text-[var(--em)]">LA THÈSE</p>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--encre)]">
                Le même outil peut créer une dépendance ou un actif.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 border-y border-white/[0.1]">
              <article className="py-6 sm:pr-8 sm:border-r border-white/[0.1]">
                <p className="text-sm font-semibold text-white/65 mb-3">LE LOCATAIRE NUMÉRIQUE</p>
                <p className="text-sm text-[var(--t2)] leading-relaxed">
                  Il utilise des outils puissants sans garder ce qu&apos;ils lui ont appris. Quand l&apos;outil disparaît, son savoir-faire disparaît avec lui. Comme quelqu&apos;un qui loue tout son atelier et ne possède aucune de ses machines.
                </p>
              </article>
              <article className="py-6 sm:pl-8">
                <p className="text-sm font-semibold text-[var(--em)] mb-3">LE CAPITAL ORGANIQUE</p>
                <p className="text-sm text-[var(--t1)] leading-relaxed">
                  Il transforme chaque session en méthode, chaque vente en expérience et chaque expérience en système. Les outils peuvent changer, mais ce qui a été appris reste disponible et continue de s&apos;accumuler.
                </p>
              </article>
            </div>

            <p className="text-sm text-[var(--t2)] leading-relaxed max-w-2xl">
              La différence ne vient donc pas du modèle utilisé. Elle vient de ce que tu gardes une fois la session terminée. Tu peux laisser l&apos;IA faire le travail à ta place, ou lui faire t&apos;aider à construire une façon de travailler qui t&apos;appartient.
            </p>
            <LocataireVsCapitalDiagram />
            <p className="text-sm text-[var(--t2)] italic leading-[1.7] max-w-2xl">
              « Nous façonnons nos outils, puis nos outils nous façonnent. » La distillation consiste à garder la main sur cette relation : tu formes l&apos;outil avant qu&apos;il ne forme tes habitudes.
            </p>
          </section>

          <section id="references" className="scroll-mt-24 flex flex-col gap-7">
            <div className="flex flex-col gap-3 max-w-3xl">
              <p className="text-xs font-semibold tracking-[0.18em] text-[var(--em)]">LES RÉFÉRENCES</p>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--encre)]">
                Les idées derrière le protocole
              </h2>
              <p className="text-sm sm:text-base text-[var(--t2)] leading-relaxed">
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
                    <p className="text-xs font-semibold text-[var(--encre)] leading-snug">{book.title}</p>
                    <p className="mt-1 text-[11px] text-[var(--em)]/80">{book.author}</p>
                    <p className="mt-2 text-[11px] leading-relaxed text-white/40">{book.note}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section id="phases" className="scroll-mt-24 flex flex-col gap-14">
            <div className="flex flex-col gap-4 max-w-3xl">
              <p className="text-xs font-semibold tracking-[0.18em] text-[var(--em)]">LES TROIS PHASES</p>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--encre)]">
                Tu absorbes, tu produis, tu distilles.
              </h2>
              <p className="text-sm sm:text-base text-[var(--t2)] leading-relaxed">
                Chaque phase prépare la suivante. Tu ne construis pas un système dans le vide : tu apprends, tu le mets à l&apos;épreuve avec de vrais problèmes, puis tu gardes ce qui fonctionne.
              </p>
              <ProtocolePipelineDiagram />
            </div>

            <div className="flex flex-col gap-16">
              {PHASES.map((phase) => (
                <section key={phase.num} id={`phase-${phase.num}`} className="scroll-mt-24 border-t border-white/[0.1] pt-8 sm:pt-10">
                  <div className="flex items-start gap-5 sm:gap-7">
                    <span className="text-5xl sm:text-7xl font-light tabular-nums leading-none tracking-tighter bg-gradient-to-b from-[var(--em)] to-[var(--em)]/40 bg-clip-text text-transparent select-none">
                      {phase.num}
                    </span>
                    <div className="flex flex-col gap-2 pt-1">
                      <h3 className="text-2xl sm:text-3xl font-semibold text-[var(--encre)] tracking-tight">{phase.titre}</h3>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-medium text-[var(--sur-em)] bg-[var(--em)] rounded-full px-2.5 py-1">{phase.label.toUpperCase()}</span>
                        <span className="text-xs text-[var(--t2)]">{phase.duree}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] gap-8 sm:gap-12">
                    <div className="flex flex-col gap-2">
                      <p className="text-[11px] text-[var(--em)]/75 tracking-[0.16em] font-semibold">LE POINT DE DÉPART</p>
                      <p className="text-[15px] text-[var(--t2)] leading-[1.7]">{phase.douleur}</p>
                    </div>
                    <div className="flex flex-col gap-3.5">
                      <p className="text-[11px] text-[var(--em)] tracking-[0.16em] font-semibold">CE QUE TU FAIS</p>
                      {phase.solution.map((paragraph, i) => (
                        <p key={i} className="text-[15px] text-[var(--t1)] leading-[1.75]">{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  <p className="mt-7 text-sm text-[var(--t2)] italic leading-[1.7] max-w-3xl">
                    « {phase.citation} »
                  </p>
                </section>
              ))}
            </div>
          </section>

          <section id="etat-final" className="scroll-mt-24 flex flex-col gap-8 border-t border-white/[0.1] pt-10">
            <div className="flex items-start gap-5 sm:gap-7">
              <span className="text-5xl sm:text-7xl font-light leading-none bg-gradient-to-b from-[var(--em)] to-[var(--em)]/40 bg-clip-text text-transparent select-none">∞</span>
              <div className="flex flex-col gap-2 pt-1">
                <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--encre)] tracking-tight">L&apos;état final</h2>
                <span className="text-xs font-medium text-[var(--sur-em)] bg-[var(--em)] rounded-full px-2.5 py-1 w-fit">ANTIFRAGILE NUMÉRIQUE</span>
              </div>
            </div>

            <p className="text-[15px] text-[var(--t1)] leading-[1.75] max-w-3xl">
              Un système fragile se brise quand le contexte change. Un système robuste encaisse sans bouger. Un système antifragile apprend du changement et en sort plus fort. Le capital organique suit cette logique : une nouvelle version d&apos;un modèle, une nouvelle règle ou une plateforme qui ferme devient une occasion d&apos;améliorer tes propres méthodes.
            </p>

            <div className="divide-y divide-[var(--em)]/10 border-y border-[var(--em)]/10">
              {[
                { num: "01", titre: "Des lignes verticales", desc: "Tu peux lancer des offres dans des niches précises avec des systèmes déjà éprouvés." },
                { num: "02", titre: "Des actifs réels", desc: "Tu transformes le cashflow en temps, en pierre, en parts ou en autres actifs que tu contrôles." },
                { num: "03", titre: "Plus de choix", desc: "Tu ne dépends plus d'un seul outil, d'une seule plateforme ou d'une seule façon de travailler." },
              ].map((item) => (
                <div key={item.titre} className="flex items-start gap-4 py-5">
                  <span className="text-lg font-light tabular-nums leading-none text-[var(--em)]/50 pt-0.5">{item.num}</span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--encre)] mb-1">{item.titre}</p>
                    <p className="text-xs text-[var(--t2)] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="suite" className="scroll-mt-24 flex flex-col gap-5">
            <div>
              <p className="text-[var(--encre)] font-semibold text-lg mb-2">BUILD contient les outils pour chaque phase.</p>
              <p className="text-[var(--t2)] text-sm leading-relaxed">
                Les skills, frameworks, systèmes et méthodes pour apprendre plus vite, vendre sur le terrain et transformer ce qui fonctionne en capital organique.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-[var(--em)] hover:bg-[var(--em)] text-[var(--sur-em)] font-semibold text-sm px-6 py-3 rounded-lg w-fit transition-all duration-[80ms] shadow-[0_4px_0_rgba(140,110,65,0.9),0_6px_16px_rgba(0,0,0,0.35)] active:translate-y-[3px] active:shadow-[0_1px_0_rgba(140,110,65,0.9),0_2px_6px_rgba(0,0,0,0.2)]"
            >
              Aller au dashboard
            </Link>
          </section>
          </div>,
        }]}
      />
    </DaRoot>
  );
}
