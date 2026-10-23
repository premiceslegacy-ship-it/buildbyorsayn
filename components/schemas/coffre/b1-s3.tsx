import { Cycle, FileCard, Steps, Workflow } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function BoucleCommercialeVivanteDiagram() {
  return <Cycle
    title="Une demande fait tout le tour"
    description="Une seule demande traverse le commerce, puis la livraison laisse un apprentissage."
    legend="Chaque étape reçoit ce dont elle a besoin et laisse quelque chose à la suivante."
    ariaLabel="Une boucle en cinq étapes : la demande arrive, le dossier se prépare, une personne décide, le client répond, la livraison laisse un apprentissage qui sert à la demande suivante."
    accent={EM}
    entryIndex={0}
    centerLabel="Ce qu'on apprend sert à la suivante"
    steps={[
      { label: "Demande", detail: "Un déclencheur visible" },
      { label: "Dossier", detail: "Il se prépare" },
      { label: "Décision", detail: "Une personne tranche" },
      { label: "Réponse", detail: "Le client répond" },
      { label: "Livraison", detail: "Elle laisse un apprentissage" },
    ]}
  />;
}

export function ContexteQuiPasseDiagram() {
  return <FileCard
    title="Une fiche qui suit le dossier"
    description="Exemple : une seule fiche avance avec la demande, au lieu de dix copies dans des messages."
    legend="Ne garde que ce qui sert à la suite, sinon la fiche devient une boîte mail."
    ariaLabel="Une fiche dossier d'auto-école en quatre lignes : la demande de permis B arrivée par le site, les pièces reçues, l'offre validée par l'équipe et la prochaine action, rappeler jeudi."
    accent={EM}
    filename="fiche-dossier.md"
    lines={[
      { text: "# Fiche dossier", tone: "heading" },
      { text: "Demande : permis B, arrivée par le site" },
      { text: "Pièces : formulaire, pièce d'identité" },
      { text: "Décision : offre validée par l'équipe" },
      { text: "Prochaine action : rappeler jeudi" },
    ]}
    annotations={[
      { line: 2, label: "La demande telle qu'elle arrive" },
      { line: 3, label: "Ce qui est déjà reçu" },
      { line: 4, label: "Ce qui a été tranché" },
      { line: 5, label: "Ce que fait l'étape suivante" },
    ]}
  />;
}

export function MainAuxDecisionsDiagram() {
  return <Workflow
    title="Ta main là où ça engage"
    description="Ton agent prépare, mais le prix et l'envoi au client passent par une personne qui dit oui."
    legend="Une connexion ne donne jamais le droit de décider : le responsable reste visible."
    ariaLabel="Ton agent prépare le dossier, tu fixes le prix puis tu valides l'envoi, et le client reçoit l'offre. Le prix et l'envoi portent une validation humaine, l'envoi est mis en avant."
    accent={EM}
    actors={["Ton agent", "Toi", "Le client"]}
    accentIndex={2}
    steps={[
      { actor: 0, label: "Prépare" },
      { actor: 1, label: "Fixe le prix", transfer: "brouillon", humanValidation: true },
      { actor: 1, label: "Valide l'envoi", transfer: "proposition", humanValidation: true },
      { actor: 2, label: "Reçoit l'offre", transfer: "message validé" },
    ]}
  />;
}

export function UneBouclePuisDeuxDiagram() {
  return <Steps
    title="Stabilise avant d'ajouter"
    description="La boucle suivante n'arrive qu'après plusieurs cas sur la première, une fois ses arrêts corrigés."
    legend="Une petite boucle bien tenue vaut mieux qu'une automatisation reliée partout."
    ariaLabel="Quatre étapes : une seule boucle, plusieurs cas réels, une boucle stable aux entrées et arrêts corrigés, puis la boucle suivante. L'étape stable est mise en avant."
    accent={EM}
    accentIndex={2}
    items={[
      { label: "Une boucle", detail: "De la demande au rappel" },
      { label: "Plusieurs cas", detail: "Elle tourne pour de vrai" },
      { label: "Stable", detail: "Entrées et arrêts corrigés" },
      { label: "La suivante", detail: "Seulement maintenant" },
    ]}
  />;
}

export const b1_s3_VISUALS = [
  { name: "BoucleCommercialeVivante", kind: "schema", chapter: "b1-s3", component: BoucleCommercialeVivanteDiagram },
  { name: "ContexteQuiPasse", kind: "schema", chapter: "b1-s3", component: ContexteQuiPasseDiagram },
  { name: "MainAuxDecisions", kind: "schema", chapter: "b1-s3", component: MainAuxDecisionsDiagram },
  { name: "UneBouclePuisDeux", kind: "schema", chapter: "b1-s3", component: UneBouclePuisDeuxDiagram },
] as const satisfies readonly HandcraftedVisual[];
