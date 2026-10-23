import { Fork, Steps, Workflow } from "../kit";

export function CinqObjetsPasUnSeulDiagram() {
  return <Steps title="Cinq objets, cinq usages" description="Les distinguer évite de confier un travail flou à l'agent." ariaLabel="Une boîte à outils sépare Tâche, Workflow, Skill, Outil et Validation. Workflow est mis en avant." items={[
    { label: "Tâche", detail: "Une action" },
    { label: "Workflow", detail: "Un trajet complet", tools: ["Hermes Agent"] },
    { label: "Skill", detail: "Une méthode" },
    { label: "Outil", detail: "Une opération", tools: ["Gmail", "Notion"] },
    { label: "Validation", detail: "Une décision" },
  ]} accentIndex={1} />;
}

export function MessageJusquaSuiteDiagram() {
  return <Workflow title="Le brouillon n'est pas la fin" description="Le travail continue jusqu'à la validation et au suivi." ariaLabel="Un message Telegram est reçu, compris, préparé par Hermes, validé par une personne puis suivi dans Notion." actors={["Message", "Agent", "Toi", "Suivi"]} steps={[
    { actor: 0, label: "Reçu", tool: "Telegram" },
    { actor: 1, label: "Compris", tool: "Hermes Agent", transfer: "message" },
    { actor: 1, label: "Préparé", tool: "Hermes Agent" },
    { actor: 2, label: "Validé", humanValidation: true, transfer: "brouillon" },
    { actor: 3, label: "Suivi", tool: "Notion", transfer: "accord" },
  ]} accentIndex={3} />;
}

export function LigneArriveeDuTravailDiagram() {
  return <Fork title="Une mission utile a une arrivée" description="Une demande précise se termine devant une décision visible." ariaLabel="La demande vague Aide-moi est refusée. La mission Trois idées sourcées arrive devant la décision Oui ou non." situation="Quel résultat doit arriver ?" outcomes={[
    { label: "Aide-moi", condition: "Aucune arrivée visible", rejected: true },
    { label: "Trois idées sourcées", condition: "Oui ou non", recommended: true },
  ]} />;
}
