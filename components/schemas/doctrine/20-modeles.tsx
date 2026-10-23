import { FileCard, Fork, Funnel } from "../kit";
import type { HandcraftedVisual } from "../coffre/types";

const EM = "#22d96e";

export function KitDuPremierDossierDiagram() {
  return <FileCard
    title="Le kit du premier dossier"
    description="Huit fichiers suffisent pour qu'une autre personne reprenne le pilote."
    legend="Une valeur sans source s'écrit A_RENSEIGNER, jamais inventée."
    ariaLabel="Le dossier premier-pilote contient huit fichiers : métier, catalogue, contexte, méthode, mission, passation, baseline et tests, avec la mission mise en avant."
    accent={EM}
    filename="premier-pilote/"
    lines={[
      { text: "metier.md" },
      { text: "catalogue.md" },
      { text: "contexte.md" },
      { text: "methode.md" },
      { text: "mission.md", tone: "heading" },
      { text: "passation.md" },
      { text: "baseline.md" },
      { text: "tests.md" },
    ]}
    annotations={[
      { line: 1, label: "Qui porte le résultat" },
      { line: 5, label: "Un problème, ses limites" },
      { line: 8, label: "Non exécuté reste écrit" },
    ]}
  />;
}

export function MatriceQuiNeMentPasDiagram() {
  return <Funnel
    title="Une case vide dit non testé"
    description="Exemple : dix tests prévus, six exécutés, quatre vraiment prouvés."
    legend="Un dry run n'est sûr que s'il n'utilise ni secret ni système réel."
    ariaLabel="Exemple : sur dix tests prévus, six sont exécutés sur données fictives et quatre ont une preuve gardée et relue ; les quatre cases non lancées restent marquées non testé."
    accent={EM}
    leakIndex={0}
    leakLabel="Quatre cases restent « non testé »"
    stages={[
      { label: "Prévu", value: 10, detail: "Refus, doublon, coupure" },
      { label: "Exécuté", value: 6, detail: "Sur données fictives" },
      { label: "Prouvé", value: 4, detail: "Preuve relue" },
    ]}
  />;
}

export function EtiquetteCandidateDiagram() {
  return <Fork
    title="Candidate avant d'être gardée"
    description="Une méthode observée reste candidate jusqu'à la revue, avec sa condition de retrait."
    legend="Être gardée n'ajoute aucun droit à l'agent."
    ariaLabel="À la revue d'une méthode candidate : gardée si preuves et contre-exemples sont relus, corrigée si un cas la contredit, retirée si sa condition de retrait arrive."
    accent={EM}
    situation="Revue de la méthode candidate"
    outcomes={[
      { label: "Gardée", condition: "Preuves relues", recommended: true },
      { label: "Corrigée", condition: "Un cas la contredit" },
      { label: "Retirée", condition: "Sa condition de retrait arrive", rejected: true },
    ]}
  />;
}

export const doctrine20 = [
  { name: "KitDuPremierDossier", kind: "schema", chapter: "entreprise-08-templates-et-exercices.md", component: KitDuPremierDossierDiagram },
  { name: "MatriceQuiNeMentPas", kind: "schema", chapter: "entreprise-08-templates-et-exercices.md", component: MatriceQuiNeMentPasDiagram },
  { name: "EtiquetteCandidate", kind: "schema", chapter: "entreprise-08-templates-et-exercices.md", component: EtiquetteCandidateDiagram },
] as const satisfies readonly HandcraftedVisual[];
