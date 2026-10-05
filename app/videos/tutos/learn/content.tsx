import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

export const LEARNING_BLOCKS = [
  {
    slug: "faire-travailler-hermes",
    number: "01",
    eyebrow: "TON PREMIER SYSTÈME",
    title: "Fais entrer l'IA dans un travail que tu connais déjà",
    description: "Pars d'une tâche qui revient, donne à Hermes le bon contexte et garde la main sur les décisions qui te reviennent.",
    duration: "20 min",
  },
  {
    slug: "trois-projets-reutilisables",
    number: "02",
    eyebrow: "APPRENDRE PAR L'EXEMPLE",
    title: "Trois projets que tu peux refaire chez toi",
    description: "Un contenu, une page trouvée sur Google et un brief d'équipe. Chaque exemple montre le chemin, le résultat et ce que tu gardes ensuite.",
    duration: "30 min",
  },
  {
    slug: "treg-dans-hermes",
    number: "03",
    eyebrow: "CONNECTER DES OUTILS",
    title: "Relier Treg à Hermes et créer tes propres workflows",
    description: "Brancher la connexion, choisir les outils utiles, définir le niveau d'autonomie et transformer chaque bon essai en méthode réutilisable.",
    duration: "35 min",
  },
] as const;

export type LearningSlug = (typeof LEARNING_BLOCKS)[number]["slug"];

export function isLearningSlug(value: string): value is LearningSlug {
  return LEARNING_BLOCKS.some((block) => block.slug === value);
}

function ToolMark({ name, src }: { name: string; src: string }) {
  return (
    <span className="inline-flex items-center gap-2 border border-white/[0.1] bg-white/[0.025] px-2.5 py-1.5 text-[11px] text-white/60">
      <Image src={src} alt="" width={16} height={16} className="size-4 shrink-0" />
      {name}
    </span>
  );
}

function SectionTitle({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-3">{eyebrow}</p>
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h2>
      {intro ? <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/55">{intro}</p> : null}
    </div>
  );
}

function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <article className="border-t border-white/[0.1] pt-5">
      <p className="text-2xl font-light tabular-nums text-[#c9b48a]/65 mb-4">{number}</p>
      <h3 className="text-base font-semibold tracking-tight text-[#f0ede8]">{title}</h3>
      <div className="mt-2 text-sm leading-relaxed text-white/55">{children}</div>
    </article>
  );
}

function Capitalise({ children }: { children: React.ReactNode }) {
  return (
    <aside className="border-y border-[#e8d5b0]/35 py-6 sm:py-7">
      <p className="text-[11px] tracking-[0.18em] font-semibold text-[#e8d5b0]">CE QUE TU GARDES</p>
      <div className="mt-3 max-w-3xl text-sm leading-relaxed text-white/60">{children}</div>
    </aside>
  );
}

function Case({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <article className="border-y border-white/[0.1] py-8 sm:py-10">
      <div className="grid gap-5 lg:grid-cols-[9rem_minmax(0,1fr)] lg:gap-10">
        <p className="text-[11px] tracking-[0.18em] font-semibold text-[#e8d5b0]/75">CAS {number}</p>
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">{title}</h3>
          <div className="mt-5 space-y-4 text-sm sm:text-base leading-relaxed text-white/60">{children}</div>
        </div>
      </div>
    </article>
  );
}

function BackToHermes() {
  return (
    <Link href="/videos/tutos" className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white/90">
      <ArrowLeft className="size-4" />
      Retour à Hermes Agent
    </Link>
  );
}

function NextBlock({ current }: { current: LearningSlug }) {
  const index = LEARNING_BLOCKS.findIndex((block) => block.slug === current);
  const next = LEARNING_BLOCKS[index + 1];
  if (!next) return null;

  return (
    <Link href={`/videos/tutos/learn/${next.slug}`} className="group mt-16 flex items-center justify-between gap-5 border-y border-white/[0.1] py-6 transition-colors hover:border-[#e8d5b0]/50">
      <div>
        <p className="text-[10px] tracking-[0.18em] font-semibold text-[#e8d5b0]/75">BLOC SUIVANT</p>
        <p className="mt-2 text-lg font-semibold tracking-tight text-[#f0ede8]">{next.title}</p>
      </div>
      <ArrowRight className="size-5 shrink-0 text-[#e8d5b0] transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

function MakeHermesUseful() {
  return (
    <>
      <header className="max-w-3xl">
        <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-3">BLOC 01 · TON PREMIER SYSTÈME</p>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.08]">Fais entrer l'IA dans un travail que tu connais déjà.</h1>
        <p className="mt-5 text-base sm:text-[17px] leading-relaxed text-white/60">Tu as peut-être découvert Hermes dans une vidéo. Pars maintenant d'un moment que tu vis vraiment dans ton travail, puis apprends à lui donner une place utile, selon tes règles.</p>
      </header>

      <section className="mt-14">
        <SectionTitle eyebrow="UNE SCÈNE AVANT L'OUTIL" title="Commence par le moment où tu perds le fil, pas par le prompt." intro="Une bonne première mission ressemble à une scène précise : après un rendez-vous, remettre les notes au propre ; chaque lundi, préparer les dossiers qui demandent une décision ; après une vidéo, transformer une idée en plan de travail. Tu reconnais immédiatement ce qui entre, ce qui doit sortir et ce qui mérite ton regard." />
        <div className="mt-8 grid gap-x-6 gap-y-8 md:grid-cols-2">
          <Step number="01" title="Nomme le moment à alléger">Choisis une tâche qui revient et que tu pourrais expliquer à quelqu'un en deux minutes. Plus la scène est claire, plus tu peux juger si l'aide produite mérite de rester.</Step>
          <Step number="02" title="Montre ce que « bien fait » veut dire">Donne un exemple que tu as déjà accepté : une note, un brief, une page ou une réponse. Il devient un repère concret pour vérifier le fond, le ton et le niveau de détail.</Step>
          <Step number="03" title="Ouvre le contexte qui sert vraiment">Liste les fichiers, dossiers, outils ou conversations dont la tâche a besoin. Le périmètre rend la réponse plus facile à relire et évite de mélanger des informations qui ne concernent pas la mission.</Step>
          <Step number="04" title="Choisis la première place de l'agent">Commence par lui faire préparer, comparer ou organiser. Quand le résultat devient fiable dans ton contexte, tu pourras décider si une partie précise mérite plus d'autonomie.</Step>
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle eyebrow="LES CINQ PIÈCES DU WORKFLOW" title="Donne une forme au travail pour pouvoir le retrouver la semaine suivante." intro="Un workflow garde le chemin visible. La mission donne la direction, le contexte précise ce qui est autorisé, la méthode évite de recommencer à réfléchir depuis zéro, les outils restent limités à leur rôle et la sortie te permet de vérifier ce qui a été fait." />
        <div className="mt-8 border-y border-white/[0.1] divide-y divide-white/[0.1]">
          {[
            ["Mission", "Le travail exact, la personne aidée et le bon moment pour le lancer."],
            ["Contexte", "Les sources autorisées et ce qui doit rester hors du périmètre."],
            ["Méthode", "Les étapes répétables qui rendent le résultat compréhensible."],
            ["Outils", "Les connexions nécessaires, avec des droits limités au travail demandé."],
            ["Sortie", "Un document, une fiche, un brouillon ou une action dont on peut vérifier l'effet."],
          ].map(([title, body], index) => (
            <div key={title} className="grid gap-3 py-5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-5">
              <p className="text-xl font-light tabular-nums text-[#c9b48a]/65">0{index + 1}</p>
              <p className="text-sm leading-relaxed text-white/60"><strong className="font-semibold text-[#f0ede8]">{title}. </strong>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle eyebrow="TON NIVEAU D'AUTONOMIE" title="Tu décides jusqu'où l'agent va." intro="L'autonomie se choisit pour chaque workflow, selon le risque, le coût et ce que tu es prêt à laisser faire dans ton contexte. Tu peux garder la lecture, préparer une proposition ou autoriser une action bornée avec une règle claire." />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <article className="border border-white/[0.1] p-5">
            <h3 className="text-sm font-semibold text-[#f0ede8]">Lire et conseiller</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">Hermes observe les sources autorisées, résume ce qu'il voit et te signale une question à trancher.</p>
          </article>
          <article className="border border-white/[0.1] p-5">
            <h3 className="text-sm font-semibold text-[#f0ede8]">Préparer une proposition</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">Hermes construit un brouillon, une fiche CRM, une liste de priorités ou une réponse prête à être ajustée.</p>
          </article>
          <article className="border border-white/[0.1] p-5">
            <h3 className="text-sm font-semibold text-[#f0ede8]">Agir dans une voie bornée</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">Tu peux autoriser une action précise si tu écris le canal, la cible, le plafond, la fréquence, la personne responsable et la façon d'annuler.</p>
          </article>
        </div>
      </section>

      <Capitalise>
        <p>Quand un résultat t'aide vraiment, garde la mission, les sources utilisées, l'exemple accepté et les limites rencontrées. Cette fiche devient un <strong className="font-semibold text-[#f0ede8]">skill</strong>, c'est-à-dire une façon de reprendre le même travail sans repartir de zéro.</p>
        <p className="mt-3">Après quelques passages, ajoute les décisions, les exceptions et les preuves qui comptent. Ton système devient plus utile parce qu'il s'appuie sur ce que tu as réellement choisi et vérifié.</p>
      </Capitalise>

      <aside aria-labelledby="coffre-projection-title" className="relative mt-16 overflow-hidden border border-[#e8d5b0]/45 bg-[#151412] p-5 sm:p-7">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full border border-[#e8d5b0]/10" />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)] lg:items-end">
          <div className="max-w-xl">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-[#e8d5b0]">APRÈS CE PREMIER ESSAI</p>
            <h2 id="coffre-projection-title" className="mt-3 text-2xl font-semibold tracking-tight text-[#f0ede8] sm:text-3xl">Le lundi, tu ouvres Hermes avec une mission déjà préparée.</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60">Les sources utiles sont là, la proposition est prête à relire et les décisions qui t'appartiennent attendent ton feu vert. Tu ne délègues pas ton jugement, tu enlèves le temps perdu entre le contexte, la préparation et l'action.</p>
            <p className="mt-4 text-sm leading-relaxed text-white/60"><strong className="font-semibold text-[#f0ede8]">LE COFFRE, avec Fondations incluses.</strong> Il te permet de relier ce premier essai aux méthodes, aux skills et aux projets qui suivent, jusqu'à en faire un système que tu peux reprendre, transmettre et faire évoluer.</p>
            <p className="mt-3 text-sm leading-relaxed text-white/50"><strong className="font-semibold text-[#f0ede8]">Fondations est le bon point de départ</strong> lorsque tu veux avancer sur un premier résultat concret, avec un chemin plus court.</p>
            <Link href="/checkout" className="group mt-6 inline-flex items-center gap-3 border border-[#e8d5b0] bg-[#e8d5b0] px-4 py-3 text-sm font-semibold text-[#16130e] shadow-[0_3px_0_#a98f62] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8d5b0] active:translate-y-[2px] active:shadow-none">
              Voir les parcours BUILD
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <p className="mt-4 text-xs text-white/45">Paiement unique, accès à vie.</p>
          </div>

          <div className="border-t border-white/[0.12] pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-white/40">UNE SITUATION À CONSTRUIRE</p>
            <div className="mt-4 space-y-4 border-y border-white/[0.1] py-4 text-sm">
              <div>
                <p className="text-[10px] font-medium tracking-[0.14em] text-[#e8d5b0]/75">AVANT LE POINT D'ÉQUIPE</p>
                <p className="mt-1 leading-relaxed text-white/65">Hermes a rassemblé les décisions, les blocages et les sujets qui demandent ton arbitrage.</p>
              </div>
              <div className="border-t border-white/[0.1] pt-4">
                <p className="text-[10px] font-medium tracking-[0.14em] text-[#e8d5b0]/75">TON RÔLE</p>
                <p className="mt-1 leading-relaxed text-white/65">Tu relis, tu corriges ce qui manque et tu choisis ce qui part en action.</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function ThreeReusableProjects() {
  return (
    <>
      <header className="max-w-3xl">
        <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-3">BLOC 02 · APPRENDRE PAR L'EXEMPLE</p>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.08]">Trois projets que tu peux refaire dans ton propre contexte.</h1>
        <p className="mt-5 text-base sm:text-[17px] leading-relaxed text-white/60">L'objectif ne consiste pas à utiliser un agent une fois. Tu vas apprendre à garder le brief, les choix, le résultat et la mesure qui permettent de faire mieux au prochain passage.</p>
      </header>

      <section className="mt-14">
        <Case number="01" title="Faire un carrousel qui reste fidèle à ton idée">
          <p>Commence avec une scène que ton audience vit vraiment. Un entrepreneur peut partir d'un devis accepté qui laisse pourtant un doute sur la marge. Une agence peut partir du lundi matin où chacun cherche la dernière version d'un document. La scène donne une tension précise, puis le carrousel aide à comprendre un mécanisme ou à prendre une décision.</p>
          <p>Avant de dessiner une slide, Hermes peut préparer un brief de production : audience, scène, idée unique, mécanisme expliqué, preuve autorisée, condition matérielle, limite et prochain geste. Le texte de production reste dans ce brief. La slide garde seulement ce que le lecteur doit comprendre.</p>
          <p>Ensuite, construis une route slide par slide. Une slide porte une idée, un chiffre, une tension ou une décision. Les titres vont droit au point, les éléments visuels servent la lecture et le CTA n'arrive qu'après avoir donné assez de matière pour choisir.</p>
          <p>Le rendu final peut être produit à partir d'une direction claire, puis vérifié dans son vrai format. Tu relis les chiffres, les mots qui promettent trop, la lisibilité sur téléphone, les sources et la destination du CTA. Après diffusion, compare les sauvegardes, partages, conversations et suites commerciales à des contenus comparables, au lieu de tirer une conclusion d'une simple vue.</p>
          <Capitalise><p>Range le brief validé, la structure des slides, la direction visuelle, le fichier de production, la checklist de contrôle et la lecture des résultats. Lorsqu'ils fonctionnent ensemble, ils deviennent une recette réutilisable pour ta prochaine série.</p></Capitalise>
        </Case>

        <Case number="02" title="Transformer un signal de recherche en page plus utile">
          <p>Choisis une page importante et une période de lecture. Hermes peut lire les requêtes et les pages liées dans Google Search Console, regarder ce qui existe déjà sur ton site, puis te rendre une question simple : qu'est-ce que les gens cherchent, qu'est-ce que la page répond déjà et qu'est-ce qui manque réellement ?</p>
          <p>Le travail se poursuit avec un angle et un brouillon. Tu peux demander une nouvelle structure, un passage plus clair, une FAQ, des exemples ou un brief destiné à la personne qui écrit. Le but reste d'aider un visiteur à avancer, pas d'ajouter des mots-clés partout.</p>
          <p>Ta règle d'autonomie indique la suite. Certains équipes veulent seulement une note de travail. D'autres autorisent une branche, une demande de relecture ou une mise à jour sur un périmètre donné. Le workflow doit garder l'URL concernée, les preuves consultées, la modification proposée et le résultat observé après publication.</p>
          <Capitalise><p>Chaque amélioration utile alimente une bibliothèque d'intentions, de structures de pages, de preuves à réutiliser et de règles de qualité. Avec le temps, cette bibliothèque aide Hermes à préparer de meilleurs brouillons pour tes propres pages.</p></Capitalise>
        </Case>

        <Case number="03" title="Préparer la semaine sans perdre les décisions importantes">
          <p>Relie seulement les espaces que ton équipe veut utiliser : notes de projets, CRM, messagerie interne ou tableau de suivi. Hermes rassemble les décisions prises, les choses bloquées, les échéances proches et les personnes qui attendent une réponse.</p>
          <p>Le résultat prend la forme d'un brief court. Chaque point indique ce qui s'est passé, pourquoi cela compte maintenant, la prochaine action proposée et la personne qui doit trancher. L'équipe retrouve la raison d'une priorité au lieu de lire une longue suite de messages.</p>
          <p>Après la réunion, garde les décisions finales et les raisons des exceptions. Si une urgence a déplacé le plan ou si un indicateur a été mal interprété, ajoute-le à la méthode. Le prochain brief devient plus fiable parce qu'il tient compte de ce que votre équipe a réellement décidé.</p>
          <Capitalise><p>Le capital de ce workflow est une trace courte et vivante : décisions, propriétaires, échéances, résultats et raisons de changement. Ce sont ces éléments qui permettent à un agent de soutenir l'équipe sans raconter une histoire approximative.</p></Capitalise>
        </Case>
      </section>
    </>
  );
}

const DEPARTMENT_WORKFLOWS = [
  {
    department: "MARKETING",
    title: "Faire remonter des sujets qui méritent une prise de parole",
    body: "Cherche un thème, des questions récurrentes ou des contenus qui reviennent dans des sources autorisées. Hermes prépare un brief : ce que les gens semblent chercher, les sources, l'angle possible, le risque de répétition et une idée de format. Garde les briefs retenus et les retours reçus pour apprendre quels sujets servent vraiment ton audience.",
    tools: [["LinkedIn", "/brand-logos/treg-linkedin.svg"], ["X", "/brand-logos/x.svg"], ["Web", "/brand-logos/treg-web.svg"]],
  },
  {
    department: "VENTES",
    title: "Préparer des comptes à comprendre avant de les contacter",
    body: "Fixe une règle claire : secteur, taille, zone, problème que tu résous et signes publics utiles. Hermes rassemble les éléments trouvés, sépare les faits des hypothèses et prépare une fiche à compléter. Vérifie les coordonnées et la raison de contacter la personne avant d'ajouter quoi que ce soit à ta séquence commerciale.",
    tools: [["Entreprises", "/brand-logos/treg-companies.svg"], ["Contacts", "/brand-logos/treg-people.svg"], ["LinkedIn", "/brand-logos/treg-linkedin.svg"]],
  },
  {
    department: "PUBLICITÉ",
    title: "Comprendre une campagne avant de changer un budget",
    body: "Hermes peut rapprocher les données de campagne, les chiffres de mesure et les créations visibles afin de signaler une variation ou une question à examiner. Une bonne sortie explique le chiffre, la période comparée, les hypothèses et la proposition de test. Ta politique d'autonomie précise ensuite qui peut valider, plafonner ou modifier une dépense.",
    tools: [["Google Ads", "/brand-logos/treg-google-ads.svg"], ["Meta Ads", "/brand-logos/treg-meta-ads.svg"], ["Analytics", "/brand-logos/treg-google-analytics.svg"]],
  },
  {
    department: "SEO / GEO",
    title: "Faire passer une intention réelle avant une simple position",
    body: "Croise une requête, la page qui reçoit les visites, le contenu déjà présent et les questions que le marché pose. Hermes prépare une amélioration qui répond à une intention donnée, avec les preuves consultées et les éléments à vérifier. Laisse une trace du changement et de son effet pour réutiliser les structures qui apportent des demandes utiles.",
    tools: [["Search Console", "/brand-logos/googlesearchconsole.svg"], ["Analytics", "/brand-logos/treg-google-analytics.svg"], ["Web", "/brand-logos/treg-web.svg"]],
  },
  {
    department: "CRM",
    title: "Nettoyer une fiche sans écraser ce que ton équipe sait déjà",
    body: "Hermes compare les informations autorisées, détecte les doublons, signale les champs qui méritent une vérification et prépare une proposition de mise à jour. Préserve l'origine de chaque donnée, la date de vérification et les notes réellement utiles à la relation commerciale. Ainsi, la fiche reste utilisable au lieu de devenir un empilement de données trouvées ailleurs.",
    tools: [["Entreprises", "/brand-logos/treg-companies.svg"], ["Contacts", "/brand-logos/treg-people.svg"]],
  },
  {
    department: "ÉQUIPE",
    title: "Préparer une réunion qui débouche sur des décisions",
    body: "Hermes lit l'espace défini par l'équipe, relève les décisions à prendre, les blocages et les échéances proches, puis prépare une note courte. Après la réunion, la version validée remplace la préparation et nourrit la prochaine édition. Le workflow garde l'équipe concentrée sur les arbitrages, pas sur la chasse aux messages perdus.",
    tools: [["Slack", "/brand-logos/treg-slack.svg"]],
  },
] as const;

function TregInHermes() {
  return (
    <>
      <header className="max-w-3xl">
        <div className="mb-3 flex items-center gap-3">
          <Image src="/brand-logos/treg.svg" alt="Treg" width={22} height={22} className="size-[22px]" />
          <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold">BLOC 03 · CONNECTER DES OUTILS</p>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.08]">Relier Treg à Hermes et créer tes propres workflows.</h1>
        <p className="mt-5 text-base sm:text-[17px] leading-relaxed text-white/60">Treg donne à Hermes une porte vers un catalogue d'outils et les connexions de ton équipe. Tu pars d'un travail à faire, tu choisis les sources et les outils qui le servent, puis tu écris le niveau d'autonomie qui convient à ton activité.</p>
      </header>

      <section className="mt-14">
        <SectionTitle eyebrow="AVANT LA CONNEXION" title="Décide du travail avant d'ouvrir des accès." intro="Une connexion est utile quand elle sert une scène concrète. Écris d'abord la question, les données nécessaires, la sortie attendue, le coût acceptable et la personne qui porte le résultat." />
        <div className="mt-8 grid gap-x-6 gap-y-8 md:grid-cols-2">
          <Step number="01" title="Nommer le travail">Par exemple : « chaque mardi, trouver les pages qui répondent mal aux recherches de nos visiteurs et préparer une proposition d'amélioration ».</Step>
          <Step number="02" title="Choisir la source">Google Search Console, un espace Slack, un outil publicitaire ou une liste d'entreprises ne donnent pas le même contexte. Branche seulement ce que le workflow doit lire ou utiliser.</Step>
          <Step number="03" title="Fixer la dépense">Avant un appel payant, regarde l'entrée demandée, le prix, le nombre de résultats et le plafond que tu acceptes. Fais un petit essai avant d'élargir le volume.</Step>
          <Step number="04" title="Définir la règle d'action">Choisis si le workflow s'arrête au conseil, prépare un brouillon, ouvre une demande de relecture ou agit dans un couloir précis que tu as défini.</Step>
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle eyebrow="CONNEXION À HERMES" title="Deux manières simples de connecter Treg." intro="Utilise la connexion par navigateur quand une personne de l'équipe doit choisir l'organisation Treg. Utilise un token dans l'environnement quand tu prépares un système non interactif, comme une intégration de serveur ou un processus planifié." />
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <article className="border border-white/[0.1] p-5 sm:p-6">
            <h3 className="text-lg font-semibold tracking-tight">Option recommandée : connexion par navigateur</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/55">Dans le terminal du profil Hermes concerné, ajoute le serveur puis lance la connexion. Treg affichera l'organisation qui doit fournir l'accès. Une personne choisit cette organisation, car c'est elle qui porte les connexions et les dépenses.</p>
            <pre className="mt-5 overflow-x-auto border border-white/[0.1] bg-black/25 p-4 text-xs leading-relaxed text-white/70"><code>{`hermes mcp add treg --url https://treg.to/mcp/ --auth oauth
hermes mcp login treg
hermes mcp test treg
hermes mcp configure treg`}</code></pre>
            <p className="mt-4 text-xs leading-relaxed text-white/40">La dernière commande sert à garder seulement les outils utiles au premier workflow. Reviens-y quand tu ajoutes une nouvelle mission, plutôt que de tout ouvrir dès le début.</p>
          </article>
          <article className="border border-white/[0.1] p-5 sm:p-6">
            <h3 className="text-lg font-semibold tracking-tight">Option automatisée : token conservé hors du workflow</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/55">Place le token de l'organisation dans le fichier d'environnement du profil Hermes, jamais dans une conversation, un prompt ou un document partagé. Le fichier de configuration garde seulement une référence vers cette variable.</p>
            <pre className="mt-5 overflow-x-auto border border-white/[0.1] bg-black/25 p-4 text-xs leading-relaxed text-white/70"><code>{`# ~/.hermes/.env ou le .env du profil
TREG_TOKEN=ton_token_ici`}</code></pre>
            <pre className="mt-4 overflow-x-auto border border-white/[0.1] bg-black/25 p-4 text-xs leading-relaxed text-white/70"><code>{`mcp_servers:
  treg:
    url: "https://treg.to/mcp/"
    headers:
      Authorization: "Bearer \${TREG_TOKEN}"
    tools:
      include: [catalog_search, catalog_get, call, balance, my_tools]`}</code></pre>
            <p className="mt-4 text-xs leading-relaxed text-white/40">Après une modification de configuration, lance <code className="text-white/65">/reload-mcp</code> ou ouvre une nouvelle session Hermes, puis vérifie la connexion avant de l'utiliser dans un workflow.</p>
          </article>
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle eyebrow="COMMENT HERMES UTILISE TREG" title="Chercher, comparer, appeler, garder le reçu." intro="Treg présente un petit ensemble d'outils, puis son catalogue range les fournisseurs par travail à accomplir. Hermes peut chercher une capacité, lire les paramètres et le prix, lancer l'appel retenu et conserver les éléments nécessaires pour comprendre ce qui s'est passé." />
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["catalog_search", "Trouver les outils qui peuvent faire le travail demandé, avec les entrées nécessaires et le prix affiché."],
            ["catalog_get", "Comparer les fournisseurs d'un même travail avant d'en choisir un, selon les données disponibles, la fiabilité et le coût."],
            ["call", "Lancer l'outil précis que le workflow a choisi. Le résultat et le coût servent ensuite à la trace de travail."],
            ["balance", "Lire le budget disponible avant d'étendre un test ou d'ouvrir une tâche qui peut consommer du crédit."],
            ["my_tools", "Voir les outils et comptes déjà reliés par ton équipe, sans recopier leurs secrets dans Hermes."],
            ["catalog_request", "Demander une capacité manquante plutôt que de bricoler un outil qui ne répond pas au besoin."],
          ].map(([name, body]) => (
            <article key={name} className="border border-white/[0.1] p-5">
              <h3 className="font-mono text-sm text-[#e8d5b0]">{name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle eyebrow="WORKFLOWS PAR MÉTIER" title="Des départements différents, une même méthode de travail." intro="Chaque idée commence par une question métier. Les logos indiquent les catégories et services que le workflow peut appeler. La fiche de workflow précise ensuite ta propre politique d'action, au lieu de laisser l'agent la deviner." />
        <div className="mt-8 border-y border-white/[0.1] divide-y divide-white/[0.1]">
          {DEPARTMENT_WORKFLOWS.map((workflow) => (
            <article key={workflow.department} className="grid gap-5 py-7 lg:grid-cols-[9rem_minmax(0,1fr)] lg:gap-10">
              <p className="text-[10px] tracking-[0.18em] font-semibold text-[#e8d5b0]/75 pt-1">{workflow.department}</p>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">{workflow.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{workflow.body}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {workflow.tools.map(([name, src]) => <ToolMark key={name} name={name} src={src} />)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle eyebrow="CAPITALISER" title="Chaque bon essai devient une méthode plus simple à refaire." intro="Après un workflow, garde moins de choses, mais garde les bonnes : le but de départ, le petit échantillon utilisé, le fournisseur choisi et pourquoi, le coût, le résultat, la décision prise et le changement à faire au prochain passage." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            "Une fiche courte du workflow, rangée avec son équipe et son objectif.",
            "Les sources, droits et conditions qui ont été autorisés.",
            "La règle d'autonomie décidée par la personne responsable.",
            "Le fournisseur et les paramètres retenus, avec leur raison.",
            "Le coût observé et le plafond accepté pour le prochain test.",
            "Un exemple de sortie validée, les erreurs et les exceptions utiles.",
          ].map((item) => (
            <p key={item} className="flex gap-3 border-t border-white/[0.1] pt-4 text-sm leading-relaxed text-white/55"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#e8d5b0]" />{item}</p>
          ))}
        </div>
      </section>
    </>
  );
}

export function HermesLearningBlock({ slug }: { slug: LearningSlug }) {
  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10">
      <BackToHermes />
      <div className="mt-12">
        {slug === "faire-travailler-hermes" ? <MakeHermesUseful /> : null}
        {slug === "trois-projets-reutilisables" ? <ThreeReusableProjects /> : null}
        {slug === "treg-dans-hermes" ? <TregInHermes /> : null}
      </div>
      <NextBlock current={slug} />
    </article>
  );
}
