import { Diagram, Edge, Label } from "../primitives";
import { Document, Motif, Person, Stroke, Surface } from "./shared";
import { LogoTile, TinyCard } from "./shared-b";

export function CeQueTuPossedesDiagram() {
  const labels = ["Brief", "Sources", "Choix", "Code", "Procédure"] as const;
  const render = (compact: boolean) => <>
    <Motif><path d={compact ? "M112 140 V88 L164 48 L216 88 V140 Z" : "M278 144 V76 L340 28 L402 76 V144 Z"} fill="var(--carte)" /><Stroke path={compact ? "M144 140 V106 H184 V140" : "M316 144 V102 H364 V144"} /><Label x={compact ? 164 : 340} y={compact ? 172 : 174} text="Projet" kind="title" /></Motif>
    {labels.map((label, index) => {
      const angle = -Math.PI * .82 + index * Math.PI * .41;
      const cx = (compact ? 164 : 340) + Math.cos(angle) * (compact ? 126 : 230);
      const cy = (compact ? 240 : 130) + Math.sin(angle) * (compact ? 118 : 82);
      return <Motif step={index} key={label}><Document x={cx - 26} y={cy - 32} width={52} height={64} accent={label === "Procédure"} />{label === "Code" ? <LogoTile logo="github" x={cx - 18} y={cy - 18} size={36} /> : null}<Label x={cx} y={cy + 52} text={label} kind="note" /></Motif>;
    })}
    <Edge points={compact ? [[164, 286], [164, 328]] : [[340, 220], [520, 220]]} step={5} />
    <Motif step={6}><Surface x={compact ? 44 : 520} y={compact ? 328 : 112} width={compact ? 240 : 144} height={132} radius={26} tone="paper" /><Stroke path={compact ? "M108 328 V306 H220 V328 M44 374 H284" : "M556 112 V90 H628 V112 M520 156 H664"} accent /><Label x={compact ? 164 : 592} y={compact ? 416 : 184} text="À toi" kind="title" tone="accent" /></Motif>
  </>;
  return <Diagram id="ce-que-tu-possedes" title="Le projet sort de la conversation" says="Brief, sources, choix, code et procédure se rangent dans une mallette que tu contrôles." description="Une petite maison projet est entourée de cinq objets qui entrent dans une mallette personnelle, avec GitHub sur le code." wideHeight={256} compactHeight={468} wide={render(false)} compact={render(true)} />;
}

export function PremierProjetVersMethodeDiagram() {
  const labels = ["Question", "Règle", "Exemple", "Test"] as const;
  const render = (compact: boolean) => <>
    <Motif><Surface x={compact ? 28 : 16} y={compact ? 8 : 72} width={compact ? 272 : 176} height={112} radius={24} tone="paper" /><Stroke path={compact ? "M56 96 H112 V76 H168 V56 H224 V36 H272" : "M44 150 H80 V132 H116 V114 H152 V96 H176"} /><Label x={compact ? 164 : 104} y={compact ? 140 : 208} text="Projet terminé" kind="title" /></Motif>
    <Edge path={compact ? "M164 160 V220" : "M192 128 H260"} step={0} />
    {labels.map((label, index) => {
      const x = compact ? 46 + index * 68 : 260 + index * 72;
      const y = compact ? 220 + index * 32 : 112 + index * 18;
      return <Motif step={index + 1} key={label}><Surface x={x} y={y} width={compact ? 56 : 64} height={52} radius={10} tone="surface" /><Label x={x + (compact ? 28 : 32)} y={y + 78} text={label} kind="note" /></Motif>;
    })}
    <Motif step={6}><Stroke path={compact ? "M40 430 H96 V398 H152 V366 H208 V334 H288" : "M252 232 H340 V204 H428 V176 H516 V148 H664"} accent /><Surface x={compact ? 204 : 516} y={compact ? 292 : 104} width={compact ? 84 : 148} height={44} radius={14} tone="accent" /><text x={compact ? 246 : 590} y={compact ? 315 : 127} textAnchor="middle" dominantBaseline="central" fill="var(--sur-em)" fontFamily="var(--font-t)" fontSize={compact ? 12 : 14} fontWeight="650">Projet suivant</text></Motif>
  </>;
  return <Diagram id="premier-projet-vers-methode" title="Le chantier devient la première marche" says="Une question, une règle, un exemple et un test raccourcissent le départ suivant." description="Un chantier terminé dépose quatre briques qui construisent une marche émeraude vers le projet suivant." wideHeight={256} compactHeight={448} wide={render(false)} compact={render(true)} />;
}

export function DeuxPortesDuSeuilDiagram() {
  const render = (compact: boolean) => <>
    <Motif><Stroke path={compact ? "M164 8 V72 M164 40 L52 104 M164 40 L276 104" : "M340 24 V88 M340 56 L124 112 M340 56 L556 112"} /></Motif>
    <Motif step={1}><Surface x={compact ? 20 : 48} y={compact ? 104 : 112} width={compact ? 132 : 240} height={compact ? 224 : 208} radius={20} tone="paper" /><Stroke path={compact ? "M48 132 H124 V292 H48 Z" : "M88 144 H232 V288 H88 Z"} /><Document x={compact ? 62 : 126} y={compact ? 184 : 174} width={56} height={72} /><Label x={compact ? 86 : 160} y={compact ? 354 : 344} text="Repartir de zéro" kind="title" /></Motif>
    <Motif step={2}><Surface x={compact ? 176 : 392} y={compact ? 104 : 112} width={compact ? 132 : 240} height={compact ? 224 : 208} radius={20} tone="surface" /><Stroke path={compact ? "M204 132 H280 V292 H204 Z M218 264 H266 M218 234 H254 M218 204 H242" : "M432 144 H576 V288 H432 Z M456 260 H552 M456 228 H536 M456 196 H520"} accent /><LogoTile logo="build" x={compact ? 222 : 480} y={compact ? 154 : 152} size={40} /><Label x={compact ? 242 : 512} y={compact ? 354 : 344} text="Garder ma méthode" kind="title" tone="accent" /></Motif>
    <Person x={compact ? 164 : 340} y={compact ? 408 : 240} accent />
    <TinyCard x={compact ? 104 : 286} y={compact ? 448 : 300} width={compact ? 120 : 108} height={44} label="Je choisis" accent step={3} />
  </>;
  return <Diagram id="deux-portes-du-seuil" title="Deux portes après le premier projet" says="Tu peux repartir d'une page blanche ou entrer avec une méthode qui t'appartient." description="Un couloir mène à deux portes : repartir de zéro ou garder ma méthode. Une personne choisit devant les deux." wideHeight={368} compactHeight={500} wide={render(false)} compact={render(true)} />;
}
