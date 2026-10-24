import { FileCard, Ladder, Steps } from "../kit";
import type { HandcraftedVisual } from "../coffre/types";

const EM = "#22d96e";

function TableauDeBordHuitCasesDiagram() {
  return <FileCard
    title="Le contrat tient sur huit cases"
    description="Résultat, humain, source, entrées, sortie, droits, reprise et revue, remplis avant le lancement."
    legend="Sans reprise écrite, tu caches le travail dans une machine."
    ariaLabel="Le contrat d'une relance de devis remplit huit cases : résultat, humain responsable, source HubSpot, entrées, sortie en brouillon Gmail, droits sans envoi, état de reprise et date de revue."
    accent={EM}
    filename="contrat.yaml"
    lines={[
      { text: "resultat: relance préparée" },
      { text: "humain: responsable commercial" },
      { text: "source: HubSpot, devis ouverts" },
      { text: "entrees: devis sans réponse" },
      { text: "sortie: brouillon dans Gmail" },
      { text: "droits: lire, préparer" },
      { text: "reprise: état écrit au dossier" },
      { text: "revue: date fixée au lancement" },
    ]}
    annotations={[
      { line: 2, label: "Une personne nommée tranche" },
      { line: 6, label: "Préparer, jamais envoyer seul" },
      { line: 7, label: "Une autre personne reprend" },
    ]}
  />;
}

function TroisCerclesDAutoriteDiagram() {
  return <Ladder
    title="L'accord grandit avec l'effet"
    description="Préparer, modifier et engager ne demandent pas le même niveau d'accord."
    legend="Une ancienne décision ne devient jamais une permission générale."
    ariaLabel="Trois marches d'accord : lire et préparer reste limité sans effet dehors, modifier demande une instruction précise, engager demande un accord sur l'action exacte."
    accent={EM}
    accentIndex={2}
    lowLabel="Accord léger"
    highLabel="Accord exact"
    rungs={[
      { label: "Préparer", detail: "Lire et rédiger" },
      { label: "Modifier", detail: "Une instruction précise" },
      { label: "Engager", detail: "Envoyer, payer, publier" },
    ]}
  />;
}

function ManuelAvantAutomatiqueDiagram() {
  return <Steps
    title="Le manuel précède l'automatique"
    description="Le travail se fait d'abord à la main, puis se teste et se limite avant d'être planifié."
    legend="Une pause bloque les nouveaux départs, pas forcément ce qui tourne."
    ariaLabel="Quatre étapes : comprendre en le faisant à la main, tester une coupure avec ton agent, limiter le coût et l'effet, puis planifier dans Google Agenda."
    accent={EM}
    accentIndex={1}
    items={[
      { label: "Comprendre", detail: "Le faire à la main" },
      { label: "Tester", detail: "Coupure, réglage manquant", tools: ["Hermes Agent"] },
      { label: "Limiter", detail: "Coût, effet, pause" },
      { label: "Planifier", detail: "Une heure fixe", tools: ["Google Agenda"] },
    ]}
  />;
}

export const doctrine21 = [
  { name: "TableauDeBordHuitCases", kind: "schema", chapter: "entreprise-09-gouvernance-capacites-et-reprise.md", component: TableauDeBordHuitCasesDiagram },
  { name: "TroisCerclesDAutorite", kind: "schema", chapter: "entreprise-09-gouvernance-capacites-et-reprise.md", component: TroisCerclesDAutoriteDiagram },
  { name: "ManuelAvantAutomatique", kind: "schema", chapter: "entreprise-09-gouvernance-capacites-et-reprise.md", component: ManuelAvantAutomatiqueDiagram },
] as const satisfies readonly HandcraftedVisual[];
