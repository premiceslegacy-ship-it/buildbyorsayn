import { Funnel, Ladder, Steps } from "../kit";
import type { HandcraftedVisual } from "../coffre/types";

const EM = "#22d96e";

function PreuveAChaqueEtageDiagram() {
  return <Ladder
    title="Chaque preuve ferme un étage"
    description="Exemple : une relance de devis. Chaque preuve répond à une question, de décrit à mesuré."
    legend="N'annonce jamais le dernier étage avec la preuve du premier."
    ariaLabel="Cinq étages sur une relance de devis. Décrit : la consigne dit ce qui est prévu. Testé : un brouillon sort en local. Effet relu, mis en avant : le message apparaît dans les envoyés. Accepté : le client répond au devis. Mesuré : plus de devis signés sur un mois."
    accent={EM}
    accentIndex={2}
    lowLabel="Faible"
    highLabel="Fort"
    rungs={[
      { label: "Décrit", detail: "La consigne dit ce qui est prévu" },
      { label: "Testé", detail: "Un brouillon sort en local" },
      { label: "Effet relu", detail: "Le message est dans les envoyés" },
      { label: "Accepté", detail: "Le client répond au devis" },
      { label: "Mesuré", detail: "Plus de devis signés sur un mois" },
    ]}
  />;
}

function IncidentVersTestDiagram() {
  return <Steps
    title="L'erreur devient un test"
    description="Une erreur sert quand tu peux la rejouer, la corriger un peu et la garder comme test."
    legend="Si la cause reste inconnue, garde-la comme hypothèse, pas comme règle."
    ariaLabel="Quatre étapes dans l'ordre. Garder la trace : contexte, version, résultat attendu. Reproduire le plus petit cas. Corriger peu, un seul changement. Rejouer le cas et ses voisins, mis en avant."
    accent={EM}
    accentIndex={3}
    items={[
      { label: "Garder la trace", detail: "Contexte, version, attendu" },
      { label: "Reproduire", detail: "Le plus petit cas" },
      { label: "Corriger peu", detail: "Un seul changement" },
      { label: "Rejouer", detail: "Le cas et ses voisins" },
    ]}
  />;
}

function ObservationVersMethodeDiagram() {
  return <Funnel
    title="L'observation passe au tamis"
    description="Exemple : dix idées notées en un mois. Chacune est comparée avant de devenir une méthode."
    legend="Range ce qui passe au bon endroit : mémoire, SOP, skill ou test."
    ariaLabel="Un entonnoir, exemple sur un mois. Dix idées observées et notées. Six comparées à la baseline. Trois favorables, la mesure tient. Deux rangées comme méthode. La plus grande perte arrive après la comparaison : la moitié reste indéterminée."
    accent={EM}
    leakIndex={1}
    leakLabel="La moitié reste indéterminée"
    stages={[
      { label: "Observées", value: 10, valueLabel: "10 idées", detail: "Notées pendant le mois" },
      { label: "Comparées", value: 6, valueLabel: "6", detail: "Baseline contre variante" },
      { label: "Favorables", value: 3, valueLabel: "3", detail: "La mesure tient" },
      { label: "Rangées", value: 2, valueLabel: "2", detail: "Devenues méthode" },
    ]}
  />;
}

export const doctrine08 = [
  { name: "PreuveAChaqueEtage", kind: "schema", chapter: "06-preuve-iteration-skills.md", component: PreuveAChaqueEtageDiagram },
  { name: "IncidentVersTest", kind: "schema", chapter: "06-preuve-iteration-skills.md", component: IncidentVersTestDiagram },
  { name: "ObservationVersMethode", kind: "schema", chapter: "06-preuve-iteration-skills.md", component: ObservationVersMethodeDiagram },
] as const satisfies readonly HandcraftedVisual[];
