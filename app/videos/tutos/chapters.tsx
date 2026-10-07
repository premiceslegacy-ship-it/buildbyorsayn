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
    title: "1. Commencer par un vrai problème",
    intro: "Tu ne commences pas par une liste d'outils. Tu choisis une tâche qui revient, le résultat attendu et la décision qui doit rester humaine.",
  },
  {
    key: "first-workflow",
    title: "2. Construire ton premier workflow",
    intro: "Tu découpes le travail, ranges le contexte, choisis les bons droits et prépares une sortie que quelqu'un peut vérifier.",
  },
  {
    key: "reliable",
    title: "3. Le rendre fiable et réutilisable",
    intro: "Tu vérifies le résultat, gardes ce qui fonctionne sous forme de skill et transformes l'expérience en méthode, pas en promesse floue.",
  },
  {
    key: "team",
    title: "4. Le faire grandir dans une équipe",
    intro: "Quand le premier workflow tient, tu peux relier rôles, outils, dossiers et passages de relais sans créer un super-agent qui touche à tout.",
  },
];

export const CHAPTER_META: Record<string, ChapterMeta> = {
  "README.md": {
    path: "README.md",
    displayTitle: "Hermes Agent : mode d'emploi",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "start",
    order: 1,
    summary: "Ce que tu vas apprendre ici, ce que ces pages ne font pas à ta place et comment garder la main sur les décisions importantes.",
  },
  "00-parcours.md": {
    path: "00-parcours.md",
    displayTitle: "Le parcours : de la tâche au résultat",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "start",
    order: 2,
    summary: "Les mots utiles pour distinguer une idée, une règle, un workflow, une preuve et une tâche réellement terminée.",
  },
  "01-diagnostic-et-offre.md": {
    path: "01-diagnostic-et-offre.md",
    displayTitle: "Trouver ce qui bloque avant de choisir l'outil",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "start",
    order: 3,
    summary: "Regarder le geste répété, le retard ou l'erreur qui coûte vraiment avant de demander à une IA d'intervenir.",
  },
  "02-decomposition-et-agents.md": {
    path: "02-decomposition-et-agents.md",
    displayTitle: "Découper le travail et donner le bon rôle",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "first-workflow",
    order: 1,
    summary: "Découper un résultat en petites missions claires, puis savoir si une règle, un bot ou une personne est le bon choix.",
  },
  "03-connaissance-memoire-contexte.md": {
    path: "03-connaissance-memoire-contexte.md",
    displayTitle: "Mémoire, contexte et Second Brain : ne pas tout mélanger",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "first-workflow",
    order: 2,
    summary: "Séparer la source de vérité, le dossier en cours et la mémoire de travail pour pouvoir corriger, retrouver et vérifier.",
  },
  "04-evenements-inbox-execution.md": {
    path: "04-evenements-inbox-execution.md",
    displayTitle: "Du signal à la sortie : le workflow visible",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "first-workflow",
    order: 3,
    summary: "Faire avancer une demande depuis son signal jusqu'au rapport, brouillon ou prochain geste, sans perdre la trace en route.",
  },
  "05-autorite-outils-couts.md": {
    path: "05-autorite-outils-couts.md",
    displayTitle: "Les outils, les droits et le coût d'une action",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "first-workflow",
    order: 4,
    summary: "Lire, préparer, publier ou modifier un CRM ne sont pas la même chose. Chaque action a un droit, un coût et une limite.",
  },
  "08-fiches-atelier.md": {
    path: "08-fiches-atelier.md",
    displayTitle: "Préparer ton premier essai",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "first-workflow",
    order: 5,
    summary: "Des fiches simples pour définir l'entrée, la sortie, les limites et la vérification humaine avant de lancer un premier workflow.",
  },
  "06-preuve-iteration-skills.md": {
    path: "06-preuve-iteration-skills.md",
    displayTitle: "Vérifier avant de garder un skill",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "reliable",
    order: 1,
    summary: "Vérifier le résultat, apprendre de l'erreur et ne garder une nouvelle procédure que lorsqu'elle tient sur un vrai cas.",
  },
  "07-methode-offre-transmission.md": {
    path: "07-methode-offre-transmission.md",
    displayTitle: "Transformer ce qui marche en méthode",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "reliable",
    order: 2,
    summary: "Transformer une expérience de terrain en méthode compréhensible, transmissible et proportionnée à la preuve disponible.",
  },
  "09-message-decision-preuve.md": {
    path: "09-message-decision-preuve.md",
    displayTitle: "Faire un message qui aide vraiment à décider",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "reliable",
    order: 3,
    summary: "Partir d'une scène vécue, expliquer le changement possible et rendre la preuve lisible sans gonfler une promesse.",
  },
  "10-qualification-experimentation-premiere-valeur.md": {
    path: "10-qualification-experimentation-premiere-valeur.md",
    displayTitle: "Tester une idée et atteindre une première valeur",
    illustrationId: "hermes-agent-unified",
    group: "socle",
    section: "reliable",
    order: 4,
    summary: "Choisir un premier test utile, vérifier qu'il aide la bonne personne et apprendre avant d'élargir une capacité.",
  },
  "entreprise-01-cerveau-federe.md": {
    path: "entreprise-01-cerveau-federe.md",
    displayTitle: "Une équipe, pas un super-agent",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 1,
    summary: "Une entreprise n'a pas besoin d'un robot qui fait tout. Elle a besoin de rôles clairs qui savent qui décide, qui sait et qui agit.",
  },
  "entreprise-02-cartographie-poles.md": {
    path: "entreprise-02-cartographie-poles.md",
    displayTitle: "Faire la carte des métiers et des passages",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 2,
    summary: "Faire la carte des métiers et des passages de relais, sans créer un agent pour chaque case de l'organigramme.",
  },
  "entreprise-formats.md": {
    path: "entreprise-formats.md",
    displayTitle: "Choisir où chaque information vit",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 3,
    summary: "Décider où chaque information vit : le manuel, le dossier en cours, le registre ou la porte d'échange.",
  },
  "entreprise-04-competences-skills-sop.md": {
    path: "entreprise-04-competences-skills-sop.md",
    displayTitle: "Rendre un savoir-faire transmissible",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 4,
    summary: "Prendre un savoir-faire dans la tête de quelqu'un et en faire une recette que l'équipe peut comprendre et vérifier.",
  },
  "entreprise-05-outils-api-cli-mcp.md": {
    path: "entreprise-05-outils-api-cli-mcp.md",
    displayTitle: "Relier les outils sans donner toutes les clés",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 5,
    summary: "Relier les outils sans confondre la porte d'entrée avec le droit de déplacer quelque chose derrière.",
  },
  "entreprise-06-workflows-interpoles.md": {
    path: "entreprise-06-workflows-interpoles.md",
    displayTitle: "Faire traverser un dossier à l'équipe",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 6,
    summary: "Faire passer un dossier de la demande à la livraison, sans perdre le fil entre les métiers, les outils et les validations.",
  },
  "entreprise-07-adoption-preuves-promotion.md": {
    path: "entreprise-07-adoption-preuves-promotion.md",
    displayTitle: "Commencer petit, élargir ce qui marche",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 7,
    summary: "Commencer petit, mesurer ce qui se passe et n'élargir que ce qui fonctionne vraiment dans le contexte de l'équipe.",
  },
  "entreprise-08-templates-et-exercices.md": {
    path: "entreprise-08-templates-et-exercices.md",
    displayTitle: "Les modèles pour préparer un dossier d'équipe",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 8,
    summary: "Les modèles pour préparer un dossier compréhensible par l'équipe, sans remplir les blancs au hasard.",
  },
  "entreprise-09-gouvernance-capacites-et-reprise.md": {
    path: "entreprise-09-gouvernance-capacites-et-reprise.md",
    displayTitle: "Garder la main quand une capacité grandit",
    illustrationId: "hermes-agent-unified",
    group: "entreprise",
    section: "team",
    order: 9,
    summary: "Nommer qui décide, qui peut arrêter, comment reprendre le travail et quand une automatisation mérite de rester en place.",
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
