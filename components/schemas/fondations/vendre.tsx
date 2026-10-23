import { Diagram, Edge, Label } from "../primitives";
import { Document, Motif, Person, Stroke, Surface } from "./shared";

export function MedecinAvantOrdonnanceDiagram() {
  const render = (compact: boolean) => {
    const left = compact ? { x: 24, y: 8, w: 280, h: 190 } : { x: 16, y: 8, w: 300, h: 224 };
    const right = compact ? { x: 24, y: 230, w: 280, h: 282 } : { x: 364, y: 8, w: 300, h: 224 };
    return <>
      <Motif>
        <Surface x={left.x} y={left.y} width={left.w} height={left.h} radius={28} tone="paper" />
        <Person x={left.x + 56} y={left.y + 72} />
        <Document x={left.x + 104} y={left.y + 36} width={left.w - 130} height={112} />
        <Label x={left.x + left.w / 2} y={left.y + left.h - 24} text="Trop tôt" kind="title" />
        <path d={`M${left.x + 30} ${left.y + 30} L${left.x + left.w - 30} ${left.y + left.h - 52}`} stroke="rgba(241,245,242,.3)" strokeWidth="10" strokeLinecap="round" />
      </Motif>
      <Motif step={1}>
        <Surface x={right.x} y={right.y} width={right.w} height={right.h} radius={28} tone="paper" />
        <Person x={right.x + 54} y={right.y + 72} /><Person x={right.x + right.w - 54} y={right.y + 72} />
        <path d={`M${right.x + 86} ${right.y + 48} H${right.x + right.w - 86} V${right.y + 92} H${right.x + 150} L${right.x + 132} ${right.y + 108} V${right.y + 92} H${right.x + 86} Z`} fill="rgba(241,245,242,.06)" stroke="rgba(241,245,242,.42)" />
        <Document x={right.x + right.w / 2 - 36} y={right.y + 116} width={72} height={70} />
        <Label x={right.x + 54} y={right.y + right.h - 24} text="Questions" kind="title" />
        <Label x={right.x + right.w / 2} y={right.y + right.h - 24} text="Écoute" kind="title" tone="accent" />
        <Label x={right.x + right.w - 54} y={right.y + right.h - 24} text="Proposition" kind="title" />
      </Motif>
    </>;
  };
  return <Diagram id="medecin-avant-ordonnance" title="L'ordonnance vient après" says="La proposition arrive seulement après les questions et l'écoute." description="À gauche, une ordonnance est tendue trop tôt. À droite, Questions puis Écoute conduisent à une Proposition fermée." wideHeight={240} compactHeight={520} wide={render(false)} compact={render(true)} />;
}

export function QuatreQuestionsDeVenteDiagram() {
  const labels = ["Dernière fois", "Aujourd'hui", "Coût réel", "Pour changer"] as const;
  const render = (compact: boolean) => {
    const lampX = compact ? 164 : 74;
    const lampY = compact ? 26 : 54;
    return <>
      <Motif>
        <path d={`M${lampX - 34} ${lampY} Q${lampX} ${lampY - 32} ${lampX + 34} ${lampY} L${lampX + 24} ${lampY + 28} H${lampX - 24} Z`} fill="#2a2f2c" stroke="rgba(241,245,242,.28)" />
        <rect x={lampX - 5} y={lampY - 52} width="10" height="24" rx="5" fill="rgba(241,245,242,.62)" />
        <path d={compact ? `M${lampX - 24} ${lampY + 28} L24 430 H304 L${lampX + 24} ${lampY + 28} Z` : `M${lampX - 24} ${lampY + 28} L220 212 H664 L${lampX + 24} ${lampY + 28} Z`} fill="rgba(0,229,137,.055)" />
      </Motif>
      {labels.map((label, index) => {
        const x = compact ? 38 : 176 + index * 124;
        const y = compact ? 114 + index * 92 : 104;
        const accent = index === 0;
        return <Motif key={label} step={index + 1}>
          <Surface x={x} y={y} width={compact ? 252 : 112} height={72} radius={20} tone={accent ? "accent" : "paper"} />
          {index === 0 ? <path d={`M${x + 22} ${y + 46} H${x + 50} V${y + 26} H${x + 78}`} fill="none" stroke={accent ? "var(--sur-em)" : "currentColor"} strokeWidth="3" /> : null}
          {index === 1 ? <circle cx={x + (compact ? 40 : 56)} cy={y + 28} r="13" fill="none" stroke="rgba(241,245,242,.66)" strokeWidth="2" /> : null}
          {index === 2 ? <path d={`M${x + 30} ${y + 22} H${x + 82} M${x + 30} ${y + 36} H${x + 70} M${x + 30} ${y + 50} H${x + 58}`} stroke="rgba(241,245,242,.66)" strokeWidth="3" strokeLinecap="round" /> : null}
          {index === 3 ? <path d={`M${x + 30} ${y + 50} L${x + 56} ${y + 24} L${x + 82} ${y + 50}`} fill="none" stroke="rgba(241,245,242,.66)" strokeWidth="3" /> : null}
          <Label x={compact ? x + 78 : x + 56} y={compact ? y + 36 : y + 102} text={label} anchor={compact ? "start" : "middle"} kind={accent ? "title" : "text"} tone={accent ? (compact ? "on-accent" : "accent") : undefined} />
        </Motif>;
      })}
      <Motif><Stroke path={compact ? "M24 438 H304" : "M154 212 H664"} soft /></Motif>
    </>;
  };
  return <Diagram id="quatre-questions-de-vente" title="Éclaire le dernier épisode" says="Quatre questions font sortir la conversation des opinions pour revenir aux faits." description="Une lampe éclaire quatre objets nommés Dernière fois, Aujourd'hui, Coût réel et Pour changer." wideHeight={232} compactHeight={452} wide={render(false)} compact={render(true)} />;
}

export function CheminDeVenteDiagram() {
  const labels = ["Comprendre", "Reformuler", "Relier", "Proposer", "Vérifier"] as const;
  const wide = <>
    <Motif><Stroke path="M52 102 C132 42 194 166 278 102 S430 42 514 102 S610 56 654 102" soft /></Motif>
    {labels.map((label, index) => {
      const x = 56 + index * 142;
      const y = index % 2 ? 70 : 116;
      const accent = index === 1;
      return <Motif key={label} step={index}><Surface x={x - 52} y={y - 42} width={104} height={84} radius={30} tone={accent ? "accent" : "paper"} /><Label x={x} y={y} text={label} kind="title" tone={accent ? "on-accent" : undefined} /><path d={`M${x - 28} ${y + 54} C${x - 28} ${y + 84} ${x + 28} ${y + 84} ${x + 28} ${y + 54}`} fill="none" stroke={accent ? "var(--em)" : "rgba(241,245,242,.3)"} strokeWidth="2" /><path d={`M${x + 20} ${y + 58} L${x + 30} ${y + 52} L${x + 32} ${y + 64}`} fill="none" stroke={accent ? "var(--em)" : "rgba(241,245,242,.3)"} strokeWidth="2" /></Motif>;
    })}
  </>;
  const compact = <>
    <Motif><Stroke path="M76 50 C242 88 82 146 248 182 S82 246 248 282 S82 346 248 386" soft /></Motif>
    {labels.map((label, index) => {
      const x = index % 2 ? 240 : 88;
      const y = 52 + index * 86;
      const accent = index === 1;
      return <Motif key={label} step={index}><Surface x={x - 54} y={y - 34} width={108} height={68} radius={24} tone={accent ? "accent" : "paper"} /><Label x={index % 2 ? x - 70 : x + 70} y={y} text={label} anchor={index % 2 ? "end" : "start"} kind="title" tone={accent ? "accent" : undefined} /><path d={`M${x - 24} ${y + 42} C${x - 24} ${y + 62} ${x + 24} ${y + 62} ${x + 24} ${y + 42}`} fill="none" stroke={accent ? "var(--em)" : "rgba(241,245,242,.3)"} strokeWidth="2" /></Motif>;
    })}
  </>;
  return <Diagram id="chemin-de-vente" title="Chaque pierre prépare la suivante" says="À chaque étape, tu peux revenir poser une question avant d'avancer." description="Un chemin de cinq pierres va de Comprendre à Vérifier. Chaque pierre a une boucle de retour et Reformuler est mise en avant." wideHeight={220} compactHeight={430} wide={wide} compact={compact} />;
}

export function OffreFacileAChoisirDiagram() {
  const render = (compact: boolean) => {
    const cx = compact ? 164 : 340;
    const topY = compact ? 34 : 20;
    const boxW = compact ? 252 : 440;
    const left = cx - boxW / 2;
    const boxH = compact ? 360 : 220;
    return <Motif>
      <path d={`M${left} ${topY + 64} L${cx} ${topY} L${left + boxW} ${topY + 64} V${topY + boxH - 40} L${cx} ${topY + boxH} L${left} ${topY + boxH - 40} Z`} fill="rgba(241,245,242,.035)" stroke="rgba(241,245,242,.38)" strokeWidth="2" />
      <path d={`M${cx} ${topY} V${topY + boxH} M${left} ${topY + 64} L${cx} ${topY + 118} L${left + boxW} ${topY + 64} M${cx} ${topY + 118} V${topY + boxH}`} fill="none" stroke="rgba(241,245,242,.25)" strokeWidth="1.5" />
      <Surface x={left + 18} y={topY + 82} width={compact ? 106 : 184} height={compact ? 92 : 104} radius={18} tone="accent" /><Label x={left + 18 + (compact ? 53 : 92)} y={topY + (compact ? 128 : 134)} text="Changement" kind="title" tone="on-accent" />
      <Surface x={cx + 14} y={topY + 82} width={compact ? 106 : 184} height={compact ? 92 : 104} radius={18} tone="paper" /><Label x={cx + 14 + (compact ? 53 : 92)} y={topY + (compact ? 128 : 134)} text="Chemin" kind="title" />
      <Surface x={left + 18} y={topY + (compact ? 214 : 196)} width={compact ? 106 : 184} height={compact ? 92 : 70} radius={18} tone="paper" /><Label x={left + 18 + (compact ? 53 : 92)} y={topY + (compact ? 260 : 231)} text="Ton effort" kind="title" />
      <Surface x={cx + 14} y={topY + (compact ? 214 : 196)} width={compact ? 106 : 184} height={compact ? 92 : 70} radius={18} tone="paper" /><Label x={cx + 14 + (compact ? 53 : 92)} y={topY + (compact ? 260 : 231)} text="Limite" kind="title" />
    </Motif>;
  };
  return <Diagram id="offre-facile-a-choisir" title="Une offre ouverte montre ses quatre faces" says="La personne voit ce qui change, le chemin, son effort et la limite avant de choisir." description="Une boîte transparente ouverte révèle quatre faces : Changement, Chemin, Ton effort et Limite." wideHeight={306} compactHeight={420} wide={render(false)} compact={render(true)} />;
}

export function ObjectionQuestionCacheeDiagram() {
  const questions = ["Valeur ?", "Comparaison ?", "Priorité ?"] as const;
  const render = (compact: boolean) => <>
    <Motif><Surface x={compact ? 48 : 16} y={compact ? 8 : 58} width={compact ? 232 : 168} height={88} radius={38} tone="paper" /><Label x={compact ? 164 : 100} y={compact ? 52 : 102} text="Trop cher" kind="title" /><path d={compact ? "M226 82 L260 112 L214 94" : "M150 126 L184 154 L138 138"} fill="#202522" /></Motif>
    <Edge points={compact ? [[164, 112], [164, 146]] : [[184, 102], [228, 102]]} accent step={0} />
    <Motif step={1}>
      {questions.map((question, index) => {
        const x = compact ? 34 : 228 + index * 136;
        const y = compact ? 146 + index * 88 : 66;
        return <g key={question}><Surface x={x} y={y} width={compact ? 260 : 120} height={64} radius={20} tone="paper" /><Label x={x + (compact ? 130 : 60)} y={y + 32} text={question} kind="title" /></g>;
      })}
    </Motif>
    <Edge points={compact ? [[164, 386], [164, 426]] : [[636, 102], [664, 102]]} accent step={4} />
    <Motif step={5}><Surface x={compact ? 24 : 420} y={compact ? 426 : 150} width={compact ? 280 : 244} height={78} radius={26} tone="accent" /><Label x={compact ? 164 : 542} y={compact ? 465 : 189} text="Tu compares avec quoi ?" kind="title" tone="on-accent" /></Motif>
  </>;
  return <Diagram id="objection-question-cachee" title="Déplie l'objection" says="Une objection n'appelle pas une réponse automatique, mais la bonne question." description="La bulle Trop cher se déplie en Valeur, Comparaison et Priorité, puis mène à la question Tu compares avec quoi ?" wideHeight={236} compactHeight={512} wide={render(false)} compact={render(true)} />;
}
