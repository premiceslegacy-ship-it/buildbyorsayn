import { Diagram, FixedLine, Label } from "../primitives";
import { Document, Folder, Motif, Surface, ToolLogo } from "./shared";

export function WorkshopDiagram() {
  const files = ["Mission", "Outils", "Tests", "Arrêt", "Reprise"] as const;
  const render = (compact: boolean) => <>
    <Motif><Folder x={compact ? 40 : 224} y={compact ? 8 : 24} width={compact ? 248 : 232} height={compact ? 344 : 184} accent /></Motif>
    {files.map((file, index) => {
      const x = compact ? 64 + (index % 2) * 112 : 32 + index * 128;
      const y = compact ? 64 + Math.floor(index / 2) * 88 : 80;
      return <Motif key={file} step={index + 1}><Document x={x} y={y} width={compact ? 88 : 104} height={64} /><Label x={x + (compact ? 44 : 52)} y={y + 84} text={file} kind="title" /></Motif>;
    })}
  </>;
  return <Diagram id="atelier-pilote" title="Cinq fiches dans le même dossier" says="La mission, les outils, les tests, l'arrêt et la reprise restent ensemble." description="Un dossier ouvert contient cinq fiches nommées Mission, Outils, Tests, Arrêt et Reprise." wideHeight={232} compactHeight={400} wide={render(false)} compact={render(true)} />;
}

export function FicheMissionRemplieMockup() {
  const fields = ["Problème", "Résultat", "Responsable", "Sources", "Interdits", "Validation", "Preuve", "Arrêt"] as const;
  const render = (compact: boolean) => <>
    <Motif><Surface x={compact ? 16 : 112} y={8} width={compact ? 296 : 456} height={compact ? 480 : 344} radius={12} tone="paper" /><Label x={compact ? 40 : 144} y={42} text="Fiche de mission" anchor="start" kind="title" />{fields.map((field, index) => {
      const x = compact ? 40 : 144 + (index % 2) * 208;
      const y = compact ? 82 + index * 44 : 86 + Math.floor(index / 2) * 58;
      return <g key={field}><Label x={x} y={y} text={field} anchor="start" /><FixedLine path={`M${x + 92} ${y} H${x + (compact ? 248 : 184)}`} /></g>;
    })}<Label x={compact ? 40 : 144} y={compact ? 446 : 320} text="Responsable du prix : inconnu" anchor="start" tone="accent" /></Motif>
    <Motif step={1}><g transform={compact ? "translate(184 36) rotate(7)" : "translate(456 40) rotate(7)"}><Surface x={0} y={0} width={112} height={48} radius={12} tone="accent" /><Label x={56} y={24} text="PAS PRÊT" kind="title" tone="on-accent" /></g><Label x={compact ? 164 : 340} y={compact ? 520 : 384} text="1 Ce qui sort   2 Qui décide   3 Ce qui bloque" maxChars={compact ? 28 : 64} kind="note" /><Label x={compact ? 164 : 340} y={compact ? 566 : 412} text="Départ bloqué" kind="title" tone="accent" /></Motif>
  </>;
  return <Diagram id="fiche-mission-remplie" title="Un manque visible bloque le départ" says="La fiche reste honnête : responsable inconnu, donc pilote éteint." description="Une feuille A4 comporte huit champs et un tampon PAS PRÊT près de Responsable du prix : inconnu." wideHeight={432} compactHeight={584} wide={render(false)} compact={render(true)} />;
}

export function TroisPortesDuPiloteDiagram() {
  const doors = [["Lire les devis-test", "Gmail"], ["Écrire le brouillon", "Notion"], ["Demander l'accord", "Telegram"]] as const;
  const render = (compact: boolean) => <>{doors.map(([label, tool], index) => {
    const x = compact ? 24 : 32 + index * 216;
    const y = compact ? 8 + index * 152 : 24;
    return <Motif key={label} step={index}><Surface x={x} y={y} width={compact ? 280 : 184} height={120} radius={18} tone={index === 2 ? "accent" : "paper"} /><ToolLogo name={tool} x={x + (compact ? 214 : 122)} y={y + 16} size={44} /><circle cx={x + 28} cy={y + 60} r="5" fill={index === 2 ? "var(--sur-em)" : "var(--t3)"} /><Label x={x + (compact ? 140 : 92)} y={y + 92} text={label} maxChars={compact ? 26 : 18} kind="title" tone={index === 2 ? "on-accent" : undefined} /></Motif>;
  })}</>;
  return <Diagram id="trois-portes-pilote" title="Trois portes, trois droits" says="Chaque connexion annonce l'opération exacte qu'elle autorise sur une cible précise." description="Trois portes portent les plaques Lire les devis-test, Écrire le brouillon et Demander l'accord." wideHeight={168} compactHeight={424} wide={render(false)} compact={render(true)} />;
}

export function QuatreCartesQuiCassentDiagram() {
  const cards = ["Pièce absente", "Doublon", "Contradiction", "Faux ordre"] as const;
  const render = (compact: boolean) => <>{cards.map((label, index) => {
    const x = compact ? 44 + (index % 2) * 128 : 32 + index * 160;
    const y = compact ? 16 + Math.floor(index / 2) * 184 : 24 + index * 10;
    return <Motif key={label} step={index}><g transform={`rotate(${index % 2 ? 3 : -3} ${x + 56} ${y + 72})`}><Surface x={x} y={y} width={compact ? 112 : 136} height={152} radius={18} tone={label === "Faux ordre" ? "accent" : "paper"} /><Label x={x + (compact ? 56 : 68)} y={y + 76} text={label} maxChars={12} kind="title" tone={label === "Faux ordre" ? "on-accent" : undefined} /></g></Motif>;
  })}</>;
  return <Diagram id="quatre-cartes-cassent" title="Retourne les cartes difficiles" says="Le pilote doit tenir face au manque, au doublon, à la contradiction et au faux ordre." description="Quatre cartes à jouer montrent Pièce absente, Doublon, Contradiction et Faux ordre." wideHeight={216} compactHeight={368} wide={render(false)} compact={render(true)} />;
}
