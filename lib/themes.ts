/**
 * Thèmes des blocs et des Fondations.
 * Un thème est un mot général : une vidéo y trouve sa place même quand elle ne reprend pas le titre d'un chapitre.
 * Le titre précis d'avant reste en sous-titre, pour que la personne sache ce que le bloc couvre.
 */
export const BLOC_THEMES: Record<string, { theme: string; sousTitre: string }> = {
  "1": { theme: "L'opportunité", sousTitre: "Lire l'opportunité et choisir une ligne" },
  "2": { theme: "Les outils", sousTitre: "La stack" },
  "5": { theme: "Le client", sousTitre: "La logique business" },
  "3": { theme: "La méthode", sousTitre: "Les frameworks" },
  "4": { theme: "Les skills", sousTitre: "Les skills comme second cerveau" },
  "6": { theme: "La construction", sousTitre: "Construire pour de vrai" },
  "7": { theme: "Le système", sousTitre: "Récapitulatif" },
};

export const FONDATIONS_THEMES = {
  "fondations-1": { theme: "Le socle", sousTitre: "Ce qui ne change pas" },
  "fondations-2": { theme: "Le projet", sousTitre: "De l'idée à l'URL" },
  protocole: { theme: "Le cycle", sousTitre: "Absorber, produire, distiller" },
} as const;
