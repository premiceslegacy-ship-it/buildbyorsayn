import { Diagram, Edge, Label } from "../primitives";
import { Bubble, Document, Folder, Hand, Motif, Stroke, Surface, ToolLogo } from "./shared";

export function CinqObjetsPasUnSeulDiagram() {
  const items = ["Tâche", "Workflow", "Skill", "Outil", "Validation"] as const;
  const render = (compact: boolean) => <Motif>
    <Surface x={compact ? 12 : 16} y={8} width={compact ? 304 : 648} height={compact ? 392 : 216} radius={32} tone="paper" />
    <Stroke path={compact ? "M164 8 V400 M12 136 H316 M12 264 H316" : "M145 8 V224 M274 8 V224 M403 8 V224 M532 8 V224"} soft />
    {items.map((label, index) => {
      const x = compact ? 40 + (index % 2) * 152 : 40 + index * 129;
      const y = compact ? 48 + Math.floor(index / 2) * 128 : 72;
      return <g key={label}>
        {index === 0 ? <Document x={x + 28} y={y} width={44} height={54} /> : null}
        {index === 1 ? <Folder x={x + 22} y={y + 4} width={56} height={50} accent /> : null}
        {index === 2 ? <Document x={x + 28} y={y} width={44} height={54} accent /> : null}
        {index === 3 ? <ToolLogo name="Gmail" x={x + 24} y={y} size={52} /> : null}
        {index === 4 ? <Hand x={x + 34} y={y} scale={.8} /> : null}
        <Label x={x + 50} y={y + 82} text={label} kind="title" tone={index === 1 ? "accent" : undefined} />
      </g>;
    })}
  </Motif>;
  return <Diagram id="cinq-objets" title="Cinq compartiments, cinq usages" says="Une tâche, un workflow, un skill, un outil et une validation ne jouent pas le même rôle." description="Une boîte à outils ouverte sépare cinq compartiments. Workflow est mis en avant." wideHeight={232} compactHeight={408} wide={render(false)} compact={render(true)} />;
}

export function MessageJusquaSuiteDiagram() {
  const labels = ["Reçu", "Compris", "Préparé", "Validé", "Suivi"] as const;
  const render = (compact: boolean) => <>{labels.map((label, index) => {
    const x = compact ? 24 : 8 + index * 136;
    const y = compact ? 8 + index * 104 : 24;
    return <g key={label}>
      <Motif step={index}><Surface x={x} y={y} width={compact ? 280 : 120} height={72} radius={22} tone={index === 3 ? "accent" : "paper"} />
        {index === 0 ? <ToolLogo name="Telegram" x={x + 14} y={y + 16} size={40} /> : null}
        {index === 1 || index === 2 ? <ToolLogo name="Hermes Agent" x={x + 14} y={y + 16} size={40} /> : null}
        {index === 3 ? <Hand x={x + 26} y={y + 14} scale={.65} /> : null}
        {index === 4 ? <ToolLogo name="Notion" x={x + 14} y={y + 16} size={40} /> : null}
        <Label x={x + (compact ? 84 : 76)} y={y + 36} text={label} anchor="start" kind="title" tone={index === 3 ? "on-accent" : undefined} />
      </Motif>
      {index < 4 ? <Edge points={compact ? [[164, y + 72], [164, y + 104]] : [[x + 120, 60], [x + 136, 60]]} accent={index === 2} step={index} /> : null}
    </g>;
  })}</>;
  return <Diagram id="message-jusqua-suite" title="Le brouillon n'est pas la fin" says="Le travail continue jusqu'à la validation et au suivi rangé dans le bon outil." description="Un message Telegram devient compris, préparé, validé par une main puis suivi dans Notion." wideHeight={120} compactHeight={488} wide={render(false)} compact={render(true)} />;
}

export function LigneArriveeDuTravailDiagram() {
  const render = (compact: boolean) => <>
    <Motif><Stroke path={compact ? "M28 72 C112 24 210 120 300 48" : "M24 72 C134 16 216 112 320 48"} dashed /><Bubble x={compact ? 24 : 16} y={compact ? 96 : 104} width={compact ? 280 : 304} height={72} /><Label x={compact ? 164 : 168} y={compact ? 128 : 136} text="Aide-moi" kind="title" /></Motif>
    <Motif step={1}><Stroke path={compact ? "M28 280 H276" : "M360 72 H632"} accent /><path d={compact ? "M276 248 V312" : "M632 32 V112"} stroke="var(--em)" strokeWidth="3" /><Surface x={compact ? 24 : 360} y={compact ? 176 : 104} width={compact ? 280 : 304} height={112} radius={24} tone="paper" /><Label x={compact ? 164 : 512} y={compact ? 216 : 136} text="Trois idées sourcées" kind="title" /><Label x={compact ? 164 : 512} y={compact ? 252 : 176} text="Oui ou non" kind="title" tone="accent" /></Motif>
  </>;
  return <Diagram id="ligne-arrivee-travail" title="Une piste doit avoir une arrivée" says="La mission vague disparaît dans le brouillard. La mission précise arrive devant une décision." description="Deux pistes comparent Aide-moi, sans arrivée, à Trois idées sourcées qui arrive devant Oui ou non." wideHeight={224} compactHeight={320} wide={render(false)} compact={render(true)} />;
}
