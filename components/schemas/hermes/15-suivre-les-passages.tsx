import { Diagram, Edge, Label } from "../primitives";
import { Document, Motif, Person, Stroke, Surface, ToolLogo } from "./shared";
import { Panel } from "./chapter-shared";

export function RelaisDuDossierDiagram() {
  const runners = ["Marketing", "Vente", "Production", "Finance"] as const;
  const draw = (compact: boolean) => <>
    <Stroke path={compact ? "M72 24 V456" : "M24 176 H656"} soft />
    {runners.map((label, index) => {
      const x = compact ? 72 : 72 + index * 176;
      const y = compact ? 40 + index * 112 : 128;
      return <Motif key={label} step={index}>
        <Person x={x} y={y} accent={index === 3} />
        <Label x={compact ? 120 : x} y={compact ? y + 8 : 198} text={label} anchor={compact ? "start" : "middle"} kind="title" tone={index === 3 ? "accent" : undefined} />
        {index < 3 ? <g transform={`rotate(${compact ? 90 : 0} ${compact ? x : x + 64} ${compact ? y + 52 : y})`}><rect x={compact ? x - 28 : x + 40} y={compact ? y + 44 : y - 7} width="56" height="14" rx="7" fill="var(--em)" /></g> : null}
      </Motif>;
    })}
    <Label x={compact ? 164 : 340} y={compact ? 500 : 32} text="Le dossier est le témoin" kind="title" tone="accent" />
  </>;
  return <Diagram id="relais-dossier" title="Le dossier change de main" says="Les zones de passage sont visibles comme dans une course de relais." description="Marketing, Vente, Production et Finance se passent un dossier représenté comme un témoin émeraude." wideHeight={232} compactHeight={520} wide={draw(false)} compact={draw(true)} />;
}

export function PasseportDuDossierDiagram() {
  const stamps = ["Version", "Reçu par", "Accepté", "Refusé car"] as const;
  const draw = (compact: boolean) => <>
    <Motif><path d={compact ? "M24 16 H304 V424 H24 Z M164 16 V424" : "M72 16 H608 V320 H72 Z M340 16 V320"} fill="#262b28" stroke="rgba(241,245,242,.35)" strokeWidth="1.5" /><Stroke path={compact ? "M152 36 V404 M176 36 V404" : "M328 36 V300 M352 36 V300"} soft /></Motif>
    <Label x={compact ? 94 : 204} y={compact ? 52 : 54} text="PASSEPORT" kind="note" />
    <Document x={compact ? 56 : 152} y={compact ? 84 : 86} width={76} height={96} />
    {stamps.map((stamp, index) => {
      const x = compact ? (index < 2 ? 208 : 88) : (index < 2 ? 452 : 204);
      const y = compact ? 104 + (index % 2) * 96 + (index >= 2 ? 192 : 0) : 104 + (index % 2) * 104;
      return <Motif key={stamp} step={index}><g transform={`rotate(${index % 2 ? 3 : -3} ${x} ${y})`}><rect x={x - 68} y={y - 28} width="136" height="56" rx="14" fill="none" stroke={index === 3 ? "var(--em)" : "rgba(241,245,242,.55)"} strokeWidth="2" /><Label x={x} y={y} text={stamp} kind="title" tone={index === 3 ? "accent" : undefined} /></g></Motif>;
    })}
  </>;
  return <Diagram id="passeport-dossier" title="Le dossier voyage avec son passeport" says="Sa version, le destinataire et le motif de refus restent attachés au même objet." description="Un passeport ouvert porte quatre tampons : Version, Reçu par, Accepté et Refusé car." wideHeight={336} compactHeight={440} wide={draw(false)} compact={draw(true)} />;
}

export function CinqParcoursMetierDiagram() {
  const lines = [["Contenu", "Instagram"], ["Ads", "Meta Ads"], ["CRM", "Notion"], ["Support", "WhatsApp"], ["Devis", "Stripe"]] as const;
  const draw = (compact: boolean) => <>{lines.map(([label, tool], index) => {
    const y = 24 + index * (compact ? 84 : 48);
    const xEnd = compact ? 292 - index * 16 : 632 - index * 36;
    return <g key={label}>
      <Motif step={index}><ToolLogo name={tool} x={compact ? 12 : 16} y={y - 20} size={40} /><Label x={compact ? 62 : 70} y={y} text={label} anchor="start" kind="title" /><Stroke path={`M${compact ? 126 : 170} ${y} H${xEnd}`} soft /><circle cx={xEnd - 54} cy={y} r="14" fill="var(--em)" /><Person x={xEnd - 54} y={y - 4} accent /></Motif>
    </g>;
  })}</>;
  return <Diagram id="cinq-parcours-metier" title="Cinq lignes, cinq validations" says="Chaque workflow suit sa propre voie et rencontre une station humaine avant sa sortie." description="Un plan de métro présente Contenu, Ads, CRM, Support et Devis, avec une validation humaine sur chaque ligne." wideHeight={248} compactHeight={376} wide={draw(false)} compact={draw(true)} />;
}

export function RefusQuiAideDiagram() {
  const draw = (compact: boolean) => <>
    <Motif><g transform={compact ? "translate(164 76) rotate(-4)" : "translate(160 136) rotate(-4)"}><rect x="-112" y="-44" width="224" height="88" rx="18" fill="none" stroke="rgba(241,245,242,.58)" strokeWidth="3" /><Label x={0} y={0} text="REFUSÉ" kind="title" /></g></Motif>
    <Edge points={compact ? [[164, 128], [164, 176]] : [[272, 136], [336, 136]]} accent />
    {["Ce qui manque", "Qui corrige", "Où reprendre"].map((label, index) => {
      const x = compact ? 24 : 336 + index * 112;
      const y = compact ? 176 + index * 96 : 92;
      return <Panel key={label} x={x} y={y} width={compact ? 280 : 104} height={72} radius={20} accent={index === 2} step={index + 1}><Label x={x + (compact ? 140 : 52)} y={y + 36} text={label} kind="title" maxChars={compact ? 24 : 10} tone={index === 2 ? "on-accent" : undefined} /></Panel>;
    })}
  </>;
  return <Diagram id="refus-qui-aide" title="Un refus ouvre la reprise" says="Le tampon n'arrête pas le dossier. Il révèle le manque, le responsable et le point de retour." description="Un tampon Refusé ouvre trois cartes : Ce qui manque, Qui corrige et Où reprendre." wideHeight={256} compactHeight={464} wide={draw(false)} compact={draw(true)} />;
}
