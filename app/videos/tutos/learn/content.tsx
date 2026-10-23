import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

export const LEARNING_BLOCKS = [
  {
    slug: "faire-travailler-hermes",
    number: "01",
    eyebrow: "INSTALLER ET CADRER",
    title: "Prépare un premier workflow que tu peux arrêter",
    description: "Vérifie l'installation, choisis le modèle et les outils, puis traite un cas fictif avec une preuve et une reprise.",
    duration: "25 min",
  },
  {
    slug: "trois-projets-reutilisables",
    number: "02",
    eyebrow: "PRATIQUER SUR TROIS CAS",
    title: "Construis trois workflows réutilisables",
    description: "Prépare un contenu, améliore une page et organise une semaine avec des entrées, des limites et une preuve de fin.",
    duration: "35 min",
  },
  {
    slug: "treg-dans-hermes",
    number: "03",
    eyebrow: "CONNECTER SANS TOUT OUVRIR",
    title: "Ajoute un outil externe par MCP",
    description: "Inspecte la connexion, filtre les outils, borne le coût et garde Treg désactivé tant qu'aucun appel autorisé ne peut partir.",
    duration: "30 min",
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
      <p className="text-[11px] tracking-[0.18em] text-[var(--em)] font-semibold mb-3">{eyebrow}</p>
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h2>
      {intro ? <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/55">{intro}</p> : null}
    </div>
  );
}

function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <article className="border-t border-white/[0.1] pt-5">
      <p className="text-2xl font-light tabular-nums text-[var(--em)]/65 mb-4">{number}</p>
      <h3 className="text-base font-semibold tracking-tight text-[var(--encre)]">{title}</h3>
      <div className="mt-2 text-sm leading-relaxed text-white/55">{children}</div>
    </article>
  );
}

function Capitalise({ children }: { children: React.ReactNode }) {
  return (
    <aside className="border-y border-[var(--em)]/35 py-6 sm:py-7">
      <p className="text-[11px] tracking-[0.18em] font-semibold text-[var(--em)]">CE QUE TU GARDES</p>
      <div className="mt-3 max-w-3xl text-sm leading-relaxed text-white/60">{children}</div>
    </aside>
  );
}

function Case({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <article className="border-y border-white/[0.1] py-8 sm:py-10">
      <div className="grid gap-5 lg:grid-cols-[9rem_minmax(0,1fr)] lg:gap-10">
        <p className="text-[11px] tracking-[0.18em] font-semibold text-[var(--em)]/75">CAS {number}</p>
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
    <Link href={`/videos/tutos/learn/${next.slug}`} className="group mt-16 flex items-center justify-between gap-5 border-y border-white/[0.1] py-6 transition-colors hover:border-[var(--em)]/50">
      <div>
        <p className="text-[10px] tracking-[0.18em] font-semibold text-[var(--em)]/75">BLOC SUIVANT</p>
        <p className="mt-2 text-lg font-semibold tracking-tight text-[var(--encre)]">{next.title}</p>
      </div>
      <ArrowRight className="size-5 shrink-0 text-[var(--em)] transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

function MakeHermesUseful() {
  return (
    <>
      <header className="max-w-3xl">
        <p className="text-[11px] tracking-[0.18em] text-[var(--em)] font-semibold mb-3">BLOC 01 : INSTALLER ET CADRER</p>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.08]">Prépare un premier workflow que tu peux arrêter.</h1>
        <p className="mt-5 text-base sm:text-[17px] leading-relaxed text-white/60">L'installation fournit un moteur. Ta mission, tes sources, tes droits et ta preuve de fin transforment ce moteur en aide de travail. Compte 25 minutes ce soir : tu repars avec trois fiches vérifiées et un contrat de mission que tu peux réutiliser.</p>
      </header>

      <section className="mt-14">
        <SectionTitle eyebrow="VÉRIFIER L'ENVIRONNEMENT" title="Commence par savoir ce qui tourne réellement." intro="Utilise le paquet Desktop officiel sur macOS ou Windows, ou l'installation en ligne de commande documentée pour ton système. Recharge le terminal, puis contrôle la version, les dépendances et le profil actif avant d'ajouter un outil. Un profil est une configuration nommée qui regroupe le modèle, les outils, la mémoire et les réglages d'un usage." />
        <pre className="mt-7 overflow-x-auto border border-white/[0.1] bg-black/25 p-4 text-xs leading-relaxed text-white/70"><code>{`hermes --version
hermes doctor
hermes status --all`}</code></pre>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/50">Une commande qui répond prouve que le programme démarre. Elle ne prouve pas encore qu'un modèle, une mémoire, un connecteur ou une tâche planifiée fonctionne.</p>
      </section>

      <section className="mt-16">
        <SectionTitle eyebrow="CHOISIR LE MOTEUR" title="Teste le modèle sur le travail, pas sur sa réputation." intro="Configure le fournisseur depuis le terminal. Garde un cas typique, un cas limite et une instruction hostile. Le meilleur choix est celui qui appelle les bons outils, respecte le format et reste dans le coût accepté." />
        <div className="mt-8 grid gap-x-6 gap-y-8 md:grid-cols-2">
          <Step number="01" title="Configurer le modèle"><code className="text-white/75">hermes model</code> ajoute le fournisseur, l'authentification et le modèle. Le sélecteur lancé dans une conversation sert seulement aux fournisseurs déjà configurés.</Step>
          <Step number="02" title="Réduire les outils"><code className="text-white/75">hermes tools</code> permet d'activer les catégories utiles. Un workflow de synthèse n'a besoin ni d'une publication, ni d'un accès d'administration.</Step>
          <Step number="03" title="Définir la sortie">Écris le fichier, la fiche ou la décision attendue. Ajoute les sources à citer, les inconnues à garder et les erreurs qui doivent arrêter le travail.</Step>
          <Step number="04" title="Préparer la reprise">Indique l'état durable, c'est-à-dire la note qui survit à la fin de la session, les objets touchés, la dernière vérification et la prochaine action. Une nouvelle session doit pouvoir reprendre sans répéter un effet.</Step>
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle eyebrow="PREMIER WORKFLOW" title="Traite trois dossiers fictifs en lecture seule." intro="Crée un petit dossier avec deux cas complets et un cas qui contient une pièce manquante. Par exemple, trois demandes de devis d'un paysagiste : deux avec la surface et les photos du jardin, une sans surface. Une boutique peut prendre trois demandes de retour, un cabinet trois demandes de rendez-vous. N'utilise aucun secret, aucune donnée client et aucune destination externe." />
        <div className="mt-8 border-y border-white/[0.1] divide-y divide-white/[0.1]">
          {[
            ["Mission", "Préparer une fiche par dossier et signaler ce qui manque avant toute décision."],
            ["Sources", "Lire seulement le dossier d'exemple et la règle de qualité fournie."],
            ["Référence", "Donner avant l'exécution une fiche déjà acceptée. Elle sert de repère pour le fond, le ton et le niveau de détail."],
            ["Interdits", "Ne contacter personne, ne modifier aucune source et ne fabriquer aucune valeur."],
            ["Sortie", "Faits, déclarations, inconnues, décision attendue, source et prochaine action."],
            ["Arrêt", "Bloquer si deux sources se contredisent ou si une permission manque."],
            ["Preuve", "Comparer les fiches aux sources et vérifier qu'aucun outil externe n'a été appelé."],
          ].map(([title, body], index) => (
            <div key={title} className="grid gap-3 py-5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-5">
              <p className="text-xl font-light tabular-nums text-[var(--em)]/65">0{index + 1}</p>
              <p className="text-sm leading-relaxed text-white/60"><strong className="font-semibold text-[var(--encre)]">{title}. </strong>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle eyebrow="AUTONOMIE PAR PALIERS" title="Élargis une seule capacité à la fois." intro="Le passage suivant dépend de la preuve du palier précédent. Un résultat impressionnant sur un exemple ne justifie pas un droit d'écriture." />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <article className="border border-white/[0.1] p-5">
            <h3 className="text-sm font-semibold text-[var(--encre)]">Lire et signaler</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">L'agent consulte un périmètre défini, cite ses sources et remonte une décision. Commence ici.</p>
          </article>
          <article className="border border-white/[0.1] p-5">
            <h3 className="text-sm font-semibold text-[var(--encre)]">Préparer dans un brouillon</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">Il produit un fichier isolé ou une proposition. Une personne compare, corrige et accepte.</p>
          </article>
          <article className="border border-white/[0.1] p-5">
            <h3 className="text-sm font-semibold text-[var(--encre)]">Agir dans un couloir</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">L'action précise la cible, le contenu, la durée, le plafond, la trace et le retour arrière. Les actions sensibles restent approuvées.</p>
          </article>
        </div>
      </section>

      <Capitalise>
        <p>Garde le contrat de mission, les trois dossiers, la sortie acceptée, les erreurs, les outils réellement appelés et la procédure de reprise. Cette matière peut devenir un skill après comparaison, revue et version.</p>
        <p className="mt-3">Pour la version IA, ajoute deux autres entrées : un cas limite et une pièce qui demande d'ignorer les règles. Compare le résultat à une consigne naïve et note les écarts.</p>
      </Capitalise>
    </>
  );
}

function ThreeReusableProjects() {
  return (
    <>
      <header className="max-w-3xl">
        <p className="text-[11px] tracking-[0.18em] text-[var(--em)] font-semibold mb-3">BLOC 02 : PRATIQUER SUR TROIS CAS</p>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.08]">Construis trois workflows que tu peux refaire.</h1>
        <p className="mt-5 text-base sm:text-[17px] leading-relaxed text-white/60">Chaque cas possède une entrée, une sortie, une limite, une preuve et une reprise. Tu gardes la méthode seulement après avoir contrôlé le résultat. Ce soir, choisis un seul des trois cas et compte 35 minutes : tu repars avec une recette écrite que tu pourras relancer la semaine prochaine.</p>
      </header>

      <section className="mt-14">
        <Case number="01" title="Préparer un carrousel fidèle à une idée">
          <p><strong className="font-semibold text-[var(--encre)]">Entrée.</strong> Une scène réelle, une idée principale, une preuve autorisée, une limite et la destination du contenu. Exemple : un carrousel de six écrans pour un cabinet de kinésithérapie sur les douleurs de dos au bureau, qui renvoie vers la page de prise de rendez-vous. Le brief sépare les faits, les hypothèses et les chiffres qui demandent une source.</p>
          <p><strong className="font-semibold text-[var(--encre)]">Exécution.</strong> L'agent propose une route écran par écran. Chaque écran porte une idée utile à la compréhension. Le texte reste lisible sur téléphone et le geste final correspond à ce que la destination délivre.</p>
          <p><strong className="font-semibold text-[var(--encre)]">Limite et preuve.</strong> Il ne publie rien. Tu relis le rendu dans son format final, les chiffres, les sources, la promesse et le lien. Après diffusion autorisée, tu compares des signaux de qualité à des contenus comparables.</p>
          <p><strong className="font-semibold text-[var(--encre)]">Reprise.</strong> La passation garde l'idée, le dernier écran validé, les points refusés et la prochaine correction. Une interruption ne force pas à reconstruire la route.</p>
          <Capitalise><p>Range le brief, la structure, la direction visuelle, la checklist et la lecture du résultat. Ensemble, ces éléments forment une recette versionnée, pas une promesse de performance.</p></Capitalise>
        </Case>

        <Case number="02" title="Préparer l'amélioration d'une page">
          <p><strong className="font-semibold text-[var(--encre)]">Entrée.</strong> Une URL, une période, les requêtes et pages autorisées, ainsi que la décision visée. Exemple : la page « tarifs » d&apos;un garage sur les 28 derniers jours. La Search Console, l&apos;outil gratuit de Google qui montre les recherches menant au site, indique des impressions et des clics. Elle ne révèle pas seule l&apos;intention exacte de chaque personne.</p>
          <p><strong className="font-semibold text-[var(--encre)]">Exécution.</strong> L'agent compare les questions visibles, le contenu présent et les passages manquants. Il propose une structure, des exemples ou une FAQ dans un brouillon séparé. Pour le garage, cela peut être une réponse claire à « combien coûte une vidange » si le prix réel est fourni par le propriétaire.</p>
          <p><strong className="font-semibold text-[var(--encre)]">Limite et preuve.</strong> Il ne change ni la page publiée, ni la mesure. Tu contrôles les sources, le diff, c&apos;est-à-dire la liste exacte des lignes modifiées, et la lisibilité. La preuve porte d'abord sur la qualité du brouillon, puis sur l'effet observé après une publication décidée par le propriétaire.</p>
          <p><strong className="font-semibold text-[var(--encre)]">Reprise.</strong> Le dossier garde l'URL, la version, les données lues, la proposition, l'approbation et la date de prochaine lecture.</p>
          <Capitalise><p>Conserve les intentions, structures, preuves et règles de qualité qui ont survécu à la revue. Retire les conclusions fondées sur une seule variation.</p></Capitalise>
        </Case>

        <Case number="03" title="Préparer la semaine autour des décisions">
          <p><strong className="font-semibold text-[var(--encre)]">Entrée.</strong> Un espace de projets défini, une fenêtre de temps et la liste des personnes autorisées. Les conversations privées et les dossiers sans rapport restent hors périmètre.</p>
          <p><strong className="font-semibold text-[var(--encre)]">Exécution.</strong> L'agent relève les décisions, blocages, échéances et personnes qui attendent une réponse. Chaque point indique sa source, son état, sa prochaine action et le responsable qui tranche.</p>
          <p><strong className="font-semibold text-[var(--encre)]">Limite et preuve.</strong> Le brief reste une préparation. La réunion valide ou corrige. La version validée remplace le brouillon et devient l'état de reprise.</p>
          <p><strong className="font-semibold text-[var(--encre)]">Planification.</strong> Lance d'abord le workflow manuellement. Quand il tient, crée une tâche planifiée avec un profil, un dossier, des outils filtrés, une destination de test et un arrêt. Consulte l'historique avant d'activer la livraison.</p>
          <Capitalise><p>Le capital utile tient dans les décisions, leurs raisons, les propriétaires, les échéances, les résultats et les exceptions. Une transcription complète ajouterait du bruit et des données inutiles.</p></Capitalise>
        </Case>
      </section>
    </>
  );
}

const DEPARTMENT_WORKFLOWS = [
  {
    department: "MARKETING",
    title: "Faire remonter les questions qui méritent une réponse",
    body: "Lis uniquement les sources autorisées. La sortie sépare les questions récurrentes, les sources, l'angle proposé et le risque de répétition. Une personne choisit les sujets et décide de la publication.",
    tools: [["LinkedIn", "/brand-logos/treg-linkedin.svg"], ["X", "/brand-logos/x.svg"], ["Web", "/brand-logos/treg-web.svg"]],
  },
  {
    department: "VENTES",
    title: "Préparer une fiche avant un contact",
    body: "Fixe le secteur, la zone et les signaux publics utiles. La fiche distingue les faits, les hypothèses et les coordonnées à vérifier. L'outil ne décide ni de la légitimité du contact, ni du message envoyé.",
    tools: [["Entreprises", "/brand-logos/treg-companies.svg"], ["Contacts", "/brand-logos/treg-people.svg"], ["LinkedIn", "/brand-logos/treg-linkedin.svg"]],
  },
  {
    department: "PUBLICITÉ",
    title: "Lire une variation avant de toucher au budget",
    body: "Rapproche la période, la mesure et les créations. La sortie décrit le changement observé, les hypothèses et un test. Toute dépense ou modification demande une approbation sur le compte, le montant et la durée.",
    tools: [["Google Ads", "/brand-logos/treg-google-ads.svg"], ["Meta Ads", "/brand-logos/treg-meta-ads.svg"], ["Analytics", "/brand-logos/treg-google-analytics.svg"]],
  },
  {
    department: "SEO / GEO",
    title: "Relier une requête à une page et une décision",
    body: "Compare la requête, la page et les questions du marché. Prépare un changement avec ses preuves et son diff. Laisse la publication au propriétaire, puis relis les résultats dans une fenêtre définie.",
    tools: [["Search Console", "/brand-logos/googlesearchconsole.svg"], ["Analytics", "/brand-logos/treg-google-analytics.svg"], ["Web", "/brand-logos/treg-web.svg"]],
  },
  {
    department: "CRM",
    title: "Préparer une correction sans écraser l'historique",
    body: "Repère les doublons et les champs douteux, puis propose un diff. Garde l'origine, la date et la version. Une personne ou une règle métier accepte l'écriture dans le bon compte.",
    tools: [["Entreprises", "/brand-logos/treg-companies.svg"], ["Contacts", "/brand-logos/treg-people.svg"]],
  },
  {
    department: "ÉQUIPE",
    title: "Préparer une réunion qui ferme des décisions",
    body: "Relève les blocages, échéances et arbitrages dans l'espace choisi. Après la réunion, remplace la préparation par la version validée et garde la prochaine action avec son propriétaire.",
    tools: [["Slack", "/brand-logos/treg-slack.svg"]],
  },
] as const;

function TregInHermes() {
  return (
    <>
      <header className="max-w-3xl">
        <div className="mb-3 flex items-center gap-3">
          <Image src="/brand-logos/treg.svg" alt="Treg" width={22} height={22} className="size-[22px]" />
          <p className="text-[11px] tracking-[0.18em] text-[var(--em)] font-semibold">BLOC 03 : CONNECTER SANS TOUT OUVRIR</p>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.08]">Ajoute un outil externe par MCP.</h1>
        <p className="mt-5 text-base sm:text-[17px] leading-relaxed text-white/60">MCP (Model Context Protocol) est le protocole qui branche un service externe sur l'agent et lui expose des outils. Tu contrôles encore le serveur, l'authentification, les outils visibles, le coût, les actions sensibles et la preuve de l'effet.</p>
      </header>

      <section className="mt-14">
        <SectionTitle eyebrow="AVANT LA CONNEXION" title="Écris le travail, puis ouvre une seule capacité." intro="Choisis une question métier, une source, une sortie, un plafond et un propriétaire. Exemple : un cabinet comptable veut une fiche publique sur dix entreprises de sa zone avant de les contacter. La sortie est un tableau, le plafond de dépense est fixé à l'avance et l'associé décide de chaque contact. Une connexion réussie prouve seulement que le serveur répond." />
        <div className="mt-8 grid gap-x-6 gap-y-8 md:grid-cols-2">
          <Step number="01" title="Nommer l'opération">Écris l'action exacte, les paramètres et le résultat attendu. « Utiliser le marketing » reste trop vague.</Step>
          <Step number="02" title="Inspecter le serveur">Lis l'URL ou la commande locale, la source du paquet, le mode d'authentification et les outils exposés.</Step>
          <Step number="03" title="Filtrer les outils">Commence par les lectures nécessaires. Les outils de suppression, dépense, envoi ou publication restent désactivés.</Step>
          <Step number="04" title="Préparer le refus">Teste un objet autorisé, un objet hors périmètre, un secret absent, une interruption et un appel dupliqué.</Step>
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle eyebrow="COMMANDES DE CONTRÔLE" title="Ajouter, tester, réduire, puis recharger." intro="Ces commandes suivent l'interface officielle du client. Remplace l'URL et le mode d'authentification par ceux de la documentation du serveur choisi." />
        <pre className="mt-7 overflow-x-auto border border-white/[0.1] bg-black/25 p-4 text-xs leading-relaxed text-white/70"><code>{`hermes mcp add service --url https://example.com/mcp --auth oauth
hermes mcp login service
hermes mcp test service
hermes mcp configure service`}</code></pre>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/50">Après le filtre, ouvre une nouvelle session ou recharge MCP. Contrôle la liste réelle des outils. Un nom rassurant ou une description fournie par le serveur ne remplace pas ce contrôle.</p>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/50">À faire ce soir, en 30 minutes : écris l&apos;opération exacte que tu veux confier, ajoute un serveur MCP en lecture seule, filtre ses outils et recopie la liste réellement visible. Tu repars avec un reçu de connexion daté, sans aucun appel payant.</p>
      </section>

      <section className="mt-16">
        <SectionTitle eyebrow="CAS TREG" title="Garder le catalogue séparé de l'appel payant." intro="La documentation actuelle expose le catalogue, les détails d'une opération, l'appel et le solde par HTTP, CLI ou MCP. Le catalogue change. Lis donc les paramètres et le coût sur l'opération exacte au moment du test." />
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <article className="border border-white/[0.1] p-5 sm:p-6">
            <h3 className="text-lg font-semibold tracking-tight">Connexion documentée</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/55">Le serveur distant utilise OAuth ou un jeton d'organisation. OAuth est une connexion par autorisation : tu valides l&apos;accès dans ton navigateur sans copier de mot de passe. Préfère OAuth pour une connexion interactive et ne colle jamais un secret dans une conversation.</p>
            <pre className="mt-5 overflow-x-auto border border-white/[0.1] bg-black/25 p-4 text-xs leading-relaxed text-white/70"><code>{`hermes mcp add treg --url https://treg.to/mcp/ --auth oauth
hermes mcp login treg
hermes mcp test treg
hermes mcp configure treg`}</code></pre>
            <p className="mt-4 text-sm leading-relaxed text-white/55">Pour un système non interactif, comme un serveur ou une tâche planifiée, place le jeton dans une variable d&apos;environnement et envoie-le en en-tête Bearer, c&apos;est-à-dire le jeton présenté à chaque requête.</p>
            <pre className="mt-4 overflow-x-auto border border-white/[0.1] bg-black/25 p-4 text-xs leading-relaxed text-white/70"><code>{`# ~/.hermes/.env
TREG_TOKEN=ton_token_ici

# config.yaml
mcp_servers:
  treg:
    url: "https://treg.to/mcp/"
    headers:
      Authorization: "Bearer \${TREG_TOKEN}"`}</code></pre>
          </article>
          <article className="border border-white/[0.1] p-5 sm:p-6">
            <h3 className="text-lg font-semibold tracking-tight">Limite actuelle de ce parcours</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/55">Aucun appel payant n'a été exécuté pour produire ce contenu. Le solde disponible dans l'environnement de recherche ne permettait pas ce test. Aucun fonds ne doit être ajouté pour le contourner.</p>
            <p className="mt-4 text-sm leading-relaxed text-white/55">Tu peux apprendre la méthode en consultant le catalogue public. Si ton organisation autorise ensuite un appel, lis le coût exact, fixe le total accepté, garde l'identifiant et arrête la boucle avant le plafond.</p>
            <p className="mt-4 text-sm leading-relaxed text-white/55">Treg distingue aussi le catalogue public des outils enregistrés par ton équipe. L'opération <code className="font-mono text-[var(--em)]">my_tools</code> sert à lister ces connexions. Si aucune opération ne répond au besoin, <code className="font-mono text-[var(--em)]">catalog_request</code> demande la capacité manquante au lieu de détourner un outil inadapté. Aucune connexion d'équipe active n'a été vérifiée pour ce parcours : contrôle la réponse, les droits et le coût avant tout appel.</p>
          </article>
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle eyebrow="WORKFLOWS PAR MÉTIER" title="Une même méthode, des autorités différentes." intro="Chaque idée commence par une décision métier. Les services affichés indiquent des familles de sources possibles. Ils ne déclarent aucune connexion active." />
        <div className="mt-8 border-y border-white/[0.1] divide-y divide-white/[0.1]">
          {DEPARTMENT_WORKFLOWS.map((workflow) => (
            <article key={workflow.department} className="grid gap-5 py-7 lg:grid-cols-[9rem_minmax(0,1fr)] lg:gap-10">
              <p className="text-[10px] tracking-[0.18em] font-semibold text-[var(--em)]/75 pt-1">{workflow.department}</p>
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
        <SectionTitle eyebrow="PREUVE ET REPRISE" title="Ferme chaque appel avec un reçu exploitable." intro="Conserve l'opération, les paramètres non sensibles, le coût observé, l'identifiant, l'état, la sortie acceptée et la prochaine action. Après un délai dépassé, relis la cible avant de réessayer." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            "Le serveur, le profil et les outils réellement actifs.",
            "La source et la version des données utilisées.",
            "L'opération exacte et son état terminal.",
            "Le fournisseur et les paramètres retenus, avec la raison du choix.",
            "Le coût unitaire observé et le total du workflow.",
            "L'approbation liée à la cible et au contenu.",
            "La reprise après refus, coupure ou effet incertain.",
          ].map((item) => (
            <p key={item} className="flex gap-3 border-t border-white/[0.1] pt-4 text-sm leading-relaxed text-white/55"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--em)]" />{item}</p>
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
        <HermesLearningContent slug={slug} />
      </div>
      <NextBlock current={slug} />
    </article>
  );
}

export function HermesLearningContent({ slug }: { slug: LearningSlug }) {
  return <>
    {slug === "faire-travailler-hermes" ? <MakeHermesUseful /> : null}
    {slug === "trois-projets-reutilisables" ? <ThreeReusableProjects /> : null}
    {slug === "treg-dans-hermes" ? <TregInHermes /> : null}
  </>;
}
