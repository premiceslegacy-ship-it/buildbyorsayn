import { Diagram, Label } from "../primitives";
import { Document, Motif, Person, Stroke, Surface } from "./shared";

const messageFrames = ["Moment", "Problème", "Changement", "Comment", "Geste"] as const;

function FilmIcon({ index, x, y, accent }: { index: number; x: number; y: number; accent: boolean }) {
  const color = accent ? "var(--sur-em)" : "rgba(241,245,242,.68)";
  if (index === 0) return <><circle cx={x} cy={y} r="22" fill="none" stroke={color} strokeWidth="3" /><path d={`M${x} ${y} V${y - 12} M${x} ${y} L${x + 10} ${y + 8}`} stroke={color} strokeWidth="3" strokeLinecap="round" /></>;
  if (index === 1) return <><path d={`M${x - 24} ${y - 18} H${x + 24} V${y + 14} H${x + 2} L${x - 12} ${y + 28} V${y + 14} H${x - 24} Z`} fill="none" stroke={color} strokeWidth="3" /><circle cx={x - 10} cy={y - 2} r="3" fill={color} /><circle cx={x + 2} cy={y - 2} r="3" fill={color} /><circle cx={x + 14} cy={y - 2} r="3" fill={color} /></>;
  if (index === 2) return <path d={`M${x - 28} ${y + 20} H${x - 8} V${y + 6} H${x + 10} V${y - 8} H${x + 30}`} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />;
  if (index === 3) return <><circle cx={x - 18} cy={y} r="10" fill="none" stroke={color} strokeWidth="3" /><circle cx={x + 18} cy={y} r="10" fill="none" stroke={color} strokeWidth="3" /><path d={`M${x - 8} ${y} H${x + 8}`} stroke={color} strokeWidth="3" /></>;
  return <path d={`M${x - 28} ${y} H${x + 22} M${x + 8} ${y - 14} L${x + 24} ${y} L${x + 8} ${y + 14}`} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />;
}

export function CarteDuMessageDiagram() {
  const render = (compact: boolean) => <>
    <Motif><Surface x={compact ? 14 : 4} y={compact ? 4 : 22} width={compact ? 300 : 672} height={compact ? 532 : 176} radius={24} tone="paper" />
      {[0, 1, 2, 3, 4, 5, 6].map((hole) => compact
        ? <g key={hole}><rect x="26" y={22 + hole * 72} width="10" height="24" rx="3" fill="rgba(241,245,242,.22)" /><rect x="292" y={22 + hole * 72} width="10" height="24" rx="3" fill="rgba(241,245,242,.22)" /></g>
        : <g key={hole}><rect x={20 + hole * 94} y="32" width="34" height="10" rx="3" fill="rgba(241,245,242,.22)" /><rect x={20 + hole * 94} y="168" width="34" height="10" rx="3" fill="rgba(241,245,242,.22)" /></g>)}
      {messageFrames.map((label, index) => {
        const x = compact ? 50 : 22 + index * 132;
        const y = compact ? 20 + index * 100 : 54;
        const accent = index === 2;
        return <g key={label}><Surface x={x} y={y} width={compact ? 228 : 108} height={82} radius={16} tone={accent ? "accent" : "surface"} /><FilmIcon index={index} x={x + (compact ? 46 : 54)} y={y + 41} accent={accent} /><Label x={compact ? x + 92 : x + 54} y={compact ? y + 41 : y + 112} text={label} anchor={compact ? "start" : "middle"} kind="title" tone={accent ? (compact ? "on-accent" : "accent") : undefined} /></g>;
      })}
    </Motif>
  </>;
  return <Diagram id="carte-du-message" title="Cinq images gardent le fil" says="Ta scène mène au changement puis au geste sans perdre le lecteur en route." description="Une vraie bande de film montre Moment, Problème, Changement, Comment et Geste. Changement est mis en avant." wideHeight={190} compactHeight={540} wide={render(false)} compact={render(true)} />;
}

export function MemeOffreQuatreMomentsDiagram() {
  const labels = ["Découvre", "Comprend", "Compare", "Décide"] as const;
  const render = (compact: boolean) => <>
    <Motif><Person x={compact ? 54 : 38} y={compact ? 58 : 142} /><Stroke path={compact ? "M54 100 C56 174 50 246 54 318 S50 398 54 468" : "M70 162 H650"} soft /></Motif>
    {labels.map((label, index) => {
      const x = compact ? 92 : 104 + index * 142;
      const y = compact ? 16 + index * 124 : 22 - index * 3;
      const w = compact ? 212 : 124;
      const h = compact ? 102 : 146 + index * 10;
      const accent = index === 2;
      return <Motif key={label} step={index + 1}>
        <Surface x={x} y={y} width={w} height={h} radius={22} tone={accent ? "accent" : "paper"} />
        <rect x={x + 18} y={y + 22} width={compact ? 70 + index * 24 : 54 + index * 12} height="24" rx="8" fill={accent ? "rgba(3,35,24,.28)" : "rgba(241,245,242,.12)"} />
        <path d={`M${x + 18} ${y + 64} H${x + w - 18} M${x + 18} ${y + 82} H${x + w - 36}`} stroke={accent ? "rgba(3,35,24,.58)" : "rgba(241,245,242,.3)"} strokeWidth="3" strokeLinecap="round" />
        <Label x={compact ? x + 118 : x + w / 2} y={compact ? y + 51 : y + h + 26} text={label} anchor={compact ? "start" : "middle"} kind="title" tone={accent ? (compact ? "on-accent" : "accent") : undefined} />
      </Motif>;
    })}
  </>;
  return <Diagram id="meme-offre-quatre-moments" title="La vitrine change avec le moment" says="La même offre montre plus de détails à mesure que la décision approche." description="Une personne avance devant quatre vitrines de plus en plus détaillées : Découvre, Comprend, Compare et Décide." wideHeight={230} compactHeight={512} wide={render(false)} compact={render(true)} />;
}

export function MecanismeVisibleDiagram() {
  const labels = ["Entrée", "Étapes", "Validation", "Résultat"] as const;
  const render = (compact: boolean) => {
    const outer = compact ? { x: 20, y: 8, w: 288, h: 478 } : { x: 8, y: 8, w: 664, h: 230 };
    return <>
      <Motif>
        <Surface x={outer.x} y={outer.y} width={outer.w} height={outer.h} radius={30} tone="paper" />
        <path d={compact ? "M54 64 V430 H274" : "M48 170 H632"} fill="none" stroke="rgba(241,245,242,.26)" strokeWidth="18" strokeLinecap="round" />
        {labels.map((label, index) => {
          const x = compact ? 52 : 38 + index * 160;
          const y = compact ? 34 + index * 104 : 66;
          const accent = index === 2;
          return <g key={label}>
            <Surface x={x} y={y} width={compact ? 224 : 126} height={78} radius={20} tone={accent ? "accent" : "surface"} />
            {index === 0 ? <Document x={x + 16} y={y + 14} width={44} height={50} /> : null}
            {index === 1 ? <><circle cx={x + 38} cy={y + 39} r="14" fill="none" stroke="rgba(241,245,242,.62)" strokeWidth="3" /><path d={`M${x + 52} ${y + 39} H${x + 86}`} stroke="rgba(241,245,242,.62)" strokeWidth="3" /></> : null}
            {index === 2 ? <path d={`M${x + 18} ${y + 40} L${x + 34} ${y + 56} L${x + 62} ${y + 24}`} fill="none" stroke="var(--sur-em)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /> : null}
            {index === 3 ? <path d={`M${x + 18} ${y + 24} H${x + 72} V${y + 58} H${x + 18} Z`} fill="none" stroke="rgba(241,245,242,.62)" strokeWidth="3" /> : null}
            <Label x={compact ? x + 82 : x + 63} y={compact ? y + 39 : y + 108} text={label} anchor={compact ? "start" : "middle"} kind="title" tone={accent ? (compact ? "on-accent" : "accent") : undefined} />
          </g>;
        })}
        <path d={compact ? "M32 438 H296" : "M32 194 H648"} stroke="rgba(241,245,242,.18)" strokeWidth="2" />
      </Motif>
    </>;
  };
  return <Diagram id="mecanisme-visible" title="Regarde à travers le mécanisme" says="Tu vois ce qui entre, ce qui se passe, qui valide et ce qui sort." description="Une machine transparente montre quatre grandes zones : Entrée, Étapes, Validation et Résultat." wideHeight={246} compactHeight={494} wide={render(false)} compact={render(true)} />;
}

export function PreuveAuBonEndroitDiagram() {
  const rows = [{ q: "Mon cas ?", p: "Exemple" }, { q: "Ton travail ?", p: "Démo" }, { q: "Pour moi ?", p: "Conditions" }] as const;
  const render = (compact: boolean) => <Motif>
    <Surface x={compact ? 18 : 54} y={8} width={compact ? 292 : 572} height={compact ? 464 : 276} radius={28} tone="paper" />
    <path d={compact ? "M42 54 H286" : "M86 54 H594"} stroke="rgba(241,245,242,.24)" strokeWidth="8" strokeLinecap="round" />
    {rows.map((row, index) => {
      const y = compact ? 88 + index * 124 : 82 + index * 62;
      const accent = index === 1;
      return <g key={row.q}>
        <Label x={compact ? 42 : 92} y={y} text={row.q} anchor="start" kind="title" />
        <path d={compact ? `M42 ${y + 28} H286` : `M210 ${y} H354`} stroke={accent ? "var(--em)" : "rgba(241,245,242,.28)"} strokeWidth={accent ? 3 : 1.5} strokeDasharray="4 7" />
        <Surface x={compact ? 72 : 380} y={compact ? y + 42 : y - 25} width={compact ? 184 : 186} height={54} radius={17} tone={accent ? "accent" : "surface"} />
        {accent ? <path d={`M${compact ? 94 : 402} ${compact ? y + 69 : y + 2} L${compact ? 108 : 416} ${compact ? y + 83 : y + 16} L${compact ? 132 : 440} ${compact ? y + 55 : y - 12}`} fill="none" stroke="var(--sur-em)" strokeWidth="3" strokeLinecap="round" /> : null}
        <Label x={compact ? 174 : 473} y={compact ? y + 69 : y + 2} text={row.p} kind="title" tone={accent ? "on-accent" : undefined} />
      </g>;
    })}
  </Motif>;
  return <Diagram id="preuve-au-bon-endroit" title="Chaque doute trouve sa preuve" says="La preuve reste à côté de la question qu'elle aide réellement à trancher." description="Sur une page, Mon cas mène à Exemple, Ton travail à Démo, et Pour moi à Conditions. Démo est mise en avant." wideHeight={290} compactHeight={480} wide={render(false)} compact={render(true)} />;
}
