import type { CourseVisualDefinition } from "../protocole/kit-instance";

export const doctrine10 = [
  { name: "ArmoireDuPilote", kind: "schema", chapter: "08-fiches-atelier.md", template: "file-card", title: "L'armoire garde les bons liens", description: "Doctrine, projet, méthodes et tests restent séparés tout en pointant vers leurs systèmes réels.", ariaLabel: "Une armoire relie décider, préparer, tester et apprendre, avec le projet mis en avant.", labels: ["Décider", "Préparer", "Tester", "Apprendre"], accentIndex: 1 },
  { name: "TrouQuiBloque", kind: "schema", chapter: "08-fiches-atelier.md", template: "fork", title: "Un inconnu critique bloque", description: "La planche manquante reste visible jusqu'à ce que la bonne personne renseigne la limite.", ariaLabel: "Un manque bloque le passage et doit être renseigné avant de continuer.", labels: ["Manque", "Bloque", "Renseigner"], accentIndex: 1 },
  { name: "CinqCartesDeTest", kind: "schema", chapter: "08-fiches-atelier.md", template: "steps", title: "Cinq cartes avant d'activer", description: "Le pilote affronte le cas normal, le manque, le doublon, l'hostile et la coupure.", ariaLabel: "Une main de cinq tests comprend normal, manque, double, hostile et coupure.", labels: ["Normal", "Manque", "Double", "Hostile", "Coupure"], accentIndex: 3 },
] as const satisfies readonly CourseVisualDefinition[];
