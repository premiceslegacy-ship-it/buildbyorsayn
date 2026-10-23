import { Diagram, Edge, Label } from "../primitives";
import { Folder, Motif, Stroke, Surface } from "./shared";

export function CroyanceVersQuestionDiagram() {
  const scene = (compact: boolean) => {
    const bubble = compact ? { x: 24, y: 8, w: 280, h: 104 } : { x: 8, y: 48, w: 238, h: 128 };
    const window = compact ? { x: 24, y: 160, w: 280, h: 248 } : { x: 298, y: 8, w: 374, h: 208 };
    return <>
      <Motif>
        <Surface x={bubble.x} y={bubble.y} width={bubble.w} height={bubble.h} radius={bubble.h / 2} tone="paper" />
        <Label x={bubble.x + bubble.w / 2} y={bubble.y + bubble.h / 2} text="Marché saturé" kind="title" />
        <path d={`M${bubble.x + bubble.w - 42} ${bubble.y + bubble.h - 18} L${bubble.x + bubble.w - 12} ${bubble.y + bubble.h + 10} L${bubble.x + bubble.w - 58} ${bubble.y + bubble.h - 2}`} fill="#1f2321" />
      </Motif>
      <Edge points={compact ? [[164, 120], [164, 160]] : [[246, 112], [298, 112]]} accent step={0} />
      <Motif step={1}>
        <Surface x={window.x} y={window.y} width={window.w} height={window.h} radius={24} tone="paper" />
        <Stroke path={`M${window.x} ${window.y + 38} H${window.x + window.w}`} soft />
        <circle cx={window.x + 20} cy={window.y + 19} r="4" fill="var(--t3)" /><circle cx={window.x + 34} cy={window.y + 19} r="4" fill="var(--t3)" />
        <path d={`M${window.x + window.w - 116} ${window.y + 38} V${window.y + window.h} M${window.x + 26} ${window.y + window.h - 42} V${window.y + 92} Q${window.x + 96} ${window.y + 56} ${window.x + 170} ${window.y + 92} V${window.y + window.h - 42}`} fill="none" stroke="rgba(241,245,242,.45)" strokeWidth="2" />
        <rect x={window.x + 62} y={window.y + 108} width="78" height="70" rx="10" fill="#242926" stroke="rgba(241,245,242,.25)" />
        <Label x={window.x + window.w - 92} y={window.y + 76} text="Qui ?" />
        <Label x={window.x + window.w - 92} y={window.y + 122} text="Quel moment ?" />
        <Label x={window.x + window.w - 92} y={window.y + 172} text="Quel problème ?" kind="title" tone="accent" />
      </Motif>
    </>;
  };
  return <Diagram id="croyance-vers-question" title="Ouvre la croyance" says="Une conclusion fermée devient une scène que tu peux aller vérifier." description="La bulle Marché saturé s'ouvre sur une fenêtre de restaurant et trois questions : qui, quel moment et quel problème." wideHeight={224} compactHeight={416} wide={scene(false)} compact={scene(true)} />;
}

export function PetitTestTroisSortiesDiagram() {
  const render = (compact: boolean) => {
    const cx = compact ? 164 : 314;
    const test = compact ? { x: 44, y: 8, w: 240, h: 88 } : { x: 16, y: 64, w: 208, h: 96 };
    const signs = compact
      ? [{ x: 28, y: 174, label: "Continuer" }, { x: 170, y: 238, label: "Modifier" }, { x: 28, y: 302, label: "Arrêter" }]
      : [{ x: 376, y: 12, label: "Continuer" }, { x: 424, y: 90, label: "Modifier" }, { x: 376, y: 168, label: "Arrêter" }];
    return <>
      <Motif><Surface x={test.x} y={test.y} width={test.w} height={test.h} radius={28} tone="paper" /><Label x={test.x + test.w / 2} y={test.y + test.h / 2} text="Petit test" kind="title" /><Stroke path={`M${test.x + 34} ${test.y + test.h - 18} H${test.x + test.w - 34}`} soft /></Motif>
      <Edge path={compact ? `M${cx} 96 V150` : "M224 112 H314"} accent step={0} />
      <Motif step={1}>
        <circle cx={cx} cy={compact ? 150 : 112} r="12" fill="var(--em)" />
        {signs.map((sign) => {
          const accent = sign.label === "Modifier";
          const sx = sign.x;
          const sy = sign.y;
          return <g key={sign.label}>
            <path d={compact ? `M${cx} 150 L${sx + 56} ${sy + 22}` : `M${cx} 112 L${sx} ${sy + 24}`} fill="none" stroke={accent ? "var(--em)" : "rgba(241,245,242,.4)"} strokeWidth={accent ? 3 : 2} />
            <Surface x={sx} y={sy} width={compact ? 132 : 248} height={48} radius={16} tone={accent ? "accent" : "paper"} />
            <Label x={sx + (compact ? 66 : 124)} y={sy + 24} text={sign.label} kind="title" tone={accent ? "on-accent" : undefined} />
          </g>;
        })}
      </Motif>
    </>;
  };
  return <Diagram id="petit-test-trois-sorties" title="Un test choisit une direction" says="Tu testes pour décider de la suite, pas pour prouver que tu avais raison." description="Un petit test arrive à un panneau qui indique Continuer, Modifier ou Arrêter. Modifier est mis en avant." wideHeight={228} compactHeight={366} wide={render(false)} compact={render(true)} />;
}

function TrialCard({ x, y, width, changed, compact = false }: { x: number; y: number; width: number; changed: boolean; compact?: boolean }) {
  const rows = ["Même personne", "Même offre", changed ? "Nouveau message" : "Même canal"];
  return <Motif step={changed ? 1 : 0}>
    <Surface x={x} y={y} width={width} height={compact ? 180 : 196} radius={26} tone="paper" />
    <Label x={x + 22} y={y + 28} text={changed ? "ESSAI B" : "ESSAI A"} anchor="start" kind="note" />
    {rows.map((row, index) => {
      const accent = row === "Nouveau message";
      return <g key={row}>
        <rect x={x + 22} y={y + 52 + index * 42} width={width - 44} height="30" rx="10" fill={accent ? "rgba(0,229,137,.16)" : "rgba(241,245,242,.06)"} stroke={accent ? "var(--em)" : "rgba(241,245,242,.16)"} />
        <circle cx={x + 40} cy={y + 67 + index * 42} r="4" fill={accent ? "var(--em)" : "rgba(241,245,242,.45)"} />
        <Label x={x + 54} y={y + 67 + index * 42} text={row} anchor="start" kind={accent ? "title" : "text"} tone={accent ? "accent" : undefined} />
      </g>;
    })}
  </Motif>;
}

export function UneSeuleChoseChangeDiagram() {
  return <Diagram id="une-seule-chose-change" title="Deux essais, une différence" says="La base reste stable pour que la différence raconte quelque chose." description="Les cartes Essai A et Essai B gardent la même personne et la même offre. Seul le nouveau message est mis en avant." wideHeight={212} compactHeight={408} wide={<><TrialCard x={16} y={8} width={294} changed={false} /><Edge points={[[310, 106], [370, 106]]} head={false} accent step={0} /><TrialCard x={370} y={8} width={294} changed /></>} compact={<><TrialCard x={24} y={8} width={280} changed={false} compact /><Edge points={[[164, 188], [164, 220]]} head={false} accent step={0} /><TrialCard x={24} y={220} width={280} changed compact /></>} />;
}

export function EchelleEngagementDiagram() {
  const labels = ["Intéressé", "Raconte", "Partage", "Demande", "Paie"] as const;
  const wide = <>
    <Motif><path d="M10 220 H138 V176 H266 V132 H394 V88 H522 V44 H670 V236 H10 Z" fill="#202522" stroke="rgba(241,245,242,.18)" /><path d="M10 219 H138 V175 H266 V131 H394 V87 H522 V43 H670" fill="none" stroke="rgba(241,245,242,.42)" strokeWidth="2" /></Motif>
    {labels.map((label, index) => {
      const x = 74 + index * 128;
      const y = 196 - index * 44;
      const accent = label === "Demande";
      return <Motif step={index} key={label}><circle cx={x} cy={y} r={accent ? 18 : 8} fill={accent ? "var(--em)" : "rgba(241,245,242,.55)"} /><Label x={x} y={y + 38} text={label} kind={accent ? "title" : "text"} tone={accent ? "accent" : undefined} /></Motif>;
    })}
  </>;
  const compact = <>
    <Motif><path d="M30 392 H92 V318 H140 V244 H188 V170 H236 V96 H298 V424 H30 Z" fill="#202522" stroke="rgba(241,245,242,.18)" /><path d="M30 391 H92 V317 H140 V243 H188 V169 H236 V95 H298" fill="none" stroke="rgba(241,245,242,.42)" strokeWidth="2" /></Motif>
    {labels.map((label, index) => {
      const x = 64 + index * 48;
      const y = 366 - index * 74;
      const accent = label === "Demande";
      return <Motif step={index} key={label}><circle cx={x} cy={y} r={accent ? 15 : 7} fill={accent ? "var(--em)" : "rgba(241,245,242,.55)"} /><Label x={index < 3 ? x + 4 : x - 4} y={y - 28} text={label} anchor={index < 3 ? "start" : "end"} kind={accent ? "title" : "text"} tone={accent ? "accent" : undefined} /></Motif>;
    })}
  </>;
  return <Diagram id="echelle-engagement" title="Du compliment au geste" says="Plus le geste demande un effort réel, plus il t'apprend sur la demande." description="Cinq grandes marches montent d'Intéressé à Paie. Demande est la marche mise en avant." wideHeight={244} compactHeight={432} wide={wide} compact={compact} />;
}

export function CeQueTuGardesDiagram() {
  const render = (compact: boolean) => {
    const folder = compact ? { x: 24, y: 8, w: 280, h: 224 } : { x: 16, y: 16, w: 396, h: 216 };
    const cards = ["Question", "Réponse", "Décision", "Fichiers"];
    return <>
      <Motif>
        <Folder x={folder.x} y={folder.y + 28} width={folder.w} height={folder.h - 28} />
        {cards.map((label, index) => {
          const cardWidth = compact ? 112 : 76;
          const x = compact ? folder.x + 18 + (index % 2) * 132 : folder.x + 24 + index * 88;
          const y = compact ? folder.y + 72 + Math.floor(index / 2) * 72 : folder.y + 82 + index % 2 * 18;
          return <g key={label} transform={`rotate(${index % 2 ? 2 : -2} ${x + cardWidth / 2} ${y + 26})`}><Surface x={x} y={y} width={cardWidth} height={54} radius={12} tone="paper" /><Label x={x + cardWidth / 2} y={y + 27} text={label} /></g>;
        })}
      </Motif>
      <Edge path={compact ? "M164 232 V274" : "M412 124 H458"} accent step={1} />
      <Motif step={2}>
        <path d={compact ? "M32 400 H86 V376 H140 V348 H194 V316 H250 V280 H304" : "M458 218 H500 V178 H542 V138 H584 V98 H626 V58 H672"} fill="none" stroke="var(--em)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" opacity=".22" />
        <Stroke path={compact ? "M32 400 H86 V376 H140 V348 H194 V316 H250 V280 H304" : "M458 218 H500 V178 H542 V138 H584 V98 H626 V58 H672"} accent />
        <Surface x={compact ? 76 : 474} y={compact ? 420 : 8} width={compact ? 176 : 182} height={52} radius={18} tone="accent" />
        <Label x={compact ? 164 : 565} y={compact ? 446 : 34} text="Prochain projet" kind="title" tone="on-accent" />
      </Motif>
    </>;
  };
  return <Diagram id="ce-que-tu-gardes" title="Chaque test remplit ton dossier" says="Ce que tu apprends aujourd'hui rend le prochain projet plus simple à lancer." description="Un dossier reçoit Question, Réponse, Décision et Fichiers, puis alimente une rampe qui monte vers le Prochain projet." wideHeight={244} compactHeight={480} wide={render(false)} compact={render(true)} />;
}
