import { Steps, ToolMap } from "../kit";

const EM = "#22d96e";

export function TroisPortesUnServiceDiagram() {
  return <ToolMap
    title="Trois portes, un seul compte"
    description="API, CLI et MCP sont trois façons de parler au même logiciel."
    legend="Quelle que soit la porte, ce sont les droits du compte qui décident."
    ariaLabel="Une API envoie une demande structurée à un service comme Stripe, une CLI passe par une commande dans le terminal Ghostty, et MCP présente des outils à l'agent. Dans les trois cas, les droits du compte restent la limite."
    accent={EM}
    groups={[
      { role: "API", tools: [{ name: "Stripe", description: "Une demande structurée" }] },
      { role: "CLI", tools: [{ name: "Ghostty", description: "Une commande rejouable" }] },
      { role: "MCP", tools: [{ name: "Hermes Agent", description: "Des outils pour l'agent" }] },
    ]}
    accentGroup={1}
  />;
}

export function ToolAccessDiagramV2() {
  return <Steps
    title="La porte, les droits, l'action"
    description="Une connexion n'ouvre rien toute seule : le compte autorise ou refuse chaque opération."
    legend="Teste une lecture autorisée et un refus avant d'activer une écriture."
    ariaLabel="Trois étapes : choisir une porte parmi API, CLI ou MCP, laisser le compte vérifier ses droits, puis exécuter une seule opération précise."
    accent={EM}
    items={[
      { label: "Une porte", detail: "API, CLI ou MCP" },
      { label: "Les droits", detail: "Le service autorise ou refuse" },
      { label: "Une opération", detail: "Une seule, sur une cible" },
    ]}
    accentIndex={1}
  />;
}

export function CarteOutilsParRoleDiagram() {
  return <ToolMap
    title="Une phrase par outil"
    description="Chaque outil reçoit une opération précise, jamais un accès général."
    legend="Garde les outils d'écriture éteints au premier essai."
    ariaLabel="Gmail lit les demandes et prépare des brouillons, Notion garde la fiche de travail, Stripe montre l'état d'un paiement, Telegram reçoit la demande de validation."
    accent={EM}
    groups={[
      { role: "Lire", tools: [{ name: "Gmail", description: "Demandes et brouillons" }] },
      { role: "Ranger", tools: [{ name: "Notion", description: "La fiche de travail" }] },
      { role: "Vérifier", tools: [{ name: "Stripe", description: "L'état du paiement" }] },
      { role: "Valider", tools: [{ name: "Telegram", description: "Ton accord" }] },
    ]}
    accentGroup={3}
  />;
}

export function LireAgirRelireDiagram() {
  return <Steps
    title="Une action se ferme par une relecture"
    description="Une commande peut finir sans erreur alors que le service a refusé l'action."
    legend="Si tu ne sais pas si le message est parti, ne le renvoie pas tout de suite."
    ariaLabel="Quatre étapes : lire l'état avant, agir une seule fois, relire le service qui fait foi, puis décider. En cas de doute, on ne renvoie pas."
    accent={EM}
    items={[
      { label: "Lire", detail: "L'état avant l'action" },
      { label: "Agir", detail: "Une seule tentative" },
      { label: "Relire", detail: "Le service qui fait foi" },
      { label: "Décider", detail: "Pas de renvoi si doute" },
    ]}
    accentIndex={2}
  />;
}
