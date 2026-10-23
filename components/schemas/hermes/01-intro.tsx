import { Diagram, Edge, Label } from "../primitives";
import { Bubble, Folder, Hand, Motif, Person, Surface, ToolLogo } from "./shared";

export function PremierWorkflowVisibleDiagram() {
  const render = (compact: boolean) => {
    const stages = compact
      ? [{ x: 24, y: 8 }, { x: 24, y: 136 }, { x: 24, y: 264 }, { x: 24, y: 392 }]
      : [{ x: 8, y: 24 }, { x: 184, y: 24 }, { x: 360, y: 24 }, { x: 536, y: 24 }];
    const labels = ["Message", "Préparation", "Ta validation", "Suivi"] as const;
    return <>{stages.map(({ x, y }, index) => <g key={labels[index]}>
      <Motif step={index}>
        <Surface x={x} y={y} width={compact ? 280 : 136} height={96} radius={24} tone={index === 2 ? "accent" : "paper"} />
        {index === 0 ? <><Bubble x={x + 18} y={y + 16} width={48} height={44} /><ToolLogo name="Telegram" x={x + (compact ? 214 : 82)} y={y + 18} size={42} /></> : null}
        {index === 1 ? <><Folder x={x + 18} y={y + 16} width={54} height={48} /><ToolLogo name="Hermes Agent" x={x + (compact ? 214 : 82)} y={y + 18} size={42} /></> : null}
        {index === 2 ? <Hand x={x + (compact ? 220 : 92)} y={y + 15} scale={.75} onAccent /> : null}
        {index === 3 ? <ToolLogo name="Notion" x={x + (compact ? 214 : 82)} y={y + 18} size={42} /> : null}
        <Label x={x + 18} y={y + 80} text={labels[index]} anchor="start" kind="title" tone={index === 2 ? "on-accent" : undefined} />
      </Motif>
      {index < stages.length - 1 ? <Edge points={compact ? [[164, y + 96], [164, y + 128]] : [[x + 136, 72], [x + 176, 72]]} accent={index === 1} step={index} /> : null}
    </g>)}</>;
  };
  return <Diagram id="premier-workflow-visible" title="Du message au suivi" says="Le dossier avance, mais ta main reste placée avant l'action qui engage." description="Un message Telegram devient une préparation, passe par ta validation, puis met à jour le suivi Notion." wideHeight={144} compactHeight={488} wide={render(false)} compact={render(true)} />;
}

export function OrdreDuPremierWorkflowDiagram() {
  const labels = ["Installer", "Comprendre", "Connecter", "Planifier"] as const;
  const logos = ["Hermes Agent", "Hermes Agent", "Telegram", "Google Agenda"] as const;
  const render = (compact: boolean) => <>{labels.map((label, index) => {
    const x = compact ? 24 : 16 + index * 166;
    const y = compact ? 336 - index * 96 : 144 - index * 40;
    const width = compact ? 280 : 150;
    return <Motif key={label} step={index}>
      <Surface x={x} y={y} width={width} height={compact ? 72 : 104 + index * 40} radius={20} tone={index === 1 ? "accent" : "paper"} />
      <ToolLogo name={logos[index]} x={x + width - 54} y={y + 14} size={38} />
      <Label x={x + 18} y={y + 38} text={label} anchor="start" kind="title" tone={index === 1 ? "on-accent" : undefined} />
    </Motif>;
  })}</>;
  return <Diagram id="ordre-premier-workflow" title="Les connexions viennent en troisième" says="Tu comprends d'abord le travail, puis tu ouvres une porte et enfin tu planifies." description="Quatre marches montent dans l'ordre : installer, comprendre, connecter et planifier. Comprendre est mis en avant." wideHeight={248} compactHeight={424} wide={render(false)} compact={render(true)} />;
}

export function ToiAgentOutilDiagram() {
  const render = (compact: boolean) => {
    const xs = compact ? [24, 24, 24] : [16, 240, 464];
    const ys = compact ? [8, 152, 296] : [24, 24, 24];
    const labels = ["Tu choisis", "Il prépare", "L'outil exécute"] as const;
    return <>{labels.map((label, index) => <g key={label}>
      <Motif step={index}>
        <Surface x={xs[index]} y={ys[index]} width={compact ? 280 : 200} height={112} radius={28} tone={index === 0 ? "accent" : "paper"} />
        {index === 0 ? <Person x={xs[index] + 52} y={ys[index] + 30} accent /> : null}
        {index === 1 ? <ToolLogo name="Hermes Agent" x={xs[index] + 28} y={ys[index] + 16} size={52} /> : null}
        {index === 2 ? <><ToolLogo name="Gmail" x={xs[index] + 20} y={ys[index] + 18} size={38} /><ToolLogo name="Notion" x={xs[index] + 64} y={ys[index] + 18} size={38} /><ToolLogo name="Telegram" x={xs[index] + 108} y={ys[index] + 18} size={38} /></> : null}
        <Label x={xs[index] + (compact ? 140 : 100)} y={ys[index] + 88} text={label} kind="title" tone={index === 0 ? "on-accent" : undefined} />
      </Motif>
      {index < 2 ? <Edge points={compact ? [[164, ys[index] + 112], [164, ys[index] + 144]] : [[xs[index] + 200, 80], [xs[index] + 224, 80]]} step={index} /> : null}
    </g>)}</>;
  };
  return <Diagram id="toi-agent-outil" title="Trois places dans le même atelier" says="Tu choisis le résultat, l'agent prépare et chaque outil exécute une opération précise." description="Un atelier montre la personne qui choisit, Hermes qui prépare et les outils Gmail, Notion et Telegram qui exécutent." wideHeight={144} compactHeight={408} wide={render(false)} compact={render(true)} />;
}
