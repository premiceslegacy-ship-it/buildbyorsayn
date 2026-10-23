import { Fork, Steps, Workflow } from "../kit";
import type { HandcraftedVisual } from "../coffre/types";

const EM = "#22d96e";

export function AssietteVersPostesDiagram() {
  return <Steps
    title="Remonter depuis le résultat"
    description="Comme en cuisine, tu pars de l'assiette servie : ici, le devis accepté par le client."
    legend="Arrête de découper quand chaque lot a une entrée, une sortie et un contrôle."
    ariaLabel="Quatre étapes en remontant depuis le résultat. Le résultat : le devis accepté. Les compétences : chiffrer, rédiger, vérifier. Les tâches : métré, prix, relecture. Les lots, mis en avant : chacun avec une entrée et une sortie."
    accent={EM}
    accentIndex={3}
    items={[
      { label: "Résultat", detail: "Le devis accepté" },
      { label: "Compétences", detail: "Chiffrer, rédiger, vérifier" },
      { label: "Tâches", detail: "Métré, prix, relecture" },
      { label: "Lots", detail: "Une entrée, une sortie" },
    ]}
  />;
}

export function RecetteTicketCuisinierDiagram() {
  return <Workflow
    title="Ticket, recette, cuisinier"
    description="La tâche dit quoi faire, le skill dit comment, l'agent exécute avec ses permissions."
    legend="Une sous-compétence ne demande pas toujours un sous-agent."
    ariaLabel="Trois objets distincts en relais. La tâche, un ticket limité : le devis de la salle de bain. Le skill, la recette avec ses choix : chiffrer une pose. L'agent, l'exécutant avec son contexte et ses permissions, mis en avant : il prépare le devis."
    accent={EM}
    accentIndex={2}
    actors={["La tâche", "Le skill", "L'agent"]}
    steps={[
      { actor: 0, label: "Devis salle de bain" },
      { actor: 1, label: "Chiffrer une pose", transfer: "le besoin" },
      { actor: 2, label: "Prépare le devis", transfer: "la méthode", tool: "Hermes Agent" },
    ]}
  />;
}

export function UneEquipePasUneFouleDiagram() {
  return <Fork
    title="Une équipe, pas une foule"
    description="Avant d'ajouter un agent, regarde si le risque demande vraiment de séparer le travail."
    legend="Un responsable d'intégration regarde toujours le dossier complet."
    ariaLabel="Situation : faut-il un agent de plus pour les devis ? Regrouper, conseillé, quand les compétences partagent le même contexte. Séparer quand il y a une validation de prix, une donnée sensible ou une revue indépendante. Un agent par geste, refusé, car il crée trop de passations."
    accent={EM}
    situation="Un agent de plus pour les devis ?"
    outcomes={[
      { label: "Regrouper", condition: "Même contexte, compétences proches", recommended: true },
      { label: "Séparer", condition: "Prix, donnée sensible, revue" },
      { label: "Un agent par geste", condition: "Trop de passations", rejected: true },
    ]}
  />;
}

export const doctrine04 = [
  { name: "AssietteVersPostes", kind: "schema", chapter: "02-decomposition-et-agents.md", component: AssietteVersPostesDiagram },
  { name: "RecetteTicketCuisinier", kind: "schema", chapter: "02-decomposition-et-agents.md", component: RecetteTicketCuisinierDiagram },
  { name: "UneEquipePasUneFoule", kind: "schema", chapter: "02-decomposition-et-agents.md", component: UneEquipePasUneFouleDiagram },
] as const satisfies readonly HandcraftedVisual[];
