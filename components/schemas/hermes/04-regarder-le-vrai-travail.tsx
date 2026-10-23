import { Diagram, Edge, Label } from "../primitives";
import { Document, Motif, Stroke, Surface, ToolLogo } from "./shared";

export function DiagnosticDiagram() {
  const labels = ["Travail réel", "Cause", "Plus petite aide"] as const;
  const render = (compact: boolean) => <>{labels.map((label, index) => {
    const x = compact ? 24 : 32 + index * 216;
    const y = compact ? 8 + index * 120 : 24;
    return <g key={label}>
      <Motif step={index}><Surface x={x} y={y} width={compact ? 280 : 184} height={88} radius={24} tone={index === 2 ? "accent" : "paper"} /><Label x={x + (compact ? 140 : 92)} y={y + 44} text={label} kind="title" tone={index === 2 ? "on-accent" : undefined} /></Motif>
      {index < 2 ? <Edge points={compact ? [[164, y + 88], [164, y + 120]] : [[x + 184, 68], [x + 216, 68]]} step={index} /> : null}
    </g>;
  })}</>;
  return <Diagram id="diagnostic-travail" title="Du travail réel à la plus petite aide" says="Tu retrouves la cause avant de choisir ce que l'agent doit faire." description="Trois étapes relient le travail réel, la cause et la plus petite aide." wideHeight={136} compactHeight={328} wide={render(false)} compact={render(true)} />;
}

export function FilmDuDernierDevisDiagram() {
  const labels = ["Demande", "Photos", "Mesure absente", "Question", "Devis"] as const;
  const render = (compact: boolean) => <>{labels.map((label, index) => {
    const x = compact ? 36 + (index % 2) * 144 : 8 + index * 136;
    const y = compact ? 16 + Math.floor(index / 2) * 136 : 24;
    return <Motif key={label} step={index}>
      <rect x={x} y={y} width={compact ? 112 : 120} height={104} rx="14" fill={index === 2 ? "var(--em)" : "var(--carte)"} />
      <circle cx={x - 5} cy={y + 22} r="5" fill="var(--fond)" /><circle cx={x - 5} cy={y + 52} r="5" fill="var(--fond)" /><circle cx={x - 5} cy={y + 82} r="5" fill="var(--fond)" />
      {index === 0 ? <ToolLogo name="WhatsApp" x={x + 36} y={y + 14} size={42} /> : null}
      {index === 1 ? <Document x={x + 38} y={y + 12} width={40} height={48} /> : null}
      {index === 2 ? <Stroke path={`M${x + 36} ${y + 28} H${x + 84} M${x + 60} ${y + 16} V${y + 48}`} /> : null}
      {index === 3 ? <ToolLogo name="Gmail" x={x + 36} y={y + 14} size={42} /> : null}
      {index === 4 ? <Document x={x + 38} y={y + 12} width={40} height={48} accent /> : null}
      <Label x={x + (compact ? 56 : 60)} y={y + 82} text={label} maxChars={13} kind="title" tone={index === 2 ? "on-accent" : undefined} />
    </Motif>;
  })}</>;
  return <Diagram id="film-dernier-devis" title="Le dossier rejoue le vrai film" says="Chaque image remet une attente visible à sa place dans le trajet du devis." description="Une pellicule montre demande, photos, mesure absente, question et devis. La mesure absente est mise en avant." wideHeight={152} compactHeight={392} wide={render(false)} compact={render(true)} />;
}

export function SymptomeTroisCausesDiagram() {
  const causes = ["Pièce", "Règle", "Responsable"] as const;
  const render = (compact: boolean) => <>
    <Motif><Surface x={compact ? 64 : 16} y={compact ? 8 : 72} width={compact ? 200 : 160} height={72} radius={36} tone="paper" /><circle cx={compact ? 96 : 50} cy={compact ? 44 : 108} r="9" fill="var(--err)" /><Label x={compact ? 124 : 76} y={compact ? 44 : 108} text="Réponse lente" anchor="start" kind="title" /></Motif>
    {causes.map((cause, index) => {
      const x = compact ? 40 + (index % 2) * 152 : 248 + index * 144;
      const y = compact ? 144 + Math.floor(index / 2) * 120 : 72;
      return <g key={cause}><Edge points={compact ? [[164, 80], [164, 112], [x + 56, 112], [x + 56, y]] : [[176, 108], [216, 108], [216, 40 + index * 34], [x + 56, 40 + index * 34], [x + 56, 72]]} accent step={index} /><Motif step={index + 1}><Surface x={x} y={y} width={112} height={72} radius={24} tone="paper" /><Label x={x + 56} y={y + 36} text={cause} kind="title" tone="accent" /></Motif></g>;
    })}
  </>;
  return <Diagram id="symptome-trois-causes" title="Un voyant, trois fils" says="La même lenteur peut venir d'une pièce, d'une règle ou d'un responsable." description="Le voyant Réponse lente se divise en trois fils vers Pièce, Règle et Responsable." wideHeight={216} compactHeight={336} wide={render(false)} compact={render(true)} />;
}
