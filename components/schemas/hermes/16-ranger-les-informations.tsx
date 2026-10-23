import { Compare, ToolMap, Workflow } from "../kit";

export function DataFormatsDiagramV2() {
  return <ToolMap title="Une information, une maison" description="Le format suit l'usage qui doit rester vrai." ariaLabel="Règles vivent dans Markdown, Données vivantes dans Supabase, Échange dans JSON et Recherche dans un index." groups={[
    { role: "Règles", tools: [{ name: "Obsidian", description: "Markdown lisible" }] },
    { role: "Données vivantes", tools: [{ name: "Supabase", description: "Base structurée" }] },
    { role: "Échange", tools: [{ name: "Hermes Agent", description: "JSON transportable" }] },
    { role: "Recherche", tools: [{ name: "Notion", description: "Index consultable" }] },
  ]} accentGroup={1} />;
}

export function SourceEtCopiesDateesDiagram() {
  return <Workflow title="Une source, des copies datées" description="Chaque copie garde un lien vers ce qui fait foi." ariaLabel="La source Notion qui Fait foi alimente trois copies datées dans Gmail, Google Agenda et un dossier. Il faut relire avant d'agir." actors={["Source", "Copies"]} steps={[
    { actor: 0, label: "Fait foi", tool: "Notion" },
    { actor: 1, label: "Copie du 12/10", tool: "Gmail", transfer: "source" },
    { actor: 1, label: "Copie du 18/10", tool: "Google Agenda", transfer: "source" },
    { actor: 1, label: "Relire avant d'agir", transfer: "date" },
  ]} accentIndex={0} />;
}

export function QuatreFormatsQuatreUsagesDiagram() {
  return <ToolMap title="Quatre formats, quatre usages" description="Aucun format ne gagne partout." ariaLabel="Markdown sert à lire, Base à tenir des données vivantes, JSON à échanger et Index à rechercher." groups={[
    { role: "Markdown", tools: [{ name: "Obsidian", description: "Lire et versionner" }] },
    { role: "Base", tools: [{ name: "Supabase", description: "Mettre à jour" }] },
    { role: "JSON", tools: [{ name: "Hermes Agent", description: "Échanger" }] },
    { role: "Index", tools: [{ name: "Notion", description: "Retrouver" }] },
  ]} accentGroup={0} />;
}

export function ValeurQuiChangeDiagram() {
  return <Compare title="Une valeur change, les copies vieillissent" description="La nouvelle valeur marque immédiatement les copies à relire." ariaLabel="Nouvelle valeur dans Stripe remplace les copies anciennes Notion. Les copies anciennes sont marquées À relire." beforeTitle="Copies anciennes" afterTitle="Nouvelle valeur" rows={[
    { before: "Copie ancienne dans Notion", after: "Prix actuel dans Stripe" },
    { before: "Copie ancienne dans un document", after: "À relire" },
    { before: "Date absente", after: "Valeur datée" },
  ]} />;
}
