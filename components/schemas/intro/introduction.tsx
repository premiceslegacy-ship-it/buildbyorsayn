import type { CourseVisualDefinition } from "../protocole/kit-instance";

export const INTRO_VISUALS = [
  {
    name: "ConsommerOuConstruire", kind: "schema", chapter: "introduction", template: "compare",
    title: "Regarder ou construire",
    description: "Le contenu consommé s'empile, tandis que l'action produit un objet que tu peux montrer.",
    ariaLabel: "Regarder accumule du contenu, faire produit un livrable montrable.",
    labels: ["Regarder", "Encore une vidéo", "Faire", "Montrer"], tools: ["BUILD"], accentIndex: 3,
  },
  {
    name: "CarteDuParcoursBUILD", kind: "schema", chapter: "introduction", template: "steps",
    title: "Un seul trajet en trois temps",
    description: "Une idée devient un objet, puis une méthode plus facile à reprendre.",
    ariaLabel: "Le parcours avance de comprendre à construire puis améliorer.",
    labels: ["Comprendre", "Construire", "Améliorer"], accentIndex: 1,
  },
  {
    name: "BoussoleDesQuatreHabitudes", kind: "schema", chapter: "introduction", template: "rings",
    title: "Quatre habitudes pour avancer",
    description: "L'action reste au centre, entourée par la compréhension, la correction et la continuité.",
    ariaLabel: "Une boussole place exécuter au centre avec comprendre, corriger et continuer autour.",
    labels: ["Comprendre", "Corriger", "Continuer", "Exécuter"], accentIndex: 3,
  },
  {
    name: "UnBlocUnLivrable", kind: "schema", chapter: "introduction", template: "cycle",
    title: "Chaque bloc ferme une boucle",
    description: "Le bloc produit un objet, puis le réel apporte le retour qui permet de recommencer mieux.",
    ariaLabel: "Une boucle relie un bloc, un livrable et un retour.",
    labels: ["Un bloc", "Un livrable", "Un retour"], accentIndex: 1,
  },
] as const satisfies readonly CourseVisualDefinition[];
