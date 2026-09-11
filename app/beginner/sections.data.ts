import { SectionMindset } from "./sections/SectionMindset";
import { SectionPsychologie } from "./sections/SectionPsychologie";
import { SectionCopywriting } from "./sections/SectionCopywriting";
import { SectionVente } from "./sections/SectionVente";
import { SectionMarketing } from "./sections/SectionMarketing";
import { Section1 } from "./sections/Section1";
import { Section2 } from "./sections/Section2";
import { Section3 } from "./sections/Section3";
import { Section4 } from "./sections/Section4";

export const SECTIONS = [
  {
    id: "mindset",
    num: "01",
    label: "L'état d'esprit qui fait l'argent",
    summary: "Avant la technique, avant les outils, il y a la tête. Ces principes ne changent pas dans le temps.",
    illustrationId: "fondations-mindset",
    Component: SectionMindset,
  },
  {
    id: "psychologie",
    num: "02",
    label: "Comprendre les gens",
    summary: "On répète qu'il faut résoudre un problème. C'est vrai, mais c'est incomplet.",
    illustrationId: "fondations-psychologie",
    Component: SectionPsychologie,
  },
  {
    id: "copywriting",
    num: "03",
    label: "Écrire pour vendre",
    summary: "Le copywriting, c'est l'art d'écrire pour vendre. Pas pour faire joli.",
    illustrationId: "fondations-copywriting",
    Component: SectionCopywriting,
  },
  {
    id: "vente",
    num: "04",
    label: "Vendre",
    summary: "La vente fait peur parce qu'on l'imagine comme du baratin de marchand de tapis. C'est l'inverse.",
    illustrationId: "fondations-vente",
    Component: SectionVente,
  },
  {
    id: "marketing",
    num: "05",
    label: "Capter l'attention",
    summary: "Le meilleur produit du monde ne sert à rien si personne ne le connaît.",
    illustrationId: "fondations-marketing",
    Component: SectionMarketing,
  },
  {
    id: "penser",
    num: "06",
    label: "Penser avant de construire",
    summary: "Avant de toucher un seul outil, je pose le cadre. C'est l'étape que tout le monde saute.",
    illustrationId: "fondations-penser",
    Component: Section1,
  },
  {
    id: "environnement",
    num: "07",
    label: "Comprendre l'environnement",
    summary: "Pas besoin d'être développeur. Mais comprendre les bases change radicalement la qualité des résultats.",
    illustrationId: "fondations-environnement",
    Component: Section2,
  },
  {
    id: "visuels",
    num: "08",
    label: "Générer des visuels pro",
    summary: "Créer une direction visuelle cohérente avec le message, la conversion et le design system.",
    illustrationId: "fondations-visuels",
    Component: Section3,
  },
  {
    id: "url",
    num: "09",
    label: "De l'idée à l'URL en ligne",
    summary: "La section la plus concrète. À la fin, tu sais mettre un site en ligne, même si tu n'as jamais codé.",
    illustrationId: "fondations-url",
    Component: Section4,
  },
] as const;

export const ANGLE_MORT = {
  id: "angle-mort",
  num: "10",
  label: "Le seuil",
  summary: "Tu as les Fondations entre les mains. Regarde maintenant ce qui te fait sortir de la dépendance pour de bon.",
  illustrationId: "fondations-seuil",
} as const;

export type BeginnerSectionId = (typeof SECTIONS)[number]["id"] | typeof ANGLE_MORT.id;

export function findSectionIndex(id: string): number {
  return SECTIONS.findIndex((s) => s.id === id);
}
