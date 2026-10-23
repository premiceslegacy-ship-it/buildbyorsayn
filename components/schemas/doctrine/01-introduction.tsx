import type { CourseVisualDefinition } from "../protocole/kit-instance";

export const doctrine01 = [
  { name: "DoctrineCommeAtelier", kind: "schema", chapter: "README.md", template: "workflow", title: "Préparer avant d'agir", description: "L'atelier transforme une scène de travail en dossier limité, prouvé et reprenable.", ariaLabel: "Le travail passe par limites et preuve avant une reprise humaine.", labels: ["Travail", "Limites", "Preuve", "Reprise"], tools: ["Hermes Agent"], accentIndex: 3 },
  { name: "TroisObjetsTroisRoles", kind: "schema", chapter: "README.md", template: "compare", title: "Trois objets, trois rôles", description: "Le workflow porte le trajet, le skill porte la méthode et la mémoire porte les faits.", ariaLabel: "Le trajet, la méthode et les faits sont trois objets séparés.", labels: ["Le trajet", "Workflow", "La méthode", "Skill", "Les faits", "Mémoire"], accentIndex: 2 },
  { name: "CinqPartiesUnDossier", kind: "schema", chapter: "README.md", template: "steps", title: "Le même dossier gagne cinq couches", description: "Le dossier reste continu pendant que chaque partie ajoute une pièce utile.", ariaLabel: "Un dossier avance par voir, limiter, prouver, relier et reprendre.", labels: ["Voir", "Limiter", "Prouver", "Relier", "Reprendre"], accentIndex: 4 },
] as const satisfies readonly CourseVisualDefinition[];
