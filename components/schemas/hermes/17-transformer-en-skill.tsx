import { Diagram, Edge, FixedLine, Label } from "../primitives";
import { Document, Folder, Motif, Stroke, Surface, ToolLogo } from "./shared";
import { MiniRows, NumberPin, Panel } from "./chapter-shared";

export function SkillCommeDossierOuvertDiagram() {
  const files = [["SKILL.md", "Hermes Agent"], ["Références", "GitHub"], ["Tests", "Hermes Agent"], ["Scripts", "Ghostty"]] as const;
  const draw = (compact: boolean) => <>
    <Motif><Folder x={compact ? 24 : 40} y={compact ? 8 : 48} width={compact ? 280 : 600} height={compact ? 392 : 176} accent /></Motif>
    {files.map(([label, tool], index) => {
      const x = compact ? 48 + (index % 2) * 128 : 64 + index * 144;
      const y = compact ? 80 + Math.floor(index / 2) * 152 : 88 - (index % 2) * 24;
      return <Motif key={label} step={index}><g transform={`rotate(${index % 2 ? 3 : -3} ${x + 52} ${y + 56})`}><Surface x={x} y={y} width={compact ? 104 : 120} height={112} radius={16} tone={label === "Tests" ? "accent" : "paper"} /><ToolLogo name={tool} x={x + (compact ? 32 : 40)} y={y + 12} size={40} /><Label x={x + (compact ? 52 : 60)} y={y + 82} text={label} kind="title" maxChars={compact ? 12 : 14} tone={label === "Tests" ? "on-accent" : undefined} /></g></Motif>;
    })}
  </>;
  return <Diagram id="skill-dossier-ouvert" title="Le skill sort de son dossier" says="Méthode, références, tests et scripts restent séparés et lisibles." description="Un dossier 3D ouvert laisse glisser SKILL.md, Références, Tests et Scripts, avec Tests en émeraude." wideHeight={256} compactHeight={416} wide={draw(false)} compact={draw(true)} />;
}

export function SkillsSopDiagramV2() {
  const labels = ["Métier", "Petit savoir-faire", "Méthode écrite", "Personne ou agent"] as const;
  const draw = (compact: boolean) => <>{labels.map((label, index) => {
    const x = compact ? 24 : 8 + index * 168;
    const y = compact ? 8 + index * 112 : 24;
    return <g key={label}><Panel x={x} y={y} width={compact ? 280 : 152} height={80} radius={index === 1 ? 14 : 24} accent={index === 2} step={index}>
      {index === 2 ? <Document x={x + 14} y={y + 14} width={40} height={50} /> : null}
      {index === 3 ? <ToolLogo name="Hermes Agent" x={x + 12} y={y + 18} size={44} /> : null}
      <Label x={x + (compact ? 84 : 76)} y={y + 40} text={label} anchor={compact ? "start" : "middle"} kind="title" maxChars={compact ? 25 : 14} tone={index === 2 ? "on-accent" : undefined} />
    </Panel>{index < 3 ? <Edge points={compact ? [[164, y + 80], [164, y + 112]] : [[x + 152, 64], [x + 168, 64]]} step={index} /> : null}</g>;
  })}</>;
  return <Diagram id="skills-sop-v2" title="Le métier devient une méthode transmissible" says="Tu découpes un geste précis, tu écris les choix, puis une personne ou un agent peut l'exécuter." description="Quatre étapes relient Métier, Petit savoir-faire, Méthode écrite et Personne ou agent." wideHeight={128} compactHeight={416} wide={draw(false)} compact={draw(true)} />;
}

export function DossierSkillReelMockup() {
  const sections = ["description", "Quand l'utiliser", "méthode", "Quand s'arrêter", "Qui valide"] as const;
  const draw = (compact: boolean) => <>
    <Panel x={8} y={8} width={compact ? 312 : 664} height={compact ? 472 : 328} radius={22}>
      <ToolLogo name="Ghostty" x={compact ? 268 : 620} y={20} size={36} />
      <ToolLogo name="Hermes Agent" x={compact ? 228 : 580} y={20} size={36} />
      <Label x={28} y={38} text="skill-campagne/" anchor="start" kind="title" />
      <Surface x={compact ? 24 : 24} y={68} width={compact ? 104 : 176} height={compact ? 372 : 232} radius={14} tone="surface" />
      {["SKILL.md", "references/", "tests/", "scripts/"].map((file, index) => <Label key={file} x={compact ? 36 : 40} y={100 + index * 44} text={file} anchor="start" tone={index === 0 ? "accent" : undefined} maxChars={compact ? 12 : 18} />)}
      <Label x={compact ? 148 : 228} y={90} text="SKILL.md" anchor="start" kind="title" />
      {sections.map((section, index) => <g key={section}><Label x={compact ? 148 : 228} y={128 + index * 54} text={section} anchor="start" kind={index === 1 || index === 3 || index === 4 ? "title" : "text"} tone={index === 3 ? "accent" : undefined} maxChars={compact ? 16 : 30} /><FixedLine path={`M${compact ? 148 : 228} ${148 + index * 54} H${compact ? 296 : 640}`} /></g>)}
    </Panel>
    <NumberPin x={compact ? 138 : 212} y={118} number={1} />
    <NumberPin x={compact ? 138 : 212} y={226} number={2} />
    <NumberPin x={compact ? 138 : 212} y={334} number={3} accent />
    <Label x={compact ? 164 : 340} y={compact ? 514 : 372} text="1 Trouver   2 Charger le détail   3 Tester" kind="note" maxChars={compact ? 25 : 52} />
  </>;
  return <Diagram id="dossier-skill-reel" title="Le vrai dossier montre les choix" says="L'arborescence aide à trouver. SKILL.md dit quand agir, quand s'arrêter et qui valide." description="Un éditeur affiche l'arborescence du skill et un SKILL.md annoté avec description, méthode, interdits et tests." wideHeight={392} compactHeight={532} wide={draw(false)} compact={draw(true)} />;
}

export function BriquesDeCompetenceDiagram() {
  const bricks = ["Lire", "Comparer", "Préparer", "Vérifier"] as const;
  const draw = (compact: boolean) => <>{bricks.map((label, index) => {
    const x = compact ? 48 + (index % 2) * 120 : 64 + index * 140;
    const y = compact ? 32 + Math.floor(index / 2) * 112 + (index % 2) * 20 : 80 - (index % 2) * 24;
    return <Motif key={label} step={index}><path d={`M${x} ${y + 16} l16 -16 h${compact ? 72 : 84} l16 16 v64 l-16 16 h-${compact ? 72 : 84} l-16 -16 z`} fill={index === 3 ? "var(--em)" : "#262b28"} stroke="rgba(241,245,242,.3)" /><Label x={x + (compact ? 52 : 58)} y={y + 52} text={label} kind="title" tone={index === 3 ? "on-accent" : undefined} /></Motif>;
  })}</>;
  return <Diagram id="briques-competence" title="Quatre gestes s'emboîtent" says="Chaque petit skill garde un rôle clair. Les jointures forment le workflow." description="Quatre briques physiques nommées Lire, Comparer, Préparer et Vérifier s'emboîtent." wideHeight={184} compactHeight={272} wide={draw(false)} compact={draw(true)} />;
}
