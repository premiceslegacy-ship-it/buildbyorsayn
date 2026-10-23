import { Diagram, Edge, Label } from "../primitives";
import { Document, Folder, Motif, Stroke, Surface, ToolLogo } from "./shared";

export function TransmissionDiagram() {
  const labels = ["Cas réel", "Ce qui a marché", "Méthode", "Prochain projet"] as const;
  const render = (compact: boolean) => <>{labels.map((label, index) => {
    const x = compact ? 24 : 8 + index * 168;
    const y = compact ? 8 + index * 120 : 24;
    return <g key={label}><Motif step={index}><Surface x={x} y={y} width={compact ? 280 : 152} height={88} radius={22} tone={index === 3 ? "accent" : "paper"} />{index === 0 || index === 2 ? <Document x={x + 16} y={y + 16} width={40} height={52} accent={index === 2} /> : null}<Label x={x + (compact ? 84 : 76)} y={y + 44} text={label} maxChars={compact ? 24 : 14} anchor={compact ? "start" : "middle"} kind="title" tone={index === 3 ? "on-accent" : undefined} /></Motif>{index < 3 ? <Edge points={compact ? [[164, y + 88], [164, y + 120]] : [[x + 152, 68], [x + 168, 68]]} accent={index === 2} step={index} /> : null}</g>;
  })}</>;
  return <Diagram id="transmission-methode" title="Le cas devient une méthode" says="Tu extrais ce qui a marché puis tu l'emportes vers le prochain projet." description="Quatre étapes relient Cas réel, Ce qui a marché, Méthode et Prochain projet." wideHeight={136} compactHeight={448} wide={render(false)} compact={render(true)} />;
}

export function ValiseClientBoiteMethodeDiagram() {
  const render = (compact: boolean) => <>
    <Motif><Surface x={compact ? 32 : 40} y={compact ? 8 : 40} width={compact ? 264 : 256} height={176} radius={28} tone="paper" /><Stroke path={compact ? "M116 8 Q116 -8 164 -8 Q212 -8 212 8" : "M120 40 Q120 8 168 8 Q216 8 216 40"} /><Label x={compact ? 164 : 168} y={compact ? 48 : 80} text="Valise client" kind="title" />{["Contacts", "Prix", "Documents"].map((label, index) => <Label key={label} x={compact ? 64 : 72} y={(compact ? 88 : 120) + index * 28} text={label} anchor="start" />)}</Motif>
    <Motif step={1}><Surface x={compact ? 32 : 384} y={compact ? 224 : 40} width={compact ? 264 : 256} height={176} radius={28} tone="paper" /><Folder x={compact ? 56 : 408} y={compact ? 248 : 64} width={72} height={60} accent /><Label x={compact ? 164 : 512} y={compact ? 328 : 144} text="Boîte méthode" kind="title" />{["Questions", "Contrôles"].map((label, index) => <Label key={label} x={compact ? 64 : 416} y={(compact ? 360 : 176) + index * 28} text={label} anchor="start" tone={label === "Contrôles" ? "accent" : undefined} />)}</Motif>
    <Stroke path={compact ? "M24 204 H304" : "M340 24 V216"} dashed />
  </>;
  return <Diagram id="valise-client-boite-methode" title="Deux contenants, aucune fuite" says="Les données restent dans la valise du client. Les questions et contrôles rejoignent la méthode." description="Une valise client contient Contacts, Prix et Documents. Une boîte méthode contient Questions et Contrôles." wideHeight={232} compactHeight={416} wide={render(false)} compact={render(true)} />;
}

export function CinqTiroirsDuSavoirDiagram() {
  const drawers = [["Toi", "Hermes Agent"], ["Mémoire", "Hermes Agent"], ["Projet", "Obsidian"], ["Skill", "Hermes Agent"], ["Décision", "Obsidian"]] as const;
  const render = (compact: boolean) => <Motif>
    <Surface x={compact ? 16 : 88} y={8} width={compact ? 296 : 504} height={compact ? 432 : 304} radius={20} tone="paper" />
    {drawers.map(([label, tool], index) => {
      const x = compact ? 36 : 112;
      const y = compact ? 32 + index * 76 : 32 + index * 52;
      const open = label === "Skill";
      return <g key={label}><Surface x={x + (open ? 12 : 0)} y={y} width={compact ? 256 : 456} height={compact ? 56 : 40} radius={12} tone={open ? "accent" : "surface"} /><ToolLogo name={tool} x={x + 12 + (open ? 12 : 0)} y={y + (compact ? 8 : 4)} size={compact ? 40 : 32} /><Label x={x + 68 + (open ? 12 : 0)} y={y + (compact ? 28 : 20)} text={label} anchor="start" kind="title" tone={open ? "on-accent" : undefined} /></g>;
    })}
  </Motif>;
  return <Diagram id="cinq-tiroirs-savoir" title="Chaque apprentissage a son tiroir" says="Une préférence, un souvenir, une règle, un skill et une décision ne se rangent pas ensemble." description="Un meuble présente cinq tiroirs : Toi, Mémoire, Projet, Skill et Décision. Skill est entrouvert en émeraude." wideHeight={320} compactHeight={448} wide={render(false)} compact={render(true)} />;
}

export function CarteConditionDeRetraitDiagram() {
  const render = (compact: boolean) => <Motif>
    <Surface x={compact ? 16 : 112} y={8} width={compact ? 296 : 456} height={compact ? 328 : 248} radius={24} tone="paper" />
    <Document x={compact ? 40 : 144} y={32} width={56} height={68} accent />
    <Label x={compact ? 116 : 216} y={56} text="Carte de méthode" anchor="start" kind="title" />
    {["Marche quand", "Ne marche pas quand", "Revoir le"].map((label, index) => <g key={label}><Label x={compact ? 40 : 144} y={(compact ? 136 : 120) + index * 64} text={label} anchor="start" kind="title" tone={index === 1 ? "accent" : undefined} /><Stroke path={`M${compact ? 40 : 144} ${(compact ? 156 : 140) + index * 64} H${compact ? 280 : 536}`} soft /></g>)}
    <g transform={compact ? "translate(204 16) rotate(8)" : "translate(472 16) rotate(8)"}><Surface x={0} y={0} width={104} height={44} radius={12} tone="accent" /><Label x={52} y={22} text="Retirer si" kind="title" tone="on-accent" /></g>
  </Motif>;
  return <Diagram id="carte-condition-retrait" title="Une méthode dit aussi quand s'arrêter" says="La carte garde ses conditions d'usage, sa date de revue et sa raison de retrait." description="Une carte de méthode affiche Marche quand, Ne marche pas quand et Revoir le, avec un coin Retirer si." wideHeight={264} compactHeight={344} wide={render(false)} compact={render(true)} />;
}
