import { Diagram, Edge, FixedLine, Label } from "../primitives";
import { Hand, Motif, Stroke, Surface, ToolLogo } from "./shared";
import { Check, NumberPin, Panel } from "./chapter-shared";

export function AdoptionLaddersDiagramV2() {
  const steps = ["Observer", "Préparer", "Quelques cas", "Plus de cas", "Un nouvel outil", "Suivre"] as const;
  const draw = (compact: boolean) => <>{steps.map((label, index) => {
    const width = compact ? 164 + index * 24 : 92;
    const x = compact ? 12 : 20 + index * 108;
    const y = compact ? 8 + index * 72 : 184 - index * 28;
    return <Motif key={label} step={index}><Surface x={x} y={y} width={width} height={56} radius={14} tone={index === 5 ? "accent" : "paper"} /><Label x={x + (compact ? 16 : width / 2)} y={y + 28} text={label} anchor={compact ? "start" : "middle"} kind="title" maxChars={compact ? 26 : 12} tone={index === 5 ? "on-accent" : undefined} /></Motif>;
  })}</>;
  return <Diagram id="paliers-adoption-v2" title="Six marches, dans cet ordre" says="Tu observes, prépares, testes quelques cas, élargis, ajoutes un outil puis suis dans le temps." description="Un escalier de six marches porte Observer, Préparer, Quelques cas, Plus de cas, Un nouvel outil et Suivre." wideHeight={256} compactHeight={424} wide={draw(false)} compact={draw(true)} />;
}

export function EscalierDesDroitsDiagram() {
  const steps = [["Lire", 0], ["Préparer", 1], ["Proposer", 2], ["Agir", 3]] as const;
  const draw = (compact: boolean) => <>{steps.map(([label, index]) => {
    const x = compact ? 24 : 24 + index * 152;
    const y = compact ? 344 - index * 96 : 176 - index * 40;
    const w = compact ? 280 : 144;
    return <Motif key={label} step={index}><Surface x={x} y={y} width={w} height={72} radius={14} tone={index === 3 ? "accent" : "paper"} /><Label x={x + w / 2} y={y + 40} text={label} kind="title" tone={index === 3 ? "on-accent" : undefined} /><Stroke path={`M${x + w - 28} ${y - 12} v48`} accent /><circle cx={x + w - 28} cy={y - 12} r="7" fill="var(--em)" /></Motif>;
  })}<ToolLogo name="Hermes Agent" x={compact ? 136 : 320} y={compact ? 448 : 232} size={56} /></>;
  return <Diagram id="escalier-droits" title="Chaque marche garde sa barrière" says="Lire, préparer, proposer puis agir : le droit suivant attend la preuve du précédent." description="Un escalier monte de Lire à Agir avec une barrière émeraude sur chaque marche et le logo Hermes." wideHeight={304} compactHeight={520} wide={draw(false)} compact={draw(true)} />;
}

export function TableauAvantApresPiloteMockup() {
  const rows = ["Acceptés", "Corrections", "Oublis", "Temps humain", "Coût total"] as const;
  const draw = (compact: boolean) => <>
    <Panel x={8} y={8} width={compact ? 312 : 664} height={compact ? 432 : 304} radius={24}>
      <ToolLogo name="Notion" x={compact ? 268 : 620} y={20} size={36} />
      <Label x={28} y={40} text="Même type de dossiers" anchor="start" kind="title" />
      <Label x={28} y={68} text="Même période" anchor="start" tone="accent" />
      <Label x={compact ? 188 : 400} y={compact ? 112 : 92} text="Avant" kind="title" />
      <Label x={compact ? 268 : 560} y={compact ? 112 : 92} text="Pilote" kind="title" tone="accent" />
      {rows.map((row, index) => {
        const y = (compact ? 150 : 124) + index * (compact ? 54 : 34);
        return <g key={row}><FixedLine path={`M28 ${y - 18} H${compact ? 296 : 648}`} /><Label x={28} y={y} text={row} anchor="start" /><Label x={compact ? 188 : 400} y={y} text="•" /><Label x={compact ? 268 : 560} y={y} text="•" tone={index === 1 ? "accent" : undefined} /></g>;
      })}
    </Panel>
    <NumberPin x={compact ? 18 : 650} y={120} number={1} />
    <NumberPin x={compact ? 18 : 650} y={228} number={2} accent />
    <NumberPin x={compact ? 18 : 650} y={336} number={3} />
    <Label x={compact ? 164 : 340} y={compact ? 474 : 344} text="1 Mêmes cas   2 Corrections   3 Décider à la date" kind="note" maxChars={compact ? 27 : 58} />
  </>;
  return <Diagram id="tableau-avant-apres-pilote" title="Avant et pilote regardent les mêmes cas" says="Cinq mesures complètes évitent de confondre vitesse et résultat utile." description="Un tableau Notion compare Avant et Pilote sur acceptés, corrections, oublis, temps humain et coût total." wideHeight={364} compactHeight={492} wide={draw(false)} compact={draw(true)} />;
}

export function SortieDeSecoursDiagram() {
  const draw = (compact: boolean) => <>
    <Edge path={compact ? "M164 8 V232 Q164 280 116 280 H48" : "M16 112 H392 Q440 112 440 160 V232"} accent trajectory head={false} />
    <Edge path={compact ? "M164 232 Q164 280 212 280 H292" : "M392 112 Q440 112 488 112 H664"} head={false} />
    <Panel x={compact ? 84 : 40} y={compact ? 24 : 64} width={compact ? 160 : 176} height={72} radius={36} step={0}><Label x={compact ? 164 : 128} y={compact ? 60 : 100} text="Continuer" kind="title" /></Panel>
    <Panel x={compact ? 24 : 488} y={compact ? 320 : 64} width={compact ? 280 : 176} height={72} radius={36} step={1}><Label x={compact ? 164 : 576} y={compact ? 356 : 100} text="Arrêter" kind="title" /></Panel>
    <Panel x={compact ? 24 : 328} y={compact ? 416 : 208} width={compact ? 280 : 224} height={88} radius={24} accent step={2}><Hand x={compact ? 48 : 352} y={compact ? 430 : 222} scale={.72} onAccent /><Label x={compact ? 188 : 448} y={compact ? 460 : 252} text="Reprendre à la main" kind="title" tone="on-accent" /></Panel>
  </>;
  return <Diagram id="sortie-secours" title="La route garde une bretelle humaine" says="Continuer ou arrêter ne détruit jamais le chemin qui permet de reprendre à la main." description="Une route principale se divise entre Continuer et Arrêter, avec une bretelle émeraude vers Reprendre à la main." wideHeight={312} compactHeight={520} wide={draw(false)} compact={draw(true)} />;
}
