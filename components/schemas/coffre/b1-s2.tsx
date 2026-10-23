import { Compare, Fork, Ladder, Steps } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function ZoomDeLaLigneDiagram() {
  return <Ladder
    title="Resserre jusqu'à la scène"
    description="Du marché au moment précis, chaque marche rend la journée de la personne plus visible."
    legend="Tant que tu ne vois pas la scène, tu as une direction, pas une ligne."
    ariaLabel="Quatre marches vont du vague au précis : le marché des commerces, le métier des restaurants de quartier, le moment du service, puis la scène des réservations perdues, mise en avant."
    accent={EM}
    accentIndex={3}
    lowLabel="Vague"
    highLabel="Précis"
    rungs={[
      { label: "Marché", detail: "Les commerces" },
      { label: "Métier", detail: "Restaurants de quartier" },
      { label: "Moment", detail: "Pendant le service" },
      { label: "Scène", detail: "Les réservations perdues" },
    ]}
  />;
}

export function QuatreAppuisDiagram() {
  return <Compare
    title="Les quatre pieds de ta ligne"
    description="Une ligne solide tient sur quatre appuis à la fois, comme une table sur ses pieds."
    legend="Si un seul appui manque, la ligne bouge : cherche un autre terrain."
    ariaLabel="À gauche, une ligne bancale : problème rare, personne ne tranche, résultat invisible, rien après. À droite, une ligne solide : une douleur qui revient, une personne qui décide, un résultat visible, une suite utile."
    accent={EM}
    beforeTitle="Ligne bancale"
    afterTitle="Ligne solide"
    rows={[
      { before: "Un problème rare", after: "Une douleur qui revient" },
      { before: "Personne ne tranche", after: "Une personne qui décide" },
      { before: "Un résultat invisible", after: "Un résultat visible" },
      { before: "Rien après", after: "Une suite utile" },
    ]}
  />;
}

export function PrestationVersMethodeDiagram() {
  return <Steps
    title="De la mission à la méthode"
    description="Une première prestation, même en partie manuelle, t'apprend ce qui revient à chaque fois."
    legend="Le produit vient après, quand tu as vu comment le client veut acheter."
    ariaLabel="Quatre étapes : une prestation avec une partie manuelle, ce qui revient noté à chaque mission, une procédure écrite, puis un produit plus tard. Ce qui revient est mis en avant."
    accent={EM}
    accentIndex={1}
    items={[
      { label: "Prestation", detail: "Une partie encore manuelle" },
      { label: "Ce qui revient", detail: "Noté à chaque mission" },
      { label: "Procédure", detail: "Écrite pour être refaite" },
      { label: "Produit", detail: "Plus tard, si le client l'achète" },
    ]}
  />;
}

export function TroisLignesUnTerrainDiagram() {
  return <Fork
    title="Trois lignes, un même test"
    description="Exemple : trois pistes passent le même test, joindre la personne et voir un vrai cas."
    legend="Garde la ligne qui t'ouvre la conversation la plus proche, pas la plus séduisante."
    ariaLabel="Trois pistes passent le même test : les réservations de restaurants et les dossiers de courtiers ne donnent pas de cas à voir cette semaine, les devis de paysagistes ouvrent un vrai dossier et sont retenus."
    accent={EM}
    situation="Puis-je voir un cas ?"
    outcomes={[
      { label: "Restaurants", condition: "Personne à joindre cette semaine", rejected: true },
      { label: "Courtiers", condition: "Aucun dossier à observer", rejected: true },
      { label: "Paysagistes", condition: "Un dossier montré tout de suite", recommended: true },
    ]}
  />;
}

export const b1_s2_VISUALS = [
  { name: "ZoomDeLaLigne", kind: "schema", chapter: "b1-s2", component: ZoomDeLaLigneDiagram },
  { name: "QuatreAppuis", kind: "schema", chapter: "b1-s2", component: QuatreAppuisDiagram },
  { name: "PrestationVersMethode", kind: "schema", chapter: "b1-s2", component: PrestationVersMethodeDiagram },
  { name: "TroisLignesUnTerrain", kind: "schema", chapter: "b1-s2", component: TroisLignesUnTerrainDiagram },
] as const satisfies readonly HandcraftedVisual[];
