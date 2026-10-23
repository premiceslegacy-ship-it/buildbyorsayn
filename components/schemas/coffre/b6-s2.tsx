import { Chat, FileCard, Steps, Workflow } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function OrchestrationSixTempsDiagram() {
  return <Workflow
    title="Le projet avance en six temps"
    description="Chaque temps reçoit ce que le précédent a produit, de l'interview jusqu'aux audits."
    legend="Les décisions difficiles se prennent avant que la construction commence."
    ariaLabel="Un relais en six temps. L'interview ouvre le travail. Les documents gardent tes réponses. Les décisions sont prises à partir des documents, mises en avant. Les spécialistes reçoivent les décisions prises. La construction reçoit des lots. Les audits reçoivent le produit et ferment le parcours."
    accent={EM}
    accentIndex={2}
    actors={[]}
    steps={[
      { actor: 0, label: "Interview" },
      { actor: 0, label: "Documents", transfer: "tes réponses" },
      { actor: 0, label: "Décisions", transfer: "les documents" },
      { actor: 0, label: "Spécialistes", transfer: "les décisions" },
      { actor: 0, label: "Construction", transfer: "des lots" },
      { actor: 0, label: "Audits", transfer: "le produit" },
    ]}
  />;
}

export function DocumentsQuiSeNourrissentDiagram() {
  return <Steps
    title="Chaque document nourrit le suivant"
    description="Le brief alimente la marque, le copy et le design. Les données fixent la sécurité. Le PRD rassemble."
    legend="Une décision a une seule source. Les autres documents y renvoient."
    ariaLabel="Cinq documents dans l'ordre. Le brief est la source commune. La marque reprend sa promesse. Le copy et le design reprennent le ton de la marque. Les données décident de la sécurité. Le PRD, mis en avant, décrit les fonctions, les priorités et les conditions d'acceptation."
    accent={EM}
    accentIndex={4}
    items={[
      { label: "Brief", detail: "La source commune du projet" },
      { label: "Marque", detail: "Reprend la promesse du brief" },
      { label: "Copy, design", detail: "Reprennent le ton de la marque" },
      { label: "Données", detail: "Décident des règles de sécurité" },
      { label: "PRD", detail: "Fonctions, priorités, acceptation" },
    ]}
  />;
}

export function ContratDeLotAnnoteDiagram() {
  return <FileCard
    title="Un lot qui voyage seul"
    description="Exemple : le contrat du premier lot de Mehdi, coach sportif, pour construire sa réservation."
    legend="Si quelqu'un doit t'appeler pour comprendre le lot, il manque une ligne."
    ariaLabel="Un fichier de contrat de lot pour une réservation. Il donne l'objectif, les sources, les fichiers autorisés, ce qui est interdit, le résultat attendu, le test final et la passation. Les annotations soulignent l'objectif, l'interdit, le test final et la passation."
    accent={EM}
    filename="lot-1-reservation.md"
    tool="GitHub"
    lines={[
      { text: "# Lot 1 : réservation complète", tone: "heading" },
      { text: "Objectif : réserver un créneau libre" },
      { text: "Sources : brief, PRD, données" },
      { text: "Fichiers : dossier reservation/" },
      { text: "Interdit : toucher au rappel" },
      { text: "Résultat : réservation confirmée" },
      { text: "Test : vide, pris, confirmé, refusé" },
      { text: "Passation : fichiers, tests, questions" },
    ]}
    annotations={[
      { line: 2, label: "Ce que le lot doit obtenir" },
      { line: 5, label: "Ce qu'il ne fait jamais" },
      { line: 7, label: "La preuve que c'est fini" },
      { line: 8, label: "Ce que reçoit la suite" },
    ]}
  />;
}

export function CockpitIntegrationDiagram() {
  return <Chat
    title="Un seul responsable réunit les lots"
    description="Exemple : les lots rendent compte au responsable d'intégration, qui arrête un chemin qui se coupe."
    legend="Deux lots avancent ensemble seulement s'ils ne touchent pas la même décision."
    ariaLabel="Une conversation de suivi des lots. Le lot page d'aide est terminé avec ses tests. Le lot données a fini sa migration sur la version 3 du brief. Le lot formulaire annonce qu'il modifie aussi le fichier de réservation. Le responsable l'arrête : ce fichier appartient à un autre lot. En coulisse, le responsable vérifie la version du brief, réunit les sorties sur GitHub et tranche la contradiction lui-même."
    accent={EM}
    platform="Neutre"
    contact="Lots en cours"
    messages={[
      { from: "agent", text: "Lot aide : page terminée, tests verts.", time: "09:12" },
      { from: "agent", text: "Lot données : migration prête, brief v3.", time: "09:20" },
      { from: "agent", text: "Lot formulaire : je modifie aussi le fichier de réservation.", time: "09:31" },
      { from: "person", text: "Stop. Ce fichier appartient au lot réservation. Attends l'accord.", time: "09:33" },
    ]}
    backstageTitle="Le responsable d'intégration"
    actions={[
      { label: "Vérifie la version du brief" },
      { label: "Réunit les sorties des lots", tool: "GitHub" },
      { label: "Tranche la contradiction", humanValidation: true },
    ]}
  />;
}

export function ParcoursE2EVisibleDiagram() {
  return <Steps
    title="Le test joue la personne"
    description="Exemple : le test de bout en bout de la réservation de Mehdi, écran par écran."
    legend="Un test ne passe au vert que s'il voit ce que la personne verrait."
    ariaLabel="Un parcours de test en quatre étapes. Choisir un créneau libre dans l'agenda. Réserver avec son nom et son e-mail. Voir la confirmation s'afficher à l'écran, mise en avant. Puis vérifier qu'un autre compte est bien refusé."
    accent={EM}
    accentIndex={2}
    items={[
      { label: "Choisir", detail: "Un créneau libre dans l'agenda" },
      { label: "Réserver", detail: "Nom et e-mail remplis" },
      { label: "Confirmer", detail: "Le message s'affiche à l'écran" },
      { label: "Refuser", detail: "Un autre compte est bloqué" },
    ]}
  />;
}

export const b6_s2_VISUALS = [
  { name: "OrchestrationSixTemps", kind: "schema", chapter: "b6-s2", component: OrchestrationSixTempsDiagram },
  { name: "DocumentsQuiSeNourrissent", kind: "schema", chapter: "b6-s2", component: DocumentsQuiSeNourrissentDiagram },
  { name: "ContratDeLotAnnote", kind: "maquette", chapter: "b6-s2", component: ContratDeLotAnnoteDiagram },
  { name: "CockpitIntegration", kind: "maquette", chapter: "b6-s2", component: CockpitIntegrationDiagram },
  { name: "ParcoursE2EVisible", kind: "schema", chapter: "b6-s2", component: ParcoursE2EVisibleDiagram },
] as const satisfies readonly HandcraftedVisual[];
