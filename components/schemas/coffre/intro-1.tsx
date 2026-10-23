import { Steps } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function LigneDuTerrainDiagram() {
  return <Steps
    title="Une ligne naît du terrain"
    description="Ta ligne part d'une scène de travail réelle et revient devant une personne pour être testée."
    legend="Si la personne ne reconnaît pas son cas, ta ligne bouge ou s'arrête."
    ariaLabel="Cinq étapes. Une scène, le dernier cas récent. Le métier, ses gestes, ses décisions et ses pertes. Ta ligne, une phrase de ligne. Une démo, un film court. Le terrain, une personne te répond, mis en avant."
    accent={EM}
    accentIndex={4}
    items={[
      { label: "Une scène", detail: "Le dernier cas récent" },
      { label: "Le métier", detail: "Gestes, décisions, pertes" },
      { label: "Ta ligne", detail: "Une phrase de ligne" },
      { label: "Une démo", detail: "Un film court" },
      { label: "Le terrain", detail: "Une personne te répond" },
    ]}
  />;
}

export const intro_1_VISUALS = [
  { name: "LigneDuTerrain", kind: "schema", chapter: "intro-1", component: LigneDuTerrainDiagram },
] as const satisfies readonly HandcraftedVisual[];
