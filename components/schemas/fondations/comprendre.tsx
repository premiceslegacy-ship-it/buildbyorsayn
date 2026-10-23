import { Diagram, Edge, Label } from "../primitives";
import { Document, Motif, Person, Stroke, Surface } from "./shared";

function SceneVignette({ x, y, label, accent = false }: { x: number; y: number; label: string; accent?: boolean }) {
  return <g>
    <Surface x={x} y={y} width={118} height={86} radius={16} tone="surface" />
    {label === "Déclencheur" ? <path d={`M${x + 28} ${y + 20} H${x + 90} V${y + 54} H${x + 62} L${x + 50} ${y + 66} V${y + 54} H${x + 28} Z`} fill="none" stroke={accent ? "var(--em)" : "rgba(241,245,242,.64)"} strokeWidth="2" /> : null}
    {label === "Geste" ? <path d={`M${x + 32} ${y + 56} C${x + 40} ${y + 26} ${x + 54} ${y + 18} ${x + 60} ${y + 44} C${x + 67} ${y + 22} ${x + 81} ${y + 26} ${x + 86} ${y + 58}`} fill="none" stroke="rgba(241,245,242,.64)" strokeWidth="3" strokeLinecap="round" /> : null}
    {label === "Gêne" ? <path d={`M${x + 30} ${y + 24} L${x + 50} ${y + 62} M${x + 54} ${y + 24} L${x + 74} ${y + 62} M${x + 78} ${y + 24} L${x + 98} ${y + 62}`} stroke="rgba(241,245,242,.64)" strokeWidth="3" strokeLinecap="round" /> : null}
    {label === "Changement" ? <path d={`M${x + 30} ${y + 56} H${x + 48} V${y + 46} H${x + 66} V${y + 36} H${x + 88}`} fill="none" stroke="rgba(241,245,242,.64)" strokeWidth="3" strokeLinecap="round" /> : null}
    <Label x={x + 59} y={y + 108} text={label} kind={accent ? "title" : "text"} tone={accent ? "accent" : undefined} />
  </g>;
}

export function SousLeMotLaSceneDiagram() {
  const wide = <>
    <Motif>
      <Surface x={16} y={56} width={190} height={144} radius={22} tone="paper" />
      <path d="M16 92 L111 36 L206 92" fill="#252a27" stroke="rgba(241,245,242,.3)" strokeWidth="2" />
      <Label x={111} y={132} text="Premium" kind="title" />
    </Motif>
    <Edge points={[[206, 128], [252, 128]]} accent step={0} />
    <Motif step={1}>
      <Surface x={252} y={8} width={412} height={240} radius={28} tone="paper" />
      <SceneVignette x={270} y={30} label="Déclencheur" accent />
      <SceneVignette x={400} y={30} label="Geste" />
      <SceneVignette x={270} y={142} label="Gêne" />
      <SceneVignette x={400} y={142} label="Changement" />
    </Motif>
  </>;
  const compact = <>
    <Motif><Surface x={62} y={8} width={204} height={112} radius={20} tone="paper" /><path d="M62 42 L164 4 L266 42" fill="#252a27" stroke="rgba(241,245,242,.3)" strokeWidth="2" /><Label x={164} y={76} text="Premium" kind="title" /></Motif>
    <Edge points={[[164, 120], [164, 156]]} accent step={0} />
    <Motif step={1}><Surface x={24} y={156} width={280} height={404} radius={28} tone="paper" /><SceneVignette x={40} y={176} label="Déclencheur" accent /><SceneVignette x={170} y={176} label="Geste" /><SceneVignette x={40} y={364} label="Gêne" /><SceneVignette x={170} y={364} label="Changement" /></Motif>
  </>;
  return <Diagram id="sous-le-mot-la-scene" title="Ouvre le mot" says="Un mot vague devient utile quand tu retrouves la journée qu'il résume." description="Un carton Premium s'ouvre sur quatre scènes : Déclencheur, Geste, Gêne et Changement." wideHeight={260} compactHeight={568} wide={wide} compact={compact} />;
}

export function DecisionHumaineDiagram() {
  const render = (compact: boolean) => {
    const leftX = compact ? 24 : 24;
    const rightX = compact ? 180 : 440;
    const y = compact ? 22 : 18;
    const cardW = compact ? 124 : 216;
    const centerX = compact ? 164 : 340;
    const beamY = compact ? 186 : 148;
    return <>
      <Motif>
        <Surface x={leftX} y={y} width={cardW} height={114} radius={24} tone="paper" />
        <path d={`M${leftX + 34} ${y + 82} V${y + 34} H${leftX + cardW - 34} V${y + 82}`} fill="none" stroke="rgba(241,245,242,.58)" strokeWidth="3" /><path d={`M${leftX + cardW - 48} ${y + 48} L${leftX + cardW - 34} ${y + 34} L${leftX + cardW - 20} ${y + 48}`} fill="none" stroke="var(--em)" strokeWidth="3" />
        <Label x={leftX + cardW / 2} y={y + 142} text="Ce que je veux" kind="title" />
        <Surface x={rightX} y={y} width={cardW} height={114} radius={24} tone="paper" />
        <path d={`M${rightX + cardW / 2} ${y + 28} Q${rightX + cardW - 34} ${y + 44} ${rightX + cardW / 2} ${y + 88} Q${rightX + 34} ${y + 44} ${rightX + cardW / 2} ${y + 28} Z`} fill="none" stroke="rgba(241,245,242,.58)" strokeWidth="3" />
        <Label x={rightX + cardW / 2} y={y + 142} text="Ce que je crains" kind="title" />
        <path d={`M${compact ? 48 : 92} ${beamY} H${compact ? 280 : 588}`} stroke="rgba(241,245,242,.55)" strokeWidth="5" strokeLinecap="round" />
        <path d={`M${centerX} ${beamY} V${beamY + 68} M${centerX - 48} ${beamY + 68} H${centerX + 48}`} stroke="rgba(241,245,242,.55)" strokeWidth="5" strokeLinecap="round" />
        <circle cx={centerX} cy={beamY} r="13" fill="var(--em)" />
      </Motif>
      <Motif step={1}><Surface x={centerX - (compact ? 96 : 112)} y={beamY + 88} width={compact ? 192 : 224} height={58} radius={20} tone="accent" /><Label x={centerX} y={beamY + 117} text="Ma décision" kind="title" tone="on-accent" /></Motif>
    </>;
  };
  return <Diagram id="decision-humaine" title="Une décision pèse deux mouvements" says="La personne avance vers un progrès tout en se protégeant d'un risque." description="Une balance oppose Ce que je veux et Ce que je crains, puis conduit à Ma décision." wideHeight={312} compactHeight={340} wide={render(false)} compact={render(true)} />;
}

export function SixRessortsDansUneSceneDiagram() {
  const labels = ["Progrès", "Identité", "Autres", "Crédibilité", "Inaction", "Sécurité"] as const;
  const render = (compact: boolean) => {
    const cx = compact ? 164 : 340;
    const cy = compact ? 258 : 150;
    const positions = compact
      ? [[52, 68], [202, 68], [28, 194], [202, 194], [52, 382], [202, 382]] as const
      : [[20, 30], [232, 8], [460, 30], [20, 226], [232, 250], [460, 226]] as const;
    return <>
      <Motif><ellipse cx={cx} cy={cy} rx={compact ? 118 : 244} ry={compact ? 150 : 112} fill="none" stroke="rgba(241,245,242,.18)" strokeWidth="28" /><ellipse cx={cx} cy={cy} rx={compact ? 90 : 188} ry={compact ? 110 : 78} fill="none" stroke="rgba(241,245,242,.18)" strokeWidth="1.5" /><Surface x={cx - 54} y={cy - 54} width={108} height={108} radius={54} tone="paper" /><Person x={cx} y={cy - 12} /><Label x={cx} y={cy + 38} text="Une scène" kind="title" /></Motif>
      {labels.map((label, index) => {
        const [x, y] = positions[index];
        const accent = index === 0;
        return <Motif key={label} step={index + 1}><Surface x={x} y={y} width={compact ? 126 : 200} height={54} radius={18} tone={accent ? "accent" : "paper"} /><Label x={x + (compact ? 63 : 100)} y={y + 27} text={label} kind={accent ? "title" : "text"} tone={accent ? "on-accent" : undefined} /></Motif>;
      })}
    </>;
  };
  return <Diagram id="six-ressorts-dans-une-scene" title="Six angles autour d'une scène" says="Tu observes ces ressorts pour comprendre, jamais pour pousser quelqu'un." description="Une personne dans une scène est entourée de six lentilles : Progrès, Identité, Autres, Crédibilité, Inaction et Sécurité." wideHeight={312} compactHeight={452} wide={render(false)} compact={render(true)} />;
}

export function ConfianceVisibleDiagram() {
  const labels = ["Livrable", "Étapes", "Sortie"] as const;
  const render = (compact: boolean) => <>
    <Motif>
      <Surface x={compact ? 24 : 16} y={compact ? 8 : 28} width={compact ? 280 : 496} height={compact ? 356 : 196} radius={28} tone="paper" />
      {labels.map((label, index) => {
        const x = compact ? 48 : 40 + index * 156;
        const y = compact ? 34 + index * 104 : 54;
        return <g key={label}>
          <Surface x={x} y={y} width={compact ? 232 : 132} height={78} radius={18} tone="surface" />
          {index === 0 ? <Document x={x + 18} y={y + 14} width={42} height={50} /> : null}
          {index === 1 ? <Stroke path={`M${x + 18} ${y + 22} H${x + 104} M${x + 18} ${y + 39} H${x + 88} M${x + 18} ${y + 56} H${x + 72}`} soft /> : null}
          {index === 2 ? <path d={`M${x + 24} ${y + 50} H${x + 86} M${x + 72} ${y + 36} L${x + 88} ${y + 50} L${x + 72} ${y + 64}`} fill="none" stroke="rgba(241,245,242,.65)" strokeWidth="3" /> : null}
          <Label x={compact ? x + 132 : x + 66} y={compact ? y + 39 : y + 102} text={label} anchor={compact ? "start" : "middle"} kind="title" />
        </g>;
      })}
    </Motif>
    <Edge points={compact ? [[164, 364], [164, 404]] : [[512, 126], [550, 126]]} accent step={3} />
    <Motif step={4}><Surface x={compact ? 54 : 550} y={compact ? 404 : 72} width={compact ? 220 : 114} height={108} radius={28} tone="accent" /><path d={compact ? "M112 455 L148 479 L214 435" : "M576 124 L592 140 L638 102"} fill="none" stroke="#052116" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /><Label x={compact ? 164 : 607} y={compact ? 490 : 164} text="Je choisis" kind="title" tone="on-accent" /></Motif>
  </>;
  return <Diagram id="confiance-visible" title="La confiance a des fenêtres" says="La personne inspecte le travail avant de décider, sans devoir te croire sur parole." description="Trois fenêtres montrent le Livrable, les Étapes et la Sortie avant le bouton Je choisis." wideHeight={252} compactHeight={520} wide={render(false)} compact={render(true)} />;
}

export function FaitMotQuestionDiagram() {
  const render = (compact: boolean) => {
    const sheets = compact
      ? [{ x: 24, y: 8, r: -4, l: "Fait" }, { x: 76, y: 46, r: 1, l: "Mots exacts" }, { x: 128, y: 84, r: 5, l: "Question" }]
      : [{ x: 20, y: 44, r: -5, l: "Fait" }, { x: 160, y: 24, r: 0, l: "Mots exacts" }, { x: 300, y: 44, r: 5, l: "Question" }];
    return <>
      {sheets.map((sheet, index) => <Motif key={sheet.l} step={index}><g transform={`rotate(${sheet.r} ${sheet.x + 92} ${sheet.y + 74})`}><Surface x={sheet.x} y={sheet.y} width={compact ? 176 : 184} height={148} radius={20} tone="paper" /><Label x={sheet.x + 20} y={sheet.y + 30} text={sheet.l} anchor="start" kind="title" /><Stroke path={`M${sheet.x + 20} ${sheet.y + 62} H${sheet.x + (compact ? 150 : 160)} M${sheet.x + 20} ${sheet.y + 86} H${sheet.x + 132} M${sheet.x + 20} ${sheet.y + 110} H${sheet.x + 116}`} soft /></g></Motif>)}
      <Edge path={compact ? "M164 244 V300" : "M484 116 H536"} accent step={3} />
      <Motif step={4}><Surface x={compact ? 36 : 536} y={compact ? 300 : 44} width={compact ? 256 : 128} height={132} radius={32} tone="accent" /><text x={compact ? 164 : 600} y={compact ? 354 : 92} textAnchor="middle" fill="#052116" fontFamily="var(--font-t)" fontSize="46" fontWeight="650">?</text><Label x={compact ? 164 : 600} y={compact ? 398 : 142} text="À vérifier" kind="title" tone="on-accent" /></Motif>
    </>;
  };
  return <Diagram id="fait-mot-question" title="Sépare avant d'interpréter" says="Tes notes distinguent ce qui s'est passé, les mots utilisés et ce qu'il reste à vérifier." description="Trois feuilles Fait, Mots exacts et Question convergent vers une grande carte À vérifier." wideHeight={236} compactHeight={440} wide={render(false)} compact={render(true)} />;
}
