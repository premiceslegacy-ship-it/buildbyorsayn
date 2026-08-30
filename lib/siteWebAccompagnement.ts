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
      "Tu veux comprendre les bases et construire sans dépendre d'une suite de commandes que tu ne comprends pas.",
    adjustment:
      "On prend le temps de rendre chaque décision claire avant de passer à la suivante.",
  },
  {
    id: "experimente",
    label: "J'ai déjà livré",
    shortLabel: "J'ai déjà livré",
    description:
      "Tu as déjà produit des sites et tu veux surtout gagner en clarté, en qualité et en régularité.",
    adjustment:
      "On va directement sur les sujets qui te font encore perdre du temps ou de la qualité.",
  },
  {
    id: "agence",
    label: "Je travaille en équipe",
    shortLabel: "En équipe",
    description:
      "Tu veux qu'une équipe puisse produire avec le même niveau d'exigence, sans tout garder dans ta tête.",
    adjustment:
      "On précise qui décide, qui produit et qui relit, pour que le travail reste fiable quand il circule.",
  },
];

export const THEMES: AccompanimentTheme[] = [
  {
    id: "diagnostic",
    marker: "01",
    title: "Un projet clair avant de commencer",
    promise:
      "Tu sais ce que ton site doit changer, pour qui et quelle action il doit provoquer.",
    why:
      "Sans objectif précis, on fabrique une page agréable à regarder mais inutile pour l'activité.",
    deliverables: [
      "Objectif du site",
      "Personne à aider",
      "Projet de travail",
      "Ordre des sujets",
    ],
    tasks: [
      {
        id: "web-diagnostic-01",
        title: "Décrire ce que le site doit changer",
        outcome: "Un objectif formulé avec des mots simples.",
      },
      {
        id: "web-diagnostic-02",
        title: "Faire le point sur ce que tu sais déjà faire",
        outcome: "Les sujets à travailler sont identifiés sans refaire ce qui est déjà acquis.",
      },
      {
        id: "web-diagnostic-03",
        title: "Choisir le résultat à obtenir",
        outcome: "On sait à quoi ressemble une bonne sortie avant de commencer.",
      },
      {
        id: "web-diagnostic-04",
        title: "Fixer l'ordre de travail",
        outcome: "Le prochain sujet est évident et le calendrier reste adaptable.",
      },
      {
        id: "web-diagnostic-agency-01",
        title: "Décider qui fait quoi dans l'équipe",
        outcome: "Les décisions, la production et la relecture ont un responsable clair.",
        tracks: ["agence"],
      },
    ],
    finishLine:
      "On peut avancer quand le projet tient en une minute d'explication et que la prochaine action est claire.",
    trackFinishLine: {
      agence:
        "L'équipe sait aussi qui décide, qui produit, qui relit et qui échange avec le client.",
    },
  },
  {
    id: "business-copy",
    marker: "02",
    title: "Un message qui donne envie d'avancer",
    promise:
      "Ton site explique rapidement ce que tu proposes, à qui tu t'adresses et pourquoi agir maintenant.",
    why:
      "Un site ne rattrape pas une offre floue. Les bons mots viennent du problème réel, pas d'un vocabulaire de brochure.",
    deliverables: [
      "Offre lisible",
      "Message principal",
      "Réponses aux hésitations",
      "Action suivante",
    ],
    tasks: [
      {
        id: "web-copy-01",
        title: "Relier l'offre à la personne qui la cherche",
        outcome: "Le message correspond à une situation réelle et à un besoin précis.",
      },
      {
        id: "web-copy-02",
        title: "Reprendre les mots utilisés sur le terrain",
        outcome: "Les textes parlent comme les clients parlent.",
      },
      {
        id: "web-copy-03",
        title: "Écrire la promesse et l'action suivante",
        outcome: "La page dit ce que l'on gagne et quoi faire ensuite.",
      },
      {
        id: "web-copy-04",
        title: "Choisir les bons principes d'écriture",
        outcome: "Chaque choix sert la compréhension au lieu de remplir la page.",
      },
      {
        id: "web-copy-05",
        title: "Préparer une deuxième façon de présenter l'offre",
        outcome: "On peut comparer deux messages sans tout changer à la fois.",
      },
      {
        id: "web-copy-agency-01",
        title: "Fixer comment le texte client est préparé et relu",
        outcome: "Les sources, les retours et l'accord final ne dépendent pas d'un échange perdu.",
        tracks: ["agence"],
      },
    ],
    finishLine:
      "On peut avancer quand une personne extérieure comprend l'offre et l'action à faire sans explication orale.",
  },
  {
    id: "references-da",
    marker: "03",
    title: "Une direction qui donne confiance",
    promise:
      "Tu choisis l'allure du site pour servir le message, pas pour collectionner de belles images.",
    why:
      "Une référence peut aider pour une ambiance, une page, une animation ou un détail. Elle ne donne pas automatiquement la bonne réponse à ton projet.",
    deliverables: [
      "Références utiles",
      "Ce que l'on écarte",
      "Direction choisie",
      "Premier écran comparé",
    ],
    tasks: [
      {
        id: "web-da-01",
        title: "Choisir des références pour le bon usage",
        outcome: "Chaque référence a une raison d'être et un rôle précis.",
      },
      {
        id: "web-da-02",
        title: "Repérer ce qui crée l'impression recherchée",
        outcome: "On sait ce qui vient des mots, des images, des formes ou du rythme.",
      },
      {
        id: "web-da-03",
        title: "Comparer deux directions sur le vrai écran",
        outcome: "Le choix se fait sur le projet réel, pas sur deux tableaux d'inspiration.",
      },
      {
        id: "web-da-04",
        title: "Décider ce qui est gardé, adapté ou écarté",
        outcome: "Le site a sa propre personnalité sans copier une référence.",
      },
    ],
    finishLine:
      "On peut avancer quand le site inspire la bonne impression avant même que l'on regarde le logo.",
  },
  {
    id: "design-system-assets",
    marker: "04",
    title: "Des pages cohérentes partout",
    promise:
      "Tu poses des règles simples pour que chaque nouvelle page ressemble au même site, sur mobile comme sur ordinateur.",
    why:
      "Sans règles partagées, chaque nouvelle page repart de zéro et le site finit par se contredire.",
    deliverables: [
      "Règles visuelles du site",
      "Pages et cas importants",
      "Visuels cohérents",
      "Version mobile",
    ],
    tasks: [
      {
        id: "web-ds-01",
        title: "Fixer les règles visuelles du site",
        outcome: "Les couleurs, caractères, espacements et formes suivent une même logique.",
      },
      {
        id: "web-ds-02",
        title: "Prévoir les différents cas d'une page",
        outcome: "Les états normal, vide, en attente et en erreur restent compréhensibles.",
      },
      {
        id: "web-ds-03",
        title: "Choisir le bon format pour chaque visuel",
        outcome: "Chaque image, illustration ou schéma a un rôle et un format adapté.",
      },
      {
        id: "web-ds-04",
        title: "Créer une base visuelle réutilisable",
        outcome: "Une nouvelle page peut être produite sans inventer une nouvelle identité.",
      },
      {
        id: "web-ds-05",
        title: "Ajouter du mouvement seulement s'il aide à comprendre",
        outcome: "Les animations confirment une action ou une transition et restent discrètes.",
      },
      {
        id: "web-ds-06",
        title: "Relire le site comme un client",
        outcome: "Les décorations inutiles disparaissent et la page garde une hiérarchie nette.",
      },
      {
        id: "web-ds-agency-01",
        title: "Décider ce qui doit être relu par un senior",
        outcome: "L'équipe sait quelles décisions ne doivent pas être prises automatiquement.",
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
      "On peut avancer quand une autre personne comprend les règles et que le site reste clair sur petit écran.",
    trackFinishLine: {
      agence:
        "L'équipe dispose d'un exemple commun à produire et à relire, avec une règle simple en cas de désaccord.",
    },
  },
  {
    id: "build-stack",
    marker: "05",
    title: "Construire et mettre en ligne",
    promise:
      "Tu passes de l'idée à une version utilisable, que l'on peut relire, corriger et remettre en ligne sans repartir de zéro.",
    why:
      "Le bon outil compte moins que la capacité à comprendre ce qui a changé et à revenir en arrière quand il le faut.",
    deliverables: [
      "Espace de travail propre",
      "Versions conservées",
      "Version de test",
      "Site en ligne",
    ],
    tasks: [
      {
        id: "web-build-01",
        title: "Préparer l'espace de travail et les versions",
        outcome: "Le projet reste lisible et chaque modification peut être retrouvée.",
      },
      {
        id: "web-build-02",
        title: "Choisir l'outil adapté au projet",
        outcome: "On évite de prendre un outil plus compliqué que le besoin.",
      },
      {
        id: "web-build-03",
        title: "Construire les pages dans le bon ordre",
        outcome: "Chaque partie est vérifiée avant d'ajouter la suivante.",
      },
      {
        id: "web-build-04",
        title: "Partager une version de test",
        outcome: "Le site peut être relu sur un vrai appareil avant sa mise en ligne.",
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
      "On peut avancer quand le site est en ligne, compréhensible par une autre personne et récupérable après une erreur.",
    trackFinishLine: {
      agence:
        "La livraison peut être reprise par l'équipe sans dépendre de la mémoire du fondateur.",
    },
  },
  {
    id: "connected",
    marker: "06",
    title: "Ajouter seulement ce qui est nécessaire",
    promise:
      "Les formulaires, comptes, paiements ou automatisations ne sont ajoutés que s'ils servent vraiment le résultat.",
    why:
      "Dès qu'un site garde des informations ou déclenche une action, il faut protéger les personnes et prévoir les erreurs.",
    deliverables: [
      "Besoins utiles",
      "Informations protégées",
      "Actions autorisées",
      "Plan en cas d'erreur",
    ],
    tasks: [
      {
        id: "web-connected-01",
        title: "Décider ce que le site doit vraiment garder",
        outcome: "Les informations demandées ont une utilité claire.",
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
        outcome: "Le site explique quoi faire quand une information manque ou qu'une action échoue.",
      },
      {
        id: "web-connected-05",
        title: "Éviter les doublons quand une action est répétée",
        outcome: "Un clic répété ne crée pas deux paiements, deux demandes ou deux dossiers.",
      },
    ],
    finishLine:
      "On peut avancer quand chaque information a une raison, un accès prévu et une solution si quelque chose se passe mal.",
  },
  {
    id: "seo-geo",
    marker: "07",
    title: "Être trouvé par les bonnes personnes",
    promise:
      "Tes pages répondent aux bonnes recherches et tu peux voir ce qui attire vraiment des visiteurs.",
    why:
      "Être visible prend du temps. Il faut relier chaque page à une question réelle puis regarder ce qui se passe.",
    deliverables: [
      "Pages liées aux recherches",
      "Site lisible par les moteurs",
      "Suivi des recherches",
      "Plan d'amélioration",
    ],
    tasks: [
      {
        id: "web-seo-01",
        title: "Relier chaque page à une recherche réelle",
        outcome: "Chaque page répond à une intention précise.",
      },
      {
        id: "web-seo-02",
        title: "Aider les moteurs à comprendre le site",
        outcome: "Les titres, adresses et informations importantes sont propres.",
      },
      {
        id: "web-seo-03",
        title: "Voir les recherches qui amènent des visiteurs",
        outcome: "Les décisions viennent de recherches observées, pas d'une intuition seule.",
      },
      {
        id: "web-seo-04",
        title: "Décider ce qui peut être proposé ou publié",
        outcome: "Aucun texte automatique ne part sans relecture prévue.",
      },
      {
        id: "web-seo-05",
        title: "Répondre sans inventer d'autorité",
        outcome: "Les pages restent justes, utiles et reliées à des sources vérifiables.",
      },
    ],
    finishLine:
      "On peut avancer quand les pages sont compréhensibles par les moteurs et que les premières recherches peuvent être suivies.",
  },
  {
    id: "launch-acquisition",
    marker: "08",
    title: "Obtenir des demandes",
    promise:
      "Tu relies le site à quelques actions concrètes pour que les bonnes personnes puissent le découvrir et te contacter.",
    why:
      "Un site ne crée pas de demande dans le vide. Il devient utile quand il reçoit une attention qualifiée et apprend des réponses obtenues.",
    deliverables: [
      "Deux canaux de départ",
      "Liste de contacts propre",
      "Message de prise de contact",
      "Premières mesures",
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
        title: "Montrer le site à une personne précise",
        outcome: "La démonstration fait voir ce que le site peut changer pour elle.",
      },
      {
        id: "web-acq-05",
        title: "Publier ce que le travail apprend",
        outcome: "Le contenu montre des décisions réelles plutôt que des promesses vagues.",
      },
      {
        id: "web-acq-06",
        title: "Mesurer les réponses et les demandes",
        outcome: "On regarde les échanges utiles, pas seulement le nombre de clics.",
      },
      {
        id: "web-acq-agency-01",
        title: "Transformer une livraison en exemple réutilisable",
        outcome: "L'exemple respecte le client et peut être adapté à une nouvelle cible.",
        tracks: ["agence"],
      },
    ],
    finishLine:
      "On peut avancer quand le site reçoit une attention réelle et qu'une réponse permet de choisir la prochaine amélioration.",
  },
  {
    id: "qa-capitalisation",
    marker: "09",
    title: "Améliorer avec le réel",
    promise:
      "Tu vérifies ce qui fonctionne, tu corriges ce qui bloque et tu gardes une méthode réutilisable pour la suite.",
    why:
      "La mise en ligne n'est pas la fin. C'est le moment où l'on peut enfin apprendre des usages, des demandes et des erreurs réelles.",
    deliverables: [
      "Relecture complète",
      "Site vérifié en ligne",
      "Méthodes réutilisables",
      "Suivi 30, 60 et 90 jours",
    ],
    tasks: [
      {
        id: "web-qa-01",
        title: "Tester le site sur mobile et ordinateur",
        outcome: "Les pages, boutons et textes restent utilisables partout.",
      },
      {
        id: "web-qa-02",
        title: "Vérifier les demandes et les mesures",
        outcome: "Une demande envoyée arrive au bon endroit et peut être suivie.",
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
        outcome: "Les prochaines décisions ont une date et une mesure associée.",
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
      "On peut avancer quand le site est vérifié, que les prochaines mesures sont posées et que les apprentissages peuvent servir ailleurs.",
    trackFinishLine: {
      agence:
        "Au moins une méthode a été transmise, exécutée, relue et rendue réversible avant d'être généralisée.",
    },
  },
];

export const PHASES = THEMES;

export const OUTCOMES = [
  "Un site qui sert une offre et une action précises",
  "Un message que les bons clients comprennent",
  "Une direction visuelle cohérente et personnelle",
  "Un site en ligne que tu peux reprendre",
  "Des demandes reliées à des actions concrètes",
  "Une méthode que tu peux réutiliser",
];

export const TOOL_LAYERS = [
  { label: "Trouver des idées", tools: "Références visuelles, sites métier, exemples de pages" },
  { label: "Préparer", tools: "Plan des pages, textes, règles visuelles et visuels" },
  { label: "Construire", tools: "Outil de travail, versions, relecture et mise en ligne" },
  { label: "Relier", tools: "Demandes, informations, accès et automatisations si nécessaires" },
  { label: "Regarder", tools: "Recherches, visites, réponses et demandes reçues" },
  { label: "Garder", tools: "Décisions, vérifications, méthodes et exemples réutilisables" },
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
  exportedAt = new Date(),
}: {
  profile: SiteWebFollowUpProfile;
  followUp: SiteWebFollowUpValues;
  completed: string[];
  exportedAt?: Date;
}) {
  const completedSet = new Set(completed);
  const visibleTasks = THEMES.flatMap((theme) =>
    theme.tasks.filter((task) => !task.tracks || task.tracks.includes(profile.track))
  );
  const completedVisible = visibleTasks.filter((task) => completedSet.has(task.id)).length;
  const progress = visibleTasks.length
    ? Math.round((completedVisible / visibleTasks.length) * 100)
    : 0;
  const track = TRACKS.find((item) => item.id === profile.track)?.shortLabel ?? profile.track;
  const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(exportedAt);
  const themeSections = THEMES.map((theme) => {
    const tasks = theme.tasks.filter(
      (task) => !task.tracks || task.tracks.includes(profile.track)
    );
    const taskLines = tasks
      .map(
        (task) =>
          `${completedSet.has(task.id) ? "- [x]" : "- [ ]"} ${task.title}\n  Résultat visé : ${task.outcome}`
      )
      .join("\n");
    const trackLine = theme.trackFinishLine?.[profile.track];
    const finishLine = trackLine ? `${theme.finishLine} ${trackLine}` : theme.finishLine;
    return `## ${theme.marker} : ${theme.title}\n\nÀ la fin de ce thème : ${theme.promise}\n\nQuand on peut avancer : ${finishLine}\n\n${taskLines}`;
  }).join("\n\n");

  return (
    `# Suivi de l'accompagnement : Site Web\n\n` +
    `Client : ${escapeInlineMarkdown(profile.name)}\n\n` +
    `Entreprise : ${escapeInlineMarkdown(profile.company)}\n\n` +
    `Projet : ${escapeInlineMarkdown(profile.project)}\n\n` +
    `URL : ${escapeInlineMarkdown(profile.siteUrl) || "Non renseignée"}\n\n` +
    `Point de départ : ${track}\n\n` +
    `Exporté le : ${date}\n\n` +
    `Progression : ${completedVisible}/${visibleTasks.length} tâches, soit ${progress} %\n\n` +
    `## Départ et état de sortie\n\n${safeTextBlock(followUp.baseline, "À compléter pendant la revue de clôture.")}\n\n` +
    `## Mesures à suivre\n\n${safeTextBlock(followUp.metrics, "Aucune mesure renseignée.")}\n\n` +
    `## À 30 jours\n\n${safeTextBlock(followUp.day30, "À compléter.")}\n\n` +
    `## À 60 jours\n\n${safeTextBlock(followUp.day60, "À compléter.")}\n\n` +
    `## À 90 jours\n\n${safeTextBlock(followUp.day90, "À compléter.")}\n\n` +
    `## Notes de suivi\n\n${safeTextBlock(followUp.observations, "Aucune note renseignée.")}\n\n` +
    `## Règle de suite\n\nOn ne transforme pas une réussite isolée en règle générale. On garde ce qui est compris, mesuré, réutilisable et relu.\n\n` +
    `## Thèmes de travail\n\n` +
    themeSections +
    "\n"
  );
}
