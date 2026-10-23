import { Diagram, Edge, FixedLine, Label } from "../primitives";
import { Document, Hand, Motif, Person, Stroke, Surface, ToolLogo } from "./shared";
import { MiniRows, NumberPin, Panel } from "./chapter-shared";

export function SceneTravailPreuveChoixDiagram() {
  const scenes = ["Sa journée", "Travail préparé", "Preuve", "Son choix"] as const;
  const draw = (compact: boolean) => <>{scenes.map((label, index) => {
    const x = compact ? 24 : 8 + index * 168;
    const y = compact ? 8 + index * 120 : 20;
    const accent = index === 3;
    return <g key={label}>
      <Panel x={x} y={y} width={compact ? 280 : 152} height={92} radius={22} accent={accent} step={index}>
        {index === 0 ? <><Person x={x + 40} y={y + 29} /><circle cx={x + 103} cy={y + 33} r="15" fill="none" stroke="rgba(241,245,242,.35)" /><Stroke path={`M${x + 103} ${y + 33} v-8 M${x + 103} ${y + 33} l7 4`} soft /></> : null}
        {index === 1 ? <Document x={x + 18} y={y + 14} width={42} height={54} /> : null}
        {index === 2 ? <><Document x={x + 20} y={y + 14} width={44} height={56} /><CheckMark x={x + 44} y={y + 45} /></> : null}
        {index === 3 ? <Hand x={x + 28} y={y + 12} scale={.72} onAccent /> : null}
        <Label x={x + (compact ? 96 : 76)} y={y + 74} text={label} kind="title" anchor={compact ? "start" : "middle"} tone={accent ? "on-accent" : undefined} />
      </Panel>
      {index < scenes.length - 1 ? <Edge points={compact ? [[164, y + 92], [164, y + 120]] : [[x + 152, 66], [x + 168, 66]]} accent={index === 2} step={index} /> : null}
    </g>;
  })}</>;
  return <Diagram id="scene-travail-preuve-choix" title="Une offre qu'on peut voir" says="La scène mène à un travail tangible, puis à une preuve et au choix de la personne." description="Quatre vignettes montrent Sa journée, Travail préparé, Preuve et Son choix, ce dernier en émeraude." wideHeight={132} compactHeight={452} wide={draw(false)} compact={draw(true)} />;
}

function CheckMark({ x, y }: { x: number; y: number }) {
  return <Stroke path={`M${x - 9} ${y} l7 7 l15 -18`} accent />;
}

export function OffreCRMAvantApresMockup() {
  const draw = (compact: boolean) => {
    const before = compact ? { x: 16, y: 8, w: 296, h: 168 } : { x: 16, y: 16, w: 214, h: 280 };
    const after = compact ? { x: 16, y: 200, w: 296, h: 340 } : { x: 256, y: 16, w: 408, h: 280 };
    return <>
      <Panel x={before.x} y={before.y} width={before.w} height={before.h} radius={24} step={0}>
        <Label x={before.x + 20} y={before.y + 32} text="AVANT" anchor="start" kind="note" />
        <Label x={before.x + before.w / 2} y={before.y + (compact ? 84 : 122)} text="Agent IA de|qualification" kind="title" />
        <MiniRows x={before.x + 34} y={before.y + (compact ? 132 : 198)} width={before.w - 68} rows={2} />
      </Panel>
      <Panel x={after.x} y={after.y} width={after.w} height={after.h} radius={24} step={1}>
        <ToolLogo name="Notion" x={after.x + after.w - 50} y={after.y + 14} size={36} />
        <ToolLogo name="Gmail" x={after.x + after.w - 90} y={after.y + 14} size={36} />
        <ToolLogo name="Hermes Agent" x={after.x + after.w - 130} y={after.y + 14} size={36} />
        <Label x={after.x + 20} y={after.y + 34} text="Ce qu'il faut demander maintenant" anchor="start" kind="title" maxChars={compact ? 24 : 34} />
        {["Besoin", "Pièces", "Question", "Responsable"].map((text, index) => <g key={text}>
          <Label x={after.x + 38} y={after.y + 94 + index * 50} text={text} anchor="start" tone={index === 2 ? "accent" : undefined} />
          <FixedLine path={`M${after.x + 136} ${after.y + 94 + index * 50} H${after.x + after.w - 24}`} accent={index === 2} />
        </g>)}
      </Panel>
      <NumberPin x={after.x + 10} y={after.y + 94} number={1} />
      <NumberPin x={after.x + 10} y={after.y + 144} number={2} />
      <NumberPin x={after.x + 10} y={after.y + 194} number={3} accent />
      <Label x={compact ? 164 : 460} y={compact ? 574 : 326} text="1 Situation   2 Manque   3 Prochaine action" kind="note" maxChars={compact ? 28 : 60} />
    </>;
  };
  return <Diagram id="offre-crm-avant-apres" title="La promesse devient un écran" says="À droite, la personne voit le dossier qu'elle recevra et la question qui fait avancer." description="Une promesse vague est comparée à une fiche CRM avec besoin, pièces, question et responsable." wideHeight={340} compactHeight={596} wide={draw(false)} compact={draw(true)} />;
}

export function PreuveAuMemeNiveauDiagram() {
  const draw = (compact: boolean) => <>
    <Motif><Stroke path={compact ? "M164 120 V344 M48 344 H280" : "M340 40 V232 M112 232 H568"} accent /></Motif>
    <Motif><path d={compact ? "M44 120 H284" : "M92 40 H588"} stroke="rgba(241,245,242,.72)" strokeWidth="8" strokeLinecap="round" /><circle cx={compact ? 164 : 340} cy={compact ? 120 : 40} r="18" fill="var(--em)" /></Motif>
    {[{ title: "Dossier complet", proof: "Deux dossiers relus" }, { title: "Moins de retours", proof: "Corrections comptées" }].map((item, index) => {
      const x = compact ? 24 : 24 + index * 344;
      const y = compact ? 152 + index * 88 : 72;
      return <Panel key={item.title} x={x} y={y} width={compact ? 280 : 312} height={72} radius={20} step={index}>
        <Label x={x + 18} y={y + 25} text={item.title} anchor="start" kind="title" />
        <Label x={x + 18} y={y + 51} text={item.proof} anchor="start" tone="accent" />
      </Panel>;
    })}
    <Label x={compact ? 164 : 340} y={compact ? 382 : 270} text="Même niveau de preuve" kind="title" tone="accent" />
  </>;
  return <Diagram id="preuve-meme-niveau" title="La preuve tient la promesse en équilibre" says="Une promesse sur le dossier se prouve par le dossier. Une promesse sur les retours se prouve par le compte." description="Une balance relie Dossier complet à Deux dossiers relus et Moins de retours à Corrections comptées." wideHeight={304} compactHeight={408} wide={draw(false)} compact={draw(true)} />;
}
