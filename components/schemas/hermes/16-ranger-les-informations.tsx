import { Compare, ToolMap, Workflow } from "../kit";

const EM = "#22d96e";

export function DataFormatsDiagramV2() {
  return <ToolMap
    title="Une information, une maison"
    description="Chaque fait vit à un seul endroit. Les notes pointent vers lui."
    legend="Une note peut résumer, mais elle renvoie toujours à l'origine."
    ariaLabel="Quatre faits et l'outil qui fait foi : l'état du prospect dans Notion, le paiement dans Stripe, le rendez-vous dans Google Agenda, la règle de travail dans Obsidian."
    accent={EM}
    groups={[
      { role: "Prospect", tools: [{ name: "Notion", description: "L'état du prospect" }] },
      { role: "Paiement", tools: [{ name: "Stripe", description: "Le montant payé" }] },
      { role: "Rendez-vous", tools: [{ name: "Google Agenda", description: "La date de l'appel" }] },
      { role: "Règle", tools: [{ name: "Obsidian", description: "La méthode écrite" }] },
    ]}
    accentGroup={0}
  />;
}

export function SourceEtCopiesDateesDiagram() {
  return <Workflow
    title="Une source, des copies datées"
    description="Exemple : la date du prochain appel vit dans le calendrier, pas dans WhatsApp."
    legend="Avant toute relance, l'agent relit la source au lieu de croire la copie."
    ariaLabel="La date de l'appel est dans Google Agenda. La fiche Notion en garde une copie datée avec un lien. Avant la relance, l'agent relit le calendrier, puis la relance part sur WhatsApp."
    accent={EM}
    actors={["Source", "Copie", "Ton agent"]}
    steps={[
      { actor: 0, label: "Date réelle", tool: "Google Agenda" },
      { actor: 1, label: "Copie datée", tool: "Notion", transfer: "date, lien" },
      { actor: 2, label: "Relecture", tool: "Hermes Agent", transfer: "lien" },
      { actor: 2, label: "Relance", tool: "WhatsApp", transfer: "date relue" },
    ]}
    accentIndex={2}
  />;
}

export function QuatreFormatsQuatreUsagesDiagram() {
  return <ToolMap
    title="Quatre formats, quatre usages"
    description="Le bon format dépend du travail : lire, mettre à jour, échanger ou retrouver."
    legend="Un index aide à retrouver. Il ne remplace jamais la source."
    ariaLabel="Markdown dans Obsidian pour les règles relues par des humains, une base Supabase pour les objets qui changent, JSON via n8n pour échanger entre deux logiciels, un index dans Notion pour retrouver."
    accent={EM}
    groups={[
      { role: "Markdown", tools: [{ name: "Obsidian", description: "Règles que tu relis" }] },
      { role: "Base", tools: [{ name: "Supabase", description: "Objets qui changent" }] },
      { role: "JSON", tools: [{ name: "n8n", description: "Échange entre logiciels" }] },
      { role: "Index", tools: [{ name: "Notion", description: "Retrouver vite" }] },
    ]}
    accentGroup={0}
  />;
}

export function ValeurQuiChangeDiagram() {
  return <Compare
    title="Une valeur change, les copies vieillissent"
    description="Exemple : le prix change dans le CRM, l'ancien montant traîne ailleurs."
    legend="Écris la règle de mise à jour avant de multiplier les copies."
    ariaLabel="Sans règle, le prix change dans le CRM mais l'ancien montant reste dans Notion, Slack et un prompt. Avec une règle, les copies sont marquées à relire et l'agent relit la source avant d'agir."
    accent={EM}
    beforeTitle="Sans règle"
    afterTitle="Avec une règle"
    rows={[
      { before: "Ancien prix resté dans Slack", after: "Copies marquées à relire" },
      { before: "L'agent lit un vieux prompt", after: "Il relit le CRM avant d'agir" },
      { before: "Copie sans date", after: "Copie datée avec son lien" },
    ]}
  />;
}
