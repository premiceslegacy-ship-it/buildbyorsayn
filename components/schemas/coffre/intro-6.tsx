import { Steps } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function DeLIdeeAuProduitVisibleDiagram() {
  return <Steps
    title="De l'idée au produit"
    description="Ton idée devient un produit en passant par des décisions, du travail réparti et des tests visibles."
    legend="Un test raté coûte peu ici, et beaucoup chez un vrai client."
    ariaLabel="Cinq étapes après l'idée. Cadrer, une scène de projet. Répartir, un lot de travail. Construire, en suivant le dossier projet. Tester, se connecter, se tromper, revenir, mis en avant. Produit, il tient en usage réel."
    accent={EM}
    accentIndex={3}
    items={[
      { label: "Cadrer", detail: "Une scène de projet" },
      { label: "Répartir", detail: "Un lot de travail" },
      { label: "Construire", detail: "Le dossier projet suivi" },
      { label: "Tester", detail: "Connexion, erreur, retour" },
      { label: "Produit", detail: "Il tient en usage réel" },
    ]}
  />;
}

export const intro_6_VISUALS = [
  { name: "DeLIdeeAuProduitVisible", kind: "schema", chapter: "intro-6", component: DeLIdeeAuProduitVisibleDiagram },
] as const satisfies readonly HandcraftedVisual[];
