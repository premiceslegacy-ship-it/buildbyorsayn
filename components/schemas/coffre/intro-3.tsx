import { Ladder } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function AvantLePremierFichierDiagram() {
  return <Ladder
    title="Quatre décisions avant le code"
    description="Le besoin, le message, la page et le style se décident avant le premier fichier."
    legend="Saute une marche et l'IA invente la décision à ta place."
    ariaLabel="Une échelle de cinq marches. Besoin, un brief court. Message, ce que la page dit. Page, un rôle par section. Style, une direction commentée. Code, un choix et sa raison, en dernier et mis en avant."
    accent={EM}
    accentIndex={4}
    lowLabel="D'abord"
    highLabel="En dernier"
    rungs={[
      { label: "Besoin", detail: "Un brief court" },
      { label: "Message", detail: "Ce que la page dit" },
      { label: "Page", detail: "Un rôle par section" },
      { label: "Style", detail: "Une direction commentée" },
      { label: "Code", detail: "Un choix et sa raison" },
    ]}
  />;
}

export const intro_3_VISUALS = [
  { name: "AvantLePremierFichier", kind: "schema", chapter: "intro-3", component: AvantLePremierFichierDiagram },
] as const satisfies readonly HandcraftedVisual[];
