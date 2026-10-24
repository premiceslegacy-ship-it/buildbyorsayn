import type { ReactNode } from "react";
import { DaRoot } from "@/components/da/DaRoot";
import {
  AdCard,
  BigNumber,
  Chat,
  Compare,
  Curves,
  Cycle,
  FileCard,
  Fork,
  Funnel,
  Ladder,
  Rings,
  SiteCompare,
  Steps,
  ToolMap,
  WebPage,
  WebPageCompare,
  Workflow,
} from "./index";
import styles from "./kit-board.module.css";

const EM = "#22d96e";
const PREVIEW_WIDTHS = [960, 650, 350] as const;

type KitExample = {
  label: string;
  source: string;
  node: ReactNode;
};

type KitEntry = {
  name: string;
  summary: string;
  examples: readonly KitExample[];
};

const entries: readonly KitEntry[] = [
  {
    name: "Funnel",
    summary: "Des tranches proportionnelles rendent la fuite visible avant même de lire.",
    examples: [
      {
        label: "Dossier de candidature",
        source: "LE COFFRE, feedback terrain",
        node: <Funnel
          title="La fuite se voit tout de suite"
          description="Exemple illustratif : la chute principale arrive avant l'ajout de la pièce."
          ariaLabel="Un entonnoir de candidature se resserre fortement entre les personnes qui commencent et celles qui ajoutent leur pièce."
          accent={EM}
          stages={[
            { label: "Arrivent", value: 100, valueLabel: "100", detail: "ouvrent le dossier" },
            { label: "Commencent", value: 74, valueLabel: "74", detail: "remplissent un champ" },
            { label: "Ajoutent", value: 31, valueLabel: "31", detail: "joignent la pièce" },
            { label: "Valident", value: 24, valueLabel: "24", detail: "terminent" },
          ]}
          leakIndex={1}
          leakLabel="Fuite principale"
          tool="PostHog"
        />,
      },
      {
        label: "Site trouvé et utilisé",
        source: "Fondations, construire un site web",
        node: <Funnel
          title="Une visite ne suffit pas"
          description="Exemple illustratif : la page sert à faire avancer une personne jusqu'au formulaire."
          ariaLabel="Un entonnoir de site montre les passages de la recherche à la page, puis au bouton, au formulaire et au client."
          accent={EM}
          stages={[
            { label: "Recherche", value: 100, valueLabel: "100", detail: "voit le résultat" },
            { label: "Page", value: 82, valueLabel: "82", detail: "comprend l'offre" },
            { label: "Bouton", value: 46, valueLabel: "46", detail: "commence l'action" },
            { label: "Formulaire", value: 29, valueLabel: "29", detail: "termine" },
            { label: "Client", value: 18, valueLabel: "18", detail: "avance" },
          ]}
          leakIndex={2}
          leakLabel="À observer"
          tool="Search Console"
        />,
      },
    ],
  },
  {
    name: "Steps",
    summary: "Des cartes reliées portent un mot fort, un sous mot et les outils utiles.",
    examples: [
      {
        label: "Premier workflow",
        source: "Hermes Agent, introduction",
        node: <Steps
          title="Comprends avant de connecter"
          description="Les connexions arrivent seulement quand le travail réel est compris."
          ariaLabel="Quatre étapes montent dans l'ordre : installer, comprendre, connecter et planifier, avec comprendre mis en avant."
          accent={EM}
          accentIndex={1}
          items={[
            { label: "Installer", detail: "Tester une conversation", tools: ["Hermes Agent"] },
            { label: "Comprendre", detail: "Regarder une vraie tâche" },
            { label: "Connecter", detail: "Ouvrir une seule porte", tools: ["Telegram"] },
            { label: "Planifier", detail: "Ajouter le bon moment", tools: ["Google Agenda"] },
          ]}
        />,
      },
      {
        label: "Site éditorial",
        source: "LE COFFRE, composer une stack",
        node: <Steps
          title="Le chemin reste court"
          description="Un document avance du contenu jusqu'à la mise en ligne sans outil gratuit."
          ariaLabel="Un site éditorial passe du contenu à la construction, au style, aux versions puis à la mise en ligne."
          accent={EM}
          accentIndex={4}
          items={[
            { label: "Contenu", detail: "Le document source" },
            { label: "Construire", detail: "Le framework", tools: ["Next.js"] },
            { label: "Habiller", detail: "Le système visuel", tools: ["Tailwind CSS", "shadcn/ui"] },
            { label: "Versionner", detail: "L'historique", tools: ["GitHub"] },
            { label: "Mettre en ligne", detail: "Le rendu final", tools: ["Vercel"] },
          ]}
        />,
      },
    ],
  },
  {
    name: "Workflow",
    summary: "Les couloirs montrent qui agit et les flèches nomment ce qui passe.",
    examples: [
      {
        label: "Du message au suivi",
        source: "Hermes Agent, premier workflow visible",
        node: <Workflow
          title="Le message devient un suivi validé"
          description="L'agent prépare. Tu vérifies le prix. L'outil garde la suite."
          ariaLabel="Un prospect envoie un message Telegram, l'agent prépare un devis, la personne valide le prix puis le CRM reçoit le suivi."
          accent={EM}
          actors={["Ton prospect", "Ton agent", "Toi", "Les outils"]}
          accentIndex={2}
          steps={[
            { actor: 0, label: "Message", tool: "Telegram" },
            { actor: 1, label: "Préparation", transfer: "une demande", tool: "Hermes Agent" },
            { actor: 2, label: "Ta validation", transfer: "un devis", humanValidation: true },
            { actor: 3, label: "Suivi", transfer: "un accord", tool: "Notion" },
          ]}
        />,
      },
      {
        label: "De la veille à la publication",
        source: "Hermes Agent, workflow marketing",
        node: <Workflow
          title="La publication vient après ton choix"
          description="Les sources et les angles restent séparés de la décision de publier."
          ariaLabel="Les sources passent à l'agent, trois angles sont préparés, la personne choisit puis le réseau publie."
          accent={EM}
          actors={["Sources", "Ton agent", "Toi", "Le réseau"]}
          accentIndex={2}
          steps={[
            { actor: 0, label: "Veille", tool: "Perplexity" },
            { actor: 1, label: "Trois angles", transfer: "des notes", tool: "Hermes Agent" },
            { actor: 2, label: "Ton choix", transfer: "un brouillon", humanValidation: true },
            { actor: 3, label: "Publication", transfer: "ton accord", tool: "Instagram" },
          ]}
        />,
      },
    ],
  },
  {
    name: "Compare",
    summary: "Deux colonnes alignent chaque écart sans forcer l'œil à chercher.",
    examples: [
      {
        label: "Écrire depuis une scène",
        source: "Fondations, écrire pour vendre",
        node: <Compare
          title="Vague ou reconnaissable"
          description="Le texte utile part d'un moment que la personne a vraiment vécu."
          ariaLabel="Une comparaison oppose des phrases vagues à des phrases précises pour un réparateur de vélos et un comptable."
          accent={EM}
          beforeTitle="Avant"
          afterTitle="Après"
          rows={[
            { before: "Redécouvre le plaisir de rouler.", after: "Ton vélo grince quand tu montes une côte ?" },
            { before: "Notre newsletter de mars", after: "Les trois pièces qui bloquent ta clôture" },
            { before: "En savoir plus", after: "Recevoir mon plan de repas" },
          ]}
        />,
      },
      {
        label: "Donner une vraie mission",
        source: "Fondations, comprendre l'environnement",
        node: <Compare
          title="Un rôle ne remplace pas un brief"
          description="L'après donne les sources, le résultat et le contrôle mobile."
          ariaLabel="Une comparaison oppose une demande vague de site premium à une mission avec brief, références, texte et vérification mobile."
          accent={EM}
          beforeTitle="Demande vague"
          afterTitle="Mission claire"
          rows={[
            { before: "Tu es un designer senior.", after: "Lis le brief et les trois références." },
            { before: "Fais un site premium.", after: "Propose le premier écran de la coach." },
            { before: "Sois créatif.", after: "Garde le texte et vérifie le bouton sur mobile." },
          ]}
        />,
      },
    ],
  },
  {
    name: "Curves",
    summary: "Une à trois trajectoires montrent une marche, une chute ou un plateau.",
    examples: [
      {
        label: "Changer d'outil sans retomber",
        source: "Protocole Zéro",
        node: <Curves
          title="Ta méthode garde la trajectoire"
          description="L'outil change. Le savoir gardé continue de monter."
          ariaLabel="La courbe de l'outil retombe lors du changement tandis que la méthode progresse par marches."
          accent={EM}
          labels={["Projet 1", "Changement", "Projet 3", "Projet 4"]}
          series={[
            { name: "Outil seul", values: [2, 7, 0, 4], kind: "line" },
            { name: "Ta méthode", values: [2, 5, 8, 11], kind: "step", accent: true },
          ]}
          annotations={[{ series: 0, point: 2, label: "retour à zéro" }, { series: 1, point: 3, label: "le capital reste" }]}
        />,
      },
      {
        label: "De la réussite à la règle",
        source: "LE COFFRE, itérer en continu",
        node: <Curves
          title="Une réussite isolée ne suffit pas"
          description="La confiance monte après plusieurs usages comparables, puis se stabilise."
          ariaLabel="Une courbe progresse après comparaison, nouveau test et réutilisation avant d'atteindre un plateau nommé règle."
          accent={EM}
          labels={["Réussite", "Comparer", "Retester", "Réutiliser", "Règle"]}
          series={[{ name: "Confiance dans la méthode", values: [2, 3, 6, 9, 9], kind: "step", accent: true }]}
          annotations={[{ series: 0, point: 2, label: "retester" }, { series: 0, point: 4, label: "plateau" }]}
        />,
      },
    ],
  },
  {
    name: "Ladder",
    summary: "Chaque barreau augmente l'effort, la responsabilité ou l'engagement.",
    examples: [
      {
        label: "Trois temps d'attention",
        source: "Fondations, capter l'attention",
        node: <Ladder
          title="L'engagement monte par étapes"
          description="Tu ne demandes pas d'agir avant d'avoir aidé la personne à comprendre."
          ariaLabel="Une échelle monte de découvrir à comprendre puis agir, avec comprendre mis en avant."
          accent={EM}
          accentIndex={1}
          lowLabel="Premier regard"
          highLabel="Décision"
          rungs={[
            { label: "Découvrir", detail: "Voir une scène" },
            { label: "Comprendre", detail: "Voir comment tu travailles" },
            { label: "Agir", detail: "Choisir avec les conditions" },
          ]}
        />,
      },
      {
        label: "Échelle des réponses",
        source: "LE COFFRE, audit avant automatisation",
        node: <Ladder
          title="Monte seulement si le simple ne suffit pas"
          description="Une règle ou un meilleur usage peut éviter une automatisation inutile."
          ariaLabel="Une échelle de six réponses monte de la règle à l'adaptation, avec automatiser mis en avant."
          accent={EM}
          accentIndex={3}
          lowLabel="Simple"
          highLabel="Complexe"
          rungs={[
            { label: "Règle", detail: "Clarifier le geste" },
            { label: "Mieux utiliser", detail: "Retirer le détour" },
            { label: "Connecter", detail: "Passer une donnée" },
            { label: "Automatiser", detail: "Répéter sans choix" },
            { label: "Assister", detail: "Préparer pour toi" },
            { label: "Adapter", detail: "Décider selon le cas" },
          ]}
        />,
      },
    ],
  },
  {
    name: "Chat",
    summary: "La conversation reste visible, et le travail de l'agent se lit dessous.",
    examples: [
      {
        label: "Bot Telegram pour un devis",
        source: "Hermes Agent, introduction",
        node: <Chat
          title="Le bot prépare, tu valides"
          description="Le prospect voit une conversation simple. La validation du prix reste humaine."
          ariaLabel="Une conversation Telegram demande un devis, l'agent retrouve le dossier, prépare la réponse et demande la validation du prix."
          accent={EM}
          platform="Telegram"
          contact="Nouveau prospect"
          messages={[
            { from: "person", text: "Bonjour, tu peux me faire un devis ?", time: "09:41" },
            { from: "agent", text: "Oui. Envoie le plan et trois photos du chantier.", time: "09:42" },
            { from: "person", text: "C'est envoyé.", time: "09:44" },
          ]}
          actions={[
            { label: "Ouvre le dossier du prospect", tool: "Notion" },
            { label: "Prépare la réponse et le devis", tool: "Hermes Agent" },
            { label: "Te demande de valider le prix", humanValidation: true },
          ]}
        />,
      },
      {
        label: "WhatsApp et planning",
        source: "Hermes Agent, ranger les informations",
        node: <Chat
          title="Le message ne devient pas la source"
          description="L'agent relit le calendrier avant de proposer un rendez-vous."
          ariaLabel="Une conversation WhatsApp demande une date, l'agent consulte Google Agenda puis demande une validation avant de répondre."
          accent={EM}
          platform="WhatsApp"
          contact="Claire Martin"
          messages={[
            { from: "person", text: "Tu as une place jeudi après-midi ?", time: "16:12" },
            { from: "agent", text: "Je vérifie le planning avant de te répondre.", time: "16:12" },
          ]}
          actions={[
            { label: "Relit la source qui fait foi", tool: "Google Agenda" },
            { label: "Prépare deux créneaux", tool: "Hermes Agent" },
            { label: "Attend ton accord avant l'envoi", humanValidation: true },
          ]}
        />,
      },
    ],
  },
  {
    name: "FileCard",
    summary: "Un vrai fichier se lit dans un éditeur avec des repères reliés à ses lignes.",
    examples: [
      {
        label: "SOUL.md annoté",
        source: "Hermes Agent, identité et mémoire",
        node: <FileCard
          title="Le fichier donne une identité stable"
          description="Chaque partie répond à une question distincte sur l'agent."
          ariaLabel="Un fichier SOUL.md annoté montre le rôle général, la voix, les réflexes et les interdits de l'agent."
          accent={EM}
          filename="SOUL.md"
          tool="Hermes Agent"
          lines={[
            { text: "# Identité", tone: "heading" },
            { text: "Tu aides Samuel à préparer son travail." },
            { text: "" },
            { text: "## Ta manière de parler", tone: "heading" },
            { text: "Tu tutoies. Tu restes direct." },
            { text: "## Ta manière de travailler", tone: "heading" },
            { text: "Tu vérifies avant de proposer." },
            { text: "## Ce que tu évites", tone: "heading" },
            { text: "Tu n'envoies rien sans accord." },
          ]}
          annotations={[
            { line: 1, label: "Rôle général" },
            { line: 4, label: "Voix" },
            { line: 6, label: "Réflexes" },
            { line: 8, label: "Interdits" },
          ]}
        />,
      },
      {
        label: "SKILL.md réel",
        source: "Hermes Agent, transformer en skill",
        node: <FileCard
          title="Le skill dit quand agir et quand s'arrêter"
          description="Le test protège la suite, pas seulement le premier résultat."
          ariaLabel="Un fichier SKILL.md annoté montre sa description, son déclencheur, sa méthode, ses interdits et ses tests."
          accent={EM}
          filename="SKILL.md"
          tool="Ghostty"
          lines={[
            { text: "# Préparer un devis", tone: "heading" },
            { text: "Description : prépare un brouillon." },
            { text: "" },
            { text: "## Quand l'utiliser", tone: "heading" },
            { text: "Quand le dossier est complet." },
            { text: "## Méthode", tone: "heading" },
            { text: "Lire, comparer, préparer, vérifier." },
            { text: "## Quand s'arrêter", tone: "heading" },
            { text: "Prix absent : demander une validation." },
            { text: "## Tests", tone: "heading" },
            { text: "Refuser tout envoi automatique." },
          ]}
          annotations={[
            { line: 2, label: "L'agent trouve le skill" },
            { line: 6, label: "Il charge le détail utile" },
            { line: 10, label: "Le test protège la suite" },
          ]}
        />,
      },
    ],
  },
  {
    name: "WebPage",
    summary: "La page se montre comme une vraie interface, avec ses repères et son avant après.",
    examples: [
      {
        label: "Premier écran annoté",
        source: "Fondations, construire un site web",
        node: <WebPage
          title="Quatre réponses dans le premier écran"
          description="Le métier, le changement, le fonctionnement et le geste se voient sans chercher."
          ariaLabel="Une page de plaquiste annotée répond à quatre questions : pour qui, quel changement, comment et quel geste."
          accent={EM}
          page={{
            url: "karim-plaquiste.fr",
            nav: "Karim",
            eyebrow: "Plaquiste à Lyon",
            heading: "Cloisons et faux plafonds à Lyon, selon ton chantier",
            subtitle: "Envoie ton plan et trois photos. Karim te rappelle après étude avec un prix.",
            button: "Recevoir mon prix",
            photo: "plaquiste",
            offer: "Tes photos restent jointes au projet",
          }}
          annotations={[
            { number: 1, target: "heading", label: "Pour qui et quel changement ?", why: "Le métier, la ville et la situation du chantier sont dans le titre : le bon client se reconnaît tout de suite.", alt: "Le type de chantier dans le titre." },
            { number: 2, target: "subtitle", label: "Comment ça se passe ?", why: "Deux gestes pour le client, un rappel après étude : le fonctionnement tient en deux phrases.", alt: "Trois pastilles : plan, photos, rappel." },
            { number: 3, target: "button", label: "Quel geste maintenant ?", why: "Un verbe précis, un seul bouton : il n'y a pas d'autre chemin.", alt: "Un numéro de téléphone en simple lien." },
            { number: 4, target: "image", label: "Une preuve du métier réel", why: "La photo montre l'outil et la matière : c'est du vrai chantier.", alt: "Un avant et après." },
          ]}
        />,
      },
      {
        label: "Landing ratée et landing utile",
        source: "Fondations, construire un site web",
        node: <WebPageCompare
          title="Deux pages, deux trajectoires"
          description="La première disperse l'œil. La seconde guide vers une commande comprise."
          ariaLabel="Deux landing pages de fleuriste sont comparées : une page vague avec deux boutons et une page précise avec un seul bouton."
          accent={EM}
          beforeTitle="Page qui disperse"
          afterTitle="Page qui guide"
          before={{
            url: "maison-lila.fr",
            nav: "Maison Lila",
            eyebrow: "Expérience florale",
            heading: "Sublimez chaque instant",
            subtitle: "Des créations uniques",
            button: "Découvrir ou commencer",
          }}
          after={{
            url: "maison-lila.fr",
            nav: "Maison Lila",
            heading: "Ton bouquet prêt demain matin",
            subtitle: "Dis-nous l'occasion et le budget. Maison Lila te rappelle avant de composer.",
            button: "Commander un bouquet",
            photo: "fleuriste",
            offer: "Rappel pendant les horaires d'ouverture",
          }}
        />,
      },
    ],
  },
  {
    name: "AdCard",
    summary: "Une vraie publicité ou un vrai e-mail montre la différence de copy.",
    examples: [
      {
        label: "Publicité sociale",
        source: "Fondations, écrire pour vendre",
        node: <AdCard
          title="Une scène vaut mieux qu'un slogan"
          description="La question précise ouvre le diagnostic sans promettre le résultat."
          legend="Une photo du vrai atelier et une question que le client s'est déjà posée."
          ariaLabel="Une publicité générique de réparateur de vélos, avec un vélo neuf sur fond blanc, est comparée à une accroche précise sur un grincement en montée, avec la photo de l'atelier."
          accent={EM}
          variant="social"
          beforeTitle="Avant"
          afterTitle="Après"
          before={{ account: "Atelier Vélo", text: "Redécouvre le plaisir de rouler.", image: "/schemas/ads/velo-neuf-studio.jpg", visual: "Un vélo neuf sur fond blanc", headline: "Le plaisir de rouler", domain: "ATELIERVELO.FR", action: "En savoir plus", pins: { text: 1, image: 2, headline: 3, action: 4 } }}
          after={{ account: "Atelier Vélo", text: "Ton vélo grince seulement quand tu montes une côte ?", image: "/schemas/sites/atelier-velo-reparation.jpg", visual: "Un mécanicien à l'atelier", headline: "Diagnostic au bon moment", domain: "ATELIERVELO.FR", action: "Décrire le bruit", pins: { text: 1, image: 2, headline: 3, action: 4 } }}
          beforeNotes={[
            { pin: 1, role: "Un slogan", why: "« Le plaisir de rouler » pourrait venir de n'importe quelle marque de vélo.", alt: "Un bruit, une panne, un moment que le client a vécu." },
            { pin: 2, role: "Une photo de catalogue", why: "Un vélo neuf sur fond blanc ne prouve aucun savoir-faire d'atelier.", alt: "L'atelier réel, avec le mécanicien au travail." },
            { pin: 3, role: "Un titre qui répète", why: "Il redit le slogan sans dire ce que l'atelier fait.", alt: "Le service et le délai en clair." },
            { pin: 4, role: "Un bouton flou", why: "« En savoir plus » ne dit pas ce qui va se passer.", alt: "Un geste précis : « Décrire le bruit »." },
          ]}
          afterNotes={[
            { pin: 1, role: "Une question reconnue", why: "Le grincement en côte : le cycliste l'a déjà entendu, il s'arrête.", alt: "Un bruit différent pour chaque saison." },
            { pin: 2, role: "Le vrai atelier", why: "Un mécanicien et ses outils : la preuve est dans la photo.", alt: "La fiche de diagnostic remise au client." },
            { pin: 3, role: "Un intitulé concret", why: "Le titre indique ce que l'atelier regarde, sans annoncer un délai non documenté.", alt: "Le contenu du diagnostic, si l'atelier le décrit." },
            { pin: 4, role: "Un geste facile", why: "Décrire le bruit demande un message, pas un rendez-vous.", alt: "Un numéro de téléphone en simple lien." },
          ]}
        />,
      },
      {
        label: "Objet d'e-mail",
        source: "Fondations, écrire pour vendre",
        node: <AdCard
          title="L'objet nomme le blocage"
          description="L'e-mail doit ensuite livrer exactement les trois pièces annoncées."
          ariaLabel="Un objet de newsletter vague est comparé à un objet d'e-mail précis qui nomme trois pièces bloquant une clôture comptable."
          accent={EM}
          variant="email"
          beforeTitle="Avant"
          afterTitle="Après"
          before={{ subject: "Notre newsletter de mars", preview: "Les actualités du cabinet", text: "Retrouve nos conseils et nos nouveautés du mois.", action: "Lire la suite", pins: { subject: 1, text: 2, action: 3 } }}
          after={{ subject: "Les trois pièces qui bloquent ta clôture", preview: "La liste à vérifier avant vendredi", text: "Voici les justificatifs à retrouver et où les demander.", action: "Voir la liste", pins: { subject: 1, text: 2, action: 3 } }}
          beforeNotes={[
            { pin: 1, role: "Un objet de calendrier", why: "« Notre newsletter de mars » parle de l'expéditeur et du mois, pas du lecteur.", alt: "Le blocage que le lecteur a ce mois-ci." },
            { pin: 2, role: "Une promesse vague", why: "« Nos conseils et nos nouveautés » ne dit rien qu'on puisse vérifier.", alt: "Trois pièces nommées, que le mail livre vraiment." },
            { pin: 3, role: "Un bouton neutre", why: "« Lire la suite » ne dit pas ce qu'on va trouver.", alt: "« Voir la liste »." },
          ]}
          afterNotes={[
            { pin: 1, role: "Un objet qui nomme le blocage", why: "Il dit ce qui bloque (la clôture) et combien de pièces sont en cause.", alt: "La date limite dans l'objet." },
            { pin: 2, role: "Un contenu annoncé", why: "Le texte livre ce que l'objet promet : les justificatifs et où les demander.", alt: "La liste directement dans le mail." },
            { pin: 3, role: "Un bouton qui nomme l'objet", why: "« Voir la liste » promet exactement ce qui s'ouvre.", alt: "Un lien vers un modèle à imprimer." },
          ]}
        />,
      },
    ],
  },
  {
    name: "Cycle",
    summary: "Trois à cinq étapes tournent autour d'un résultat qui nourrit le passage suivant.",
    examples: [
      {
        label: "Une correction, une mesure",
        source: "LE COFFRE, feedback terrain",
        node: <Cycle
          title="Corrige une cause puis remesure"
          description="Le niveau de départ reste visible pour décider de garder ou retirer."
          ariaLabel="Une boucle relie le niveau avant, une correction, la mesure après et la décision."
          accent={EM}
          entryIndex={1}
          centerLabel="Même contexte"
          steps={[
            { label: "Avant", detail: "Écrire le niveau" },
            { label: "Une correction", detail: "Changer une cause" },
            { label: "Après", detail: "Mesurer encore" },
            { label: "Décider", detail: "Garder ou retirer" },
          ]}
        />,
      },
      {
        label: "Erreur vers test",
        source: "LE COFFRE, itérer en continu",
        node: <Cycle
          title="Une erreur devient un test"
          description="Tu reproduis le cas avant de corriger, puis tu rejoues le passage."
          ariaLabel="Une boucle relie attendu, obtenu, reproduire, corriger et rejouer, avec rejouer mis en avant."
          accent={EM}
          entryIndex={4}
          centerLabel="Apprendre du cas"
          steps={[
            { label: "Attendu", detail: "Nommer le résultat" },
            { label: "Obtenu", detail: "Garder le cas" },
            { label: "Reproduire", detail: "Refaire le passage", tool: "GitHub" },
            { label: "Corriger", detail: "Changer au plus près" },
            { label: "Rejouer", detail: "Tester la suite" },
          ]}
        />,
      },
    ],
  },
  {
    name: "ToolMap",
    summary: "Les outils se rangent par rôle avec une phrase qui dit leur utilité.",
    examples: [
      {
        label: "Carte des outils par rôle",
        source: "LE COFFRE, composer une stack",
        node: <ToolMap
          title="Un outil principal par rôle"
          description="Les marques ne se relient pas entre elles. Chaque rôle rejoint le projet."
          ariaLabel="Six groupes rangent NotebookLM, Claude, Hermes Agent, Figma, Claude Code et GitHub par rôle."
          accent={EM}
          accentGroup={2}
          groups={[
            { role: "Sources", tools: [{ name: "NotebookLM", description: "Relit les documents" }] },
            { role: "Réflexion", tools: [{ name: "Claude", description: "Compare les choix" }] },
            { role: "Missions", tools: [{ name: "Hermes Agent", description: "Orchestre le travail" }] },
            { role: "Design", tools: [{ name: "Figma", description: "Garde la maquette" }] },
            { role: "Code", tools: [{ name: "Claude Code", description: "Modifie le projet" }] },
            { role: "Versions", tools: [{ name: "GitHub", description: "Garde l'historique" }] },
          ]}
        />,
      },
      {
        label: "Portail client",
        source: "LE COFFRE, composer une stack",
        node: <ToolMap
          title="Ajoute un service quand la fonction le demande"
          description="Comptes, paiement, messages, erreurs et usage gardent chacun leur outil."
          ariaLabel="Une carte d'outils relie Supabase aux comptes, Stripe au paiement, Resend aux messages, Sentry aux erreurs et PostHog à l'usage."
          accent={EM}
          accentGroup={0}
          groups={[
            { role: "Comptes", tools: [{ name: "Supabase", description: "Gère l'accès" }] },
            { role: "Paiement", tools: [{ name: "Stripe", description: "Garde le règlement" }] },
            { role: "Messages", tools: [{ name: "Resend", description: "Envoie les e-mails" }] },
            { role: "Erreurs", tools: [{ name: "Sentry", description: "Montre ce qui casse" }] },
            { role: "Usage", tools: [{ name: "PostHog", description: "Mesure le passage utile" }] },
          ]}
        />,
      },
    ],
  },
  {
    name: "Fork",
    summary: "Une situation se sépare en issues dont la condition reste visible.",
    examples: [
      {
        label: "Premier client avant système",
        source: "Protocole Zéro",
        node: <Fork
          title="Parle avant de construire l'usine"
          description="La route courte mène à une personne. L'organisation vient après la livraison."
          ariaLabel="Une bifurcation recommande de parler puis livrer avant d'organiser un grand système vide."
          accent={EM}
          situation="Tu veux lancer une nouvelle offre"
          outcomes={[
            { label: "Parler puis livrer", condition: "Une personne a un cas réel", recommended: true },
            { label: "Construire tout le système", condition: "Personne n'a encore demandé le résultat", rejected: true },
          ]}
        />,
      },
      {
        label: "Petit test, trois sorties",
        source: "Fondations, état d'esprit",
        node: <Fork
          title="Le test sert à choisir"
          description="Tu continues, tu modifies ou tu arrêtes selon ce que le terrain montre."
          ariaLabel="Un petit test mène à trois issues : continuer, modifier ou arrêter, avec modifier mis en avant."
          accent={EM}
          situation="Le petit test est terminé"
          outcomes={[
            { label: "Continuer", condition: "Le besoin et le geste sont confirmés" },
            { label: "Modifier", condition: "Une hypothèse précise a cassé", recommended: true },
            { label: "Arrêter", condition: "Le problème n'existe pas ici", rejected: true },
          ]}
        />,
      },
    ],
  },
  {
    name: "Rings",
    summary: "Un cœur et des anneaux séparent identité, savoir, action et interdit.",
    examples: [
      {
        label: "Ce que l'agent garde autour de lui",
        source: "Hermes Agent, identité et mémoire",
        node: <Rings
          title="L'agent ne mélange pas tout"
          description="Son identité reste au cœur. Ses informations, ses actions et ses interdits vivent autour."
          ariaLabel="Des anneaux entourent l'identité de l'agent : ce qu'il sait, ce qu'il peut faire et ce qu'il ne fait jamais."
          accent={EM}
          core="Qui il est"
          accentIndex={2}
          rings={[
            { label: "Ce qu'il sait", detail: "Mémoire et contexte utiles" },
            { label: "Ce qu'il peut faire", detail: "Outils et droits précis" },
            { label: "Ce qu'il ne fait jamais", detail: "Envoi, dépense ou suppression sans accord" },
          ]}
        />,
      },
      {
        label: "Zoom vers une scène réelle",
        source: "LE COFFRE, choisir une ligne",
        node: <Rings
          title="Resserre jusqu'au moment observable"
          description="Un marché vague devient une scène où tu peux regarder le travail."
          ariaLabel="Des anneaux resserrent le marché vers le métier, puis le moment et enfin la scène réelle."
          accent={EM}
          core="Scène réelle"
          accentIndex={2}
          rings={[
            { label: "Marché", detail: "Le grand territoire" },
            { label: "Métier", detail: "La personne concernée" },
            { label: "Moment", detail: "Quand le problème arrive" },
          ]}
        />,
      },
    ],
  },
  {
    name: "BigNumber",
    summary: "Le changement tient dans un avant, un après et une phrase.",
    examples: [
      {
        label: "Une équipe agentique plus simple",
        source: "LE COFFRE, skills comme infrastructure",
        node: <BigNumber
          title="Retire les agents inutiles"
          description="Deux tâches répétées deviennent des scripts. Un agent garde l'adaptation."
          ariaLabel="Chloé passe de cinq agents imaginés à un seul agent, les tâches répétées devenant des scripts."
          accent={EM}
          before={{ value: "5", label: "agents imaginés" }}
          after={{ value: "1", label: "agent pour adapter" }}
          sentence="La répétition devient un script. L'engagement reste humain."
        />,
      },
      {
        label: "Le site de Léa",
        source: "Fondations, construire un site web",
        node: <BigNumber
          title="Commence par la page qui sert"
          description="Léa retire le blog et les formulaires de trop avant de tester son message."
          ariaLabel="Léa passe de sept surfaces prévues à une seule page utile pour montrer son style et vérifier une date."
          accent={EM}
          before={{ value: "7", label: "surfaces prévues" }}
          after={{ value: "1", label: "page utile" }}
          sentence="Elle montre son style, son déroulé et un seul formulaire."
        />,
      },
    ],
  },
  {
    name: "SiteMockup",
    summary: "Un vrai site recréé en HTML, annoté section par section, seul ou en face d'une version générée par IA.",
    examples: [
      {
        label: "Plaquiste à Lyon",
        source: "Fondations, construire un site web",
        node: <SiteCompare
          title="Même artisan, deux premiers écrans"
          description="À gauche, le gabarit d'IA ; à droite, une page qui montre le chantier et la prochaine étape."
          legend="Compare d'abord les titres : lequel te dit pour qui c'est et quoi faire ?"
          ariaLabel="Deux premiers écrans du site d'un plaquiste lyonnais : une version générique avec surtitre, dégradé et trois cartes, puis une version avec photo de chantier, titre concret et un seul bouton."
          accent={EM}
          slopTitle="Généré par réflexe"
          premiumTitle="Pensé pour le client"
          slop={{
            url: "karim-plaquiste.fr",
            theme: "encre",
            nav: { brand: "Karim Placo", links: ["Services", "À propos", "Contact"], cta: "Devis" },
            sections: [
              { kind: "hero", variant: "centered", eyebrow: "✦ Solutions innovantes", title: "Sublimez vos intérieurs", accent: "intérieurs", text: "Des finitions d'exception pour des espaces qui vous ressemblent.", cta: "Découvrir", cta2: "En savoir plus", image: "orbs", pins: { eyebrow: 1, title: 2, cta2: 3 } },
              { kind: "cards", title: "Pourquoi choisir", items: [{ title: "Rapide", text: "Un service efficace.", icon: "zap" }, { title: "Fiable", text: "Une qualité garantie.", icon: "shield" }, { title: "Innovant", text: "Des solutions modernes.", icon: "sparkles" }], pins: { items: 4 } },
            ],
          }}
          slopNotes={[
            { pin: 1, role: "Surtitre", why: "Répète une catégorie vague au-dessus du titre.", alt: "Le titre dit déjà le métier." },
            { pin: 2, role: "Mot en dégradé", why: "Effet sans sens, lisibilité réduite.", alt: "Un mot en valeur par le poids." },
            { pin: 3, role: "Deux boutons égaux", why: "Le visiteur hésite entre deux gestes.", alt: "Un seul bouton : le devis." },
            { pin: 4, role: "Trois cartes à icône", why: "Affirment sans rien montrer.", alt: "Une photo de chantier fini." },
          ]}
          premium={{
            url: "karim-plaquiste.fr",
            theme: "chaux",
            nav: { brand: "Karim Placo", links: ["Chantiers", "Tarifs", "Contact"] },
            sections: [
              { kind: "hero", variant: "editorial", title: "Cloisons et faux plafonds à Lyon, selon ton chantier", text: "Envoie ton plan et trois photos : Karim te rappelle après étude avec un prix.", cta: "Préparer ma demande", image: "/schemas/sites/plaquiste-platre-truelles.jpg", imageAlt: "Truelles et plâtre sur un chantier", pins: { title: 1, cta: 2, image: 3 } },
            ],
          }}
          premiumNotes={[
            { pin: 1, role: "Titre concret", why: "Métier, ville et situation du chantier en une phrase.", alt: "Une question du client, mot pour mot." },
            { pin: 2, role: "Un seul geste", why: "Le bouton dit ce qui se passe ensuite.", alt: "Un lien d'appel sur mobile." },
            { pin: 3, role: "Photo du vrai métier", why: "On reconnaît le chantier, pas une ambiance.", alt: "Avant et après d'une pièce." },
          ]}
        />,
      },
    ],
  },
] as const;

export function KitBoard({ only }: { only?: string }) {
  const selected = only ? entries.filter((entry) => entry.name.toLocaleLowerCase("fr") === only.toLocaleLowerCase("fr")) : entries;
  return <DaRoot className={styles.root}>
    <main className={styles.main}>
      <header className={styles.boardHeader}>
        <a href="/dev/schemas?cours=tous">Retour aux schémas</a>
        <div><p>Bibliothèque de schémas</p><h1>{only ?? "Kit HTML et CSS"}</h1></div>
        <p>{selected.length} gabarit{selected.length > 1 ? "s" : ""}, deux exemples tirés du contenu pour chacun.</p>
      </header>
      <nav className={styles.filters} aria-label="Choisir un gabarit">
        <a aria-current={!only ? "page" : undefined} href="/dev/schemas?cours=kit">Tous</a>
        {entries.map((entry) => <a aria-current={only === entry.name ? "page" : undefined} href={`/dev/schemas?cours=kit&nom=${entry.name}`} key={entry.name}>{entry.name}</a>)}
      </nav>
      <div className={styles.entries}>
        {selected.map((entry) => <section className={styles.entry} key={entry.name}>
          <header><div><h2>{entry.name}</h2><p>{entry.summary}</p></div><span>2 exemples</span></header>
          <div className={styles.examples}>{entry.examples.map((example) => <article className={styles.example} key={example.label}>
            <div className={styles.exampleMeta}><h3>{example.label}</h3><p>{example.source}</p></div>
            <div className={styles.previewList}>{PREVIEW_WIDTHS.map((width) => <section className={styles.preview} key={width}>
              <p>{width} px</p>
              <div className={styles.previewViewport} style={{ "--kit-preview-width": `${width}px` } as React.CSSProperties}>{example.node}</div>
            </section>)}</div>
          </article>)}</div>
        </section>)}
      </div>
    </main>
  </DaRoot>;
}
