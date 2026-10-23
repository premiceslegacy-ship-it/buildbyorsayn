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
    title: "1. Installer et choisir le travail",
    intro: "Vérifie l'outil sans donnée client, puis choisis une tâche réelle qui se termine clairement.",
  },
  {
    key: "first-workflow",
    title: "2. Construire ton premier workflow",
    intro: "Découpe la tâche, donne le bon contexte et place ta validation avant chaque action sensible.",
  },
  {
    key: "reliable",
    title: "3. Tester et garder ce qui marche",
    intro: "Teste la méthode, garde le savoir-faire utile et montre une offre qu'un prospect peut comprendre.",
  },
  {
    key: "team",
    title: "4. Relier le travail de l'équipe",
    intro: "Fais circuler un dossier entre les métiers sans donner toutes les données et tous les droits au même agent.",
  },
];

export const CHAPTER_META: Record<string, ChapterMeta> = {
  "README.md": {
    path: "README.md",
    displayTitle: "Installe ton agent et fais un premier essai sans risque",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "start",
    order: 1,
    summary: "Tu vérifies le terminal avant de connecter une boîte mail ou un compte client. Tu apprends les mots simples : tâche, workflow, skill, outil et validation.",
  },
  "01-diagnostic-et-offre.md": {
    path: "01-diagnostic-et-offre.md",
    displayTitle: "Regarde la dernière fois où le travail a bloqué",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "start",
    order: 2,
    summary: "Tu suis un devis récent pour trouver la vraie cause du retard.",
  },
  "02-decomposition-et-agents.md": {
    path: "02-decomposition-et-agents.md",
    displayTitle: "Découpe le travail pour pouvoir le reprendre",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "first-workflow",
    order: 1,
    summary: "Chaque partie reçoit une entrée, une sortie et un responsable.",
  },
  "03-connaissance-memoire-contexte.md": {
    path: "03-connaissance-memoire-contexte.md",
    displayTitle: "Donne-lui une identité, une mémoire et le bon contexte",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "first-workflow",
    order: 2,
    summary: "Tu écris SOUL.md et tu sépares ce qu'il est, ce qu'il apprend et ce que le projet exige.",
  },
  "04-evenements-inbox-execution.md": {
    path: "04-evenements-inbox-execution.md",
    displayTitle: "Fais entrer un message et suis ce qu'il devient",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "first-workflow",
    order: 3,
    summary: "Telegram, WhatsApp ou Slack ouvrent un dossier au lieu de lancer une action aveugle.",
  },
  "05-autorite-outils-couts.md": {
    path: "05-autorite-outils-couts.md",
    displayTitle: "Choisis ses outils, ses droits et son budget",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "first-workflow",
    order: 4,
    summary: "Tu places une validation devant chaque action sensible.",
  },
  "08-pilote-comprehensible.md": {
    path: "08-pilote-comprehensible.md",
    displayTitle: "Prépare un pilote qu'un collègue peut comprendre",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "first-workflow",
    order: 5,
    summary: "Tu réunis la mission, les outils, les cas difficiles et la façon d'arrêter, sans inventer les cases vides.",
  },
  "08-dossier-final-et-passation.md": {
    path: "08-dossier-final-et-passation.md",
    displayTitle: "Range le dossier final pour qu'on puisse reprendre ton pilote",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "first-workflow",
    order: 6,
    summary: "Tu ranges le pilote en quatre dossiers, avec un contrat de mission, une fiche d'outil et un compte rendu de passage.",
  },
  "06-preuve-iteration-skills.md": {
    path: "06-preuve-iteration-skills.md",
    displayTitle: "Teste la méthode avant d'en faire un skill",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "reliable",
    order: 1,
    summary: "Tu compares cinq cas et tu gardes les erreurs qui apprennent quelque chose.",
  },
  "07-methode-offre-transmission.md": {
    path: "07-methode-offre-transmission.md",
    displayTitle: "Garde ce qui rend le prochain projet plus facile",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "reliable",
    order: 2,
    summary: "Tu transformes une bonne pratique en règle, modèle ou skill versionné.",
  },
  "09-message-decision-preuve.md": {
    path: "09-message-decision-preuve.md",
    displayTitle: "Explique ce que tu fais sans vendre de magie",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "reliable",
    order: 3,
    summary: "Tu montres la scène, le travail préparé, la preuve et la validation humaine.",
  },
  "10-qualification-experimentation-premiere-valeur.md": {
    path: "10-qualification-experimentation-premiere-valeur.md",
    displayTitle: "Pose peu de questions et livre une première valeur",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "reliable",
    order: 4,
    summary: "Tu qualifies un prospect, prépares un devis et laisses la personne décider.",
  },
  "entreprise-01-cerveau-federe.md": {
    path: "entreprise-01-cerveau-federe.md",
    displayTitle: "Relie l'équipe sans fabriquer un agent qui voit tout",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 1,
    summary: "Chaque métier garde sa source et son responsable.",
  },
  "entreprise-02-cartographie-poles.md": {
    path: "entreprise-02-cartographie-poles.md",
    displayTitle: "Suis le dossier quand il change de métier",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 2,
    summary: "Tu repères les passages entre marketing, vente, production, support et finance.",
  },
  "entreprise-formats.md": {
    path: "entreprise-formats.md",
    displayTitle: "Range chaque information là où elle reste vraie",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 3,
    summary: "Le CRM garde le prospect, la messagerie garde l'échange et le dossier garde le livrable.",
  },
  "entreprise-04-competences-skills-sop.md": {
    path: "entreprise-04-competences-skills-sop.md",
    displayTitle: "Transforme le savoir-faire de l'équipe en skills",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 4,
    summary: "Tu écris les choix, les interdits, les exemples et les tests.",
  },
  "entreprise-05-outils-api-cli-mcp.md": {
    path: "entreprise-05-outils-api-cli-mcp.md",
    displayTitle: "Connecte les bons outils, pas tous les outils",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 5,
    summary: "Tu distingues API, ligne de commande et MCP avec des exemples concrets.",
  },
  "entreprise-06-workflows-interpoles.md": {
    path: "entreprise-06-workflows-interpoles.md",
    displayTitle: "Fais passer un prospect de la pub au suivi client",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 6,
    summary: "Chaque outil fait une chose et chaque validation a un propriétaire.",
  },
  "entreprise-07-adoption-preuves-promotion.md": {
    path: "entreprise-07-adoption-preuves-promotion.md",
    displayTitle: "Commence petit et élargis seulement ce qui marche",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 7,
    summary: "Tu mesures la qualité, le coût et la reprise avant d'ajouter des droits.",
  },
  "entreprise-09-gouvernance-capacites-et-reprise.md": {
    path: "entreprise-09-gouvernance-capacites-et-reprise.md",
    displayTitle: "Planifie sans perdre le contrôle",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 8,
    summary: "Tu lances d'abord la tâche à la main, puis tu ajoutes un horaire, une destination et un arrêt.",
  },
};

export const CHAPTER_REDIRECTS = {
  "00-parcours": "readme",
  "08-fiches-atelier": "08-pilote-comprehensible",
  "entreprise-08-templates-et-exercices": "08-dossier-final-et-passation",
} as const;

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

const HERMES_START_PATHS = [
  { intent: "Commencer au début", path: "README.md" },
  { intent: "Obtenir un premier résultat", path: "10-qualification-experimentation-premiere-valeur.md" },
  { intent: "Hermes est déjà installé", path: "01-diagnostic-et-offre.md" },
] as const;

export function hermesStartPoints<T extends { path: string }>(files: readonly T[]) {
  const available = new Map(files.map((file) => [file.path, file]));
  return HERMES_START_PATHS.flatMap(({ intent, path }) => {
    const file = available.get(path);
    const meta = CHAPTER_META[path];
    return file && meta ? [{ intent, file, meta }] : [];
  });
}

export function chapterPathFromSlug(slug: string): string | undefined {
  return Object.keys(CHAPTER_META).find((path) => chapterSlug(path) === slug);
}

export function chapterRedirectFromSlug(slug: string): string | undefined {
  return CHAPTER_REDIRECTS[slug as keyof typeof CHAPTER_REDIRECTS];
}
