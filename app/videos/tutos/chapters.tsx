export type CurriculumSectionKey = "start" | "first-workflow" | "reliable" | "team";

export type ChapterMeta = {
  path: string;
  group: "socle" | "entreprise";
  section: CurriculumSectionKey;
  order: number;
  displayTitle: string;
  summary: string;
  illustrationId: string;
};

export const CURRICULUM_SECTIONS: Array<{
  key: CurriculumSectionKey;
  title: string;
  intro: string;
}> = [
  {
    key: "start",
    title: "1. Partir du travail réel",
    intro: "Observe une tâche récente, définis le résultat accepté et prépare un premier essai en lecture seule.",
  },
  {
    key: "first-workflow",
    title: "2. Construire un workflow borné",
    intro: "Découpe le travail, charge le contexte utile, limite les outils et prépare une reprise avant toute action externe.",
  },
  {
    key: "reliable",
    title: "3. Prouver puis réutiliser",
    intro: "Teste les cas normaux et les cas qui cassent, mesure le résultat complet et garde seulement les méthodes qui tiennent.",
  },
  {
    key: "team",
    title: "4. Relier les métiers",
    intro: "Fais circuler un dossier entre les rôles et les systèmes sans créer un agent qui voit et modifie tout.",
  },
];

export const CHAPTER_META: Record<string, ChapterMeta> = {
  "README.md": {
    path: "README.md",
    displayTitle: "Installer, cadrer et lancer un premier essai",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "start",
    order: 1,
    summary: "Installe le moteur, choisis un modèle, limite les outils et vérifie un cas fictif avant de connecter un système réel.",
  },
  "00-parcours.md": {
    path: "00-parcours.md",
    displayTitle: "Passer d'un problème à une méthode",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "start",
    order: 2,
    summary: "Distingue tâche, workflow, skill, permission et preuve, puis décris une fin qu'une autre personne peut contrôler.",
  },
  "01-diagnostic-et-offre.md": {
    path: "01-diagnostic-et-offre.md",
    displayTitle: "Diagnostiquer avant d'automatiser",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "start",
    order: 3,
    summary: "Rejoue un cas récent, sépare faits et inconnues, puis choisis la plus petite intervention qui peut résoudre le blocage.",
  },
  "02-decomposition-et-agents.md": {
    path: "02-decomposition-et-agents.md",
    displayTitle: "Découper le travail en lots contrôlables",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "first-workflow",
    order: 1,
    summary: "Donne à chaque lot une entrée, une sortie, une source, des droits, une preuve et une personne qui peut reprendre.",
  },
  "03-connaissance-memoire-contexte.md": {
    path: "03-connaissance-memoire-contexte.md",
    displayTitle: "Organiser contexte, mémoire et sources",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "first-workflow",
    order: 2,
    summary: "Place chaque information dans la bonne couche, relis les données volatiles à la source et garde la mémoire courte.",
  },
  "04-evenements-inbox-execution.md": {
    path: "04-evenements-inbox-execution.md",
    displayTitle: "Faire avancer le travail du signal à la preuve",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "first-workflow",
    order: 3,
    summary: "Qualifie le signal, évite les doublons, trace l'effet et prépare la reprise avant de planifier une exécution.",
  },
  "05-autorite-outils-couts.md": {
    path: "05-autorite-outils-couts.md",
    displayTitle: "Borner les outils, les droits et les coûts",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "first-workflow",
    order: 4,
    summary: "Place une barrière devant l'action, teste le refus et suis le coût complet du workflow, appels auxiliaires inclus.",
  },
  "08-fiches-atelier.md": {
    path: "08-fiches-atelier.md",
    displayTitle: "Préparer un pilote reprenable",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "first-workflow",
    order: 5,
    summary: "Utilise des fiches pour rendre visibles le résultat, les inconnues, les interdits, les tests et la procédure d'arrêt.",
  },
  "06-preuve-iteration-skills.md": {
    path: "06-preuve-iteration-skills.md",
    displayTitle: "Prouver avant de garder une méthode",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "reliable",
    order: 1,
    summary: "Compare la méthode structurée à une consigne naïve et conserve les preuves, les contre-exemples et la condition de retrait.",
  },
  "07-methode-offre-transmission.md": {
    path: "07-methode-offre-transmission.md",
    displayTitle: "Transformer le terrain en capital de méthode",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "reliable",
    order: 2,
    summary: "Distille les choix et preuves d'un cas sans transférer ses données, ses permissions ni ses promesses.",
  },
  "09-message-decision-preuve.md": {
    path: "09-message-decision-preuve.md",
    displayTitle: "Écrire pour une décision réelle",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "reliable",
    order: 3,
    summary: "Relie une scène, une capacité, une preuve et une limite afin que la personne puisse choisir sans pression.",
  },
  "10-qualification-experimentation-premiere-valeur.md": {
    path: "10-qualification-experimentation-premiere-valeur.md",
    displayTitle: "Qualifier et livrer une première valeur",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "reliable",
    order: 4,
    summary: "Pose seulement les questions qui changent la route, puis livre un premier résultat que la personne peut inspecter.",
  },
  "entreprise-01-cerveau-federe.md": {
    path: "entreprise-01-cerveau-federe.md",
    displayTitle: "Relier l'équipe sans créer un super-agent",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 1,
    summary: "Garde les sources d'autorité dans chaque métier et construis une vue commune limitée aux décisions utiles.",
  },
  "entreprise-02-cartographie-poles.md": {
    path: "entreprise-02-cartographie-poles.md",
    displayTitle: "Cartographier les métiers par leurs passages",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 2,
    summary: "Suis des dossiers réels pour trouver les objets, versions, critères d'acceptation, refus et reprises entre les pôles.",
  },
  "entreprise-formats.md": {
    path: "entreprise-formats.md",
    displayTitle: "Donner une place et une date à chaque information",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 3,
    summary: "Choisis le format, le propriétaire, la fraîcheur et le traitement des copies pour chaque famille de données.",
  },
  "entreprise-04-competences-skills-sop.md": {
    path: "entreprise-04-competences-skills-sop.md",
    displayTitle: "Mettre le jugement dans une méthode testable",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 4,
    summary: "Écris les choix, exceptions, interdits et contrôles qui permettent à une autre personne ou à un agent de reprendre.",
  },
  "entreprise-05-outils-api-cli-mcp.md": {
    path: "entreprise-05-outils-api-cli-mcp.md",
    displayTitle: "Relier API, CLI et MCP sans élargir les droits",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 5,
    summary: "Vérifie chaque porte, filtre les outils, protège les secrets et relis l'effet exact avant une reprise.",
  },
  "entreprise-06-workflows-interpoles.md": {
    path: "entreprise-06-workflows-interpoles.md",
    displayTitle: "Faire passer un dossier entre les métiers",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 6,
    summary: "Conserve l'identifiant, la version, l'état de l'effet, la preuve et le prochain responsable à chaque passage.",
  },
  "entreprise-07-adoption-preuves-promotion.md": {
    path: "entreprise-07-adoption-preuves-promotion.md",
    displayTitle: "Commencer petit et garder une sortie",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 7,
    summary: "Mesure la situation de départ, teste un périmètre réversible et n'élargis qu'après avoir prouvé qualité, coût et récupération.",
  },
  "entreprise-08-templates-et-exercices.md": {
    path: "entreprise-08-templates-et-exercices.md",
    displayTitle: "Monter un dossier que l'équipe peut reprendre",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 8,
    summary: "Prépare les contrats, modèles et tests d'un pilote sans inventer les valeurs encore absentes.",
  },
  "entreprise-09-gouvernance-capacites-et-reprise.md": {
    path: "entreprise-09-gouvernance-capacites-et-reprise.md",
    displayTitle: "Gouverner, planifier et reprendre une capacité",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 9,
    summary: "Fixe le profil, le modèle, les outils, la destination, l'arrêt et l'état durable avant de planifier une tâche.",
  },
};

const CURRICULUM_SECTION_ORDER = new Map(
  CURRICULUM_SECTIONS.map((section, index) => [section.key, index]),
);

/** Keep the reader pager and the visible curriculum on the same path. */
export function orderCurriculumFiles<T extends { path: string }>(files: readonly T[]): T[] {
  return [...files].sort((left, right) => {
    const leftMeta = CHAPTER_META[left.path];
    const rightMeta = CHAPTER_META[right.path];
    const leftSection = leftMeta ? (CURRICULUM_SECTION_ORDER.get(leftMeta.section) ?? Number.MAX_SAFE_INTEGER) : Number.MAX_SAFE_INTEGER;
    const rightSection = rightMeta ? (CURRICULUM_SECTION_ORDER.get(rightMeta.section) ?? Number.MAX_SAFE_INTEGER) : Number.MAX_SAFE_INTEGER;

    if (leftSection !== rightSection) return leftSection - rightSection;
    const leftOrder = leftMeta?.order ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = rightMeta?.order ?? Number.MAX_SAFE_INTEGER;
    if (leftOrder !== rightOrder) return leftOrder - rightOrder;
    return left.path.localeCompare(right.path, "fr");
  });
}

export function chapterSlug(path: string): string {
  return path.replace(/\.md$/, "").toLowerCase();
}

export function chapterPathFromSlug(slug: string): string | undefined {
  return Object.keys(CHAPTER_META).find((path) => chapterSlug(path) === slug);
}
