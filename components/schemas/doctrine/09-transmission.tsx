import { Compare, Cycle, Fork } from "../kit";
import type { HandcraftedVisual } from "../coffre/types";

const EM = "#22d96e";

function TerrainAvantBibliothequeDiagram() {
  return <Fork
    title="Juste assez avant le terrain"
    description="Tu apprends le vocabulaire, les erreurs et les critères utiles, puis tu livres un vrai travail limité."
    legend="Une vente prouve l'achat, une livraison acceptée prouve le travail."
    ariaLabel="Situation : tu découvres un nouveau métier. Tout lire d'abord, refusé : la bibliothèque ne finit jamais. Juste assez, puis livrer, conseillé : vocabulaire, erreurs et critères, puis un vrai travail limité."
    accent={EM}
    situation="Tu découvres un nouveau métier"
    outcomes={[
      { label: "Tout lire d'abord", condition: "La bibliothèque ne finit jamais", rejected: true },
      { label: "Juste assez, puis livrer", condition: "Un vrai travail limité", recommended: true },
    ]}
  />;
}

function BoucleAcquisitionLivraisonDiagram() {
  return <Cycle
    title="Les retours circulent"
    description="Ce que tu entends en vendant et ce que tu vois en livrant améliore la vente suivante."
    legend="Change une seule chose à la fois pour savoir ce qui a marché."
    ariaLabel="Une boucle de quatre étapes. Vendre, point d'entrée : l'objection nourrit l'offre. Livrer : l'incident nourrit la méthode. Corriger : une seule chose change. Expliquer : la correction mesurée devient un contenu. Puis on revient à vendre."
    accent={EM}
    entryIndex={0}
    centerLabel="Le contenu nourrit la vente suivante"
    steps={[
      { label: "Vendre", detail: "L'objection nourrit l'offre" },
      { label: "Livrer", detail: "L'incident nourrit la méthode" },
      { label: "Corriger", detail: "Une seule chose change" },
      { label: "Expliquer", detail: "La correction devient contenu" },
    ]}
  />;
}

function LivrablePlusRegardDiagram() {
  return <Compare
    title="Remets le résultat et le regard"
    description="La personne reçoit le livrable et la méthode qui lui permet de le juger puis de le reprendre."
    legend="La méthode ne transporte ni secret, ni nom interne, ni ancienne permission."
    ariaLabel="Comparaison. Le livrable seul : un résultat sans mode d'emploi, personne ne sait le juger, impossible à refaire, rien à surveiller. Le livrable et le regard : ce que la personne pensait au départ, ce que le test a montré, ce qui change ensuite, ce qui reste à surveiller."
    accent={EM}
    beforeTitle="Le livrable seul"
    afterTitle="Le livrable et le regard"
    rows={[
      { before: "Un résultat sans mode d'emploi", after: "Ce qu'elle pensait au départ" },
      { before: "Personne ne sait le juger", after: "Ce que le test a montré" },
      { before: "Impossible à refaire", after: "Ce qui change ensuite" },
      { before: "Rien à surveiller", after: "Ce qui reste à surveiller" },
    ]}
  />;
}

export const doctrine09 = [
  { name: "TerrainAvantBibliotheque", kind: "schema", chapter: "07-methode-offre-transmission.md", component: TerrainAvantBibliothequeDiagram },
  { name: "BoucleAcquisitionLivraison", kind: "schema", chapter: "07-methode-offre-transmission.md", component: BoucleAcquisitionLivraisonDiagram },
  { name: "LivrablePlusRegard", kind: "schema", chapter: "07-methode-offre-transmission.md", component: LivrablePlusRegardDiagram },
] as const satisfies readonly HandcraftedVisual[];
