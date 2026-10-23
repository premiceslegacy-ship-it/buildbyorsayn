import { BigNumber, Curves, Ladder } from "../kit";
import type { HandcraftedVisual } from "../coffre/types";

const EM = "#22d96e";

export function PhotoCompleteDuTravailDiagram() {
  return <BigNumber
    title="Mesurer tout le travail"
    description="Exemple : le même devis chronométré sur l'action seule, puis jusqu'au résultat accepté."
    legend="Prends cette photo avant le pilote : c'est elle qui jugera l'essai."
    ariaLabel="Exemple : un devis compte 12 minutes pour l'action seule, mais 41 minutes avec la préparation, la correction et la relecture jusqu'au résultat accepté."
    accent={EM}
    before={{ value: "12 min", label: "L'action seule" }}
    after={{ value: "41 min", label: "Avec préparation et relecture" }}
    sentence="Le chrono s'arrête au résultat accepté, pas à la fin du geste."
  />;
}

export function EscalierDAutonomieDiagram() {
  return <Ladder
    title="L'autonomie monte par paliers"
    description="Chaque marche demande sa preuve avant de passer à la suivante."
    legend="L'effet réel arrive seulement après les refus et la reprise."
    ariaLabel="Six marches, de sans effet à effet réel : voir par un diagnostic, simuler sur un dossier fictif, assister par un brouillon isolé, piloter un effet réel limité, étendre à un nouveau compte ou volume, suivre avec mesures et sortie prête."
    accent={EM}
    accentIndex={3}
    lowLabel="Sans effet"
    highLabel="Effet réel"
    rungs={[
      { label: "Voir", detail: "Diagnostic seul" },
      { label: "Simuler", detail: "Sur un dossier fictif" },
      { label: "Assister", detail: "Brouillon isolé, relu" },
      { label: "Piloter", detail: "Effet réel, périmètre limité" },
      { label: "Étendre", detail: "Nouveau compte ou volume" },
      { label: "Suivre", detail: "Mesures et sortie prête" },
    ]}
  />;
}

export function VictoireAvecContrepoidsDiagram() {
  return <Curves
    title="Une victoire garde son contrepoids"
    description="Exemple : sur quatre semaines, le délai baisse pendant que les erreurs montent."
    legend="Le verdict peut être favorable, défavorable ou indéterminé."
    ariaLabel="Exemple sur quatre semaines : le délai passe de 10 à 5 jours pendant que les erreurs passent de 1 à 8 ; le garde-fou contredit la victoire."
    accent={EM}
    labels={["Sem. 1", "Sem. 2", "Sem. 3", "Sem. 4"]}
    series={[
      { name: "Délai en jours", values: [10, 8, 6, 5] },
      { name: "Erreurs", values: [1, 2, 5, 8], accent: true },
    ]}
    annotations={[{ series: 1, point: 3, label: "Le garde-fou contredit" }]}
  />;
}

export const doctrine19 = [
  { name: "PhotoCompleteDuTravail", kind: "schema", chapter: "entreprise-07-adoption-preuves-promotion.md", component: PhotoCompleteDuTravailDiagram },
  { name: "EscalierDAutonomie", kind: "schema", chapter: "entreprise-07-adoption-preuves-promotion.md", component: EscalierDAutonomieDiagram },
  { name: "VictoireAvecContrepoids", kind: "schema", chapter: "entreprise-07-adoption-preuves-promotion.md", component: VictoireAvecContrepoidsDiagram },
] as const satisfies readonly HandcraftedVisual[];
