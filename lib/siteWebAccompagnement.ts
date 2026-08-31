export type AccompanimentTrack = "debutant" | "experimente" | "agence";

export type AccompanimentTask = {
  id: string;
  title: string;
  outcome: string;
  tracks?: AccompanimentTrack[];
};

export type AccompanimentTheme = {
  id: string;
  marker: string;
  title: string;
  promise: string;
  why: string;
  deliverables: string[];
  tasks: AccompanimentTask[];
  finishLine: string;
  trackFinishLine?: Partial<Record<AccompanimentTrack, string>>;
};

export type AccompanimentPhase = AccompanimentTheme;

export const TRACKS: Array<{
  id: AccompanimentTrack;
  label: string;
  shortLabel: string;
  description: string;
  adjustment: string;
}> = [
  {
    id: "debutant",
    label: "Je démarre",
    shortLabel: "Je démarre",
    description:
      "Tu veux partir d'un savoir-faire ou d'une idée et comprendre comment vendre tes premiers sites web créés avec l'IA.",
    adjustment:
      "On prend le temps de rendre chaque décision commerciale et chaque étape de production claire avant de passer à la suivante.",
  },
  {
    id: "experimente",
    label: "Je vends déjà",
    shortLabel: "Je vends déjà",
    description:
      "Tu as déjà produit ou vendu des sites web et tu veux structurer l'offre, la vente et la livraison pour gagner en régularité.",
    adjustment:
      "On va directement sur les sujets qui te font encore perdre du temps, de la marge ou des ventes.",
  },
  {
    id: "agence",
    label: "Expert : je veux scaler",
    shortLabel: "Je veux scaler",
    description:
      "Tu vends déjà des sites web et tu veux utiliser l'IA pour augmenter le volume sans sacrifier la qualité, la marge ou la maîtrise de l'activité.",
    adjustment:
      "On repère ce qui peut être standardisé, accéléré ou transmis pour vendre et livrer davantage sans tout garder dans ta tête.",
  },
];

export const THEMES: AccompanimentTheme[] = [
  {
    id: "diagnostic",
    marker: "01",
    title: "Une activité de sites web claire avant de commencer",
    promise:
      "Tu sais quel type de site web tu peux vendre, à qui, pour quel résultat et avec quel premier périmètre.",
    why:
      "Sans client précis et offre de site claire, on produit des pages sans savoir pourquoi elles devraient être achetées.",
    deliverables: [
      "Positionnement simple",
      "Offre de site web",
      "Client prioritaire",
      "Premier site à vendre",
    ],
    tasks: [
      {
        id: "web-diagnostic-01",
        title: "Décrire le résultat que ton site doit apporter",
        outcome: "Une situation de départ et une valeur recherchée sont formulées pour le client.",
      },
      {
        id: "web-diagnostic-02",
        title: "Lister ce que tu peux déjà produire avec l'IA",
        outcome: "Les acquis utiles à la vente de sites sont séparés des sujets à travailler.",
      },
      {
        id: "web-diagnostic-03",
        title: "Choisir le type de site que tu peux vendre en premier",
        outcome: "Une offre de site de départ est assez concrète pour être présentée.",
      },
      {
        id: "web-diagnostic-04",
        title: "Fixer le premier signal de progrès",
        outcome: "On sait si l'on cherche une réponse, un rendez-vous, une commande ou une livraison.",
      },
      {
        id: "web-diagnostic-agency-01",
        title: "Décider qui porte la vente, la production et la relecture",
        outcome: "La valeur, les décisions et les contrôles ont un responsable clair.",
        tracks: ["agence"],
      },
    ],
    finishLine:
      "On peut avancer quand une entreprise précise, une offre de site et une prochaine action commerciale tiennent en une minute.",
    trackFinishLine: {
      agence:
        "L'équipe sait aussi qui décide, qui vend, qui produit, qui relit et qui échange avec le client.",
    },
  },
  {
    id: "business-copy",
    marker: "02",
    title: "Une offre de sites web que les bons clients comprennent",
    promise:
      "Ton offre explique le problème que le site règle, ce que le client reçoit et pourquoi il est logique d'avancer.",
    why:
      "Un site ne se vend pas à lui seul. La vente commence quand le résultat, les limites et la prochaine étape sont clairs.",
    deliverables: [
      "Offre de site lisible",
      "Message principal",
      "Réponses aux hésitations",
      "Parcours de vente",
    ],
    tasks: [
      {
        id: "web-copy-01",
        title: "Relier l'offre de site à l'entreprise qui la cherche",
        outcome: "Le message correspond à une situation réelle et à un besoin précis.",
      },
      {
        id: "web-copy-02",
        title: "Reprendre les mots utilisés sur le terrain",
        outcome: "Les textes parlent comme les clients parlent.",
      },
      {
        id: "web-copy-03",
        title: "Écrire la promesse du site et l'action suivante",
        outcome: "L'offre dit ce que l'entreprise gagne et comment commencer.",
      },
      {
        id: "web-copy-04",
        title: "Choisir les preuves qui rendent l'offre crédible",
        outcome: "Chaque preuve aide à comprendre la valeur au lieu de remplir un support.",
      },
      {
        id: "web-copy-05",
        title: "Préparer une deuxième façon de présenter l'offre",
        outcome: "On peut comparer deux angles sans tout changer à la fois.",
      },
      {
        id: "web-copy-agency-01",
        title: "Fixer comment le texte client est préparé et relu",
        outcome: "Les sources, les retours et l'accord final ne dépendent pas d'un échange perdu.",
        tracks: ["agence"],
      },
    ],
    finishLine:
      "Une entreprise extérieure comprend quel site tu proposes, pour quel résultat et comment commencer sans explication orale.",
  },
  {
    id: "references-da",
    marker: "03",
    title: "Des références pour créer des sites qui donnent confiance",
    promise:
      "Tu choisis une direction et des références qui renforcent la valeur perçue de tes sites, de tes preuves et de ton offre.",
    why:
      "Un site esthétique ne remplace pas un résultat. Chaque référence doit aider le client à comprendre, croire ou décider.",
    deliverables: [
      "Références de sites utiles",
      "Ce que l'on écarte",
      "Direction choisie",
      "Premier site comparé",
    ],
    tasks: [
      {
        id: "web-da-01",
        title: "Choisir des références pour le bon usage",
        outcome: "Chaque référence a une raison d'être et un rôle précis.",
      },
      {
        id: "web-da-02",
        title: "Repérer ce qui crée la confiance recherchée",
        outcome: "On sait ce qui vient des mots, des preuves, des images, des formes ou du rythme.",
      },
      {
        id: "web-da-03",
        title: "Comparer deux directions sur un vrai site",
        outcome: "Le choix se fait sur le travail réel, pas sur deux tableaux d'inspiration.",
      },
      {
        id: "web-da-04",
        title: "Décider ce qui est gardé, adapté ou écarté",
        outcome: "L'activité a sa propre personnalité sans copier une référence.",
      },
    ],
    finishLine:
      "On peut avancer quand tes références donnent une direction crédible au site et renforcent l'offre sans la remplacer.",
  },
  {
    id: "design-system-assets",
    marker: "04",
    title: "Une base de production web que tu peux réutiliser",
    promise:
      "Tu poses des règles simples pour produire des sites web et supports cohérents sans repartir de zéro à chaque client.",
    why:
      "Sans base de production commune, chaque site repart de zéro et l'activité dépend de ton énergie du jour.",
    deliverables: [
      "Règles de marque",
      "Bibliothèque web",
      "Cas clients importants",
      "Base de production",
    ],
    tasks: [
      {
        id: "web-ds-01",
        title: "Fixer les règles visuelles des sites",
        outcome: "Les couleurs, caractères, espacements et formes suivent une même logique sur chaque site livré.",
      },
      {
        id: "web-ds-02",
        title: "Prévoir les situations importantes du parcours",
        outcome: "Les états normal, vide, en attente et en erreur restent compréhensibles pour la personne en face.",
      },
      {
        id: "web-ds-03",
        title: "Choisir le bon format pour chaque élément du site",
        outcome: "Chaque page, image, proposition, illustration ou schéma a un rôle et un format adapté.",
      },
      {
        id: "web-ds-04",
        title: "Créer une base de site réutilisable",
        outcome: "Un nouveau site peut être produit sans inventer une nouvelle identité ni refaire chaque élément.",
      },
      {
        id: "web-ds-05",
        title: "Ajouter du mouvement seulement s'il aide à comprendre",
        outcome: "Les animations confirment une action ou une transition et restent discrètes.",
      },
      {
        id: "web-ds-06",
        title: "Relire chaque asset comme un client",
        outcome: "Les décorations inutiles disparaissent et la valeur reste immédiatement lisible.",
      },
      {
        id: "web-ds-agency-01",
        title: "Décider ce qui doit être relu par un senior",
        outcome: "L'équipe sait quelles décisions de valeur ou de marque ne doivent pas être prises automatiquement.",
        tracks: ["agence"],
      },
      {
        id: "web-ds-agency-02",
        title: "Donner à une autre personne de quoi produire sans toi",
        outcome: "Une autre personne peut reprendre le travail avec les mêmes règles.",
        tracks: ["agence"],
      },
    ],
    finishLine:
      "On peut avancer quand tu peux produire un nouveau site avec les mêmes règles et sans refaire chaque décision.",
    trackFinishLine: {
      agence:
        "L'équipe dispose d'un exemple commun à produire, vendre et relire, avec une règle simple en cas de désaccord.",
    },
  },
  {
    id: "build-stack",
    marker: "05",
    title: "Construire et livrer les sites que tu peux vendre",
    promise:
      "Tu passes de l'offre à un site web réel, propre et livrable, sans perdre le fil entre production, validation et vente.",
    why:
      "Une activité web avance quand elle transforme une promesse en site remis au client, pas quand un outil produit une première version.",
    deliverables: [
      "Espace de travail propre",
      "Site web versionné",
      "Site testable",
      "Process de livraison",
    ],
    tasks: [
      {
        id: "web-build-01",
        title: "Préparer l'espace de travail et les versions",
        outcome: "Le projet reste lisible et chaque modification peut être retrouvée.",
      },
      {
        id: "web-build-02",
        title: "Choisir l'outil adapté au site",
        outcome: "On évite de prendre un outil plus compliqué que le besoin.",
      },
      {
        id: "web-build-03",
        title: "Construire les pages et éléments du site dans le bon ordre",
        outcome: "Chaque partie est vérifiée avant d'ajouter la suivante.",
      },
      {
        id: "web-build-04",
        title: "Partager une version de test du site",
        outcome: "Le site peut être relu par la bonne personne avant d'être remis ou vendu.",
      },
      {
        id: "web-build-05",
        title: "Savoir revenir à une version qui fonctionne",
        outcome: "Une erreur ne force pas à reconstruire tout le projet.",
      },
      {
        id: "web-build-agency-01",
        title: "Écrire le chemin d'une livraison d'équipe",
        outcome: "Une version ne part pas chez le client sans relecture prévue.",
        tracks: ["agence"],
      },
      {
        id: "web-build-agency-02",
        title: "Repérer ce qui ralentit les livraisons",
        outcome: "Les reprises sont reliées à une cause que l'équipe peut corriger.",
        tracks: ["agence"],
      },
    ],
    finishLine:
      "On peut avancer quand le site est utilisable, présentable à un client et récupérable après une erreur.",
    trackFinishLine: {
      agence:
        "La livraison peut être reprise par l'équipe sans dépendre de la mémoire du fondateur.",
    },
  },
  {
    id: "connected",
    marker: "06",
    title: "Relier tes sites à la vente et à la livraison",
    promise:
      "Tu ajoutes les formulaires, paiements, automatisations ou espaces seulement quand ils aident à vendre ou sécurisent la livraison du site.",
    why:
      "Chaque connexion doit servir une décision du business, protéger les données et éviter les erreurs coûteuses.",
    deliverables: [
      "Parcours client utile",
      "Informations protégées",
      "Actions autorisées",
      "Plan en cas d'erreur",
    ],
    tasks: [
      {
        id: "web-connected-01",
        title: "Décider ce que le site doit vraiment garder",
        outcome: "Les informations demandées ont une utilité commerciale ou opérationnelle claire.",
      },
      {
        id: "web-connected-02",
        title: "Choisir où les informations seront conservées",
        outcome: "Le choix reste proportionné au besoin et au budget.",
      },
      {
        id: "web-connected-03",
        title: "Protéger les accès et les informations",
        outcome: "Une personne ne peut pas voir ou modifier ce qui ne la concerne pas.",
      },
      {
        id: "web-connected-04",
        title: "Tester les cas autorisés et les erreurs",
        outcome: "Le parcours explique quoi faire quand une information manque ou qu'une action échoue.",
      },
      {
        id: "web-connected-05",
        title: "Éviter les doublons quand une action est répétée",
        outcome: "Un clic répété ne crée pas deux paiements, deux demandes ou deux dossiers.",
      },
    ],
    finishLine:
      "On peut avancer quand chaque connexion a une raison, un accès prévu et une solution si quelque chose se passe mal.",
  },
  {
    id: "seo-geo",
    marker: "07",
    title: "Être trouvé par les entreprises qui ont besoin d'un site",
    promise:
      "Tu relies ton offre de site et tes contenus aux recherches, conversations et canaux qui peuvent amener une vraie opportunité.",
    why:
      "La visibilité ne vaut que si elle touche la bonne personne et ouvre une conversation utile.",
    deliverables: [
      "Angle de visibilité",
      "Offre de site trouvable",
      "Suivi des signaux",
      "Plan d'amélioration",
    ],
    tasks: [
      {
        id: "web-seo-01",
        title: "Relier chaque contenu à une intention réelle",
        outcome: "Chaque contenu répond à une question ou une étape précise du parcours vers une demande de site.",
      },
      {
        id: "web-seo-02",
        title: "Aider les canaux à comprendre ton activité",
        outcome: "Les titres, informations et preuves importantes sont propres et cohérents.",
      },
      {
        id: "web-seo-03",
        title: "Voir les signaux qui amènent des opportunités",
        outcome: "Les décisions viennent de recherches et de réponses observées, pas d'une intuition seule.",
      },
      {
        id: "web-seo-04",
        title: "Décider ce qui peut être proposé ou publié",
        outcome: "Aucun texte automatique ne part sans relecture prévue.",
      },
      {
        id: "web-seo-05",
        title: "Répondre sans inventer d'autorité",
        outcome: "Les assets restent justes, utiles et reliés à des sources vérifiables.",
      },
    ],
    finishLine:
      "On peut avancer quand tes assets sont compréhensibles par les bons canaux et que les premiers signaux peuvent être suivis.",
  },
  {
    id: "launch-acquisition",
    marker: "08",
    title: "Obtenir des demandes et vendre des sites",
    promise:
      "Tu transformes ton offre de site et tes preuves en actions concrètes pour obtenir des demandes, vendre et suivre ce qui fonctionne.",
    why:
      "Un asset ne travaille pas seul. Il devient utile quand une personne précise le découvre, comprend la valeur et sait quoi faire ensuite.",
    deliverables: [
      "Deux canaux de départ",
      "Liste de contacts propre",
      "Message pour vendre un site",
      "Suivi des demandes et ventes",
    ],
    tasks: [
      {
        id: "web-acq-01",
        title: "Choisir deux façons de toucher les bonnes personnes",
        outcome: "Les canaux correspondent à l'audience et au temps disponible.",
      },
      {
        id: "web-acq-02",
        title: "Préparer une liste de contacts propre et autorisée",
        outcome: "Les contacts sont utiles, compréhensibles et traités correctement.",
      },
      {
        id: "web-acq-03",
        title: "Écrire un premier message humain",
        outcome: "Le message parle d'une situation concrète et ne force pas la vente.",
      },
      {
        id: "web-acq-04",
        title: "Présenter l'offre de site à une entreprise précise",
        outcome: "La démonstration fait voir ce que le site peut changer pour elle.",
      },
      {
        id: "web-acq-05",
        title: "Publier ce que le travail apprend",
        outcome: "Le contenu montre des décisions réelles plutôt que des promesses vagues.",
      },
      {
        id: "web-acq-06",
        title: "Mesurer les réponses, rendez-vous et ventes",
        outcome: "On regarde les étapes utiles, pas seulement le nombre de clics.",
      },
      {
        id: "web-acq-agency-01",
        title: "Transformer une livraison en exemple réutilisable",
        outcome: "L'exemple respecte le client et peut être adapté à une nouvelle cible.",
        tracks: ["agence"],
      },
    ],
    finishLine:
      "On peut avancer quand une entreprise précise répond, qu'une prochaine étape est posée et que la vente d'un site peut être répétée.",
  },
  {
    id: "qa-capitalisation",
    marker: "09",
    title: "Améliorer les ventes de sites et protéger la marge",
    promise:
      "Tu observes ce qui aide à vendre, produire et livrer des sites, puis tu corriges avant de transformer l'apprentissage en méthode.",
    why:
      "Le premier résultat ne prouve pas encore un business. Il faut regarder les ventes, les délais, la marge, les objections et la qualité de livraison.",
    deliverables: [
      "Relecture d'un site vendu",
      "Marge par projet",
      "Méthodes réutilisables",
      "Suivi 30, 60 et 90 jours",
    ],
    tasks: [
      {
        id: "web-qa-01",
        title: "Tester le site et l'offre dans leur vrai contexte",
        outcome: "Le site, les supports, les messages et les actions restent utilisables par les bonnes personnes.",
      },
      {
        id: "web-qa-02",
        title: "Vérifier les demandes, ventes et mesures",
        outcome: "Une réponse, une commande ou une livraison arrive au bon endroit et peut être suivie.",
      },
      {
        id: "web-qa-03",
        title: "Noter ce qui s'est répété ou bloqué",
        outcome: "Les apprentissages sont séparés des impressions rapides.",
      },
      {
        id: "web-qa-04",
        title: "Éviter qu'une erreur revienne",
        outcome: "Les problèmes importants sont couverts par une vérification simple.",
      },
      {
        id: "web-qa-05",
        title: "Préparer le suivi à 30, 60 et 90 jours",
        outcome: "Les prochaines décisions ont une date, une mesure et un effet attendu sur l'activité.",
      },
      {
        id: "web-qa-agency-01",
        title: "Faire relire une méthode avant de la généraliser",
        outcome: "Une réussite isolée ne devient pas automatiquement la règle de toute l'équipe.",
        tracks: ["agence"],
      },
      {
        id: "web-qa-agency-02",
        title: "Faire reprendre le système par un collaborateur",
        outcome: "Les écarts restants sont visibles avant de transmettre la méthode.",
        tracks: ["agence"],
      },
    ],
    finishLine:
      "On peut avancer quand les ventes, délais, coûts et reprises sont visibles et que ce qui fonctionne peut servir à un autre site.",
    trackFinishLine: {
      agence:
        "Au moins une méthode a été transmise, exécutée, relue et rendue réversible avant d'être généralisée.",
    },
  },
];

export type ThemeGuidance = {
  competency: string;
  milestone: string;
  autonomyTip: string;
};

export const THEME_GUIDANCE: Record<string, ThemeGuidance> = {
  diagnostic: {
    competency: "Cadrer une offre de site web et une première vente avant de toucher à l'outil.",
    milestone: "Une entreprise précise, une offre de site et la prochaine décision tiennent en une minute.",
    autonomyTip: "Demande à l'agent de reformuler la valeur du site, la cible et la prochaine action commerciale avant de produire.",
  },
  "business-copy": {
    competency: "Transformer une offre de site floue en proposition que les bonnes entreprises comprennent.",
    milestone: "Une entreprise comprend le problème traité par le site, ce qu'elle reçoit et comment commencer.",
    autonomyTip: "Fais proposer trois angles, puis garde celui qui parle le plus précisément au problème réel et à la valeur créée.",
  },
  "references-da": {
    competency: "Choisir une direction visuelle au service de la valeur du site et des preuves.",
    milestone: "Tu peux expliquer pourquoi ton site doit avoir cette allure et ce qu'elle doit faire comprendre.",
    autonomyTip: "Donne à l'agent des références, leur usage et tes interdits, jamais seulement le mot moderne.",
  },
  "design-system-assets": {
    competency: "Poser des règles pour produire des sites cohérents et réutilisables.",
    milestone: "Un nouveau site peut être créé sans réinventer l'identité ou le message.",
    autonomyTip: "Demande une vérification des règles et de l'usage réel avant d'ajouter une nouveauté.",
  },
  "build-stack": {
    competency: "Construire, versionner, relire et livrer un site web vendable.",
    milestone: "Le site fonctionne, se présente à un client et peut être repris après une erreur.",
    autonomyTip: "Demande un plan avant la production et une preuve après chaque livraison.",
  },
  connected: {
    competency: "Ajouter une connexion seulement quand elle raccourcit la vente ou sécurise la livraison.",
    milestone: "Chaque donnée, accès et action a une raison business et un cas d'erreur prévu.",
    autonomyTip: "Fais expliciter ce qui est stocké, qui y accède et comment l'échec est géré.",
  },
  "seo-geo": {
    competency: "Relier l'offre de site à une recherche, une conversation et une intention réelle.",
    milestone: "Chaque contenu répond à une question précise et peut ouvrir une demande de site.",
    autonomyTip: "Demande des sources et sépare toujours ce qui est vérifié de ce qui est supposé.",
  },
  "launch-acquisition": {
    competency: "Transformer une offre de site et ses preuves en demandes commerciales.",
    milestone: "Tu as une audience, un canal, un message et un signal de vente de site à observer.",
    autonomyTip: "Commence par une audience précise et mesure les réponses, rendez-vous et ventes, pas seulement les visites.",
  },
  "qa-capitalisation": {
    competency: "Apprendre du réel, protéger ta marge et scaler une activité de sites web.",
    milestone: "Tu sais quoi garder, corriger et transmettre pour vendre et livrer plus de sites proprement.",
    autonomyTip: "Après chaque vente ou livraison, note un fait observé, une décision et un test pour la suite.",
  },
};

export const SITE_WEB_THEME_IDS = THEMES.map((theme) => theme.id);

export function themeCheckId(themeId: string) {
  return `web-theme-${themeId}`;
}

export function getThemeGuidance(themeId: string): ThemeGuidance {
  const theme = THEMES.find((item) => item.id === themeId);
  return (
    THEME_GUIDANCE[themeId] ?? {
      competency: theme?.promise ?? "Comprendre ce que ce thème rend possible.",
      milestone: theme?.finishLine ?? "Une étape concrète peut être montrée.",
      autonomyTip: "Demande à l'agent de reformuler le contexte avant d'agir.",
    }
  );
}

export function isThemeUnderstood(
  themeId: string,
  track: AccompanimentTrack,
  completedItemIds: Set<string>
) {
  if (completedItemIds.has(themeCheckId(themeId))) return true;
  const theme = THEMES.find((item) => item.id === themeId);
  if (!theme) return false;
  const tasks = theme.tasks.filter((task) => !task.tracks || task.tracks.includes(track));
  return tasks.length > 0 && tasks.every((task) => completedItemIds.has(task.id));
}

export const PHASES = THEMES;

export const OUTCOMES = [
  "Une offre de sites web que les bons clients comprennent",
  "Des sites et preuves qui renforcent la confiance",
  "Un site réel que tu peux vendre et livrer",
  "Un parcours simple entre demande, vente et livraison",
  "Des signaux pour augmenter le volume sans perdre la marge",
  "Une méthode réutilisable pour scaler ton activité web",
];

export const TOOL_LAYERS = [
  { label: "Comprendre", tools: "Marché, entreprise cliente, problème et offre de site" },
  { label: "Préparer", tools: "Brief, copy, références, preuves et direction du site" },
  { label: "Produire", tools: "Outils de création web, versions, relecture et livraison" },
  { label: "Relier", tools: "Formulaires, CRM, paiements et automatisations utiles au site" },
  { label: "Vendre", tools: "Canaux, conversations, propositions de sites et suivi" },
  { label: "Apprendre", tools: "Ventes, délais, marge, retours et méthodes réutilisables" },
];

export type SiteWebFollowUpProfile = {
  name: string;
  company: string;
  project: string;
  siteUrl: string;
  track: AccompanimentTrack;
};

export type SiteWebFollowUpValues = {
  baseline: string;
  day30: string;
  day60: string;
  day90: string;
  metrics: string;
  observations: string;
};

function escapeInlineMarkdown(value: string) {
  return value
    .replace(/\r/g, "")
    .trim()
    .replace(/([\\`*_[\]{}()#+.!|>~-])/g, "\\$1");
}

function safeTextBlock(value: string, fallback: string) {
  const text = value.replace(/\r/g, "").trim() || fallback;
  const longestTicks = Math.max(0, ...[...text.matchAll(/`+/g)].map((match) => match[0].length));
  const fence = "`".repeat(Math.max(3, longestTicks + 1));
  return `${fence}text\n${text}\n${fence}`;
}

function fileSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function buildSiteWebFollowUpFilename(profile: SiteWebFollowUpProfile) {
  return `suivi-site-web-${fileSlug(profile.company || profile.name || "client")}.md`;
}

export function buildSiteWebFollowUpMarkdown({
  profile,
  followUp,
  completed,
  themeIds,
  exportedAt = new Date(),
}: {
  profile: SiteWebFollowUpProfile;
  followUp: SiteWebFollowUpValues;
  completed: string[];
  themeIds?: string[];
  exportedAt?: Date;
}) {
  const completedSet = new Set(completed);
  const visibleThemes = THEMES.filter((theme) => !themeIds || themeIds.includes(theme.id));
  const completedVisible = visibleThemes.filter((theme) =>
    isThemeUnderstood(theme.id, profile.track, completedSet)
  ).length;
  const progress = visibleThemes.length
    ? Math.round((completedVisible / visibleThemes.length) * 100)
    : 0;
  const track = TRACKS.find((item) => item.id === profile.track)?.shortLabel ?? profile.track;
  const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(exportedAt);
  const themeSections = visibleThemes
    .map((theme) => {
      const guidance = getThemeGuidance(theme.id);
      const status = isThemeUnderstood(theme.id, profile.track, completedSet)
        ? "Compris"
        : "À travailler";
      return [
        `### ${theme.marker} · ${theme.title}`,
        `Statut : ${status}`,
        `Compétence gagnée : ${guidance.competency}`,
        `Étape franchie : ${guidance.milestone}`,
        `Repère avec ton agent : ${guidance.autonomyTip}`,
      ].join("\n\n");
    })
    .join("\n\n");

  return (
    `# Guide d'autonomie · Vente de sites web avec l'IA\n\n` +
    `Ce guide t'aide à continuer seul après les séances. Tu peux le donner à un agent IA comme contexte de travail, ou le garder comme repère.\n\n` +
    `Client : ${escapeInlineMarkdown(profile.name)}\n\n` +
    `Entreprise : ${escapeInlineMarkdown(profile.company)}\n\n` +
    `Projet : ${escapeInlineMarkdown(profile.project)}\n\n` +
    `Lien principal : ${escapeInlineMarkdown(profile.siteUrl) || "Non renseigné"}\n\n` +
    `Point de départ : ${track}\n\n` +
    `Exporté le : ${date}\n\n` +
    `Progression : ${completedVisible}/${visibleThemes.length} thèmes compris, soit ${progress} %\n\n` +
    `## Travailler avec un agent IA\n\n` +
    `1. Donne le contexte avant la demande : projet, personne visée, offre, contraintes et résultat attendu.\n` +
    `2. Demande une reformulation avant l'exécution. Si le problème est mal compris, arrête-toi là.\n` +
    `3. Sépare le plan et l'exécution : fais d'abord nommer les étapes, les risques et les vérifications.\n` +
    `4. Demande une preuve après l'action : test, aperçu, comparaison ou mesure réelle.\n` +
    `5. Garde les décisions importantes dans ce guide au lieu de les laisser disparaître dans une conversation.\n\n` +
    `### Prompt de départ\n\n` +
    safeTextBlock(
      "Voici le contexte de mon projet. Commence par reformuler le résultat attendu, les personnes concernées et la prochaine décision. Ne produis pas encore de code. Signale ce qui manque ou ce qui est incertain. Après validation, propose un plan court, puis exécute une étape à la fois avec une vérification.",
      "Commence par reformuler le contexte avant d'agir."
    ) +
    `\n\n## Tes thèmes\n\n` +
    themeSections +
    `\n\n## Quand tu bloques\n\n` +
    `Reviens au dernier résultat vérifiable. Décris ce qui devait se passer, ce qui s'est réellement passé et la dernière modification. Demande à l'agent de chercher la cause avant de proposer une correction. Ne change pas plusieurs variables à la fois.\n\n` +
    `## Après les premières ventes ou livraisons\n\n` +
    `À 30 jours : ${escapeInlineMarkdown(followUp.day30)}\n\n` +
    `À 60 jours : ${escapeInlineMarkdown(followUp.day60)}\n\n` +
    `À 90 jours : ${escapeInlineMarkdown(followUp.day90)}\n\n` +
    `Ce que tu regardes : ${escapeInlineMarkdown(followUp.metrics)}\n\n` +
    `## Notes personnelles\n\n${safeTextBlock(followUp.observations, "Ajoute ici les décisions ou apprentissages que tu veux retrouver.")}\n\n` +
    `## Règle de suite\n\n` +
    `Garde ce qui est compris, vérifié, réutilisable et relié à un résultat. Une réussite isolée devient une piste, pas une règle générale.\n`
  );
}
