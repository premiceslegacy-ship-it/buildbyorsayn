import "server-only";

import { Diagram, Edge, FixedLine, Label, Node } from "./primitives";

export function ProtocolePipelineDiagram() {
  const items = [
    { num: "01", label: "Absorption", sub: "greffer des compétences" },
    { num: "02", label: "Sprint cash", sub: "vendre et livrer" },
    { num: "03", label: "Distillation", sub: "capital organique" },
    { num: "∞", label: "Antifragile", sub: "l'état final", accent: true },
  ] as const;
  return <Diagram
    id="phases-protocole"
    title="Les trois phases, dans l'ordre"
    says="Chaque phase dépend de la précédente. Le cycle repart ensuite avec plus de capital qu'avant."
    caption="Chaque nouveau cycle repart de la phase 01 avec le capital déjà accumulé."
    description="01 Absorption, greffer des compétences ; 02 Sprint cash, vendre et livrer ; 03 Distillation, capital organique ; Antifragile, l'état final ; le cycle repart à la phase 01."
    wideHeight={208}
    compactHeight={608}
    wide={<>{items.map((item, index) => {
      const x = index * 176;
      return <g key={item.label}>
        <Node {...item} x={x} y={0} w={152} h={128} step={index} />
        {index < items.length - 1 ? <Edge points={[[x + 152, 64], [x + 176, 64]]} step={index} /> : null}
      </g>;
    })}<Edge points={[[604, 128], [604, 168], [76, 168], [76, 128]]} dashed step={4} /></>}
    compact={<>{items.map((item, index) => {
      const y = index * 144;
      return <g key={item.label}>
        <Node {...item} x={0} y={y} w={272} h={112} align="start" inline step={index} />
        {index < items.length - 1 ? <Edge points={[[136, y + 112], [136, y + 144]]} step={index} /> : null}
      </g>;
    })}<Edge points={[[272, 488], [312, 488], [312, 56], [272, 56]]} dashed step={4} /></>}
  />;
}

export function LocataireVsCapitalDiagram() {
  return <Diagram
    id="locataire-capital"
    title="Locataire numérique vs capital organique"
    says="Quand l'outil change, le locataire repart de zéro. Le capital organique continue de s'accumuler."
    caption="Le capital organique encaisse le changement et conserve ce qui a été appris."
    description="L'outil change. La trajectoire du locataire numérique retombe à zéro. La trajectoire du capital organique continue de monter."
    wideHeight={336}
    compactHeight={352}
    wide={<>
      <Label x={340} y={8} text="L'outil change" kind="note" />
      <FixedLine path="M340 28 V136 M0 136 H680 M340 192 V296 M0 296 H680" dashed />
      <Edge path="M0 132 L340 60 L340 136 L680 92" head={false} trajectory step={0} />
      <Label x={0} y={164} text="Le locataire numérique" anchor="start" kind="title" step={1} />
      <Label x={352} y={164} text="retour à zéro" anchor="start" kind="note" step={1} />
      <Edge path="M0 282 H122 V265 H245 V248 H367 V231 H490 V212 H680" head={false} accent trajectory step={1} />
      <Label x={0} y={324} text="Le capital organique" anchor="start" kind="title" step={2} />
      <Label x={352} y={324} text="le capital reste" anchor="start" kind="note" step={2} />
    </>}
    compact={<>
      <Label x={164} y={8} text="L'outil change" kind="note" />
      <FixedLine path="M164 28 V120 M0 120 H328 M164 200 V288 M0 288 H328" dashed />
      <Edge path="M0 116 L164 56 L164 120 L328 84" head={false} trajectory step={0} />
      <Label x={0} y={148} text="Le locataire numérique" anchor="start" kind="title" step={1} />
      <Label x={0} y={174} text="retour à zéro" anchor="start" kind="note" step={1} />
      <Edge path="M0 277 H59 V262 H118 V248 H177 V234 H236 V218 H328" head={false} accent trajectory step={1} />
      <Label x={0} y={316} text="Le capital organique" anchor="start" kind="title" step={2} />
      <Label x={0} y={342} text="le capital reste" anchor="start" kind="note" step={2} />
    </>}
  />;
}
