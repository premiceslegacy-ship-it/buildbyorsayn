import { Diagram, Edge, FixedLine, Label } from "../primitives";
import { Document, Folder, Motif, Stroke, Surface, ToolLogo } from "./shared";

export function QuatreFichiersQuatreQuestionsDiagram() {
  const cards = [
    ["SOUL.md", "Qui il est"], ["USER.md", "Qui tu es"], ["MEMORY.md", "Ce qu'il apprend"], ["AGENTS.md", "Ce projet"],
  ] as const;
  const render = (compact: boolean) => <>{cards.map(([file, question], index) => {
    const x = compact ? 36 + index * 14 : 40 + index * 152;
    const y = compact ? 24 + index * 92 : 32 + index * 12;
    return <Motif key={file} step={index}><Surface x={x} y={y} width={compact ? 236 : 184} height={128} radius={20} tone={index === 0 ? "accent" : "paper"} /><Document x={x + 18} y={y + 18} width={46} height={56} /><Label x={x + 78} y={y + 42} text={file} anchor="start" kind="title" tone={index === 0 ? "on-accent" : undefined} /><Label x={x + 78} y={y + 74} text={question} anchor="start" tone={index === 0 ? "on-accent" : undefined} /></Motif>;
  })}</>;
  return <Diagram id="quatre-fichiers" title="Quatre fichiers, quatre questions" says="Chaque feuille garde un seul type d'information et reste simple à relire." description="Quatre feuilles superposées montrent SOUL.md, USER.md, MEMORY.md et AGENTS.md avec leur question." wideHeight={208} compactHeight={440} wide={render(false)} compact={render(true)} />;
}

export function SoulMdAnnoteMockup() {
  const blocks = [["Identité", "Rôle général"], ["Ta manière de parler", "Voix"], ["Ta manière de travailler", "Réflexes"], ["Ce que tu évites", "Interdits"]] as const;
  const render = (compact: boolean) => <>
    <Motif><Surface x={compact ? 8 : 24} y={8} width={compact ? 312 : 448} height={compact ? 392 : 304} radius={20} tone="paper" /><ToolLogo name="Obsidian" x={compact ? 268 : 408} y={20} size={40} /><Label x={compact ? 28 : 48} y={42} text="SOUL.md" anchor="start" kind="title" />
      {blocks.map(([block, note], index) => {
        const y = compact ? 88 + index * 72 : 84 + index * 56;
        return <g key={block}><Label x={compact ? 28 : 48} y={y} text={block} anchor="start" kind="title" tone={note === "Réflexes" ? "accent" : undefined} /><FixedLine path={`M${compact ? 28 : 48} ${y + 22} H${compact ? 288 : 424}`} /></g>;
      })}</Motif>
    <Motif step={1}>{blocks.map(([, note], index) => {
      const y = compact ? 438 + index * 40 : 84 + index * 56;
      return <g key={note}><Stroke path={compact ? `M104 ${y - 8} H224` : `M472 ${y} H520`} accent={note === "Réflexes"} /><Label x={compact ? 164 : 536} y={y} text={note} anchor={compact ? "middle" : "start"} tone={note === "Réflexes" ? "accent" : undefined} /></g>;
    })}</Motif>
  </>;
  return <Diagram id="soul-md-annote" title="La fiche d'identité annotée" says="Le fichier sépare le rôle, la voix, les réflexes et les interdits de l'agent." description="Un éditeur montre SOUL.md avec quatre blocs annotés : rôle général, voix, réflexes et interdits." wideHeight={320} compactHeight={592} wide={render(false)} compact={render(true)} />;
}

export function KnowledgeLayersDiagram() {
  const files = [["SOUL.md", "Identité"], ["USER.md", "Toi"], ["MEMORY.md", "Mémoire"], ["AGENTS.md", "Projet"]] as const;
  const render = (compact: boolean) => <>{files.map(([file, label], index) => {
    const width = compact ? 280 - index * 28 : 536 - index * 72;
    const x = compact ? 24 + index * 14 : 72 + index * 36;
    const y = compact ? 8 + index * 104 : 16 + index * 64;
    return <Motif key={file} step={index}><Surface x={x} y={y} width={width} height={72} radius={22} tone={index === 0 ? "accent" : "paper"} /><ToolLogo name="Hermes Agent" x={x + 16} y={y + 16} size={40} /><Label x={x + 68} y={y + 28} text={file} anchor="start" kind="title" tone={index === 0 ? "on-accent" : undefined} /><Label x={x + 68} y={y + 50} text={label} anchor="start" tone={index === 0 ? "on-accent" : undefined} /></Motif>;
  })}</>;
  return <Diagram id="knowledge-layers-files" title="Quatre niveaux, quatre noms réels" says="L'identité, ta fiche, la mémoire et le projet ne se mélangent pas." description="Quatre niveaux portent les noms SOUL.md, USER.md, MEMORY.md et AGENTS.md." wideHeight={280} compactHeight={392} wide={render(false)} compact={render(true)} />;
}

export function SacDeContexteDiagram() {
  const cards = ["Objectif", "Sources", "Règles"] as const;
  const render = (compact: boolean) => <>
    <Motif><path d={compact ? "M44 152 Q44 112 84 112 H244 Q284 112 284 152 L264 344 H64 Z" : "M264 80 Q264 32 312 32 H488 Q536 32 536 80 L508 240 H292 Z"} fill="var(--carte)" /><Stroke path={compact ? "M112 112 Q112 48 164 48 Q216 48 216 112" : "M336 32 Q336 -8 400 -8 Q464 -8 464 32"} /></Motif>
    {cards.map((label, index) => {
      const x = compact ? 72 + (index % 2) * 112 : 24;
      const y = compact ? 176 + Math.floor(index / 2) * 80 : 24 + index * 72;
      return <Motif key={label} step={index}><Surface x={x} y={y} width={compact ? 96 : 184} height={56} radius={14} tone={index === 0 ? "accent" : "paper"} /><Label x={x + (compact ? 48 : 92)} y={y + 28} text={label} kind="title" tone={index === 0 ? "on-accent" : undefined} /></Motif>;
    })}
    <Edge points={compact ? [[164, 168], [164, 144]] : [[208, 124], [264, 124]]} accent step={3} />
    <Motif step={4}><Folder x={compact ? 88 : 560} y={compact ? 376 : 72} width={compact ? 152 : 104} height={88} /><Label x={compact ? 164 : 612} y={compact ? 488 : 188} text="Toute l'entreprise" kind="title" /></Motif>
  </>;
  return <Diagram id="sac-contexte" title="Emporte seulement ce qui aide" says="Trois cartes utiles entrent dans le sac. L'archive entière reste à côté." description="Objectif, Sources et Règles entrent dans un sac. Toute l'entreprise reste hors du sac." wideHeight={248} compactHeight={512} wide={render(false)} compact={render(true)} />;
}
