import { FileCard, Fork, Steps } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function DeuxPaniersDerreursDiagram() {
  return <Fork
    title="Le gênant ou le dangereux"
    description="Chaque défaut trouvé avant la livraison tombe dans un des deux paniers, selon sa conséquence."
    legend="Juge ce que l'erreur peut faire à la personne, pas sa difficulté technique."
    ariaLabel="Un défaut repéré avant la sortie mène à deux paniers : ça peut sortir pour un texte maladroit ou un écran rugueux, ça s'arrête pour une fuite de données, un paiement contourné ou un bouton qui supprime un dossier."
    accent={EM}
    situation="Un défaut repéré avant la sortie"
    outcomes={[
      { label: "Ça peut sortir", condition: "Texte maladroit, étape de trop, écran rugueux", recommended: true },
      { label: "Ça s'arrête", condition: "Fuite de données, paiement contourné, dossier supprimé", rejected: true },
    ]}
  />;
}

export function LigneRougeDiagram() {
  return <Fork
    title="Quatre lignes rouges"
    description="Ces quatre failles bloquent la livraison, même quand la date approche."
    legend="Une seule croix suffit à arrêter la sortie, quelle que soit l'urgence."
    ariaLabel="Avant chaque livraison, quatre lignes rouges arrêtent la sortie : l'identité non vérifiée, les données d'un autre client, l'accès ouvert sans paiement et une action sensible faite sans droit."
    accent={EM}
    situation="Avant chaque livraison, vérifie"
    outcomes={[
      { label: "Identité", condition: "Quelqu'un agit sans être vérifié", rejected: true },
      { label: "Données", condition: "Un client lit le dossier d'un autre", rejected: true },
      { label: "Paiement", condition: "L'accès s'ouvre sans paiement", rejected: true },
      { label: "Actions", condition: "Agir pour quelqu'un sans droit", rejected: true },
    ]}
  />;
}

export function ParcoursCritiqueDiagram() {
  return <Steps
    title="Teste aussi la porte fermée"
    description="Le parcours normal va de l'entrée au résultat, puis tu rejoues ses quatre accidents."
    legend="Une répétition générale teste la scène parfaite et chaque incident."
    ariaLabel="Cinq tests d'un parcours critique : le cas normal, l'accès refusé mis en avant, la pièce manquante, le doublon d'un paiement reçu deux fois et la reprise après une coupure."
    accent={EM}
    accentIndex={1}
    items={[
      { label: "Cas normal", detail: "De l'entrée au résultat" },
      { label: "Accès refusé", detail: "Sans droit, rien ne s'ouvre" },
      { label: "Incomplet", detail: "Le dossier attend sa pièce" },
      { label: "Doublon", detail: "Reçu deux fois, un seul effet", tools: ["Stripe"] },
      { label: "Reprise", detail: "Repart après une coupure" },
    ]}
  />;
}

export function TestQuiGardeLaPreuveDiagram() {
  return <FileCard
    title="L'assertion reste sous ta garde"
    description="Un test d'abonnement : l'agent peut réparer le code, jamais la ligne qui dit le résultat attendu."
    legend="Si l'attendu change pour rendre le test vert, tu as perdu ta preuve."
    ariaLabel="Un fichier de test vérifie qu'un accès sans paiement est refusé. La ligne d'assertion qui attend un refus reste sous revue humaine, tandis que l'agent peut réparer la fonction testée."
    accent={EM}
    filename="acces.test.ts"
    tool="Claude Code"
    lines={[
      { text: "// Abonnement : accès sans paiement", tone: "muted" },
      { text: "test(\"refuse l'accès sans paiement\", async () => {" },
      { text: "  const reponse = await ouvrirAcces(sansPaiement);" },
      { text: "  expect(reponse.status).toBe(403);" },
      { text: "});" },
      { text: "" },
      { text: "// L'agent peut réparer ouvrirAcces.", tone: "muted" },
      { text: "// La ligne 4 change seulement après ta revue.", tone: "muted" },
    ]}
    annotations={[
      { line: 2, label: "Le cas réel testé" },
      { line: 4, label: "L'attendu, relu par toi" },
      { line: 7, label: "Ce que l'agent répare" },
    ]}
  />;
}

export const b5_s4_VISUALS = [
  { name: "DeuxPaniersDerreurs", kind: "schema", chapter: "b5-s4", component: DeuxPaniersDerreursDiagram },
  { name: "LigneRouge", kind: "schema", chapter: "b5-s4", component: LigneRougeDiagram },
  { name: "ParcoursCritique", kind: "schema", chapter: "b5-s4", component: ParcoursCritiqueDiagram },
  { name: "TestQuiGardeLaPreuve", kind: "schema", chapter: "b5-s4", component: TestQuiGardeLaPreuveDiagram },
] as const satisfies readonly HandcraftedVisual[];
