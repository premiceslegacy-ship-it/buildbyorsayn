import { Steps, ToolMap } from "../kit";

export function TroisPortesUnServiceDiagram() {
  return <ToolMap title="Trois portes, le même compte" description="La porte technique ne change jamais les droits du service." ariaLabel="API, CLI et MCP mènent au Même compte Hermes." groups={[
    { role: "API", tools: [{ name: "Hermes Agent", description: "Même compte" }] },
    { role: "CLI", tools: [{ name: "Ghostty", description: "Même compte" }] },
    { role: "MCP", tools: [{ name: "Hermes Agent", description: "Même compte" }] },
  ]} accentGroup={1} />;
}

export function ToolAccessDiagramV2() {
  return <Steps title="La porte, le réglage, l'action" description="Le chemin technique garde un contrôle avant l'opération." ariaLabel="API, CLI ou MCP mène à Droit vérifié, puis à Action." items={[
    { label: "API, CLI ou MCP", detail: "La porte choisie" },
    { label: "Droit vérifié", detail: "Le compte autorise" },
    { label: "Action", detail: "L'opération précise" },
  ]} accentIndex={1} />;
}

export function CarteOutilsParRoleDiagram() {
  return <ToolMap title="Chaque outil tient une place" description="Quatre tuiles entourent le même dossier sans partager le même droit." ariaLabel="Gmail sert à Lire, Notion à Ranger, Stripe à Vérifier et Telegram à Valider." groups={[
    { role: "Lire", tools: [{ name: "Gmail", description: "Messages entrants" }] },
    { role: "Ranger", tools: [{ name: "Notion", description: "État du dossier" }] },
    { role: "Vérifier", tools: [{ name: "Stripe", description: "État du paiement" }] },
    { role: "Valider", tools: [{ name: "Telegram", description: "Accord humain" }] },
  ]} accentGroup={3} />;
}

export function LireAgirRelireDiagram() {
  return <Steps title="Une action se ferme par une relecture" description="Le service confirme ce qui s'est vraiment passé." ariaLabel="Trois étapes relient Lire, Agir et Relire. Relire est mis en avant." items={[
    { label: "Lire", detail: "Connaître l'état initial" },
    { label: "Agir", detail: "Tenter une opération" },
    { label: "Relire", detail: "Confirmer l'état final" },
  ]} accentIndex={2} />;
}
