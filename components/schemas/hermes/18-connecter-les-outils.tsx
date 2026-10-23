import { Diagram, Edge, Label } from "../primitives";
import { Motif, Stroke, Surface, ToolLogo } from "./shared";
import { Panel } from "./chapter-shared";

export function TroisPortesUnServiceDiagram() {
  const doors = ["API", "CLI", "MCP"] as const;
  const draw = (compact: boolean) => <>
    {doors.map((label, index) => {
      const x = compact ? 24 + index * 16 : 32 + index * 152;
      const y = compact ? 8 + index * 120 : 56;
      return <Motif key={label} step={index}><path d={`M${x} ${y + 18} Q${x} ${y} ${x + 18} ${y} H${x + (compact ? 244 : 108)} Q${x + (compact ? 264 : 128)} ${y} ${x + (compact ? 264 : 128)} ${y + 18} V${y + 88} H${x} Z`} fill="#262b28" stroke="rgba(241,245,242,.35)" /><circle cx={x + (compact ? 236 : 104)} cy={y + 48} r="5" fill="var(--em)" /><Label x={x + (compact ? 132 : 64)} y={y + 44} text={label} kind="title" /></Motif>;
    })}
    <Edge points={compact ? [[164, 336], [164, 408]] : [[464, 100], [520, 100]]} accent />
    <Panel x={compact ? 44 : 520} y={compact ? 408 : 40} width={compact ? 240 : 144} height={120} radius={28} accent step={4}>
      <ToolLogo name="Hermes Agent" x={compact ? 68 : 544} y={compact ? 430 : 62} size={48} />
      <ToolLogo name="Ghostty" x={compact ? 116 : 592} y={compact ? 430 : 62} size={48} />
      <Label x={compact ? 164 : 592} y={compact ? 500 : 132} text="Même compte" kind="title" tone="on-accent" />
    </Panel>
  </>;
  return <Diagram id="trois-portes-service" title="Trois portes, le même coffre" says="API, CLI et MCP changent le passage technique, pas les droits du compte." description="Trois portes API, CLI et MCP convergent vers un coffre nommé Même compte." wideHeight={216} compactHeight={544} wide={draw(false)} compact={draw(true)} />;
}

export function ToolAccessDiagramV2() {
  const labels = ["API, CLI ou MCP", "Droit vérifié", "Action"] as const;
  const draw = (compact: boolean) => <>{labels.map((label, index) => {
    const x = compact ? 24 : 24 + index * 224;
    const y = compact ? 8 + index * 128 : 32;
    return <g key={label}><Panel x={x} y={y} width={compact ? 280 : 184} height={96} radius={index === 0 ? 46 : 22} accent={index === 1} step={index}><Label x={x + (compact ? 140 : 92)} y={y + 48} text={label} kind="title" maxChars={compact ? 26 : 16} tone={index === 1 ? "on-accent" : undefined} /></Panel>{index < 2 ? <Edge points={compact ? [[164, y + 96], [164, y + 128]] : [[x + 184, 80], [x + 224, 80]]} step={index} /> : null}</g>;
  })}</>;
  return <Diagram id="acces-outil-v2" title="La porte, le réglage, l'action" says="Le protocole mène au réglage du compte. Seul le droit vérifié ouvre l'action." description="Trois étapes relient API, CLI ou MCP, Droit vérifié et Action." wideHeight={160} compactHeight={352} wide={draw(false)} compact={draw(true)} />;
}

export function CarteOutilsParRoleDiagram() {
  const tools = [["Gmail", "Lire"], ["Notion", "Ranger"], ["Stripe", "Vérifier"], ["Telegram", "Valider"]] as const;
  const draw = (compact: boolean) => <>
    <Motif><path d={compact ? "M164 176 L244 224 L164 272 L84 224 Z" : "M340 112 L420 160 L340 208 L260 160 Z"} fill="#262b28" stroke="var(--em)" strokeWidth="2" /><Label x={compact ? 164 : 340} y={compact ? 224 : 160} text="Dossier" kind="title" tone="accent" /></Motif>
    {tools.map(([tool, label], index) => {
      const x = compact ? 16 + (index % 2) * 168 : [24, 488, 24, 488][index];
      const y = compact ? 8 + Math.floor(index / 2) * 344 : [16, 16, 232, 232][index];
      return <Panel key={tool} x={x} y={y} width={compact ? 144 : 168} height={112} radius={24} accent={label === "Valider"} step={index}>
        <ToolLogo name={tool} x={x + (compact ? 52 : 64)} y={y + 12} size={40} />
        <Label x={x + (compact ? 72 : 84)} y={y + 84} text={label} kind="title" tone={label === "Valider" ? "on-accent" : undefined} />
      </Panel>;
    })}
  </>;
  return <Diagram id="carte-outils-role" title="Chaque outil tient une place" says="Gmail lit, Notion range, Stripe vérifie et Telegram présente la validation." description="Quatre tuiles 3D entourent un dossier central et portent Lire, Ranger, Vérifier et Valider." wideHeight={360} compactHeight={472} wide={draw(false)} compact={draw(true)} />;
}

export function LireAgirRelireDiagram() {
  const labels = ["Lire", "Agir", "Relire"] as const;
  const draw = (compact: boolean) => <>
    {labels.map((label, index) => {
      const angle = compact ? 0 : index * 120 - 90;
      const x = compact ? 64 : 340 + Math.cos(angle * Math.PI / 180) * 180;
      const y = compact ? 16 + index * 136 : 160 + Math.sin(angle * Math.PI / 180) * 104;
      return <Panel key={label} x={compact ? 64 : x - 64} y={compact ? y : y - 36} width={compact ? 200 : 128} height={72} radius={36} accent={label === "Relire"} step={index}><Label x={compact ? 164 : x} y={compact ? y + 36 : y} text={label} kind="title" tone={label === "Relire" ? "on-accent" : undefined} />{label === "Relire" ? <g><circle cx={(compact ? 164 : x) + 44} cy={(compact ? y + 36 : y) - 4} r="12" fill="none" stroke="var(--sur-em)" strokeWidth="2" /><Stroke path={`M${(compact ? 164 : x) + 54} ${(compact ? y + 36 : y) + 6} l10 10`} accent /></g> : null}</Panel>;
    })}
    <Edge path={compact ? "M164 88 V152 M164 224 V288 M64 360 Q16 360 16 52 Q16 16 64 16" : "M340 56 A180 104 0 1 1 184 212"} accent trajectory head={false} step={3} />
  </>;
  return <Diagram id="lire-agir-relire" title="L'action se ferme par une relecture" says="La boucle ne revient au départ qu'après avoir relu le service qui fait foi." description="Une boucle relie Lire, Agir et Relire, avec une loupe sur Relire." wideHeight={288} compactHeight={384} wide={draw(false)} compact={draw(true)} />;
}
