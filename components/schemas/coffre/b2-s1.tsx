import { Fork, Rings, Steps, ToolMap } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function TableDesOutilsDiagram() {
  return <ToolMap
    title="Quatre outils, quatre rôles"
    description="Une petite stack par défaut : chaque outil a un rôle connu, tu ne redécides plus tout à chaque projet."
    legend="Un outil sans rôle écrit n'a pas sa place sur ton établi."
    ariaLabel="Un établi de quatre outils bien connus, un par rôle : Claude pour réfléchir, Notion pour garder les briefs, Figma pour dessiner l'interface, GitHub pour garder les versions."
    accent={EM}
    accentGroup={-1}
    groups={[
      { role: "Réfléchir", tools: [{ name: "Claude", description: "Raisonne sur ta tâche" }] },
      { role: "Garder les briefs", tools: [{ name: "Notion", description: "Une seule source validée" }] },
      { role: "Dessiner", tools: [{ name: "Figma", description: "Pose et relit l'interface" }] },
      { role: "Garder les versions", tools: [{ name: "GitHub", description: "L'historique du projet" }] },
    ]}
  />;
}

export function PorteEntreeOutilDiagram() {
  return <Steps
    title="Quatre questions à l'entrée"
    description="Un nouvel outil entre dans ta stack seulement s'il répond aux quatre, dans cet ordre."
    legend="Une seule réponse floue, et l'outil reste dehors."
    ariaLabel="Quatre questions filtrent chaque outil : son rôle écrit en une phrase, l'opération qu'il améliore, son intégration avec tes données et ton équipe, puis son coût et sa sortie. Le rôle est mis en avant."
    accent={EM}
    accentIndex={0}
    items={[
      { label: "Son rôle", detail: "Écrit en une phrase" },
      { label: "Le gain", detail: "Quelle opération va mieux ?" },
      { label: "L'intégration", detail: "Tes données, ton équipe" },
      { label: "Coût et sortie", detail: "Combien, et comment partir" },
    ]}
  />;
}

export function CoutTotalVisibleDiagram() {
  return <Rings
    title="Le prix n'est qu'une couche"
    description="Autour du prix affiché s'ajoute le temps pour régler, former, surveiller et un jour quitter l'outil."
    legend="Avant de signer, chiffre aussi le temps des couches autour du prix."
    ariaLabel="Le coût complet d'un outil, en cinq couches du centre vers l'extérieur : le prix affiché, la configuration, la formation, la surveillance et la sortie. La sortie, souvent oubliée, est mise en avant."
    accent={EM}
    core="Coût"
    accentIndex={4}
    rings={[
      { label: "Prix affiché", detail: "Ce que montre l'écran" },
      { label: "Configuration", detail: "Le temps pour le régler" },
      { label: "Formation", detail: "Toi et ton équipe" },
      { label: "Surveillance", detail: "Le suivi chaque semaine" },
      { label: "Sortie", detail: "Exporter et migrer un jour" },
    ]}
  />;
}

export function DecisionGarderRemplacerRetirerDiagram() {
  return <Fork
    title="Une décision écrite"
    description="L'audit d'un outil se termine par un seul mot, appuyé sur un test avec un brief récent."
    legend="Note aussi la preuve qui te ferait changer d'avis, et une date de revue."
    ariaLabel="Après un test sur un brief récent, trois décisions possibles : garder l'outil s'il améliore une opération réelle, le remplacer si le rôle compte mais que l'outil ne suit pas, le retirer s'il fait doublon ou n'a plus de rôle."
    accent={EM}
    situation="Un brief récent, testé dans l'outil"
    outcomes={[
      { label: "Garder", condition: "Il améliore une opération réelle" },
      { label: "Remplacer", condition: "Le rôle compte, l'outil ne suit pas" },
      { label: "Retirer", condition: "Doublon ou rôle vide" },
    ]}
  />;
}

export const b2_s1_VISUALS = [
  { name: "TableDesOutils", kind: "schema", chapter: "b2-s1", component: TableDesOutilsDiagram },
  { name: "PorteEntreeOutil", kind: "schema", chapter: "b2-s1", component: PorteEntreeOutilDiagram },
  { name: "CoutTotalVisible", kind: "schema", chapter: "b2-s1", component: CoutTotalVisibleDiagram },
  { name: "DecisionGarderRemplacerRetirer", kind: "schema", chapter: "b2-s1", component: DecisionGarderRemplacerRetirerDiagram },
] as const satisfies readonly HandcraftedVisual[];
