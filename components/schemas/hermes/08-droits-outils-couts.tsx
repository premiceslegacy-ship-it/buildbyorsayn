import { Diagram, Edge, Label } from "../primitives";
import { Hand, Motif, Stroke, Surface, ToolLogo } from "./shared";

export function AuthorityLayersDiagram() {
  const labels = ["Consigne", "Réglage", "Test du refus"] as const;
  const render = (compact: boolean) => <>{labels.map((label, index) => {
    const x = compact ? 24 + index * 16 : 32 + index * 216;
    const y = compact ? 8 + index * 104 : 24;
    return <Motif key={label} step={index}><Surface x={x} y={y} width={compact ? 248 : 184} height={88} radius={24} tone={index === 1 ? "accent" : "paper"} /><Label x={x + (compact ? 124 : 92)} y={y + 44} text={label} kind="title" tone={index === 1 ? "on-accent" : undefined} /></Motif>;
  })}</>;
  return <Diagram id="autorite-trois-couches" title="Écrire, bloquer, tester" says="La phrase guide, le réglage bloque et le test vérifie que le refus tient." description="Trois couches distinguent Consigne, Réglage et Test du refus. Réglage est mis en avant." wideHeight={136} compactHeight={312} wide={render(false)} compact={render(true)} />;
}

export function TrousseauMinimalDiagram() {
  const doors = [["Support", "Gmail"], ["Paiement", "Stripe"], ["Code", "GitHub"], ["Messagerie", "Telegram"]] as const;
  const render = (compact: boolean) => <>
    <Motif><circle cx={compact ? 164 : 72} cy={compact ? 48 : 120} r="26" fill="none" stroke="var(--em)" strokeWidth="8" /><Stroke path={compact ? "M164 74 V112 H224 V96" : "M98 120 H192 V104 H216"} accent /></Motif>
    {doors.map(([label, tool], index) => {
      const x = compact ? 24 + (index % 2) * 152 : 232 + index * 108;
      const y = compact ? 128 + Math.floor(index / 2) * 144 : 40;
      return <Motif key={label} step={index + 1}><Surface x={x} y={y} width={compact ? 128 : 96} height={120} radius={18} tone={index === 0 ? "accent" : "paper"} /><ToolLogo name={tool} x={x + (compact ? 44 : 28)} y={y + 18} size={40} /><circle cx={x + (compact ? 64 : 48)} cy={y + 76} r="5" fill={index === 0 ? "var(--sur-em)" : "var(--t3)"} /><Label x={x + (compact ? 64 : 48)} y={y + 100} text={label} kind="title" tone={index === 0 ? "on-accent" : undefined} /></Motif>;
    })}
  </>;
  return <Diagram id="trousseau-minimal" title="Une clé, une seule porte" says="La clé du support n'ouvre ni les paiements, ni le code, ni toute la messagerie." description="Un trousseau avec une clé active fait face à quatre portes : Support, Paiement, Code et Messagerie." wideHeight={200} compactHeight={408} wide={render(false)} compact={render(true)} />;
}

export function MainAvantLeMondeExterieurDiagram() {
  const labels = ["Chercher", "Préparer", "Tu valides", "Envoyer"] as const;
  const tools = ["Hermes Agent", "Hermes Agent", "Hermes Agent", "Gmail"] as const;
  const render = (compact: boolean) => <>{labels.map((label, index) => {
    const x = compact ? 24 : 8 + index * 168;
    const y = compact ? 8 + index * 112 : 24;
    return <g key={label}><Motif step={index}><Surface x={x} y={y} width={compact ? 280 : 152} height={80} radius={22} tone={index === 2 ? "accent" : "paper"} />{index === 2 ? <Hand x={x + 24} y={y + 12} scale={.7} onAccent /> : <ToolLogo name={tools[index]} x={x + 18} y={y + 18} size={42} />}<Label x={x + (compact ? 88 : 76)} y={y + 40} text={label} anchor={compact ? "start" : "middle"} kind="title" tone={index === 2 ? "on-accent" : undefined} /></Motif>{index < 3 ? <Edge points={compact ? [[164, y + 80], [164, y + 112]] : [[x + 152, 64], [x + 168, 64]]} accent={index === 1} step={index} /> : null}</g>;
  })}</>;
  return <Diagram id="main-avant-exterieur" title="La barrière est juste avant le monde extérieur" says="L'agent peut chercher et préparer. Ta main ouvre la barrière avant l'envoi." description="Une chaîne de production relie Chercher, Préparer, Tu valides et Envoyer. La validation est en émeraude." wideHeight={128} compactHeight={416} wide={render(false)} compact={render(true)} />;
}

export function CompteurDeMissionDiagram() {
  const segments = [["Modèle", "Hermes Agent"], ["Recherche", "Perplexity"], ["Outils", "Treg"], ["Sous-tâches", "Hermes Agent"]] as const;
  const render = (compact: boolean) => {
    const cx = compact ? 164 : 340;
    const cy = compact ? 152 : 136;
    const r = compact ? 100 : 112;
    const paths = [
      `M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx + r} ${cy}`,
      `M${cx + r} ${cy} A${r} ${r} 0 0 1 ${cx} ${cy + r}`,
      `M${cx} ${cy + r} A${r} ${r} 0 0 1 ${cx - r} ${cy}`,
      `M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx} ${cy - r}`,
    ];
    return <>{segments.map(([label, tool], index) => <Motif key={label} step={index}><path d={paths[index]} fill="none" stroke={index === 3 ? "var(--em)" : "var(--t3)"} strokeWidth="18" strokeLinecap="round" /><ToolLogo name={tool} x={compact ? (index % 2 ? 264 : 24) : (index % 2 ? 520 : 112)} y={compact ? (index < 2 ? 16 : 256) : (index < 2 ? 32 : 200)} size={36} /><Label x={compact ? (index % 2 ? 282 : 42) : (index % 2 ? 538 : 130)} y={compact ? (index < 2 ? 72 : 312) : (index < 2 ? 84 : 252)} text={label} maxChars={12} /></Motif>)}<Motif step={4}><Label x={cx} y={cy - 8} text="TOTAL" kind="note" /><Label x={cx} y={cy + 24} text="Mission" kind="title" tone="accent" /></Motif></>;
  };
  return <Diagram id="compteur-mission" title="Le total vit au centre" says="Le modèle, la recherche, les outils et les sous-tâches remplissent le même compteur." description="Un compteur circulaire additionne Modèle, Recherche, Outils et Sous-tâches autour du total de la mission." wideHeight={280} compactHeight={336} wide={render(false)} compact={render(true)} />;
}
