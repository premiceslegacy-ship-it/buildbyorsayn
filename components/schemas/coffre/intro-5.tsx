import { Workflow } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function SceneOffreTerrainDiagram() {
  return <Workflow
    title="Du client vers le produit"
    description="Le business part d'un cas réel chez le client et revient à ton dossier avec une réponse."
    legend="La dernière carte nourrit ta prochaine offre."
    ariaLabel="Un relais entre toi et le client. Le client raconte une scène. Tu en tires une offre avec ses mots. Le client reçoit une page et décide. Tu livres après sa décision. Tu apprends des faits de la livraison, mis en avant."
    accent={EM}
    accentIndex={4}
    actors={["Toi", "Le client"]}
    steps={[
      { actor: 1, label: "Scène" },
      { actor: 0, label: "Offre", transfer: "ses mots" },
      { actor: 1, label: "Vente", transfer: "une page", humanValidation: true },
      { actor: 0, label: "Livraison", transfer: "sa décision" },
      { actor: 0, label: "Apprendre", transfer: "des faits" },
    ]}
  />;
}

export const intro_5_VISUALS = [
  { name: "SceneOffreTerrain", kind: "schema", chapter: "intro-5", component: SceneOffreTerrainDiagram },
] as const satisfies readonly HandcraftedVisual[];
