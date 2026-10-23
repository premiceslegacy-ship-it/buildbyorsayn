import { FileCard, Steps, Workflow } from "../kit";
import type { HandcraftedVisual } from "../coffre/types";

const EM = "#22d96e";

export function TroisScenesUneCarteDiagram() {
  return <Steps
    title="Trois scènes, une seule carte"
    description="Rejoue trois cas récents, puis garde les passages qu'ils ont en commun."
    legend="Pour chaque scène, sépare ce que tu as vu, raconté ou ignoré."
    ariaLabel="Une demande récente, une livraison suivie jusqu'au client et un cas difficile se rejouent, puis leurs passages communs forment la carte."
    accent={EM}
    accentIndex={3}
    items={[
      { label: "Une demande", detail: "La dernière reçue" },
      { label: "Une livraison", detail: "Suivie jusqu'au client" },
      { label: "Un cas difficile", detail: "Celui qui a coincé" },
      { label: "La carte", detail: "Les passages communs" },
    ]}
  />;
}

export function FlecheAvecContenuDiagram() {
  return <Workflow
    title="Chaque passage porte un contrat"
    description="« Devis transmis » ne suffit pas : le lot dit quelle version, quel délai et quelles réserves."
    legend="Tant que les opérations n'acceptent pas, la vente reste responsable."
    ariaLabel="La vente prépare le lot puis transmet le devis version 3 ; les opérations acceptent le délai et les réserves, puis démarrent quand la condition est remplie."
    accent={EM}
    actors={["Vente", "Opérations"]}
    accentIndex={2}
    steps={[
      { actor: 0, label: "Préparer le lot" },
      { actor: 0, label: "Transmettre", transfer: "devis v3" },
      { actor: 1, label: "Accepter", transfer: "délai, réserves", humanValidation: true },
      { actor: 1, label: "Démarrer", transfer: "feu vert" },
    ]}
  />;
}

export function CarteAvecTrousAssumesDiagram() {
  return <FileCard
    title="Les trous deviennent des enquêtes"
    description="La carte d'un métier sépare ce qui est connu, ce qui reste à enquêter et ce qui ne s'applique pas."
    legend="Ne crée ni rôle ni agent pour combler un trou que personne n'a compris."
    ariaLabel="La carte du pôle vente note le résultat et les objets connus, marque la validation des remises à enquêter et le stock non applicable avec son motif."
    accent={EM}
    filename="carte-vente.md"
    lines={[
      { text: "# Pôle vente", tone: "heading" },
      { text: "Résultat : devis signé" },
      { text: "Objets : devis, acceptation" },
      { text: "Outils : HubSpot, Gmail" },
      { text: "Remises : À ENQUÊTER" },
      { text: "Stock : non applicable" },
      { text: "Motif : aucun stock vendu", tone: "muted" },
    ]}
    annotations={[
      { line: 2, label: "Connu, vu sur un vrai dossier" },
      { line: 5, label: "Le trou devient une enquête" },
      { line: 6, label: "Non applicable, avec son motif" },
    ]}
  />;
}

export const doctrine14 = [
  { name: "TroisScenesUneCarte", kind: "schema", chapter: "entreprise-02-cartographie-poles.md", component: TroisScenesUneCarteDiagram },
  { name: "FlecheAvecContenu", kind: "schema", chapter: "entreprise-02-cartographie-poles.md", component: FlecheAvecContenuDiagram },
  { name: "CarteAvecTrousAssumes", kind: "schema", chapter: "entreprise-02-cartographie-poles.md", component: CarteAvecTrousAssumesDiagram },
] as const satisfies readonly HandcraftedVisual[];
