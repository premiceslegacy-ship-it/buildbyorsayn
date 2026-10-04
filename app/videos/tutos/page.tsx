import Image from "next/image";
import "server-only";
import { Suspense } from "react";
import { chapterTitle } from "../../doctrine/markdown";
import { COFFRE_LABEL } from "@/lib/pricing";
import { CHAPTER_META, CURRICULUM_SECTIONS, chapterSlug } from "./chapters";
import { hermesGate } from "./gate.server";
import { NavBar } from "@/components/NavBar";
import { HermesInstall } from "@/components/HermesInstall";
import { IllustratedCard } from "@/components/ui/illustrated-card";
import { IllustratedCardGrid } from "@/components/ui/illustrated-card-grid";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { illustrationSrc } from "@/lib/illustrations";
import { navIdentity } from "@/lib/auth/navIdentity.server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "Hermes Agent | BUILD", robots: { index: false, follow: false } };

const FIRST_MISSION = [
  ["01", "Choisis une tâche qui revient", "Pas « améliorer mon business ». Par exemple : préparer chaque lundi les trois priorités d'un dossier."],
  ["02", "Décris le résultat attendu", "Un rapport, un brouillon ou une liste d'actions que quelqu'un peut lire et corriger."],
  ["03", "Fixe ce que l'agent ne décide pas", "Publier, envoyer, modifier le CRM, dépenser ou valider un engagement restent des décisions séparées."],
  ["04", "Prévois la vérification humaine", "La tâche est terminée seulement quand une personne sait quoi relire, quoi accepter et quelle suite donner."],
] as const;

const MASTERCLASS_SYNTHESIS = [
  {
    number: "01",
    title: "Un chat, une règle et un agent ne font pas la même chose",
    body: "Un chat répond à une question. Une règle répète toujours la même action. Un agent prépare un travail avec un but, un périmètre et une vérification.",
  },
  {
    number: "02",
    title: "Un agent utile suit cinq briques simples",
    body: "Mission, contexte autorisé, méthode, outils autorisés, puis un résultat que quelqu'un relit. Sans ces briques, on demande juste quelque chose à une IA.",
  },
  {
    number: "03",
    title: "Le résultat doit rester contrôlable",
    body: "L'agent peut lire, comparer et préparer. Publier, envoyer un message, changer le CRM ou dépenser reste une décision séparée.",
  },
  {
    number: "04",
    title: "Un skill est une fiche recette",
    body: "Il dit quoi lire, dans quel ordre travailler, quoi vérifier et ce qu'il ne faut pas faire. La mémoire aide à reprendre le contexte. Le Second Brain garde les vraies décisions et les preuves.",
  },
  {
    number: "05",
    title: "Un cron est un réveil, pas un pilote automatique",
    body: "Il peut lancer une lecture ou préparer un brouillon à heure fixe. Il ne rend pas une tâche plus intelligente et ne doit pas décider seul d'une action importante.",
  },
  {
    number: "06",
    title: "Le bon départ tient dans une petite scène",
    body: "Choisis une tâche qui revient chaque semaine et dure moins de 30 minutes. Décris ce qui entre, ce qui doit sortir et ce que l'agent ne doit jamais décider seul.",
  },
] as const;

const WORKFLOW_BUILDING_BLOCKS = [
  ["01", "Mission", "Le travail précis à faire, pour qui et à quel moment."],
  ["02", "Contexte autorisé", "Les fichiers, données ou outils que le workflow a le droit de consulter."],
  ["03", "Méthode", "Les étapes répétables : lire, vérifier, comparer, préparer."],
  ["04", "Outils autorisés", "Par exemple Treg, les fichiers et le navigateur, seulement dans le périmètre utile."],
  ["05", "Sortie vérifiable et contrôle humain", "Un brouillon ou rapport relu avant tout effet réel."],
] as const;

const REAL_CASES = [
  {
    label: "CAS 01",
    title: "Un carrousel Atelier, pas juste sept images",
    body: "Le système aide à garder le brief, le texte, la direction artistique, les assets en code et le contrôle ensemble. Le rendu final reste relu avant publication.",
    limit: "Ce cas montre un mécanisme de production. Il ne prouve ni portée, ni vente, ni gain de temps chiffré.",
  },
  {
    label: "CAS 02",
    title: "Google Search Console avec Treg, puis un brouillon contrôlé",
    body: "Dans le cas Atelier, Treg lit les données first-party de Google Search Console, relie une requête à la page concernée et prépare un brouillon. Un cron borne le moment où ce travail est préparé, sans remplacer le choix humain.",
    limit: "Le cron ne publie pas, ne pousse pas et ne demande pas d'indexation sans validation humaine.",
  },
  {
    label: "CAS 03",
    title: "Le brief du lundi pour une petite équipe",
    body: "Un workflow peut rassembler les décisions, les blocages et la prochaine action dans une note de préparation. La personne responsable choisit ensuite ce qui devient prioritaire.",
    limit: "Cible à construire, pas une intégration active. Aucun outil de messagerie ou de gestion de projet n'est connecté par défaut.",
  },
] as const;

const TREG_DEPARTMENT_WORKFLOWS = [
  {
    department: "MARKETING",
    title: "Trouver les sujets qui intéressent vraiment",
    purpose: "Lire quelques posts ou pages autorisés, puis préparer trois idées de contenu avec leurs sources.",
    tools: [
      ["LinkedIn", "/brand-logos/treg-linkedin.svg"],
      ["X", "/brand-logos/x.svg"],
      ["Web", "/brand-logos/treg-web.svg"],
    ],
    output: "Un petit brief à relire. Rien n'est publié automatiquement.",
  },
  {
    department: "VENTES",
    title: "Préparer une courte liste de bonnes entreprises",
    purpose: "Chercher des entreprises qui correspondent à une règle simple, puis vérifier le rôle, le site et les signaux publics utiles avant une première relecture humaine.",
    tools: [
      ["Entreprises", "/brand-logos/treg-companies.svg"],
      ["Contacts", "/brand-logos/treg-people.svg"],
      ["LinkedIn", "/brand-logos/treg-linkedin.svg"],
    ],
    output: "Une liste à vérifier, pas des messages envoyés en masse.",
  },
  {
    department: "PUBLICITÉ",
    title: "Préparer le point clair sur une campagne",
    purpose: "Rassembler les chiffres utiles et regarder quelques annonces publiques pour signaler une tendance ou une question à creuser.",
    tools: [
      ["Google Ads", "/brand-logos/treg-google-ads.svg"],
      ["Meta Ads", "/brand-logos/treg-meta-ads.svg"],
      ["Analytics", "/brand-logos/treg-google-analytics.svg"],
    ],
    output: "Un rapport et une proposition. Aucun budget n'est modifié par défaut.",
  },
  {
    department: "SEO / GEO",
    title: "Passer d'une requête observée à un brouillon",
    purpose: "Lire une requête et la page concernée, vérifier ce qui existe déjà, puis préparer un angle ou un brouillon à corriger.",
    tools: [
      ["Search Console", "/brand-logos/googlesearchconsole.svg"],
      ["Analytics", "/brand-logos/treg-google-analytics.svg"],
      ["Web", "/brand-logos/treg-web.svg"],
    ],
    output: "Un brouillon contrôlé. Une impression Google ne prouve ni une vente ni une réponse des IA.",
  },
  {
    department: "CRM",
    title: "Préparer une fiche propre avant de toucher au CRM",
    purpose: "Comparer les informations déjà autorisées, signaler ce qui manque et proposer une fiche courte à valider avant toute écriture.",
    tools: [
      ["Entreprises", "/brand-logos/treg-companies.svg"],
      ["Contacts", "/brand-logos/treg-people.svg"],
    ],
    output: "Une proposition de fiche. Le CRM doit être connecté séparément et rien n'est modifié sans accord.",
  },
  {
    department: "ÉQUIPE",
    title: "Préparer le brief du lundi",
    purpose: "Lire les messages d'un espace autorisé, repérer les blocages et préparer les trois prochaines actions à discuter.",
    tools: [["Slack", "/brand-logos/treg-slack.svg"]],
    output: "Une note de préparation. Aucun message n'est envoyé automatiquement.",
  },
] as const;

function ToolMark({ name, src }: { name: string; src: string }) {
  return (
    <span className="inline-flex items-center gap-2 border border-white/[0.1] bg-white/[0.025] px-2.5 py-1.5 text-[11px] text-white/60">
      <Image src={src} alt="" width={16} height={16} className="size-4 shrink-0" />
      {name}
    </span>
  );
}

function ChaptersSkeleton() {
  return (
    <div className="flex flex-col gap-14 animate-pulse">
      {Array.from({ length: 4 }).map((_, group) => (
        <div key={group}>
          <div className="h-3 w-48 bg-white/[0.06] rounded mb-3" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="aspect-square border border-white/[0.06] bg-white/[0.02]" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Auth + doctrine fetch happen only inside this async subtree, so NavBar and
 * the static header can paint immediately while this streams in behind a
 * Suspense boundary. The access check itself still runs on every request.
 */
async function HermesChapters() {
  const gate = await hermesGate();
  if (gate.files === null) return gate.render;

  const groups = CURRICULUM_SECTIONS.map((section) => ({
    ...section,
    files: gate.files
      .filter((file) => CHAPTER_META[file.path]?.section === section.key)
      .sort((left, right) => (CHAPTER_META[left.path]?.order ?? 999) - (CHAPTER_META[right.path]?.order ?? 999)),
  })).filter((section) => section.files.length > 0);

  const unknownFiles = gate.files.filter((file) => !CHAPTER_META[file.path]);

  return (
    <section id="chapitres" className="scroll-mt-24">
      {gate.files.length === 0 ? (
        <p className="text-white/50">Aucun chapitre disponible pour le moment. Réessaie plus tard.</p>
      ) : (
        <div className="flex flex-col gap-16">
          {groups.map((section) => (
            <section key={section.key} id={`chapitres-${section.key}`} className="scroll-mt-24">
              <div className="mb-6 max-w-2xl">
                <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-3">{section.title.toUpperCase()}</p>
                <p className="text-sm text-white/50 leading-relaxed">{section.intro}</p>
              </div>
              <IllustratedCardGrid>
                {section.files.map((file) => {
                  const meta = CHAPTER_META[file.path];
                  return (
                    <IllustratedCard
                      key={file.path}
                      title={meta.displayTitle}
                      description={meta.summary}
                      imageSrc={illustrationSrc(meta.illustrationId)}
                      href={`/videos/tutos/${chapterSlug(file.path)}`}
                    />
                  );
                })}
              </IllustratedCardGrid>
            </section>
          ))}

          {unknownFiles.length > 0 ? (
            <section aria-label="Chapitres supplémentaires">
              <div className="mb-6 max-w-2xl">
                <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-3">CHAPITRES SUPPLÉMENTAIRES</p>
                <p className="text-sm text-white/50 leading-relaxed">Ces chapitres n'ont pas encore reçu de place dans le parcours. Ils restent accessibles sans être mélangés aux premières missions.</p>
              </div>
              <IllustratedCardGrid>
                {unknownFiles.map((file) => (
                  <IllustratedCard
                    key={file.path}
                    title={chapterTitle(file)}
                    href={`/videos/tutos/${chapterSlug(file.path)}`}
                  />
                ))}
              </IllustratedCardGrid>
            </section>
          ) : null}

          <section id="installer" className="scroll-mt-24 border-y border-white/[0.1] py-10 sm:py-12">
            <div className="max-w-2xl mb-7">
              <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-3">PRÊT À ESSAYER</p>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Installe Hermes après avoir choisi le premier travail à lui confier.</h2>
              <p className="text-white/50 text-sm sm:text-base mt-3 leading-relaxed">L'installation donne un environnement de travail. Elle ne remplace ni la mission, ni les droits, ni la vérification qui rendent un workflow réellement utile.</p>
            </div>
            <HermesInstall />
          </section>
        </div>
      )}
    </section>
  );
}

export default async function HermesAgentPage() {
  const identity = await navIdentity();

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8] font-sans selection:bg-[#e8d5b0]/30 selection:text-[#e8d5b0] relative overflow-x-clip">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-[#e8d5b0] opacity-[0.035] blur-[120px] w-[600px] h-[300px] rounded-full pointer-events-none" />

      <NavBar
        activeLink="videos-tutos"
        tier={identity?.tier ?? null}
        isAdmin={identity?.isAdmin}
        displayName={identity?.displayName}
        displayEmail={identity?.displayEmail}
        initials={identity?.initials}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 relative z-10">
        <header id="introduction" className="scroll-mt-24 mb-16 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,25rem)] lg:gap-16">
          <div className="min-w-0 max-w-3xl">
            <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-3">RÉSERVÉ À {COFFRE_LABEL.toUpperCase()}</p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.08]">Hermes Agent, pour faire avancer un vrai travail.</h1>
            <p className="text-white/60 text-base sm:text-[17px] mt-5 leading-relaxed max-w-2xl">Un agent n'est pas une personne magique dans ton ordinateur. C'est une mission, un contexte limité, une méthode, des outils autorisés et une sortie qu'une personne peut vérifier.</p>
            <p className="text-white/45 text-sm sm:text-base mt-3 leading-relaxed max-w-2xl">Ici, tu pars d'une tâche qui revient. Tu apprends ensuite à créer un bot, un skill, une mémoire utile, un workflow ou un cron sans perdre le contrôle sur ce qui compte.</p>
          </div>
          <div className="relative aspect-square max-w-sm justify-self-start lg:justify-self-end overflow-hidden border border-white/10 bg-white/[0.02]">
            <Image
              src={illustrationSrc("hermes-agent-unified")}
              alt="Illustration Hermes Agent : une opératrice et des outils physiques pour organiser le travail."
              fill
              sizes="(min-width: 1024px) 25rem, 80vw"
              className="object-cover"
              priority
              draggable={false}
            />
          </div>
        </header>

        <section id="etude-masterclass" className="scroll-mt-24 border-y border-white/[0.1] py-10 sm:py-12 mb-16">
          <div className="max-w-3xl mb-8">
            <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-3">LA MASTERCLASS, EN CLAIR</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Ce que la masterclass montre, et ce que BUILD reprend.</h2>
            <p className="text-white/50 text-sm sm:text-base mt-3 leading-relaxed">Ce que ce parcours retient d'une étude de masterclass : partir d'une tâche réelle, rendre le chemin visible et garder la bonne décision à la bonne personne. Ces six idées sont reprises dans les leçons, les cas et les workflows ci-dessous. Le transcript externe n'est ni reproduit ni traduit ici.</p>
          </div>
          <div className="grid gap-x-6 gap-y-8 md:grid-cols-3">
            {MASTERCLASS_SYNTHESIS.map((item) => (
              <article key={item.number} className="border-t border-white/[0.1] pt-5">
                <p className="text-2xl font-light tabular-nums text-[#c9b48a]/65 mb-4">{item.number}</p>
                <h3 className="text-sm font-semibold text-[#f0ede8]">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/50">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="premier-pas" className="scroll-mt-24 border-y border-white/[0.1] py-10 sm:py-12 mb-16">
          <div className="max-w-3xl mb-8">
            <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-3">LE PREMIER PAS</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Choisis une tâche avant de choisir un outil.</h2>
            <p className="text-white/50 text-sm sm:text-base mt-3 leading-relaxed">Tu n'as pas besoin de créer un agent complet aujourd'hui. Commence par un travail répétitif de moins de 30 minutes qui revient chaque semaine.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.1]">
            {FIRST_MISSION.map(([num, title, body]) => (
              <article key={num} className="py-5 sm:px-5 first:pl-0 last:pr-0 first:pt-0 sm:first:pt-5 last:pb-0 sm:last:pb-5">
                <p className="text-2xl font-light tabular-nums text-[#c9b48a]/65 mb-4">{num}</p>
                <h3 className="text-sm font-semibold text-[#f0ede8]">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/50">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="workflows" className="scroll-mt-24 mb-16">
          <div className="max-w-3xl mb-8">
            <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-3">LE WORKFLOW, VISIBLE</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Les cinq briques d'un workflow utile.</h2>
            <p className="text-white/50 text-sm sm:text-base mt-3 leading-relaxed">Ce n'est pas un outil de plus. C'est une petite chaîne de travail que l'on peut relire, corriger et améliorer sans déléguer le jugement.</p>
          </div>
          <ol className="grid border-y border-white/[0.1] sm:grid-cols-2 lg:grid-cols-5 lg:divide-x divide-white/[0.1]">
            {WORKFLOW_BUILDING_BLOCKS.map(([number, title, body]) => (
              <li key={number} className="border-b border-white/[0.1] p-5 last:border-b-0 sm:nth-[2n]:border-l lg:border-b-0 lg:border-l-0">
                <p className="text-2xl font-light tabular-nums text-[#c9b48a]/65 mb-4">{number}</p>
                <h3 className="text-sm font-semibold text-[#f0ede8]">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/50">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="cas-concrets" className="scroll-mt-24 mb-16">
          <div className="max-w-3xl mb-8">
            <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-3">CE QUE ÇA CHANGE EN VRAI</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Trois cas d'usage, avec leur état réel.</h2>
            <p className="text-white/50 text-sm sm:text-base mt-3 leading-relaxed">Une démonstration utile montre le mécanisme, les droits, le résultat attendu et la relecture humaine. Elle ne transforme pas un résultat isolé en promesse générale.</p>
          </div>
          <div className="grid gap-8 border-y border-white/[0.1] py-7 md:grid-cols-3 md:divide-x divide-white/[0.1]">
            {REAL_CASES.map((item, index) => (
              <article key={item.label} className={index === 0 ? "md:pr-8" : index === REAL_CASES.length - 1 ? "md:pl-8" : "md:px-8"}>
                <p className="text-[10px] tracking-[0.18em] font-semibold text-[#e8d5b0]/75 mb-3">{item.label}</p>
                <h3 className="text-lg font-semibold tracking-tight text-[#f0ede8]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{item.body}</p>
                <p className="mt-5 border-t border-white/[0.1] pt-4 text-xs leading-relaxed text-white/40">{item.limit}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="treg-workflows" className="scroll-mt-24 border-y border-white/[0.1] py-10 sm:py-12 mb-16">
          <div className="max-w-3xl mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Image src="/brand-logos/treg.svg" alt="Treg" width={22} height={22} className="size-[22px]" />
              <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold">TREG, EN PRATIQUE</p>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Treg : des idées de workflows, par métier.</h2>
            <p className="text-white/50 text-sm sm:text-base mt-3 leading-relaxed">Treg range des outils par catégories. Voici des possibilités utiles pour une petite équipe, expliquées sans jargon. Ce sont des exemples à construire, pas des connexions déjà actives dans BUILD.</p>
          </div>
          <div className="border-y border-white/[0.1] divide-y divide-white/[0.1]">
            {TREG_DEPARTMENT_WORKFLOWS.map((workflow) => (
              <article key={workflow.department} className="grid gap-5 py-6 lg:grid-cols-[9rem_minmax(0,1fr)_minmax(15rem,0.8fr)] lg:gap-8">
                <p className="text-[10px] tracking-[0.18em] font-semibold text-[#e8d5b0]/75 pt-1">{workflow.department}</p>
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-[#f0ede8]">{workflow.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{workflow.purpose}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {workflow.tools.map(([name, src]) => (
                      <ToolMark key={name} name={name} src={src} />
                    ))}
                  </div>
                </div>
                <p className="border-l border-white/[0.1] pl-4 text-xs leading-relaxed text-white/45 lg:mt-0">{workflow.output}</p>
              </article>
            ))}
          </div>
          <div className="mt-7 max-w-3xl border-t border-[#e8d5b0]/45 pt-4">
            <p className="text-sm font-medium text-[#f0ede8]">Les garde-fous restent les mêmes, même si un outil est disponible.</p>
            <p className="mt-2 text-xs leading-relaxed text-white/50">On connecte seulement une source autorisée. On commence par lire et préparer. Une personne valide avant de publier, envoyer un message, modifier un CRM ou dépenser. Les données de contact ne servent pas à arroser des inconnus. Les appels payants et les outils qui peuvent agir demandent un plafond et un accord séparé.</p>
          </div>
        </section>

        <section id="bibliotheque" className="scroll-mt-24 mb-8">
          <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-3">LE PARCOURS</p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Un parcours, pas une liste de mots compliqués.</h2>
          <p className="text-white/50 text-sm sm:text-base mt-3 leading-relaxed max-w-2xl">Les chapitres sont rangés dans l'ordre où tu en as besoin : comprendre le problème, construire un premier workflow, le rendre fiable, puis le faire grandir dans une équipe.</p>
        </section>

        <Suspense fallback={<ChaptersSkeleton />}>
          <HermesChapters />
        </Suspense>
      </div>

      <ScrollProgress
        sections={[
          { id: "introduction", label: "INTRODUCTION" },
          { id: "etude-masterclass", label: "ÉTUDE" },
          { id: "premier-pas", label: "PREMIER PAS" },
          { id: "workflows", label: "WORKFLOWS" },
          { id: "cas-concrets", label: "CAS CONCRETS" },
          { id: "treg-workflows", label: "TREG" },
          { id: "bibliotheque", label: "PARCOURS" },
          { id: "chapitres", label: "CHAPITRES" },
          { id: "installer", label: "INSTALLER" },
        ]}
      />
      <ScrollToTop />
    </main>
  );
}
