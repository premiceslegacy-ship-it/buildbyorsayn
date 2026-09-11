import type { ReactNode } from "react";
import {
  DiagnosticDiagram,
  DecompositionDiagram,
  KnowledgeLayersDiagram,
  ExecutionLoopDiagram,
  AuthorityLayersDiagram,
  ProofLayersDiagram,
  TransmissionDiagram,
  WorkshopDiagram,
  FederatedBrainDiagram,
  MissionFlowDiagram,
  PoleMapDiagram,
  DataFormatsDiagram,
  SkillsSopDiagram,
  ToolAccessDiagram,
  WorkflowCrossPoleDiagram,
  AdoptionLaddersDiagram,
  TemplateTreeDiagram,
} from "./diagrams";

export type ChapterMeta = {
  path: string;
  group: "socle" | "entreprise";
  summary: string;
  diagram?: ReactNode;
};

export const CHAPTER_META: Record<string, ChapterMeta> = {
  "README.md": {
    path: "README.md",
    group: "socle",
    summary: "Statut du corpus, mode de lecture et limites : une synthèse pédagogique, pas une preuve de déploiement.",
  },
  "00-parcours.md": {
    path: "00-parcours.md",
    group: "socle",
    summary: "Le parcours et le vocabulaire communs : doctrine, méthode, procédure, projet, preuve.",
  },
  "01-diagnostic-et-offre.md": {
    path: "01-diagnostic-et-offre.md",
    group: "socle",
    summary: "Partir du problème observé, pas de la capacité technique, avant de choisir une réponse.",
    diagram: <DiagnosticDiagram />,
  },
  "02-decomposition-et-agents.md": {
    path: "02-decomposition-et-agents.md",
    group: "socle",
    summary: "Découper un résultat en lots vérifiables et composer l'équipe minimale suffisante.",
    diagram: <DecompositionDiagram />,
  },
  "03-connaissance-memoire-contexte.md": {
    path: "03-connaissance-memoire-contexte.md",
    group: "socle",
    summary: "Séparer sources, connaissance qualifiée, contexte et mémoire pour éviter les promotions abusives.",
    diagram: <KnowledgeLayersDiagram />,
  },
  "04-evenements-inbox-execution.md": {
    path: "04-evenements-inbox-execution.md",
    group: "socle",
    summary: "Percevoir, décider, exécuter, tracer - la boucle qui ne s'arrête pas à une réponse produite.",
    diagram: <ExecutionLoopDiagram />,
  },
  "05-autorite-outils-couts.md": {
    path: "05-autorite-outils-couts.md",
    group: "socle",
    summary: "Une règle écrite n'est pas une barrière technique : borner autorité, outils, secrets et coûts.",
    diagram: <AuthorityLayersDiagram />,
  },
  "06-preuve-iteration-skills.md": {
    path: "06-preuve-iteration-skills.md",
    group: "socle",
    summary: "Vérifier avant de livrer, transformer l'erreur en connaissance sans créer de règle fragile.",
    diagram: <ProofLayersDiagram />,
  },
  "07-methode-offre-transmission.md": {
    path: "07-methode-offre-transmission.md",
    group: "socle",
    summary: "Du terrain à la méthode transmissible, puis à l'offre et aux actifs réutilisables.",
    diagram: <TransmissionDiagram />,
  },
  "08-fiches-atelier.md": {
    path: "08-fiches-atelier.md",
    group: "socle",
    summary: "Les fiches pratiques pour cadrer un essai et préparer sa revue - à compléter, pas à copier.",
    diagram: <WorkshopDiagram />,
  },
  "entreprise-01-cerveau-federe.md": {
    path: "entreprise-01-cerveau-federe.md",
    group: "entreprise",
    summary: "Une entreprise AI-first a une organisation, pas un super-agent : quatre responsabilités séparées.",
    diagram: <FederatedBrainDiagram />,
  },
  "entreprise-02-cartographie-poles.md": {
    path: "entreprise-02-cartographie-poles.md",
    group: "entreprise",
    summary: "Cartographier tous les pôles réellement présents, sans créer un agent par métier.",
    diagram: <PoleMapDiagram />,
  },
  "entreprise-formats.md": {
    path: "entreprise-formats.md",
    group: "entreprise",
    summary: "Choisir un format selon la responsabilité : doctrine, objets métier vivants, contrats d'échange.",
    diagram: <DataFormatsDiagram />,
  },
  "entreprise-04-competences-skills-sop.md": {
    path: "entreprise-04-competences-skills-sop.md",
    group: "entreprise",
    summary: "Transformer les compétences en procédures transmissibles : skills et SOP, sans auto-promotion.",
    diagram: <SkillsSopDiagram />,
  },
  "entreprise-05-outils-api-cli-mcp.md": {
    path: "entreprise-05-outils-api-cli-mcp.md",
    group: "entreprise",
    summary: "API, CLI, MCP : des portes d'accès, pas des preuves qu'une opération est autorisée.",
    diagram: <ToolAccessDiagram />,
  },
  "entreprise-06-workflows-interpoles.md": {
    path: "entreprise-06-workflows-interpoles.md",
    group: "entreprise",
    summary: "Faire traverser l'entreprise à un résultat complet, à travers plusieurs pôles.",
    diagram: <WorkflowCrossPoleDiagram />,
  },
  "entreprise-07-adoption-preuves-promotion.md": {
    path: "entreprise-07-adoption-preuves-promotion.md",
    group: "entreprise",
    summary: "Adopter progressivement, par paliers réversibles, et n'étendre que ce qui est prouvé.",
    diagram: <AdoptionLaddersDiagram />,
  },
  "entreprise-08-templates-et-exercices.md": {
    path: "entreprise-08-templates-et-exercices.md",
    group: "entreprise",
    summary: "Les gabarits et exercices pour construire un premier dossier exploitable, sans inventer de données.",
    diagram: <TemplateTreeDiagram />,
  },
};

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
