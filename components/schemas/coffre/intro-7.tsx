import { Cycle } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function DuGesteAuSystemeVivantDiagram() {
  return <Cycle
    title="Du geste au système vivant"
    description="Un travail répété devient une méthode quand chaque usage la corrige un peu."
    legend="Une correction rangée au bon endroit sert dès le projet suivant."
    ariaLabel="Une boucle en cinq étapes. Faire, un travail répété, point d'entrée mis en avant. Écrire, une SOP testable. Exécuter, le mode choisi après audit. Corriger, ce qui casse. Recommencer, un projet plus clair, puis retour à Faire."
    accent={EM}
    entryIndex={0}
    centerLabel="Le prochain projet, plus clair"
    steps={[
      { label: "Faire", detail: "Un travail répété" },
      { label: "Écrire", detail: "Une SOP testable" },
      { label: "Exécuter", detail: "Le mode choisi" },
      { label: "Corriger", detail: "Ce qui casse" },
      { label: "Recommencer", detail: "Avec la correction" },
    ]}
  />;
}

export const intro_7_VISUALS = [
  { name: "DuGesteAuSystemeVivant", kind: "schema", chapter: "intro-7", component: DuGesteAuSystemeVivantDiagram },
] as const satisfies readonly HandcraftedVisual[];
