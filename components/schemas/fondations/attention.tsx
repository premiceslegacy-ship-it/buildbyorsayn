import { Diagram, Edge, Label } from "../primitives";
import { Document, Motif, Person, Surface } from "./shared";

export function UneIdeeUnePersonneDiagram() {
  const render = (compact: boolean) => {
    const sourceX = compact ? 164 : 88;
    const sourceY = compact ? 50 : 110;
    const people = compact
      ? [[48, 320], [106, 284], [164, 320], [222, 284], [280, 320]] as const
      : [[344, 104], [414, 154], [484, 104], [554, 154], [624, 104]] as const;
    return <>
      <Motif>
        <Surface x={compact ? 36 : 12} y={compact ? 8 : 44} width={compact ? 256 : 152} height={84} radius={28} tone="paper" />
        <Label x={sourceX} y={sourceY - 12} text="Une scène" kind="title" />
        <Label x={sourceX} y={sourceY + 20} text="Une idée" kind="title" />
      </Motif>
      <Motif step={1}>
        <path d={compact ? `M${sourceX - 30} 92 L112 346 H216 L${sourceX + 30} 92 Z` : `M164 76 L426 198 H542 L164 144 Z`} fill="rgba(0,229,137,.07)" stroke="rgba(0,229,137,.28)" strokeWidth="1.5" />
        {people.map(([x, y], index) => <g key={`${x}-${y}`} opacity={index === 2 ? 1 : .55}><Person x={x} y={y} accent={index === 2} /></g>)}
        <Surface x={compact ? 78 : 402} y={compact ? 374 : 212} width={compact ? 172 : 164} height={54} radius={18} tone="accent" />
        <Label x={compact ? 164 : 484} y={compact ? 401 : 239} text="Bonne personne" kind="title" tone="on-accent" />
      </Motif>
    </>;
  };
  return <Diagram id="une-idee-une-personne" title="Un faisceau, pas un projecteur géant" says="Une idée précise aide la bonne personne à se reconnaître sans retenir les autres." description="Une scène et une idée forment un faisceau étroit qui éclaire une seule bonne personne dans une foule." wideHeight={276} compactHeight={438} wide={render(false)} compact={render(true)} />;
}

function Room({ x, y, width, height, label, accent = false, index }: { x: number; y: number; width: number; height: number; label: string; accent?: boolean; index: number }) {
  return <Motif step={index}>
    <Surface x={x} y={y} width={width} height={height} radius={26} tone={accent ? "accent" : "paper"} />
    <path d={`M${x + 22} ${y + height} V${y + 74} Q${x + width / 2} ${y + 28} ${x + width - 22} ${y + 74} V${y + height}`} fill="none" stroke={accent ? "var(--sur-em)" : "rgba(241,245,242,.58)"} strokeWidth="3" />
    <path d={`M${x + width / 2} ${y + 56} V${y + height - 22}`} stroke={accent ? "rgba(3,35,24,.45)" : "rgba(241,245,242,.2)"} strokeWidth="2" />
    <Label x={x + width / 2} y={y + 32} text={label} kind="title" tone={accent ? "on-accent" : undefined} />
  </Motif>;
}

export function TroisTempsAttentionDiagram() {
  const labels = ["Découvrir", "Comprendre", "Agir"] as const;
  const wide = <>
    {labels.map((label, index) => <Room key={label} x={12 + index * 226} y={22} width={204} height={188} label={label} accent={index === 1} index={index} />)}
    <Edge path="M216 116 H238 M442 116 H464" accent head={false} step={3} />
  </>;
  const compact = <>
    {labels.map((label, index) => <Room key={label} x={24} y={8 + index * 216} width={280} height={188} label={label} accent={index === 1} index={index} />)}
    <Edge path="M164 196 V224 M164 412 V440" accent head={false} step={3} />
  </>;
  return <Diagram id="trois-temps-attention" title="Trois pièces, trois gestes" says="La demande grandit seulement quand la personne comprend pourquoi elle avance." description="Trois vraies pièces reliées par des portes représentent Découvrir, Comprendre et Agir. Comprendre est mise en avant." wideHeight={226} compactHeight={628} wide={wide} compact={compact} />;
}

export function ObserverSansCopierDiagram() {
  const render = (compact: boolean) => {
    const poster = compact ? { x: 48, y: 8, w: 232, h: 170 } : { x: 8, y: 30, w: 176, h: 220 };
    const trace = compact ? { x: 48, y: 226, w: 232, h: 244 } : { x: 252, y: 30, w: 176, h: 220 };
    const facts = compact ? { x: 48, y: 518, w: 232, h: 170 } : { x: 496, y: 30, w: 176, h: 220 };
    return <>
      <Motif>
        <Surface x={poster.x} y={poster.y} width={poster.w} height={poster.h} radius={24} tone="paper" />
        <circle cx={poster.x + 54} cy={poster.y + 56} r="28" fill="var(--em)" opacity=".8" />
        <rect x={poster.x + 96} y={poster.y + 30} width={poster.w - 120} height="20" rx="8" fill="rgba(241,245,242,.5)" />
        <path d={`M${poster.x + 24} ${poster.y + 112} H${poster.x + poster.w - 24} M${poster.x + 24} ${poster.y + 140} H${poster.x + poster.w - 52}`} stroke="rgba(241,245,242,.32)" strokeWidth="8" strokeLinecap="round" />
      </Motif>
      <Edge points={compact ? [[164, 178], [164, 226]] : [[184, 140], [252, 140]]} accent step={0} />
      <Motif step={1}>
        <Surface x={trace.x} y={trace.y} width={trace.w} height={trace.h} radius={24} tone="paper" />
        {(["Scène", "Tension", "Explication", "Preuve", "Action"] as const).map((label, index) => <g key={label}><circle cx={trace.x + 26} cy={trace.y + 36 + index * 39} r="5" fill={index === 0 ? "var(--em)" : "rgba(241,245,242,.42)"} /><Label x={trace.x + 44} y={trace.y + 36 + index * 39} text={label} anchor="start" /></g>)}
      </Motif>
      <Edge points={compact ? [[164, 470], [164, 518]] : [[428, 140], [496, 140]]} accent step={2} />
      <Motif step={3}>
        <Surface x={facts.x} y={facts.y} width={facts.w} height={facts.h} radius={24} tone="paper" />
        <Document x={facts.x + facts.w / 2 - 34} y={facts.y + 28} width={68} height={84} accent />
        <Label x={facts.x + facts.w / 2} y={facts.y + facts.h - 30} text="Tes faits" kind="title" tone="accent" />
      </Motif>
    </>;
  };
  return <Diagram id="observer-sans-copier" title="Retire le costume" says="Tu gardes la mécanique du contenu puis tu reconstruis avec tes propres faits." description="Une affiche passe sous un calque qui révèle Scène, Tension, Explication, Preuve et Action, puis devient une nouvelle affiche fondée sur Tes faits." wideHeight={268} compactHeight={700} wide={render(false)} compact={render(true)} />;
}

export function VolumePuisQualiteDiagram() {
  const render = (compact: boolean) => {
    const joinX = compact ? 164 : 372;
    const joinY = compact ? 318 : 142;
    const starts = compact ? [[28, 58], [28, 128], [28, 198], [28, 268]] as const : [[20, 36], [20, 104], [20, 180], [20, 248]] as const;
    return <>
      <Motif>
        {starts.map(([x, y], index) => <g key={index}><circle cx={x + 14} cy={y} r="8" fill="rgba(241,245,242,.48)" /><path d={compact ? `M${x + 24} ${y} C96 ${y} 106 ${joinY} ${joinX} ${joinY}` : `M${x + 24} ${y} C180 ${y} 242 ${joinY} ${joinX} ${joinY}`} fill="none" stroke="rgba(241,245,242,.28)" strokeWidth="10" strokeLinecap="round" /></g>)}
        <Label x={compact ? 28 : 20} y={compact ? 292 : 282} text="Essayer" anchor="start" kind="title" />
        <Surface x={joinX - 82} y={joinY - 32} width={164} height={64} radius={24} tone="paper" /><Label x={joinX} y={joinY} text="Comparer" kind="title" />
        <Label x={joinX} y={joinY + 64} text="Comprendre" kind="title" />
      </Motif>
      <Motif step={1}>
        <path d={compact ? `M${joinX} ${joinY + 88} V466` : `M${joinX + 82} ${joinY} H660`} stroke="var(--em)" strokeWidth="16" strokeLinecap="round" opacity=".24" />
        <path d={compact ? `M${joinX} ${joinY + 88} V466` : `M${joinX + 82} ${joinY} H660`} stroke="var(--em)" strokeWidth="3" strokeLinecap="round" />
        <Surface x={compact ? 64 : 502} y={compact ? 466 : 106} width={compact ? 200 : 162} height={72} radius={26} tone="accent" />
        <Label x={compact ? 164 : 583} y={compact ? 502 : 142} text="Renforcer" kind="title" tone="on-accent" />
      </Motif>
    </>;
  };
  return <Diagram id="volume-puis-qualite" title="Plusieurs pistes, une route" says="Tu explores assez pour comprendre, puis tu renforces la direction qui ouvre de bonnes conversations." description="Quatre routes Essayer convergent vers Comparer et Comprendre, puis une seule route émeraude conduit à Renforcer." wideHeight={300} compactHeight={546} wide={render(false)} compact={render(true)} />;
}

export function SourceVersBibliothequeDiagram() {
  const formats = ["Post", "Vidéo", "E-mail", "Page"] as const;
  const render = (compact: boolean) => {
    const source = compact ? { x: 76, y: 8, w: 176, h: 126 } : { x: 12, y: 72, w: 180, h: 148 };
    const shelf = compact ? { x: 24, y: 188, w: 280, h: 360 } : { x: 246, y: 16, w: 422, h: 252 };
    return <>
      <Motif>
        <Surface x={source.x} y={source.y} width={source.w} height={source.h} radius={24} tone="accent" />
        <path d={`M${source.x + 28} ${source.y + 30} H${source.x + source.w - 28} V${source.y + 78} H${source.x + 78} L${source.x + 58} ${source.y + 98} V${source.y + 78} H${source.x + 28} Z`} fill="none" stroke="var(--sur-em)" strokeWidth="3" />
        <Label x={source.x + source.w / 2} y={source.y + source.h - 18} text="Conversation" kind="title" tone="on-accent" />
      </Motif>
      <Edge points={compact ? [[164, 134], [164, 188]] : [[192, 146], [246, 146]]} accent step={0} />
      <Motif step={1}>
        <Surface x={shelf.x} y={shelf.y} width={shelf.w} height={shelf.h} radius={28} tone="paper" />
        {[1, 2, 3].map((row) => <path key={row} d={`M${shelf.x + 22} ${shelf.y + row * (shelf.h / 4)} H${shelf.x + shelf.w - 22}`} stroke="rgba(241,245,242,.24)" strokeWidth="6" strokeLinecap="round" />)}
        {formats.map((label, index) => {
          const x = compact ? shelf.x + 34 + (index % 2) * 132 : shelf.x + 34 + index * 96;
          const y = compact ? shelf.y + 48 + Math.floor(index / 2) * 154 : shelf.y + 70;
          return <g key={label}><Document x={x} y={y} width={compact ? 72 : 64} height={92} /><Label x={x + (compact ? 36 : 32)} y={y + 118} text={label} kind="title" /></g>;
        })}
      </Motif>
    </>;
  };
  return <Diagram id="source-vers-bibliotheque" title="Une source remplit plusieurs rayons" says="Les formats changent, mais ils gardent le même problème, la même preuve et les mêmes limites." description="Une Conversation réelle alimente une bibliothèque avec quatre rayons : Post, Vidéo, E-mail et Page." wideHeight={284} compactHeight={556} wide={render(false)} compact={render(true)} />;
}
