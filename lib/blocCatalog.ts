// Public navigation metadata only. Never import the private corpus here.
export type BlocVideo = { title: string; youtubeId: string; description?: string };
export type BlocSection = { id: string; title: string; content: string; skillFiles?: { slug: string; title: string; description: string }[] };
export type DeliveredBloc = { id: string; titre: string; displayNumber: number; sections: BlocSection[]; videos: BlocVideo[] };

const entries: [string, string, [string, string][]][] = [
  ["1", "Lire l'opportunité et choisir une ligne", [["b1-s0", "Le décalage se creuse déjà"], ["b1-s1", "Une IA utile commence dans le métier"], ["b1-s2", "Choisir une ligne qui peut prendre de la valeur"], ["b1-s3", "L'AI Growth Operating : faire circuler le travail"], ["b1-s4b", "Le motion design IA devient un avantage commercial"], ["b1-s4", "Ta première décision maintenant"]]],
  ["5", "La logique business", [["b5-s1", "L'orientation client"], ["b5-s2", "La vente d'abord, toujours"], ["b5-s3", "Le feedback terrain comme moteur"], ["b5-s4", "Les erreurs graves à éviter vs les erreurs normales"]]],
  ["3", "Les frameworks", [["b3-s1", "Le bon ordre avant de construire"], ["b3-s2", "Les trois frameworks qui donnent une direction"], ["b3-s3", "Le framework technique avant l'IDE"]]],
  ["6", "Construire pour de vrai", [["b6-s1", "Ce qu'est vraiment ORACLE by Orsayn"], ["b6-s2", "Comment ORACLE orchestre le projet"], ["b6-s3", "Les sous-skills délégués par ORACLE"], ["b6-s4", "Télécharger le skill ORACLE complet"], ["b6-s5", "ORACLE Site Web : le dernier maillon, vendre le produit"]]],
  ["2", "La stack", [["b2-s1", "Pourquoi une stack fixe"], ["b2-s2", "La stack complète"], ["b2-s3", "Les MCP et les Skills"]]],
  ["4", "Les skills comme second cerveau", [["b4-s1", "Un skill, c'est quoi exactement"], ["b4-s1b", "Le framework de décomposition : le 80/20 de l'IA"], ["b4-s2", "Grouper les skills, construire la chaîne de valeur"], ["b4-s3", "Le second cerveau et la règle du cashflow d'abord"]]],
  ["7", "Récapitulatif", [["b7-s1", "Tout processiser"], ["b7-s2", "L'audit avant l'automatisation"], ["b7-s3", "Les skills comme infrastructure de connaissance"], ["b7-s4", "Itérer en continu"]]],
];

export const PUBLIC_BLOC_ONE_VIDEOS: BlocVideo[] = [{
  title: "Arrête de vendre de l'IA", youtubeId: "uhp4L3y_Jco",
  description: "L'approche one-shot est une impasse. Comment passer d'exécutant technique à architecte de systèmes et déployer un OS complet pour une niche en 30 minutes.",
}];

export const BLOCS_DATA = entries.map(([id, title, sections], index) => ({
  id, titre: `Bloc ${index + 1} : ${title}`, displayNumber: index + 1,
  sections: sections.map(([id, title]) => ({ id, title })),
  videos: id === "1" ? PUBLIC_BLOC_ONE_VIDEOS : [] as BlocVideo[],
}));