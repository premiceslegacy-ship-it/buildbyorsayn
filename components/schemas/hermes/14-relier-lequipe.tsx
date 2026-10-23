import { Fork, ToolMap } from "../kit";

export function FederatedBrainDiagramV2() {
  return <ToolMap title="Quatre responsabilités, aucun compte universel" description="Chaque métier garde sa source, ses outils et son responsable." ariaLabel="Vente, Production, Finance et Support restent séparés tout en alimentant une vue commune." groups={[
    { role: "Vente", tools: [{ name: "Notion", description: "Prospects et décisions" }] },
    { role: "Production", tools: [{ name: "Hermes Agent", description: "Dossiers et méthodes" }] },
    { role: "Finance", tools: [{ name: "Stripe", description: "Paiements" }] },
    { role: "Support", tools: [{ name: "Gmail", description: "Demandes client" }] },
  ]} accentGroup={1} />;
}

export function QuatreMetiersUneVueDiagram() {
  return <ToolMap title="Quatre métiers alimentent une vue" description="Les liens circulent sans effacer le rôle de chaque système." ariaLabel="Vente, Production, Finance et Support alimentent une Vue commune avec Notion, Hermes, Stripe, Gmail et Slack." groups={[
    { role: "Vente", tools: [{ name: "Notion", description: "Opportunités" }] },
    { role: "Production", tools: [{ name: "Hermes Agent", description: "Travail préparé" }] },
    { role: "Finance", tools: [{ name: "Stripe", description: "Paiements" }] },
    { role: "Support", tools: [{ name: "Gmail", description: "Demandes" }, { name: "Slack", description: "Vue commune" }] },
  ]} accentGroup={3} />;
}

export function AgentsParTravailDiagram() {
  return <ToolMap title="Un établi par travail" description="Chaque assistant reçoit seulement les outils de son métier." ariaLabel="Marketing utilise Instagram, Support utilise Gmail et Opérations utilise Notion. Hermes reste séparé sur chaque établi." groups={[
    { role: "Marketing", tools: [{ name: "Instagram", description: "Contenu" }, { name: "Hermes Agent", description: "Préparation" }] },
    { role: "Support", tools: [{ name: "Gmail", description: "Demandes" }, { name: "Hermes Agent", description: "Brouillons" }] },
    { role: "Opérations", tools: [{ name: "Notion", description: "Dossiers" }, { name: "Hermes Agent", description: "Contrôles" }] },
  ]} accentGroup={2} />;
}

export function DesaccordVisibleDiagram() {
  return <Fork title="Le désaccord remonte au responsable" description="Deux dates contradictoires deviennent une décision humaine." ariaLabel="Date promise et Date possible convergent vers À décider." situation="Deux sources se contredisent"
    outcomes={[
      { label: "Date promise", condition: "La vente s'est engagée" },
      { label: "Date possible", condition: "La production répond" },
      { label: "À décider", condition: "Le responsable tranche", recommended: true },
    ]} />;
}
