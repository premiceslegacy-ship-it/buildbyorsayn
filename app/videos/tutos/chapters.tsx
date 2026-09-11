export type ChapterMeta = {
  path: string;
  group: "socle" | "entreprise";
  summary: string;
  illustrationId: string;
};

export const CHAPTER_META: Record<string, ChapterMeta> = {
  "README.md": {
    path: "README.md",
    illustrationId: "hermes-agent-readme",
    group: "socle",
    summary: "Statut du corpus, mode de lecture et limites : une synthèse pédagogique, pas une preuve de déploiement.",
  },
  "00-parcours.md": {
    path: "00-parcours.md",
    illustrationId: "hermes-agent-00-parcours",
    group: "socle",
    summary: "Le parcours et le vocabulaire communs : doctrine, méthode, procédure, projet, preuve.",
  },
  "01-diagnostic-et-offre.md": {
    path: "01-diagnostic-et-offre.md",
    illustrationId: "hermes-agent-01-diagnostic-et-offre",
    group: "socle",
    summary: "Partir du problème observé, pas de la capacité technique, avant de choisir une réponse.",
  },
  "02-decomposition-et-agents.md": {
    path: "02-decomposition-et-agents.md",
    illustrationId: "hermes-agent-02-decomposition-et-agents",
    group: "socle",
    summary: "Découper un résultat en lots vérifiables et composer l'équipe minimale suffisante.",
  },
  "03-connaissance-memoire-contexte.md": {
    path: "03-connaissance-memoire-contexte.md",
    illustrationId: "hermes-agent-03-connaissance-memoire-contexte",
    group: "socle",
    summary: "Séparer sources, connaissance qualifiée, contexte et mémoire pour éviter les promotions abusives.",
  },
  "04-evenements-inbox-execution.md": {
    path: "04-evenements-inbox-execution.md",
    illustrationId: "hermes-agent-04-evenements-inbox-execution",
    group: "socle",
    summary: "Percevoir, décider, exécuter, tracer - la boucle qui ne s'arrête pas à une réponse produite.",
  },
  "05-autorite-outils-couts.md": {
    path: "05-autorite-outils-couts.md",
    illustrationId: "hermes-agent-05-autorite-outils-couts",
    group: "socle",
    summary: "Une règle écrite n'est pas une barrière technique : borner autorité, outils, secrets et coûts.",
  },
  "06-preuve-iteration-skills.md": {
    path: "06-preuve-iteration-skills.md",
    illustrationId: "hermes-agent-06-preuve-iteration-skills",
    group: "socle",
    summary: "Vérifier avant de livrer, transformer l'erreur en connaissance sans créer de règle fragile.",
  },
  "07-methode-offre-transmission.md": {
    path: "07-methode-offre-transmission.md",
    illustrationId: "hermes-agent-07-methode-offre-transmission",
    group: "socle",
    summary: "Du terrain à la méthode transmissible, puis à l'offre et aux actifs réutilisables.",
  },
  "08-fiches-atelier.md": {
    path: "08-fiches-atelier.md",
    illustrationId: "hermes-agent-08-fiches-atelier",
    group: "socle",
    summary: "Les fiches pratiques pour cadrer un essai et préparer sa revue - à compléter, pas à copier.",
  },
  "entreprise-01-cerveau-federe.md": {
    path: "entreprise-01-cerveau-federe.md",
    illustrationId: "hermes-agent-entreprise-01-cerveau-federe",
    group: "entreprise",
    summary: "Une entreprise AI-first a une organisation, pas un super-agent : quatre responsabilités séparées.",
  },
  "entreprise-02-cartographie-poles.md": {
    path: "entreprise-02-cartographie-poles.md",
    illustrationId: "hermes-agent-entreprise-02-cartographie-poles",
    group: "entreprise",
    summary: "Cartographier tous les pôles réellement présents, sans créer un agent par métier.",
  },
  "entreprise-formats.md": {
    path: "entreprise-formats.md",
    illustrationId: "hermes-agent-entreprise-formats",
    group: "entreprise",
    summary: "Choisir un format selon la responsabilité : doctrine, objets métier vivants, contrats d'échange.",
  },
  "entreprise-04-competences-skills-sop.md": {
    path: "entreprise-04-competences-skills-sop.md",
    illustrationId: "hermes-agent-entreprise-04-competences-skills-sop",
    group: "entreprise",
    summary: "Transformer les compétences en procédures transmissibles : skills et SOP, sans auto-promotion.",
  },
  "entreprise-05-outils-api-cli-mcp.md": {
    path: "entreprise-05-outils-api-cli-mcp.md",
    illustrationId: "hermes-agent-entreprise-05-outils-api-cli-mcp",
    group: "entreprise",
    summary: "API, CLI, MCP : des portes d'accès, pas des preuves qu'une opération est autorisée.",
  },
  "entreprise-06-workflows-interpoles.md": {
    path: "entreprise-06-workflows-interpoles.md",
    illustrationId: "hermes-agent-entreprise-06-workflows-interpoles",
    group: "entreprise",
    summary: "Faire traverser l'entreprise à un résultat complet, à travers plusieurs pôles.",
  },
  "entreprise-07-adoption-preuves-promotion.md": {
    path: "entreprise-07-adoption-preuves-promotion.md",
    illustrationId: "hermes-agent-entreprise-07-adoption-preuves-promotion",
    group: "entreprise",
    summary: "Adopter progressivement, par paliers réversibles, et n'étendre que ce qui est prouvé.",
  },
  "entreprise-08-templates-et-exercices.md": {
    path: "entreprise-08-templates-et-exercices.md",
    illustrationId: "hermes-agent-entreprise-08-templates-et-exercices",
    group: "entreprise",
    summary: "Les gabarits et exercices pour construire un premier dossier exploitable, sans inventer de données.",
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
    title: "Socle - apprendre la discipline agentique",
    intro: "Du diagnostic à la transmission : la méthode pour construire un système agentique qui produit un résultat vérifiable, pas juste une conversation qui semble intelligente.",
  },
  entreprise: {
    title: "Entreprise - devenir une organisation AI-first",
    intro: "L'unité de conception s'élargit : comment les pôles d'une entreprise conservent leurs responsabilités, partagent leurs données utiles et font traverser un résultat complet, avec ou sans agent.",
  },
};
