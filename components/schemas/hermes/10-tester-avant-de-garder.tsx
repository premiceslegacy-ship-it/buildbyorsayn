import { Diagram, Edge, FixedLine, Label } from "../primitives";
import { Document, Motif, Stroke, Surface, ToolLogo } from "./shared";

export function ProofLayersDiagram() {
  const labels = ["Règles", "Test", "Résultat", "Accord", "Effet"] as const;
  const render = (compact: boolean) => <>{labels.map((label, index) => {
    const width = compact ? 280 - index * 24 : 584 - index * 88;
    const x = compact ? 24 + index * 12 : 48 + index * 44;
    const y = compact ? 8 + index * 88 : 16 + index * 52;
    return <Motif key={label} step={index}><Surface x={x} y={y} width={width} height={64} radius={20} tone={index === 4 ? "accent" : "paper"} /><Label x={x + width / 2} y={y + 32} text={label} kind="title" tone={index === 4 ? "on-accent" : undefined} /></Motif>;
  })}</>;
  return <Diagram id="preuves-cinq-regards" title="Cinq regards sur le même résultat" says="Les règles, le test, le résultat, l'accord et l'effet répondent à cinq questions différentes." description="Cinq niveaux imbriqués sont nommés Règles, Test, Résultat, Accord et Effet." wideHeight={280} compactHeight={416} wide={render(false)} compact={render(true)} />;
}

export function DeuxCouloirsMemeTestDiagram() {
  const cases = [1, 2, 3, 4, 5] as const;
  const render = (compact: boolean) => <>
    <Motif><Label x={compact ? 16 : 16} y={compact ? 28 : 40} text="Méthode BUILD" anchor="start" kind="title" /><Label x={compact ? 16 : 16} y={compact ? 236 : 152} text="Consigne naïve" anchor="start" kind="title" /><Label x={compact ? 164 : 604} y={compact ? 444 : 96} text="Mêmes cinq cas" tone="accent" kind="title" /></Motif>
    {[0, 1].map((lane) => <g key={lane}><Stroke path={compact ? `M24 ${64 + lane * 208} H304` : `M168 ${56 + lane * 112} H632`} accent={lane === 0} />{cases.map((value, index) => {
      const x = compact ? 40 + index * 56 : 184 + index * 88;
      const y = compact ? 48 + lane * 208 : 40 + lane * 112;
      return <Motif key={`${lane}-${value}`} step={index}><Surface x={x} y={y} width={compact ? 40 : 56} height={48} radius={14} tone={lane === 0 && index === 4 ? "accent" : "paper"} /><Label x={x + (compact ? 20 : 28)} y={y + 24} text={String(value)} kind="title" tone={lane === 0 && index === 4 ? "on-accent" : undefined} /></Motif>;
    })}</g>)}
  </>;
  return <Diagram id="deux-couloirs-test" title="Deux méthodes, les mêmes obstacles" says="Les cinq cartes restent identiques pour comparer la méthode et non la chance." description="Deux pistes parallèles nommées Méthode BUILD et Consigne naïve reçoivent les mêmes cinq cas." wideHeight={208} compactHeight={464} wide={render(false)} compact={render(true)} />;
}

export function TableauDeTestSkillMockup() {
  const rows = ["Cas 1", "Cas 2", "Cas 3", "Cas limite", "Faux ordre"] as const;
  const render = (compact: boolean) => <>
    <Motif><Surface x={compact ? 8 : 16} y={8} width={compact ? 312 : 648} height={compact ? 432 : 312} radius={22} tone="paper" /><ToolLogo name="Notion" x={compact ? 260 : 604} y={20} size={36} /><ToolLogo name="Hermes Agent" x={compact ? 220 : 560} y={20} size={36} /><Label x={compact ? 24 : 32} y={40} text="Tests du skill" anchor="start" kind="title" />
      {compact ? <><Label x={24} y={76} text="Cas" anchor="start" kind="note" /><Label x={264} y={76} text="Total" anchor="end" kind="note" /></> : ["Cas", "Exactitude", "Format", "Utilité", "Dérive", "Total"].map((label, index) => <Label key={label} x={32 + index * 112} y={76} text={label} anchor="start" kind="note" />)}
      {rows.map((row, index) => {
        const y = 112 + index * (compact ? 60 : 40);
        return <g key={row}><FixedLine path={`M${compact ? 24 : 32} ${y - 20} H${compact ? 296 : 648}`} /><Label x={compact ? 24 : 32} y={y} text={row} anchor="start" tone={row === "Faux ordre" ? "accent" : undefined} />{compact ? <Label x={264} y={y} text={index > 2 ? "À corriger" : "8/8"} anchor="end" tone={index > 2 ? "accent" : undefined} /> : [2, 2, index > 2 ? 1 : 2, index === 4 ? 0 : 2, index > 2 ? "À corriger" : "8/8"].map((score, cell) => <Label key={cell} x={144 + cell * 112} y={y} text={String(score)} anchor="start" tone={cell === 4 && index > 2 ? "accent" : undefined} />)}</g>;
      })}
    </Motif>
    <Motif step={2}><Label x={compact ? 24 : 32} y={compact ? 472 : 352} text="1 Même entrée   2 Quatre notes   3 Décision" anchor="start" kind="note" /></Motif>
  </>;
  return <Diagram id="tableau-test-skill" title="La comparaison tient dans un tableau" says="Cinq lignes, quatre notes et une décision rendent les défauts visibles en un regard." description="Une interface Notion compare cinq cas sur exactitude, format, utilité, dérive et total." wideHeight={368} compactHeight={488} wide={render(false)} compact={render(true)} />;
}

export function ErreurVersNouveauTestDiagram() {
  const labels = ["Erreur", "Cause", "Correction", "Nouveau test"] as const;
  const render = (compact: boolean) => <>{labels.map((label, index) => {
    const x = compact ? 24 : 8 + index * 168;
    const y = compact ? 8 + index * 112 : 24;
    return <g key={label}><Motif step={index}><Surface x={x} y={y} width={compact ? 280 : 152} height={80} radius={index === 0 ? 8 : 22} tone={index === 3 ? "accent" : "paper"} />{index === 0 ? <Stroke path={`M${x + 76} ${y + 8} L${x + 62} ${y + 34} L${x + 82} ${y + 48} L${x + 70} ${y + 72}`} /> : index === 3 ? <Document x={x + 18} y={y + 14} width={42} height={52} /> : null}<Label x={x + (compact ? 140 : 94)} y={y + 40} text={label} anchor="middle" kind="title" tone={index === 3 ? "on-accent" : undefined} /></Motif>{index < 3 ? <Edge points={compact ? [[164, y + 80], [164, y + 112]] : [[x + 152, 64], [x + 168, 64]]} step={index} /> : null}</g>;
  })}</>;
  return <Diagram id="erreur-nouveau-test" title="La fissure rejoint la pile" says="Chaque erreur comprise devient un cas qui protège la version suivante." description="Une fissure passe par Erreur, Cause et Correction puis devient une carte Nouveau test." wideHeight={128} compactHeight={416} wide={render(false)} compact={render(true)} />;
}
