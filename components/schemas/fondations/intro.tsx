import { Diagram, Edge, Label } from "../primitives";
import { Document, Motif, Person, Stroke, Surface } from "./shared";

const steps = ["Tester", "Comprendre", "Vendre", "Écrire", "Montrer"] as const;

function StepIcon({ index, x, y, accent = false }: { index: number; x: number; y: number; accent?: boolean }) {
  if (index === 0) return <><path d={`M${x - 22} ${y + 2} A24 24 0 1 1 ${x + 19} ${y + 16}`} fill="none" stroke="currentColor" strokeWidth="2" /><path d={`M${x + 16} ${y + 8} L${x + 22} ${y + 17} L${x + 11} ${y + 18}`} fill="none" stroke="currentColor" strokeWidth="2" /></>;
  if (index === 1) return <><Person x={x - 12} y={y - 8} accent={accent} /><Person x={x + 18} y={y - 5} /></>;
  if (index === 2) return <><path d={`M${x - 26} ${y - 18} H${x + 26} V${y + 12} H${x + 4} L${x - 9} ${y + 24} V${y + 12} H${x - 26} Z`} fill="none" stroke="currentColor" strokeWidth="2" /><circle cx={x - 12} cy={y - 3} r="3" fill="currentColor" /><circle cx={x} cy={y - 3} r="3" fill="currentColor" /><circle cx={x + 12} cy={y - 3} r="3" fill="currentColor" /></>;
  if (index === 3) return <Document x={x - 25} y={y - 31} width={50} height={62} accent={accent} />;
  return <><circle cx={x} cy={y} r="12" fill={accent ? "var(--em)" : "currentColor"} /><path d={`M${x} ${y - 28} V${y - 40} M${x + 22} ${y - 19} L${x + 31} ${y - 28} M${x - 22} ${y - 19} L${x - 31} ${y - 28} M${x + 28} ${y + 2} H${x + 40} M${x - 28} ${y + 2} H${x - 40}`} fill="none" stroke="currentColor" strokeWidth="2" /></>;
}

function WidePath() {
  return <>
    <Motif><Stroke path="M58 112 C142 40 214 178 304 100 S472 44 622 110" soft /></Motif>
    {steps.map((label, index) => {
      const x = 62 + index * 139;
      const y = [112, 72, 116, 72, 110][index];
      const accent = label === "Comprendre";
      return <Motif step={index} key={label}>
        <Surface x={x - 54} y={y - 54} width={108} height={108} radius={54} tone={accent ? "accent" : "paper"} />
        <g color={accent ? "var(--sur-em)" : "rgba(241,245,242,.82)"}><StepIcon index={index} x={x} y={y - 4} accent={accent} /></g>
        <Label x={x} y={y + 82} text={label} kind="title" tone={accent ? "accent" : undefined} />
      </Motif>;
    })}
  </>;
}

function CompactPath() {
  return <>
    <Motif><Stroke path="M72 56 C238 78 78 150 250 184 S78 294 250 330 S76 414 244 450" soft /></Motif>
    {steps.map((label, index) => {
      const x = index % 2 === 0 ? 74 : 246;
      const y = 52 + index * 98;
      const accent = label === "Comprendre";
      return <Motif step={index} key={label}>
        <Surface x={x - 42} y={y - 42} width={84} height={84} radius={42} tone={accent ? "accent" : "paper"} />
        <g color={accent ? "var(--sur-em)" : "rgba(241,245,242,.82)"} transform={`translate(${x} ${y}) scale(.76) translate(${-x} ${-y})`}><StepIcon index={index} x={x} y={y} accent={accent} /></g>
        <Label x={index % 2 === 0 ? 132 : 188} y={y} text={label} anchor={index % 2 === 0 ? "start" : "end"} kind="title" tone={accent ? "accent" : undefined} />
      </Motif>;
    })}
    <Edge path="M74 444 C126 480 200 480 246 448" head={false} accent trajectory step={5} />
  </>;
}

export function LeCheminDuMessageDiagram() {
  return <Diagram
    id="le-chemin-du-message"
    title="Le chemin du message"
    says="Une offre utile avance du terrain vers un message que les bonnes personnes peuvent reconnaître."
    description="Cinq pierres dessinent un chemin de Tester à Montrer. Comprendre est la pierre centrale mise en avant."
    wideHeight={220}
    compactHeight={500}
    wide={<WidePath />}
    compact={<CompactPath />}
  />;
}
