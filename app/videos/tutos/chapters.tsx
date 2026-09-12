export type ChapterMeta = {
  path: string;
  group: "socle" | "entreprise";
  displayTitle: string;
  summary: string;
  illustrationId: string;
};

export const CHAPTER_META: Record<string, ChapterMeta> = {
  "README.md": {
    path: "README.md",
    displayTitle: "Hermes Agent : mode d'emploi",
    illustrationId: "hermes-agent-readme",
    group: "socle",
    summary: "Le mode d'emploi : ce que tu vas apprendre ici et ce que ces pages ne prétendent pas faire à ta place.",
  },
  "00-parcours.md": {
    path: "00-parcours.md",
    displayTitle: "Le parcours : produire un résultat et construire une méthode",
    illustrationId: "hermes-agent-00-parcours",
    group: "socle",
    summary: "Les mots de base pour ne pas confondre une idée, une recette, un projet et une preuve.",
  },
  "01-diagnostic-et-offre.md": {
    path: "01-diagnostic-et-offre.md",
    displayTitle: "Regarder le problème avant de sortir l'outil",
    illustrationId: "hermes-agent-01-diagnostic-et-offre",
    group: "socle",
    summary: "Regarder ce qui bloque vraiment avant de sortir un outil. Parfois, une règle claire suffit.",
  },
  "02-decomposition-et-agents.md": {
    path: "02-decomposition-et-agents.md",
    displayTitle: "Découper le travail et répartir les rôles",
    illustrationId: "hermes-agent-02-decomposition-et-agents",
    group: "socle",
    summary: "Découper un gros résultat en petites missions claires, puis donner à chacune le bon rôle.",
  },
  "03-connaissance-memoire-contexte.md": {
    path: "03-connaissance-memoire-contexte.md",
    displayTitle: "Ranger le savoir, la mémoire et le contexte",
    illustrationId: "hermes-agent-03-connaissance-memoire-contexte",
    group: "socle",
    summary: "Ranger le savoir comme dans un atelier : la source, le dossier en cours et ce qui est déjà décidé ne vont pas au même endroit.",
  },
  "04-evenements-inbox-execution.md": {
    path: "04-evenements-inbox-execution.md",
    displayTitle: "Faire avancer le travail du signal à la trace",
    illustrationId: "hermes-agent-04-evenements-inbox-execution",
    group: "socle",
    summary: "Faire avancer une demande du premier signal jusqu'à la trace de ce qui a vraiment été fait.",
  },
  "05-autorite-outils-couts.md": {
    path: "05-autorite-outils-couts.md",
    displayTitle: "Donner les bonnes clés, au bon moment",
    illustrationId: "hermes-agent-05-autorite-outils-couts",
    group: "socle",
    summary: "Donner les bonnes clés au bon moment, sans laisser une phrase dans un document ouvrir toutes les portes.",
  },
  "06-preuve-iteration-skills.md": {
    path: "06-preuve-iteration-skills.md",
    displayTitle: "Vérifier avant d'apprendre",
    illustrationId: "hermes-agent-06-preuve-iteration-skills",
    group: "socle",
    summary: "Vérifier le résultat, apprendre de l'erreur et ne garder une nouvelle règle que lorsqu'elle tient debout.",
  },
  "07-methode-offre-transmission.md": {
    path: "07-methode-offre-transmission.md",
    displayTitle: "Transformer le terrain en méthode",
    illustrationId: "hermes-agent-07-methode-offre-transmission",
    group: "socle",
    summary: "Transformer ce que le terrain t'apprend en méthode que quelqu'un d'autre peut reprendre.",
  },
  "08-fiches-atelier.md": {
    path: "08-fiches-atelier.md",
    displayTitle: "Les fiches pour préparer un essai",
    illustrationId: "hermes-agent-08-fiches-atelier",
    group: "socle",
    summary: "Les feuilles de travail pour préparer un essai sans inventer les chiffres, les droits ou les résultats.",
  },
  "entreprise-01-cerveau-federe.md": {
    path: "entreprise-01-cerveau-federe.md",
    displayTitle: "Une entreprise a une équipe, pas un super-agent",
    illustrationId: "hermes-agent-entreprise-01-cerveau-federe",
    group: "entreprise",
    summary: "Une entreprise n'a pas besoin d'un robot qui fait tout. Elle a besoin de rôles clairs qui savent qui décide, qui sait et qui agit.",
  },
  "entreprise-02-cartographie-poles.md": {
    path: "entreprise-02-cartographie-poles.md",
    displayTitle: "Faire la carte des métiers et des passages",
    illustrationId: "hermes-agent-entreprise-02-cartographie-poles",
    group: "entreprise",
    summary: "Faire la carte des métiers et des passages de relais, sans créer un agent pour chaque case de l'organigramme.",
  },
  "entreprise-formats.md": {
    path: "entreprise-formats.md",
    displayTitle: "Choisir où chaque information vit",
    illustrationId: "hermes-agent-entreprise-formats",
    group: "entreprise",
    summary: "Décider où chaque information vit : le manuel, le dossier en cours, le registre ou la porte d'échange.",
  },
  "entreprise-04-competences-skills-sop.md": {
    path: "entreprise-04-competences-skills-sop.md",
    displayTitle: "Rendre un savoir-faire transmissible",
    illustrationId: "hermes-agent-entreprise-04-competences-skills-sop",
    group: "entreprise",
    summary: "Prendre un savoir-faire dans la tête de quelqu'un et en faire une recette que l'équipe peut comprendre et vérifier.",
  },
  "entreprise-05-outils-api-cli-mcp.md": {
    path: "entreprise-05-outils-api-cli-mcp.md",
    displayTitle: "Relier les outils sans donner toutes les clés",
    illustrationId: "hermes-agent-entreprise-05-outils-api-cli-mcp",
    group: "entreprise",
    summary: "Relier les outils sans confondre la porte d'entrée avec le droit de déplacer quelque chose derrière.",
  },
  "entreprise-06-workflows-interpoles.md": {
    path: "entreprise-06-workflows-interpoles.md",
    displayTitle: "Faire traverser un dossier toute l'entreprise",
    illustrationId: "hermes-agent-entreprise-06-workflows-interpoles",
    group: "entreprise",
    summary: "Faire passer un même dossier de la demande à la livraison, sans perdre le fil entre les métiers.",
  },
  "entreprise-07-adoption-preuves-promotion.md": {
    path: "entreprise-07-adoption-preuves-promotion.md",
    displayTitle: "Commencer petit et élargir ce qui marche",
    illustrationId: "hermes-agent-entreprise-07-adoption-preuves-promotion",
    group: "entreprise",
    summary: "Commencer petit, mesurer ce qui se passe et n'élargir que ce qui fonctionne vraiment.",
  },
  "entreprise-08-templates-et-exercices.md": {
    path: "entreprise-08-templates-et-exercices.md",
    displayTitle: "Les modèles pour préparer un premier dossier",
    illustrationId: "hermes-agent-entreprise-08-templates-et-exercices",
    group: "entreprise",
    summary: "Les modèles pour préparer un premier dossier compréhensible par l'équipe, sans remplir les blancs au hasard.",
  },
};

export function chapterSlug(path: string): string {
  return path.replace(/\.md$/, "").toLowerCase();
}

export function chapterPathFromSlug(slug: string): string | undefined {
  return Object.keys(CHAPTER_META).find((path) => chapterSlug(path) === slug);
}

export const GROUP_LABELS: Record<ChapterMeta["group"], { title: string; intro: string }> = {
  socle: {
    title: "Comprendre le travail avant de le confier à l'IA",
    intro: "On part d'un problème réel, comme dans un atelier : on regarde le geste, les outils, les passages de relais et le résultat attendu avant de décider ce qui peut être aidé.",
  },
  entreprise: {
    title: "Faire travailler toute l'équipe dans le même sens",
    intro: "Quand plusieurs métiers touchent au même dossier, chacun garde son rôle, sa mémoire et ses limites. L'objectif est de faire circuler le travail sans perdre la décision en route.",
  },
};
