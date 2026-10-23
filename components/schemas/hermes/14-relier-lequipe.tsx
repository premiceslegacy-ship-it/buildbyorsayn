import { Diagram, Edge, Label } from "../primitives";
import { Document, Motif, Person, Stroke, ToolLogo } from "./shared";
import { Panel, ToolPill } from "./chapter-shared";

export function FederatedBrainDiagramV2() {
  const roles = ["Vente", "Production", "Finance", "Support"] as const;
  const draw = (compact: boolean) => <>
    {roles.map((role, index) => {
      const x = compact ? 24 + (index % 2) * 152 : 24 + index * 164;
      const y = compact ? 8 + Math.floor(index / 2) * 184 : 24;
      return <Panel key={role} x={x} y={y} width={compact ? 128 : 140} height={136} radius={26} step={index}>
        <Person x={x + (compact ? 64 : 70)} y={y + 38} />
        <Label x={x + (compact ? 64 : 70)} y={y + 96} text={role} kind="title" />
        <Stroke path={`M${x + 28} ${y + 116} H${x + (compact ? 100 : 112)}`} soft />
      </Panel>;
    })}
    <Motif step={5}><rect x={compact ? 56 : 232} y={compact ? 384 : 200} width={216} height={72} rx={24} fill="none" stroke="var(--em)" strokeWidth={2} /><Label x={compact ? 164 : 340} y={compact ? 420 : 236} text="Aucun compte universel" kind="title" tone="accent" /></Motif>
  </>;
  return <Diagram id="cerveau-federe-v2" title="Quatre responsabilités, aucun compte universel" says="Chaque métier garde son espace et son responsable. Aucun agent ne reçoit toutes les clés." description="Quatre postes séparés portent Vente, Production, Finance et Support autour de la mention Aucun compte universel." wideHeight={288} compactHeight={472} wide={draw(false)} compact={draw(true)} />;
}

export function QuatreMetiersUneVueDiagram() {
  const stations = [["Vente", "Notion"], ["Production", "Slack"], ["Finance", "Stripe"], ["Support", "Gmail"]] as const;
  const draw = (compact: boolean) => <>
    {stations.map(([label, tool], index) => {
      const x = compact ? 8 + (index % 2) * 164 : 8 + index * 168;
      const y = compact ? 8 + Math.floor(index / 2) * 120 : 16;
      return <ToolPill key={label} name={tool} label={label} x={x} y={y} width={compact ? 148 : 152} step={index} />;
    })}
    <Panel x={compact ? 44 : 220} y={compact ? 272 : 136} width={compact ? 240 : 240} height={104} radius={28} step={5}>
      <Label x={compact ? 164 : 340} y={compact ? 312 : 174} text="Vue commune" kind="title" />
      <Document x={compact ? 140 : 316} y={compact ? 328 : 188} width={48} height={36} />
    </Panel>
    {stations.map((_, index) => {
      const start = compact ? [82 + (index % 2) * 164, 64 + Math.floor(index / 2) * 120] as const : [84 + index * 168, 72] as const;
      return <Edge key={index} points={compact ? [start, [start[0], 250], [164, 272]] : [start, [start[0], 112], [340, 136]]} accent head={false} step={index} />;
    })}
  </>;
  return <Diagram id="quatre-metiers-vue" title="Quatre sources, une vue de décision" says="Les liens se rejoignent sans déplacer la vérité de chaque métier." description="Notion, Slack, Stripe et Gmail alimentent une vue commune tout en restant quatre postes distincts." wideHeight={256} compactHeight={392} wide={draw(false)} compact={draw(true)} />;
}

export function AgentsParTravailDiagram() {
  const benches = [["Marketing", ["Instagram", "Hermes Agent"]], ["Support", ["Gmail", "Hermes Agent"]], ["Opérations", ["Notion", "Hermes Agent"]]] as const;
  const draw = (compact: boolean) => <>{benches.map(([label, tools], index) => {
    const x = compact ? 24 : 16 + index * 224;
    const y = compact ? 8 + index * 160 : 16;
    return <g key={label}>
      <Panel x={x} y={y} width={compact ? 280 : 200} height={128} radius={24} step={index}>
        <Label x={x + 18} y={y + 30} text={label} anchor="start" kind="title" />
        {tools.map((tool, toolIndex) => <ToolLogo key={tool} name={tool} x={x + 20 + toolIndex * 52} y={y + 52} size={44} />)}
        <Stroke path={`M${x + 18} ${y + 108} H${x + (compact ? 262 : 182)}`} soft />
      </Panel>
      {index < 2 ? <Stroke path={compact ? `M16 ${y + 144} H312` : `M${x + 212} 16 V144`} accent /> : null}
    </g>;
  })}</>;
  return <Diagram id="agents-par-travail" title="Trois établis, trois trousses" says="Le marketing, le support et les opérations utilisent seulement les outils de leur travail." description="Trois établis séparés montrent Marketing avec Instagram, Support avec Gmail et Opérations avec Notion." wideHeight={160} compactHeight={456} wide={draw(false)} compact={draw(true)} />;
}

export function DesaccordVisibleDiagram() {
  const draw = (compact: boolean) => <>
    <Panel x={compact ? 24 : 24} y={compact ? 8 : 48} width={compact ? 280 : 224} height={88} radius={22} step={0}>
      <Label x={compact ? 164 : 136} y={compact ? 52 : 92} text="Date promise" kind="title" />
    </Panel>
    <Panel x={compact ? 24 : 432} y={compact ? 128 : 48} width={compact ? 280 : 224} height={88} radius={22} step={1}>
      <Label x={compact ? 164 : 544} y={compact ? 172 : 92} text="Date possible" kind="title" />
    </Panel>
    <Edge points={compact ? [[164, 96], [164, 264]] : [[248, 92], [304, 92], [340, 176]]} accent head={false} />
    <Edge points={compact ? [[164, 216], [164, 264]] : [[432, 92], [376, 92], [340, 176]]} accent head={false} />
    <Panel x={compact ? 72 : 240} y={compact ? 264 : 144} width={compact ? 184 : 200} height={112} radius={56} accent step={3}>
      <Person x={compact ? 108 : 282} y={compact ? 294 : 176} accent />
      <Label x={compact ? 190 : 358} y={compact ? 320 : 184} text="À décider" kind="title" tone="on-accent" />
    </Panel>
  </>;
  return <Diagram id="desaccord-visible" title="Le désaccord arrive devant une personne" says="Deux dates contradictoires restent visibles jusqu'à la décision du bon responsable." description="Date promise et Date possible convergent vers une personne au centre, sous la mention À décider." wideHeight={280} compactHeight={392} wide={draw(false)} compact={draw(true)} />;
}
