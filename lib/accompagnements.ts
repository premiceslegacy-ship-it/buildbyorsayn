export const ACCOMPANIMENT_CAL_URL = "https://cal.com/samuel-mbeboura/point-sur-ton-projet-de-site-web";

export type Accompagnement = {
  id: string;
  status: "available" | "soon";
  title: string;
  description: string;
  href?: string;
};

export const ACCOMPAGNEMENTS: Accompagnement[] = [
  {
    id: "site-web",
    status: "available",
    title: "Construire et vendre des sites web avec l'IA",
    description:
      "Pour passer d'un premier site web réalisé avec l'IA à une offre vendable, un processus de livraison et une activité web qui peut grandir.",
    href: "/accompagnement/site-web",
  },
  {
    id: "soon",
    status: "soon",
    title: "Bientôt disponible",
    description: "D'autres accompagnements arrivent.",
  },
];
