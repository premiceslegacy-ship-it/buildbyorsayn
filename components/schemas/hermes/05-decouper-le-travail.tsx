import { Diagram, Edge, FixedLine, Label } from "../primitives";
import { Document, Folder, Hand, Motif, Surface, ToolLogo } from "./shared";

export function DecompositionDiagram() {
  const lots = ["Pièces", "Besoin", "Brouillon", "Validation"] as const;
  const render = (compact: boolean) => <>
    <Motif><Surface x={compact ? 40 : 16} y={8} width={compact ? 248 : 176} height={80} radius={24} tone="accent" /><Label x={compact ? 164 : 104} y={48} text="Résultat visible" kind="title" tone="on-accent" /></Motif>
    <Edge points={compact ? [[164, 88], [164, 128]] : [[192, 48], [232, 48]]} accent step={0} />
    <Motif step={1}><Surface x={compact ? 24 : 232} y={compact ? 128 : 8} width={compact ? 280 : 432} height={compact ? 344 : 160} radius={28} tone="paper" />{lots.map((label, index) => {
      const x = compact ? 52 : 252 + index * 100;
      const y = compact ? 152 + index * 72 : 48;
      return <g key={label}><Document x={x} y={y} width={36} height={44} accent={index === 3} /><Label x={compact ? x + 56 : x + 18} y={compact ? y + 22 : y + 70} text={label} anchor={compact ? "start" : "middle"} tone={index === 3 ? "accent" : undefined} /></g>;
    })}</Motif>
  </>;
  return <Diagram id="decomposition-lots" title="Du résultat aux lots de travail" says="Chaque lot laisse une sortie visible que la personne suivante peut ouvrir et reprendre." description="Un résultat visible se décompose en quatre lots : pièces, besoin, brouillon et validation." wideHeight={176} compactHeight={472} wide={render(false)} compact={render(true)} />;
}

export function DevisEnQuatreLotsDiagram() {
  const labels = ["Pièces", "Besoin", "Brouillon", "Validation"] as const;
  const tools = ["WhatsApp", "Hermes Agent", "Gmail", "Notion"] as const;
  const render = (compact: boolean) => <>{labels.map((label, index) => {
    const x = compact ? 24 : 8 + index * 168;
    const y = compact ? 8 + index * 128 : 24;
    return <g key={label}><Motif step={index}>
      <Surface x={x} y={y} width={compact ? 280 : 152} height={96} radius={22} tone="paper" />
      <ToolLogo name={tools[index]} x={x + 18} y={y + 16} size={42} />
      <Folder x={x + (compact ? 214 : 92)} y={y + 18} width={48} height={42} accent={index === 3} />
      {index === 3 ? <Hand x={x + (compact ? 190 : 72)} y={y + 10} scale={.55} /> : null}
      <Label x={x + (compact ? 140 : 76)} y={y + 78} text={label} kind="title" tone={index === 3 ? "accent" : undefined} />
    </Motif>{index < 3 ? <Edge points={compact ? [[164, y + 96], [164, y + 128]] : [[x + 152, 72], [x + 168, 72]]} step={index} /> : null}</g>;
  })}</>;
  return <Diagram id="devis-quatre-lots" title="Le dossier change de plateau" says="Chaque plateau reçoit le dossier, ajoute une sortie et le passe au suivant." description="Quatre plateaux d'atelier se passent un dossier : pièces, besoin, brouillon et validation humaine." wideHeight={144} compactHeight={480} wide={render(false)} compact={render(true)} />;
}

export function CarteContratDuLotDiagram() {
  const fields = ["Entrée", "Sortie", "Source", "Interdit", "Validation", "Arrêt"] as const;
  const render = (compact: boolean) => <Motif>
    <Surface x={compact ? 16 : 112} y={8} width={compact ? 296 : 456} height={compact ? 392 : 304} radius={12} tone="paper" />
    <circle cx={compact ? 164 : 340} cy="24" r="7" fill="var(--t3)" />
    <Label x={compact ? 40 : 144} y={52} text="Fiche de travail" anchor="start" kind="title" />
    {fields.map((field, index) => {
      const x = compact ? 40 : 144 + (index % 2) * 208;
      const y = compact ? 92 + index * 48 : 96 + Math.floor(index / 2) * 64;
      return <g key={field}><Label x={x} y={y} text={field} anchor="start" tone={field === "Sortie" ? "accent" : undefined} /><FixedLine path={`M${x + 88} ${y} H${x + (compact ? 248 : 184)}`} accent={field === "Sortie"} /></g>;
    })}
  </Motif>;
  return <Diagram id="carte-contrat-lot" title="Six lignes sur la planche" says="La fiche dit ce qui entre, ce qui sort et où le lot doit s'arrêter." description="Une fiche de travail accrochée présente Entrée, Sortie, Source, Interdit, Validation et Arrêt. Sortie est en émeraude." wideHeight={320} compactHeight={408} wide={render(false)} compact={render(true)} />;
}
