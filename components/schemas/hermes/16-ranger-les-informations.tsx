import { Diagram, Edge, Label } from "../primitives";
import { Document, Motif, Stroke, Surface, ToolLogo } from "./shared";
import { Panel } from "./chapter-shared";

export function DataFormatsDiagramV2() {
  const homes = [["Règles", "Notion"], ["Données vivantes", "Supabase"], ["Échange", "Hermes Agent"], ["Recherche", "Perplexity"]] as const;
  const draw = (compact: boolean) => <>{homes.map(([label, tool], index) => {
    const x = compact ? 24 + (index % 2) * 152 : 16 + index * 168;
    const y = compact ? 32 + Math.floor(index / 2) * 176 : 48;
    return <Motif key={label} step={index}>
      <path d={`M${x} ${y + 42} L${x + (compact ? 64 : 70)} ${y} L${x + (compact ? 128 : 140)} ${y + 42} V${y + 144} H${x} Z`} fill={index === 1 ? "var(--em)" : "#262b28"} stroke="rgba(241,245,242,.3)" />
      <ToolLogo name={tool} x={x + (compact ? 44 : 50)} y={y + 52} size={40} />
      <Label x={x + (compact ? 64 : 70)} y={y + 116} text={label} kind="title" maxChars={compact ? 12 : 14} tone={index === 1 ? "on-accent" : undefined} />
    </Motif>;
  })}</>;
  return <Diagram id="formats-maisons" title="Une information, une maison" says="Les règles, les données vivantes, les échanges et la recherche n'habitent pas le même endroit." description="Quatre maisons portent Règles, Données vivantes, Échange et Recherche avec leurs outils." wideHeight={224} compactHeight={384} wide={draw(false)} compact={draw(true)} />;
}

export function SourceEtCopiesDateesDiagram() {
  const tools = ["Notion", "Gmail", "Google Agenda"] as const;
  const draw = (compact: boolean) => <>
    <Panel x={compact ? 64 : 244} y={8} width={compact ? 200 : 192} height={88} radius={28} accent step={0}>
      <Label x={compact ? 164 : 340} y={52} text="Fait foi" kind="title" tone="on-accent" />
    </Panel>
    {tools.map((tool, index) => {
      const x = compact ? 24 : 32 + index * 224;
      const y = compact ? 136 + index * 112 : 152;
      return <g key={tool}>
        <Edge points={compact ? [[164, 96], [164, y], [x + 140, y]] : [[340, 96], [340, 128], [x + 96, 152]]} head={false} step={index} />
        <Panel x={x} y={y} width={compact ? 280 : 192} height={80} radius={20} step={index + 1}>
          <ToolLogo name={tool} x={x + 12} y={y + 12} size={44} />
          <Label x={x + 68} y={y + 28} text="Copie du 23/10" anchor="start" kind="title" maxChars={16} />
          <Label x={x + 68} y={y + 56} text="Relire avant d'agir" anchor="start" tone="accent" maxChars={18} />
        </Panel>
      </g>;
    })}
  </>;
  return <Diagram id="source-copies-datees" title="Trois copies, une seule origine" says="Chaque feuille porte sa date et garde un chemin clair vers l'endroit qui fait foi." description="Une source Fait foi alimente trois copies datées dans Notion, Gmail et Google Agenda." wideHeight={248} compactHeight={472} wide={draw(false)} compact={draw(true)} />;
}

export function QuatreFormatsQuatreUsagesDiagram() {
  const items = [["Markdown", "Obsidian", "page"], ["Base", "Supabase", "table"], ["JSON", "Hermes Agent", "envelope"], ["Index", "Perplexity", "search"]] as const;
  const draw = (compact: boolean) => <>{items.map(([label, tool, shape], index) => {
    const x = compact ? 24 + (index % 2) * 152 : 16 + index * 168;
    const y = compact ? 8 + Math.floor(index / 2) * 176 : 16;
    return <Panel key={label} x={x} y={y} width={compact ? 128 : 152} height={148} radius={24} step={index}>
      <ToolLogo name={tool} x={x + (compact ? 44 : 56)} y={y + 14} size={40} />
      {shape === "page" ? <Document x={x + (compact ? 40 : 52)} y={y + 60} width={48} height={50} /> : null}
      {shape === "table" ? <g><Surface x={x + (compact ? 30 : 42)} y={y + 68} width={68} height={42} radius={8} tone="surface" /><Stroke path={`M${x + (compact ? 30 : 42)} ${y + 82} H${x + (compact ? 98 : 110)} M${x + (compact ? 52 : 64)} ${y + 68} V${y + 110}`} soft /></g> : null}
      {shape === "envelope" ? <g><rect x={x + (compact ? 28 : 40)} y={y + 72} width="72" height="40" rx="8" fill="none" stroke="rgba(241,245,242,.55)" /><Stroke path={`M${x + (compact ? 28 : 40)} ${y + 72} l36 24 l36 -24`} soft /></g> : null}
      {shape === "search" ? <g><circle cx={x + (compact ? 58 : 70)} cy={y + 88} r="20" fill="none" stroke="rgba(241,245,242,.55)" strokeWidth="3" /><Stroke path={`M${x + (compact ? 74 : 86)} ${y + 104} l18 18`} /></g> : null}
      <Label x={x + (compact ? 64 : 76)} y={y + 130} text={label} kind="title" />
    </Panel>;
  })}</>;
  return <Diagram id="quatre-formats-usages" title="Le format suit le travail" says="Une feuille, une table, une enveloppe et une loupe rendent les quatre usages visibles." description="Quatre objets représentent Markdown, Base, JSON et Index avec Obsidian et Supabase." wideHeight={180} compactHeight={336} wide={draw(false)} compact={draw(true)} />;
}

export function ValeurQuiChangeDiagram() {
  const copies = ["Notion", "Gmail", "Hermes Agent"] as const;
  const draw = (compact: boolean) => <>
    <Panel x={compact ? 44 : 240} y={8} width={compact ? 240 : 200} height={96} radius={20} accent step={0}>
      <ToolLogo name="Stripe" x={compact ? 64 : 260} y={24} size={48} />
      <Label x={compact ? 132 : 328} y={42} text="Nouvelle valeur" anchor="start" kind="title" tone="on-accent" />
    </Panel>
    {copies.map((tool, index) => {
      const x = compact ? 24 : 24 + index * 224;
      const y = compact ? 144 + index * 104 : 152;
      return <g key={tool}>
        <Edge points={compact ? [[164, 104], [164, y], [x + 140, y]] : [[340, 104], [340, 132], [x + 96, 152]]} dashed head={false} step={index} />
        <Panel x={x} y={y} width={compact ? 280 : 192} height={72} radius={20} step={index + 1}>
          <ToolLogo name={tool} x={x + 12} y={y + 12} size={44} />
          <Label x={x + 68} y={y + 25} text="Copie ancienne" anchor="start" kind="muted-title" />
          <Label x={x + 68} y={y + 51} text="À relire" anchor="start" tone="accent" />
        </Panel>
      </g>;
    })}
  </>;
  return <Diagram id="valeur-qui-change" title="La nouvelle valeur grise les anciennes" says="Quand le prix change, chaque copie devient une question à relire, pas une vérité silencieuse." description="Une nouvelle valeur Stripe marque trois copies anciennes Notion, Gmail et Hermes Agent comme À relire." wideHeight={248} compactHeight={456} wide={draw(false)} compact={draw(true)} />;
}
