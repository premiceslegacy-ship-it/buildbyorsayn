import { Rings, Steps, ToolMap } from "../kit";
import type { HandcraftedVisual } from "../coffre/types";

const EM = "#22d96e";

function QuatrePortesUnCoffreDiagram() {
  return <ToolMap
    title="Quatre portes, la même serrure"
    description="API, CLI, MCP ou interface : la route technique change, la permission reste la même."
    legend="Une panne peut ouvrir une autre route, une interdiction jamais."
    ariaLabel="Quatre portes vers le même service : une API comme Stripe, une CLI dans Ghostty, MCP avec ton agent, une interface comme Notion ; toutes passent par le même contrôle des droits."
    accent={EM}
    accentGroup={-1}
    groups={[
      { role: "API", tools: [{ name: "Stripe", description: "Un service parle à un service" }] },
      { role: "CLI", tools: [{ name: "Ghostty", description: "Une commande dans le terminal" }] },
      { role: "MCP", tools: [{ name: "Hermes Agent", description: "Ressources et outils exposés" }] },
      { role: "Interface", tools: [{ name: "Notion", description: "Des boutons à l'écran" }] },
    ]}
  />;
}

function BarriereDevantActionDiagram() {
  return <Steps
    title="La barrière vient avant l'appel"
    description="La règle explique, le contrôle bloque l'appel, et le test prouve que le refus arrive."
    legend="Une règle seule ne bloque rien : regarde les outils vraiment appelés."
    ariaLabel="Trois étapes : dire la règle par écrit, bloquer l'appel par un contrôle, puis tester en provoquant le refus."
    accent={EM}
    accentIndex={1}
    items={[
      { label: "Dire", detail: "La règle écrite" },
      { label: "Bloquer", detail: "Le contrôle refuse l'appel" },
      { label: "Tester", detail: "Tu provoques le refus" },
    ]}
  />;
}

function TroisFiletsSousActionDiagram() {
  return <Rings
    title="Trois filets sous l'action"
    description="Une action extérieure, comme un paiement, se protège de trois façons différentes."
    legend="Délai dépassé : relis la cible avant de recommencer."
    ariaLabel="Autour d'une action extérieure, trois protections : ignorer le même événement en doublon, n'autoriser qu'une écriture à la fois, et rendre l'action répétable sans double effet."
    accent={EM}
    core="Action"
    accentIndex={2}
    rings={[
      { label: "Doublon", detail: "Le même événement ignoré" },
      { label: "Concurrence", detail: "Une écriture à la fois" },
      { label: "Rejeu", detail: "Répéter sans double effet" },
    ]}
  />;
}

export const doctrine17 = [
  { name: "QuatrePortesUnCoffre", kind: "schema", chapter: "entreprise-05-outils-api-cli-mcp.md", component: QuatrePortesUnCoffreDiagram },
  { name: "BarriereDevantAction", kind: "schema", chapter: "entreprise-05-outils-api-cli-mcp.md", component: BarriereDevantActionDiagram },
  { name: "TroisFiletsSousAction", kind: "schema", chapter: "entreprise-05-outils-api-cli-mcp.md", component: TroisFiletsSousActionDiagram },
] as const satisfies readonly HandcraftedVisual[];
