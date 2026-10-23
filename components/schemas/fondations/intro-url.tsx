import { Diagram, Edge, Label } from "../primitives";
import { Document, Motif, Stroke, Surface } from "./shared";
import { Check, LogoTile } from "./shared-b";

export function DeLideeALURLDiagram() {
  const wide = <>
    <Motif><Surface x={8} y={48} width={112} height={96} radius={18} tone="paper" /><Stroke path="M32 80 H96 M32 96 H84 M32 112 H72" /><Label x={64} y={168} text="Besoin" kind="title" /></Motif>
    <Edge points={[[120, 96], [148, 96]]} step={0} />
    <Motif step={1}><Document x={148} y={52} width={72} height={88} /><Label x={184} y={168} text="Brief" kind="title" /></Motif>
    <Edge points={[[220, 96], [248, 96]]} step={1} />
    <Motif step={2}><Surface x={248} y={44} width={96} height={104} radius={18} tone="surface" /><Surface x={260} y={60} width={72} height={20} radius={6} tone="paper" /><Surface x={260} y={88} width={44} height={44} radius={8} tone="paper" /><LogoTile logo="figma" x={304} y={108} size={32} /><Label x={296} y={168} text="Maquette" kind="title" /></Motif>
    <Edge points={[[344, 96], [372, 96]]} step={2} />
    <Motif step={3}><Document x={372} y={52} width={72} height={88} /><Stroke path="M388 82 L400 94 L388 106 M428 82 L416 94 L428 106" /><Label x={408} y={168} text="Code" kind="title" /></Motif>
    <Edge points={[[444, 96], [472, 96]]} step={3} />
    <LogoTile logo="github" x={468} y={68} size={56} step={4} /><Label x={496} y={168} text="GitHub" kind="title" />
    <Edge points={[[524, 96], [548, 96]]} step={4} />
    <LogoTile logo="vercel" x={544} y={68} size={56} step={5} /><Label x={572} y={168} text="Vercel" kind="title" />
    <Edge points={[[600, 96], [620, 96]]} accent step={5} />
    <Motif step={6}><Surface x={620} y={52} width={56} height={88} radius={18} tone="accent" /><Stroke path="M648 52 V30 M632 38 H664" accent /><Check x={648} y={96} /><Label x={648} y={168} text="Domaine" kind="title" tone="accent" /></Motif>
    <Stroke path="M270 24 Q296 4 322 24 M632 190 Q648 208 664 190" accent />
  </>;

  const compact = <>
    <Motif><Surface x={24} y={8} width={280} height={72} radius={20} tone="paper" /><Label x={64} y={44} text="Besoin" anchor="start" kind="title" /><Label x={244} y={44} text="Brief" kind="title" /></Motif>
    <Edge points={[[164, 80], [164, 112]]} step={0} />
    <Motif step={1}><Surface x={24} y={112} width={280} height={88} radius={20} /><LogoTile logo="figma" x={48} y={128} size={48} /><Label x={112} y={146} text="Maquette" anchor="start" kind="title" /><Label x={112} y={174} text="Code" anchor="start" /></Motif>
    <Edge points={[[164, 200], [164, 232]]} step={1} />
    <Motif step={2}><LogoTile logo="github" x={70} y={232} size={52} /><LogoTile logo="vercel" x={206} y={232} size={52} /><Label x={96} y={304} text="GitHub" kind="title" /><Label x={232} y={304} text="Vercel" kind="title" /></Motif>
    <Edge points={[[164, 316], [164, 348]]} accent step={2} />
    <Motif step={3}><Surface x={64} y={348} width={200} height={72} radius={24} tone="accent" /><Check x={96} y={384} /><text x="124" y="386" fill="var(--sur-em)" fontFamily="var(--font-t)" fontSize="17" fontWeight="650">Domaine</text></Motif>
  </>;

  return <Diagram
    id="de-l-idee-a-l-url"
    title="De l'idée à l'URL"
    says="Le site devient public quand chaque objet passe au suivant sans perdre son propriétaire."
    description="Un besoin devient un brief, une maquette, du code, un dépôt GitHub, un site Vercel et enfin un domaine validé."
    wideHeight={216}
    compactHeight={420}
    wide={wide}
    compact={compact}
  />;
}
