import type { CourseVisualDefinition } from "../protocole/kit-instance";

export const doctrine04 = [
  { name: "AssietteVersPostes", kind: "schema", chapter: "02-decomposition-et-agents.md", template: "funnel", title: "Remonter depuis le résultat", description: "L'assiette finie révèle les compétences, les tâches et les contrôles nécessaires.", ariaLabel: "Le résultat se décompose en compétences, tâches et contrôles.", labels: ["Résultat", "Compétences", "Tâches", "Contrôles"], accentIndex: 0 },
  { name: "RecetteTicketCuisinier", kind: "schema", chapter: "02-decomposition-et-agents.md", template: "compare", title: "Ne mélange pas les objets", description: "La recette, le ticket et l'exécutant répondent à trois questions différentes.", ariaLabel: "Skill, tâche et agent restent trois objets distincts.", labels: ["Skill", "Recette", "Tâche", "Ticket", "Agent", "Exécutant"], accentIndex: 2 },
  { name: "UneEquipePasUneFoule", kind: "schema", chapter: "02-decomposition-et-agents.md", template: "workflow", title: "Quelques postes, une intégration", description: "Trois postes entourent le dossier et une personne garde la vue complète.", ariaLabel: "Lire, préparer et valider convergent vers assembler.", labels: ["Lire", "Préparer", "Valider", "Assembler"], accentIndex: 2 },
] as const satisfies readonly CourseVisualDefinition[];
