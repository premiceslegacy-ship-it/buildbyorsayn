import { Ladder, Workflow } from "../kit";

export function PremierWorkflowVisibleDiagram() {
  return <Workflow title="Du message au suivi" description="Le dossier avance, mais ta main reste avant l'action qui engage." ariaLabel="Un message Telegram devient une préparation Hermes, passe par ta validation, puis met à jour le suivi Notion." actors={["Prospect", "Hermes", "Toi", "CRM"]} steps={[
    { actor: 0, label: "Message", tool: "Telegram" },
    { actor: 1, label: "Préparation", tool: "Hermes Agent", transfer: "demande" },
    { actor: 2, label: "Ta validation", humanValidation: true, transfer: "brouillon" },
    { actor: 3, label: "Suivi", tool: "Notion", transfer: "accord" },
  ]} accentIndex={2} />;
}

export function OrdreDuPremierWorkflowDiagram() {
  return <Ladder title="Comprendre avant de connecter" description="Les connexions arrivent seulement après le travail compris." ariaLabel="Quatre marches montent dans l'ordre Installer, Comprendre, Connecter et Planifier. Comprendre est mis en avant." rungs={[
    { label: "Installer", detail: "Hermes répond" },
    { label: "Comprendre", detail: "Le travail est clair" },
    { label: "Connecter", detail: "Telegram ouvre la porte" },
    { label: "Planifier", detail: "Google Agenda donne le rythme" },
  ]} accentIndex={1} lowLabel="D'abord" highLabel="Ensuite" />;
}

export function ToiAgentOutilDiagram() {
  return <Workflow title="Trois rôles dans le même atelier" description="Chacun garde une responsabilité différente." ariaLabel="Tu choisis, Hermes prépare, puis Gmail, Notion et Telegram exécutent une opération précise." actors={["Toi", "Agent", "Outils"]} steps={[
    { actor: 0, label: "Tu choisis", humanValidation: true },
    { actor: 1, label: "Il prépare", tool: "Hermes Agent", transfer: "objectif" },
    { actor: 2, label: "L'outil exécute", tool: "Gmail", transfer: "instruction" },
    { actor: 2, label: "Suit", tool: "Notion" },
    { actor: 2, label: "Reçoit", tool: "Telegram" },
  ]} accentIndex={0} />;
}
