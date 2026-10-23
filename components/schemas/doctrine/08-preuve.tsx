import type { CourseVisualDefinition } from "../protocole/kit-instance";

export const doctrine08 = [
  { name: "PreuveAChaqueEtage", kind: "schema", chapter: "06-preuve-iteration-skills.md", template: "ladder", title: "Chaque preuve ferme un étage", description: "Une preuve ne permet jamais d'annoncer un niveau plus haut que celui réellement atteint.", ariaLabel: "Cinq étages montent de décrit à mesuré.", labels: ["Décrit", "Testé", "Changé", "Accepté", "Mesuré"], accentIndex: 3 },
  { name: "IncidentVersTest", kind: "schema", chapter: "06-preuve-iteration-skills.md", template: "steps", title: "L'incident devient rejouable", description: "On observe la fissure, reproduit le cas, corrige peu et garde le test.", ariaLabel: "Voir, rejouer, corriger et garder transforment un incident en test.", labels: ["Voir", "Rejouer", "Corriger", "Garder"], accentIndex: 3 },
  { name: "ObservationVersMethode", kind: "schema", chapter: "06-preuve-iteration-skills.md", template: "funnel", title: "Une observation passe au tamis", description: "L'apprentissage est comparé et revu avant d'être rangé comme méthode.", ariaLabel: "Observer, comparer, revoir puis ranger transforment une observation en méthode.", labels: ["Observer", "Comparer", "Revoir", "Ranger"], accentIndex: 1 },
] as const satisfies readonly CourseVisualDefinition[];
