import type { CourseVisualDefinition } from "../protocole/kit-instance";

export const doctrine02 = [
  { name: "HuitQuestionsEnRelais", kind: "schema", chapter: "00-parcours.md", template: "steps", title: "Huit questions ferment le travail", description: "Le relais ouvre le dossier, transmet le témoin puis ferme la mission sur une preuve.", ariaLabel: "Huit questions vont du problème à la méthode en passant par les droits et la preuve.", labels: ["Problème", "Résultat", "Lots", "Sources", "Trajet", "Droits", "Preuve", "Méthode"], accentIndex: 6 },
  { name: "QuatreNiveauxDeMethode", kind: "schema", chapter: "00-parcours.md", template: "ladder", title: "Du principe au choix", description: "Chaque niveau ajoute de la précision jusqu'au skill capable de choisir une route.", ariaLabel: "Une échelle monte de doctrine à méthode, SOP puis skill.", labels: ["Doctrine", "Méthode", "SOP", "Skill"], accentIndex: 3 },
  { name: "DossierDeMission", kind: "schema", chapter: "00-parcours.md", template: "file-card", title: "Le petit dossier utile", description: "La mission emporte seulement l'objectif, les faits, les sources, les limites et la fin.", ariaLabel: "Une valise de mission contient objectif, faits, sources, limites et fin.", labels: ["Objectif", "Faits", "Sources", "Limites", "Fin"], accentIndex: 3 },
] as const satisfies readonly CourseVisualDefinition[];
