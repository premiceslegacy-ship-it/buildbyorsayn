import { Fork, ToolMap, Workflow } from "../kit";

const EM = "#22d96e";

export function FederatedBrainDiagramV2() {
  return <ToolMap
    title="Chaque métier garde sa source"
    description="Pour chaque sujet, un seul outil fait foi. L'agent ne les remplace pas."
    legend="Quand deux chiffres se contredisent, tu relis l'outil du métier concerné."
    ariaLabel="Quatre métiers et l'outil qui fait foi : Notion pour la relation commerciale, Google Agenda pour les disponibilités, Stripe pour les paiements, Figma pour les livrables."
    accent={EM}
    groups={[
      { role: "Vente", tools: [{ name: "Notion", description: "La relation client" }] },
      { role: "Planning", tools: [{ name: "Google Agenda", description: "Les disponibilités" }] },
      { role: "Comptabilité", tools: [{ name: "Stripe", description: "Les paiements" }] },
      { role: "Projet", tools: [{ name: "Figma", description: "Les livrables" }] },
    ]}
    accentGroup={0}
  />;
}

export function QuatreMetiersUneVueDiagram() {
  return <Workflow
    title="Trois sources, un dossier"
    description="Exemple : une agence reçoit un client, chaque métier ajoute sa pièce."
    legend="L'agent réunit les pièces. Il ne devient pas une seconde base."
    ariaLabel="Le commercial transmet l'offre acceptée depuis Notion, la production ajoute la date possible depuis Google Agenda, la finance confirme l'acompte dans Stripe, puis l'agent prépare le dossier de démarrage."
    accent={EM}
    actors={["Vente", "Production", "Finance", "Ton agent"]}
    steps={[
      { actor: 0, label: "Offre acceptée", tool: "Notion" },
      { actor: 1, label: "Date possible", tool: "Google Agenda", transfer: "offre" },
      { actor: 2, label: "Acompte", tool: "Stripe", transfer: "date" },
      { actor: 3, label: "Dossier prêt", tool: "Hermes Agent", transfer: "3 sources" },
    ]}
    accentIndex={3}
  />;
}

export function AgentsParTravailDiagram() {
  return <ToolMap
    title="Un agent par travail"
    description="Chaque assistant ne reçoit que ce qui sert son travail, rien de plus."
    legend="Le marketing ne voit pas les factures, le support ne voit pas le dépôt."
    ariaLabel="L'assistant marketing lit les briefs dans Notion et les résultats sur Instagram. L'assistant support lit les demandes dans Gmail et les commandes utiles dans Stripe."
    accent={EM}
    groups={[
      { role: "Assistant marketing", tools: [{ name: "Notion", description: "Les briefs" }, { name: "Instagram", description: "Les résultats" }] },
      { role: "Assistant support", tools: [{ name: "Gmail", description: "Les demandes" }, { name: "Stripe", description: "Les commandes utiles" }] },
    ]}
    accentGroup={1}
  />;
}

export function DesaccordVisibleDiagram() {
  return <Fork
    title="Le désaccord remonte"
    description="Exemple : le commercial promet une date, les opérations disent non."
    legend="L'agent montre l'écart et nomme qui tranche. Il ne choisit pas seul."
    ariaLabel="Deux sources se contredisent sur une date. Le commercial a promis une date, les opérations en confirment une autre. L'agent présente la comparaison et le responsable décide."
    accent={EM}
    situation="Deux dates différentes"
    outcomes={[
      { label: "Date promise", condition: "Donnée par le commercial" },
      { label: "Date possible", condition: "Confirmée par les opérations" },
      { label: "Décision", condition: "Le responsable tranche", recommended: true },
    ]}
  />;
}
