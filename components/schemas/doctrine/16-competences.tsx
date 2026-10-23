import { Cycle, Fork, Rings } from "../kit";
import type { HandcraftedVisual } from "../coffre/types";

const EM = "#22d96e";

export function BriquesDuSavoirFaireDiagram() {
  return <Rings
    title="Les briques du savoir-faire"
    description="Du métier à l'agent, chaque brique a un rôle et ne remplace pas les autres."
    legend="Le skill se change sans toucher au métier ni à la compétence."
    ariaLabel="Le métier porte la responsabilité, la compétence décrit un savoir-faire, la SOP une route stable, le skill ajoute des choix et l'agent exécute au centre."
    accent={EM}
    core="Agent"
    accentIndex={0}
    rings={[
      { label: "Skill", detail: "Ajoute des choix" },
      { label: "SOP", detail: "Une route stable" },
      { label: "Compétence", detail: "Un savoir-faire" },
      { label: "Métier", detail: "Porte la responsabilité" },
    ]}
  />;
}

export function ProcedureAvecSortiesDeSecoursDiagram() {
  return <Fork
    title="La procédure prévoit ses sorties"
    description="Après la comparaison, la procédure continue, s'arrête ou passe la main."
    legend="Une étape testable dit quoi comparer, pas « contrôler le dossier »."
    ariaLabel="Après avoir comparé le devis et l'acceptation : continuer si tout concorde, arrêter si une pièce manque, reprendre en signalant la différence à une personne."
    accent={EM}
    situation="Comparer le devis et l'acceptation"
    outcomes={[
      { label: "Continuer", condition: "Tout concorde", recommended: true },
      { label: "Arrêter", condition: "Une pièce manque" },
      { label: "Reprendre", condition: "Différence signalée à une personne" },
    ]}
  />;
}

export function CandidatPuisPromotionDiagram() {
  return <Cycle
    title="Une répétition reste candidate"
    description="Une méthode observée passe par un test et une revue avant d'être gardée."
    legend="Le modèle peut proposer un changement, jamais s'ajouter un droit."
    ariaLabel="Une boucle : observer un cas qui se répète, le tester sur un dossier incomplet, le faire relire par une personne, puis le garder ou le retirer."
    accent={EM}
    entryIndex={0}
    centerLabel="Candidat, pas règle"
    steps={[
      { label: "Observer", detail: "Un cas qui se répète" },
      { label: "Tester", detail: "Sur un dossier incomplet" },
      { label: "Revoir", detail: "Une personne relit" },
      { label: "Garder", detail: "Ou retirer" },
    ]}
  />;
}

export const doctrine16 = [
  { name: "BriquesDuSavoirFaire", kind: "schema", chapter: "entreprise-04-competences-skills-sop.md", component: BriquesDuSavoirFaireDiagram },
  { name: "ProcedureAvecSortiesDeSecours", kind: "schema", chapter: "entreprise-04-competences-skills-sop.md", component: ProcedureAvecSortiesDeSecoursDiagram },
  { name: "CandidatPuisPromotion", kind: "schema", chapter: "entreprise-04-competences-skills-sop.md", component: CandidatPuisPromotionDiagram },
] as const satisfies readonly HandcraftedVisual[];
