import { Compare, FileCard, Workflow } from "../kit";
import type { HandcraftedVisual } from "../coffre/types";

const EM = "#22d96e";

function DossierQuiTraverseDiagram() {
  return <Workflow
    title="Le dossier garde sa version"
    description="Le même dossier passe de la vente aux opérations puis à la finance, avec sa version."
    legend="Bloqué avec un responsable vaut mieux que « terminé » sans preuve."
    ariaLabel="La vente qualifie dans HubSpot puis valide le dossier version 1 ; les opérations livrent dans Notion la proposition version 2 ; la finance facture dans Stripe la livraison version 2."
    accent={EM}
    actors={["Vente", "Opérations", "Finance"]}
    accentIndex={2}
    steps={[
      { actor: 0, label: "Qualifier", tool: "HubSpot" },
      { actor: 0, label: "Valider", transfer: "dossier v1", humanValidation: true },
      { actor: 1, label: "Livrer", tool: "Notion", transfer: "proposition v2" },
      { actor: 2, label: "Facturer", tool: "Stripe", transfer: "livraison v2" },
    ]}
  />;
}

function PreuvesParMetierDiagram() {
  return <Compare
    title="Chaque métier a sa preuve"
    description="Une étape franchie dans un métier ne prouve pas le résultat attendu par le suivant."
    legend="Demande à chaque métier ce qu'il regarde pour dire « c'est fait »."
    ariaLabel="Une proposition validée ne prouve pas la livraison acceptée, un code corrigé ne prouve pas que le client confirme, une réponse aimable ne prouve pas la panne réparée, une facture envoyée ne prouve pas le paiement reçu."
    accent={EM}
    beforeTitle="Ne prouve pas"
    afterTitle="La vraie preuve"
    rows={[
      { before: "Proposition validée", after: "Livraison acceptée" },
      { before: "Code corrigé", after: "Le client confirme" },
      { before: "Réponse aimable", after: "Panne réparée" },
      { before: "Facture envoyée", after: "Paiement reçu" },
    ]}
  />;
}

function CarteDePassationDiagram() {
  return <FileCard
    title="La passation tient sur une carte"
    description="La carte suffit pour reprendre le dossier sans répéter une action extérieure."
    legend="Une autre personne doit pouvoir reprendre avec cette carte seule."
    ariaLabel="La carte de passation du dossier D-1042 indique l'état incertain, les objets, l'action faite, la preuve, l'inconnu à relire et la personne suivante."
    accent={EM}
    filename="passation.md"
    lines={[
      { text: "# Dossier D-1042", tone: "heading" },
      { text: "État : incertain" },
      { text: "Objets : devis v3, facture" },
      { text: "Fait : relance préparée" },
      { text: "Preuve : acceptation signée" },
      { text: "Inconnu : relance partie ?" },
      { text: "Suivant : la comptable" },
    ]}
    annotations={[
      { line: 2, label: "Quatre états possibles" },
      { line: 6, label: "Relire la cible avant de refaire" },
      { line: 7, label: "Une personne nommée reprend" },
    ]}
  />;
}

export const doctrine18 = [
  { name: "DossierQuiTraverse", kind: "schema", chapter: "entreprise-06-workflows-interpoles.md", component: DossierQuiTraverseDiagram },
  { name: "PreuvesParMetier", kind: "schema", chapter: "entreprise-06-workflows-interpoles.md", component: PreuvesParMetierDiagram },
  { name: "CarteDePassation", kind: "schema", chapter: "entreprise-06-workflows-interpoles.md", component: CarteDePassationDiagram },
] as const satisfies readonly HandcraftedVisual[];
