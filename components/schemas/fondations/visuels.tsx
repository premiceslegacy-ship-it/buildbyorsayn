import { Diagram, Edge, Label } from "../primitives";
import { Motif, Stroke, Surface } from "./shared";
import { BrowserFrame, LogoTile, NumberMarker, PhoneFrame, TinyCard } from "./shared-b";

function FlowerScene({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  return <g aria-hidden="true">
    <rect x={x} y={y} width={width} height={height} rx="14" fill="color-mix(in srgb, var(--em) 14%, var(--carte))" />
    <path d={`M${x + width * .5} ${y + height * .88} C${x + width * .5} ${y + height * .55} ${x + width * .38} ${y + height * .36} ${x + width * .26} ${y + height * .2} M${x + width * .5} ${y + height * .88} C${x + width * .58} ${y + height * .54} ${x + width * .72} ${y + height * .34} ${x + width * .78} ${y + height * .18}`} fill="none" stroke="var(--t2)" strokeWidth="2" strokeLinecap="round" />
    {[[.24,.2],[.38,.32],[.5,.18],[.64,.3],[.78,.18]].map(([dx, dy]) => <circle key={`${dx}-${dy}`} cx={x + width * dx} cy={y + height * dy} r={Math.max(5, width * .035)} fill="var(--em)" />)}
  </g>;
}

export function LandingGeneriqueContreMarqueMockup() {
  const page = (x: number, useful: boolean, compact = false) => {
    const width = compact ? 288 : 312;
    const y = compact ? (useful ? 338 : 8) : 8;
    const h = compact ? 306 : 300;
    return <BrowserFrame x={x} y={y} width={width} height={h} step={useful ? 2 : 0}>
      {useful ? <>
        <FlowerScene x={x + 16} y={y + 42} width={width - 32} height={compact ? 82 : 92} />
        <Label x={x + 20} y={y + (compact ? 150 : 156)} text="Ton bouquet prêt|pour demain" anchor="start" kind="title" tone="accent" />
        <Label x={x + 20} y={y + (compact ? 206 : 210)} text="Choisis l'occasion. Maison Lila|te rappelle avant la composition." anchor="start" kind="note" />
        <Surface x={x + 20} y={y + (compact ? 244 : 250)} width={176} height={40} radius={20} tone="accent" />
        <text x={x + 108} y={y + (compact ? 265 : 271)} textAnchor="middle" dominantBaseline="central" fill="var(--sur-em)" fontFamily="var(--font)" fontSize="12" fontWeight="650">Commander un bouquet</text>
      </> : <>
        <Surface x={x + 16} y={y + 42} width={width - 32} height={92} radius={18} tone="surface" />
        <circle cx={x + width / 2} cy={y + 88} r="30" fill="color-mix(in srgb, var(--t3) 24%, transparent)" />
        <TinyCard x={x + 22} y={y + 148} width={86} height={28} label="Innovation" />
        <Label x={x + 20} y={y + 198} text="Réinventez votre|expérience" anchor="start" kind="title" />
        <Label x={x + 20} y={y + 244} text="Des solutions innovantes|pour vos besoins" anchor="start" kind="note" />
        <Surface x={x + 20} y={y + 270} width={104} height={28} radius={14} tone="surface" /><Label x={x + 72} y={y + 284} text="Commencer" kind="note" />
      </>}
    </BrowserFrame>;
  };
  return <Diagram id="landing-generique-contre-marque" title="La scène gagne contre le décor" says="La page utile montre le métier, nomme le résultat et annonce la vraie action." description="Deux landing pages sont comparées : une page générique violette et une page Maison Lila centrée sur un bouquet et une commande." wideHeight={316} compactHeight={652} wide={<>{page(12, false)}{page(356, true)}</>} compact={<>{page(20, false, true)}{page(20, true, true)}</>} />;
}

export function ReferencesVersDirectionDiagram() {
  const render = (compact: boolean) => {
    const sources = ["Lumière", "Cadre", "Matière", "À éviter"] as const;
    return <>
      {sources.map((label, index) => {
        const x = compact ? (index % 2) * 156 + 8 : index * 144 + 16;
        const y = compact ? Math.floor(index / 2) * 108 + 8 : 8 + (index % 2) * 24;
        return <Motif step={index} key={label}><Surface x={x} y={y} width={compact ? 144 : 120} height={84} radius={18} tone="paper" /><Stroke path={`M${x + 18} ${y + 58} L${x + 44} ${y + 26} L${x + 72} ${y + 48} L${x + 100} ${y + 20}`} accent={label === "À éviter"} /><Label x={x + (compact ? 72 : 60)} y={y + 104} text={label} kind="title" /></Motif>;
      })}
      <Motif step={5}><Surface x={compact ? 44 : 176} y={compact ? 260 : 160} width={compact ? 240 : 328} height={96} radius={28} tone="accent" /><text x={compact ? 164 : 340} y={compact ? 308 : 208} textAnchor="middle" dominantBaseline="central" fill="var(--sur-em)" fontFamily="var(--font-t)" fontSize="17" fontWeight="650">Notre direction</text></Motif>
      {compact ? <><LogoTile logo="pinterest" x={68} y={278} size={40} /><LogoTile logo="figma" x={220} y={278} size={40} /></> : <><LogoTile logo="pinterest" x={204} y={188} size={40} /><LogoTile logo="figma" x={436} y={188} size={40} /></>}
      {sources.map((_, index) => <Edge key={index} path={compact ? `M${80 + (index % 2) * 156} ${100 + Math.floor(index / 2) * 108} Q164 238 164 260` : `M${76 + index * 144} ${116 + (index % 2) * 24} Q340 144 340 160`} head={false} step={index} />)}
    </>;
  };
  return <Diagram id="references-vers-direction" title="Quatre références, quatre décisions" says="Chaque source donne une seule pièce. La planche centrale compose une direction originale." description="Lumière, cadre, matière et anti-référence convergent vers notre direction, avec Pinterest et Figma." wideHeight={272} compactHeight={372} wide={render(false)} compact={render(true)} />;
}

export function BriefPhotoAnnoteMockup() {
  const render = (compact: boolean) => {
    const x = compact ? 12 : 72;
    const y = 8;
    const width = compact ? 304 : 536;
    const height = compact ? 408 : 304;
    const imageX = x + 16;
    const imageY = y + 44;
    const imageW = compact ? 272 : 344;
    const imageH = compact ? 196 : 236;
    return <>
      <BrowserFrame x={x} y={y} width={width} height={height}>
        <rect x={imageX} y={imageY} width={imageW} height={imageH} rx="16" fill="color-mix(in srgb, var(--encre) 84%, var(--carte))" />
        <ellipse cx={imageX + imageW * .62} cy={imageY + imageH * .55} rx={imageW * .16} ry={imageH * .24} fill="var(--t3)" />
        <path d={`M${imageX + imageW * .5} ${imageY + imageH * .45} Q${imageX + imageW * .62} ${imageY + imageH * .3} ${imageX + imageW * .74} ${imageY + imageH * .45} V${imageY + imageH * .78} H${imageX + imageW * .5} Z`} fill="var(--encre)" stroke="var(--t2)" />
        <rect x={imageX + 16} y={imageY + 16} width={imageW * .34} height={imageH - 32} rx="12" fill="none" stroke="var(--em)" strokeWidth="1.5" strokeDasharray="4 5" />
        <Label x={imageX + 28} y={imageY + 42} text="Texte ici" anchor="start" tone="accent" />
        {!compact ? <><LogoTile logo="openai" x={x + 388} y={y + 60} size={44} /><LogoTile logo="gemini" x={x + 448} y={y + 60} size={44} /><Label x={x + 388} y={y + 130} text="Tasse noire mate" anchor="start" /><Label x={x + 388} y={y + 158} text="Plan serré" anchor="start" /><Label x={x + 388} y={y + 186} text="Lumière de fenêtre" anchor="start" /><Label x={x + 388} y={y + 214} text="Bois sombre" anchor="start" /><Label x={x + 388} y={y + 242} text="Sans logo" anchor="start" /></> : <><LogoTile logo="openai" x={x + 184} y={y + 252} size={40} /><LogoTile logo="gemini" x={x + 232} y={y + 252} size={40} /><Label x={x + 28} y={y + 278} text="Tasse noire mate" anchor="start" /><Label x={x + 28} y={y + 306} text="Plan serré" anchor="start" /><Label x={x + 28} y={y + 334} text="Lumière de fenêtre" anchor="start" /><Label x={x + 28} y={y + 362} text="Bois sombre" anchor="start" /><Label x={x + 28} y={y + 390} text="Sans logo" anchor="start" /></>}
      </BrowserFrame>
      {[1,2,3,4,5,6].map((number, index) => <NumberMarker key={number} x={compact ? 24 + (index % 3) * 140 : 40 + index * 116} y={compact ? 438 + Math.floor(index / 3) * 40 : 326} number={number} accent={number === 2} />)}
    </>;
  };
  return <Diagram id="brief-photo-annote" title="Le brief pointe vers l'image" says="Chaque choix visible correspond à une zone précise, pas à un adjectif vague." description="Une interface d'image montre une tasse noire, une zone de texte et six repères pour le sujet, le cadre, la lumière, la matière, le format et les refus." wideHeight={348} compactHeight={498} wide={render(false)} compact={render(true)} />;
}

export function DesignSystemOuvertMockup() {
  const render = (compact: boolean) => compact ? <>
    <BrowserFrame x={12} y={8} width={304} height={280}><Label x={32} y={54} text="DESIGN-SYSTEM.md" anchor="start" kind="title" />{["Couleurs", "Typographie", "Espacements", "Formes", "États", "Mobile"].map((label, index) => <Label key={label} x={36} y={92 + index * 28} text={label} anchor="start" tone={label === "États" ? "accent" : undefined} />)}</BrowserFrame>
    <Edge points={[[164, 288], [164, 320]]} step={5} />
    <PhoneFrame x={90} y={320} width={148} height={252} accent><Label x={108} y={366} text="Texte" anchor="start" kind="note" /><Label x={108} y={404} text="Surface" anchor="start" /><Surface x={108} y={430} width={112} height={42} radius={21} tone="accent" /><text x="164" y="452" fill="var(--sur-em)" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font)" fontSize="12" fontWeight="650">Action</text><Label x={108} y={504} text="Erreur" anchor="start" tone="error" /><Label x={108} y={536} text="Chargement" anchor="start" /></PhoneFrame>
  </> : <>
    <BrowserFrame x={16} y={16} width={304} height={272}><Label x={40} y={62} text="DESIGN-SYSTEM.md" anchor="start" kind="title" />{["Couleurs", "Typographie", "Espacements", "Formes", "États", "Mobile"].map((label, index) => <Label key={label} x={44} y={100 + index * 28} text={label} anchor="start" tone={label === "États" ? "accent" : undefined} />)}</BrowserFrame>
    <Edge path="M320 80 C374 80 364 80 412 80 M320 136 C374 136 364 136 412 136 M320 192 C374 192 364 192 412 192" head={false} step={3} />
    <BrowserFrame x={412} y={16} width={252} height={272} step={4}><LogoTile logo="figma" x={432} y={52} size={40} /><Label x={488} y={72} text="Texte" anchor="start" /><Surface x={432} y={104} width={212} height={72} radius={16} /><Label x={448} y={130} text="Surface" anchor="start" /><Surface x={448} y={144} width={108} height={32} radius={16} tone="accent" /><text x="502" y="161" fill="var(--sur-em)" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font)" fontSize="12" fontWeight="650">Action</text><Label x={432} y={210} text="Erreur" anchor="start" tone="error" /><Label x={432} y={242} text="Chargement" anchor="start" /></BrowserFrame>
  </>;
  return <Diagram id="design-system-ouvert" title="La règle rejoint son composant" says="Le système relie chaque décision à un usage visible dans la vraie interface." description="Une fenêtre DESIGN-SYSTEM.md relie couleurs, typographie, espacements, formes, états et mobile à un écran rendu." wideHeight={304} compactHeight={580} wide={render(false)} compact={render(true)} />;
}

export function EcranDansTousSesEtatsMockup() {
  const states = ["Chargement", "Vide", "Erreur", "Succès", "Mobile"] as const;
  const detail = ["Envoi en cours", "Commencer", "Corriger l'adresse", "Demande reçue", "Bouton entier"] as const;
  const render = (compact: boolean) => <>{states.map((state, index) => {
    const x = compact ? 28 : 8 + index * 134;
    const y = compact ? 8 + index * 112 : 8;
    const width = compact ? 272 : 124;
    return <Motif step={index} key={state}><Surface x={x} y={y} width={width} height={compact ? 88 : 224} radius={20} tone={state === "Erreur" ? "paper" : "surface"} /><Label x={x + width / 2} y={y + 30} text={state} kind="title" tone={state === "Erreur" ? "error" : undefined} /><Surface x={x + 14} y={y + (compact ? 48 : 64)} width={width - 28} height={compact ? 24 : 32} radius={10} tone="paper" />{!compact ? <><Surface x={x + 14} y={y + 110} width={width - 28} height={32} radius={10} tone="paper" /><Surface x={x + 14} y={y + 164} width={width - 28} height={36} radius={18} tone={state === "Erreur" ? "accent" : "paper"} /></> : null}<Label x={x + width / 2} y={y + (compact ? 100 : 214)} text={detail[index]} kind="note" tone={state === "Erreur" ? "accent" : undefined} /></Motif>;
  })}</>;
  return <Diagram id="ecran-dans-tous-ses-etats" title="Le même écran traverse la vraie vie" says="Chargement, vide, erreur, succès et mobile gardent la même structure et une reprise claire." description="Un formulaire apparaît dans cinq cadres successifs : chargement, vide, erreur, succès et mobile. Corriger l'adresse est mis en avant." wideHeight={252} compactHeight={568} wide={render(false)} compact={render(true)} />;
}
