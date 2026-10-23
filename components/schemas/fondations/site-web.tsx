import { Diagram, Edge, FixedLine, Label } from "../primitives";
import { Motif, Person, Stroke, Surface } from "./shared";
import { BrowserFrame, Check, LogoTile, NumberMarker, PhoneFrame, TinyCard } from "./shared-b";

function BouquetPage({ x, y, useful, compact = false }: { x: number; y: number; useful: boolean; compact?: boolean }) {
  const width = compact ? 288 : 312;
  const height = compact ? 420 : 392;
  return <BrowserFrame x={x} y={y} width={width} height={height}>
    {useful ? <>
      <Surface x={x + 16} y={y + 44} width={width - 32} height={96} radius={16} tone="paper" />
      <Stroke path={`M${x + 72} ${y + 128} Q${x + 92} ${y + 76} ${x + 112} ${y + 128} M${x + 102} ${y + 128} Q${x + 126} ${y + 66} ${x + 148} ${y + 128} M${x + 132} ${y + 128} Q${x + 154} ${y + 82} ${x + 178} ${y + 128}`} accent />
      <Label x={x + 20} y={y + 166} text="Ton bouquet prêt|pour demain" anchor="start" kind="title" tone="accent" />
      <Label x={x + 20} y={y + 218} text="Dis-nous l'occasion et le budget.|Maison Lila te rappelle avant de composer." anchor="start" kind="note" />
      <Surface x={x + 20} y={y + 258} width={176} height={38} radius={19} tone="accent" />
      <text x={x + 108} y={y + 278} textAnchor="middle" dominantBaseline="central" fill="var(--sur-em)" fontFamily="var(--font)" fontSize="12" fontWeight="650">Commander un bouquet</text>
      <Label x={x + 20} y={y + 320} text="Rappel pendant les horaires d'ouverture" anchor="start" kind="note" />
      {[0,1,2].map((index) => <Surface key={index} x={x + 20 + index * ((width - 52) / 3)} y={y + 344} width={(width - 68) / 3} height={32} radius={8} tone="paper" />)}
    </> : <>
      <TinyCard x={x + 20} y={y + 48} width={126} height={30} label="Expérience florale" />
      <Label x={x + 20} y={y + 112} text="Sublimez|chaque instant" anchor="start" kind="title" />
      <Surface x={x + 20} y={y + 168} width={width - 40} height={84} radius={16} tone="paper" />
      <Surface x={x + 20} y={y + 276} width={108} height={36} radius={18} /><Surface x={x + 140} y={y + 276} width={108} height={36} radius={18} />
      <Label x={x + 74} y={y + 294} text="Découvrir" kind="note" /><Label x={x + 194} y={y + 294} text="Commencer" kind="note" />
      {[0,1,2].map((index) => <Surface key={index} x={x + 20 + index * ((width - 52) / 3)} y={y + 336} width={(width - 68) / 3} height={40} radius={10} tone="paper" />)}
      <Label x={x + 20} y={y + 404} text="Des créations uniques" anchor="start" kind="note" />
    </>}
  </BrowserFrame>;
}

export function LandingRateeLandingUtileMockup() {
  return <Diagram id="landing-ratee-landing-utile" title="Deux pages, deux trajectoires" says="La première disperse l'œil. La seconde guide une personne jusqu'à une commande comprise." description="Deux navigateurs comparent une page fleuriste vague et une page Maison Lila avec un bouquet, une promesse précise et un seul bouton." wideHeight={408} compactHeight={876} wide={<><BouquetPage x={12} y={8} useful={false} /><BouquetPage x={356} y={8} useful /></>} compact={<><BouquetPage x={20} y={8} useful={false} compact /><BouquetPage x={20} y={448} useful compact /></>} />;
}

export function AnatomiePremierEcranMockup() {
  const render = (compact: boolean) => {
    const x = compact ? 16 : 96;
    const y = 8;
    const width = compact ? 296 : 488;
    const height = compact ? 466 : 328;
    return <>
      <BrowserFrame x={x} y={y} width={width} height={height}>
        <Label x={x + 24} y={y + 58} text="Plaquiste à Lyon" anchor="start" kind="note" />
        <Label x={x + 24} y={y + 100} text="Ton devis part avec|les bonnes mesures" anchor="start" kind="title" tone="accent" />
        <Label x={x + 24} y={y + 158} text="Envoie ton plan et trois photos.|Karim te rappelle avant de chiffrer." anchor="start" kind="note" />
        <Surface x={x + 24} y={y + 202} width={156} height={40} radius={20} tone="accent" />
        <text x={x + 102} y={y + 223} textAnchor="middle" dominantBaseline="central" fill="var(--sur-em)" fontFamily="var(--font)" fontSize="12" fontWeight="650">Préparer ma demande</text>
        <Label x={x + 24} y={y + 268} text="Tes photos restent jointes au projet" anchor="start" kind="note" />
        <Surface x={compact ? x + 24 : x + 310} y={compact ? y + 306 : y + 48} width={compact ? width - 48 : 154} height={compact ? 132 : 232} radius={18} tone="paper" />
        <Stroke path={compact ? `M${x + 52} ${y + 408} L${x + 146} ${y + 328} L${x + 244} ${y + 408}` : `M${x + 330} ${y + 252} L${x + 386} ${y + 88} L${x + 444} ${y + 252}`} />
      </BrowserFrame>
      {["Pour qui ?", "Quel changement ?", "Comment ?", "Quel geste ?"].map((label, index) => {
        const px = compact ? 30 + (index % 2) * 170 : 28 + index * 166;
        const py = compact ? 494 + Math.floor(index / 2) * 48 : 360;
        return <g key={label}><NumberMarker x={px} y={py} number={index + 1} accent={index === 3} /><Label x={px + 22} y={py} text={label} anchor="start" kind="note" /></g>;
      })}
    </>;
  };
  return <Diagram id="anatomie-premier-ecran" title="Quatre réponses au premier regard" says="Le métier, le changement, la méthode et le geste occupent chacun une place visible." description="Un premier écran de plaquiste est annoté avec quatre repères : pour qui, quel changement, comment et quel geste." wideHeight={388} compactHeight={590} wide={render(false)} compact={render(true)} />;
}

export function TrajetDeDecisionDiagram() {
  const labels = ["C'est pour moi ?", "Qu'est-ce qui change ?", "Comment ?", "Je peux croire ?", "Je fais quoi ?"] as const;
  const render = (compact: boolean) => <>
    <Edge path={compact ? "M72 32 C270 72 58 142 252 190 C70 242 264 300 164 378" : "M24 112 C124 22 226 198 336 94 C444 -2 530 196 656 72"} head={false} trajectory accent step={0} />
    {labels.map((label, index) => {
      const x = compact ? (index % 2 ? 214 : 74) : 48 + index * 142;
      const y = compact ? 40 + index * 82 : 112 + (index % 2 ? -36 : 28);
      return <Motif step={index} key={label}><circle cx={x} cy={y} r={label === "Je fais quoi ?" ? 14 : 9} fill={label === "Je fais quoi ?" ? "var(--em)" : "var(--carte)"} stroke="var(--em)" strokeWidth="2" /><Label x={x} y={y + (compact ? 30 : 40)} text={label} kind="note" tone={label === "Je fais quoi ?" ? "accent" : undefined} /></Motif>;
    })}
    <Person x={compact ? 164 : 620} y={compact ? 386 : 118} accent />
  </>;
  return <Diagram id="trajet-de-decision" title="La page suit les questions" says="Chaque virage répond à une hésitation avant d'avancer vers l'action finale." description="Un chemin courbe traverse cinq questions du lecteur, de c'est pour moi à je fais quoi, avec une personne au bout." wideHeight={216} compactHeight={424} wide={render(false)} compact={render(true)} />;
}

export function SiteParTranchesDiagram() {
  const labels = ["Premier écran", "Ouvrir", "Tester", "Corriger", "Puis continuer"] as const;
  const render = (compact: boolean) => <>
    <Motif><Surface x={compact ? 16 : 16} y={8} width={compact ? 296 : 648} height={compact ? 360 : 264} radius={28} tone="paper" />{labels.map((label, index) => {
      const y = 32 + index * (compact ? 58 : 46);
      return <g key={label}><Surface x={compact ? 36 : 40} y={y} width={compact ? 256 : 600} height={compact ? 42 : 34} radius={12} tone={index === 0 ? "accent" : "surface"} />{index === 0 ? <text x={compact ? 56 : 60} y={y + (compact ? 22 : 18)} dominantBaseline="central" fill="var(--sur-em)" fontFamily="var(--font-t)" fontSize="17" fontWeight="650">Premier écran</text> : <Label x={compact ? 56 : 60} y={y + (compact ? 21 : 17)} text={label} anchor="start" />}</g>;
    })}<Check x={compact ? 268 : 612} y={compact ? 53 : 49} /></Motif>
    {compact ? <><PhoneFrame x={104} y={392} width={120} height={196} accent><Surface x={120} y={432} width={88} height={52} radius={12} tone="paper" /><Check x={164} y={520} /></PhoneFrame><LogoTile logo="figma" x={28} y={612} size={44} /><LogoTile logo="claude-code" x={142} y={612} size={44} /><LogoTile logo="codex" x={256} y={612} size={44} /></> : <><PhoneFrame x={520} y={48} width={104} height={176} accent><Check x={572} y={182} /></PhoneFrame><LogoTile logo="figma" x={96} y={288} size={44} /><LogoTile logo="claude-code" x={318} y={288} size={44} /><LogoTile logo="codex" x={540} y={288} size={44} /></>}
  </>;
  return <Diagram id="site-par-tranches" title="Une tranche complète avant la suivante" says="Le premier écran s'ouvre, se teste et se corrige avant que la page grandisse." description="Une page découpée en bandes montre le premier écran allumé, testé sur mobile, puis les outils Figma, Claude Code et Codex." wideHeight={344} compactHeight={664} wide={render(false)} compact={render(true)} />;
}

export function SiteTrouveEtUtiliseDiagram() {
  const labels = ["Recherche", "Page", "Bouton", "Formulaire", "Client"] as const;
  const render = (compact: boolean) => <>
    <FixedLine path={compact ? "M68 36 V420" : "M44 96 H636"} />
    {labels.map((label, index) => {
      const x = compact ? 68 : 56 + index * 140;
      const y = compact ? 40 + index * 94 : 96;
      return <Motif step={index} key={label}><circle cx={x} cy={y} r={label === "Formulaire" ? 15 : 10} fill={label === "Formulaire" ? "var(--em)" : "var(--carte)"} stroke="var(--em)" strokeWidth="2" /><Label x={compact ? 104 : x} y={compact ? y : 132} text={label} anchor={compact ? "start" : "middle"} kind="title" tone={label === "Formulaire" ? "accent" : undefined} /><Stroke path={compact ? `M${x + 12} ${y + 36} H${x + 72}` : `M${x - 24} 166 A24 24 0 0 1 ${x + 24} 166`} accent={label === "Formulaire"} /></Motif>;
    })}
    {compact ? <><LogoTile logo="search" x={220} y={48} size={44} /><LogoTile logo="posthog" x={220} y={326} size={44} /></> : <><LogoTile logo="search" x={36} y={184} size={44} /><LogoTile logo="posthog" x={494} y={184} size={44} /></>}
  </>;
  return <Diagram id="site-trouve-et-utilise" title="La visibilité doit finir en geste" says="La recherche compte seulement si la personne comprend la page et termine l'action utile." description="Une ligne de métro relie recherche, page, bouton, formulaire et client. Search Console et PostHog mesurent le trajet." wideHeight={240} compactHeight={448} wide={render(false)} compact={render(true)} />;
}
