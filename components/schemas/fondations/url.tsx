import { Diagram, Edge, Label } from "../primitives";
import { Folder, Motif, Person, Stroke, Surface } from "./shared";
import { BrowserFrame, Check, LogoTile, NumberMarker, PhoneFrame } from "./shared-b";

export function DuDossierAuDomaineDiagram() {
  const labels = ["Dossier", "Git", "GitHub", "Vercel", "Domaine"] as const;
  const render = (compact: boolean) => <>{labels.map((label, index) => {
    const x = compact ? 44 : 18 + index * 134;
    const y = compact ? 12 + index * 96 : 72 + (index % 2 ? 24 : 0);
    const logo = label === "GitHub" ? "github" : label === "Vercel" ? "vercel" : null;
    return <Motif step={index} key={label}>
      {label === "Dossier" ? <Folder x={x} y={y} width={compact ? 240 : 104} height={64} /> : logo ? <LogoTile logo={logo} x={compact ? x + 92 : x + 24} y={y + 4} size={56} /> : label === "Domaine" ? <><Surface x={x} y={y} width={compact ? 240 : 104} height={64} radius={18} tone="accent" /><Stroke path={`M${x + (compact ? 120 : 52)} ${y} V${y - 18}`} accent /></> : <><circle cx={x + (compact ? 120 : 52)} cy={y + 32} r="28" fill="var(--carte)" /><Stroke path={`M${x + (compact ? 104 : 36)} ${y + 32} C${x + (compact ? 104 : 36)} ${y + 10} ${x + (compact ? 136 : 68)} ${y + 10} ${x + (compact ? 136 : 68)} ${y + 32} C${x + (compact ? 136 : 68)} ${y + 54} ${x + (compact ? 104 : 36)} ${y + 54} ${x + (compact ? 104 : 36)} ${y + 32}`} /></>}
      <Label x={compact ? x + 120 : x + 52} y={y + 84} text={label} kind="title" tone={label === "Domaine" ? "accent" : undefined} />
      {index < labels.length - 1 ? <Edge points={compact ? [[164, y + 88], [164, y + 108]] : [[x + 104, y + 32], [x + 134, 104 + ((index + 1) % 2 ? 24 : 0)]]} step={index} /> : null}
    </Motif>;
  })}</>;
  return <Diagram id="du-dossier-au-domaine" title="Cinq objets sur la ligne de montage" says="Le dossier garde les fichiers, Git l'histoire, GitHub le dépôt, Vercel le site et le domaine l'adresse." description="Un dossier passe par Git, GitHub et Vercel avant d'allumer un panneau de domaine." wideHeight={208} compactHeight={500} wide={render(false)} compact={render(true)} />;
}

export function OuvrirOuClonerMockup() {
  const render = (compact: boolean) => {
    const x = compact ? 12 : 72;
    const width = compact ? 304 : 536;
    const height = compact ? 492 : 312;
    return <>
      <BrowserFrame x={x} y={8} width={width} height={height}>
        <image href="/assets/tutorials/antigravity-ouvrir-ou-cloner.jpg" x={x + 1} y="37" width={width - 2} height={height - 30} preserveAspectRatio="xMidYMid slice" opacity="0.08" aria-hidden="true" />
        <Label x={x + width / 2} y={58} text="Où est le projet ?" kind="title" />
        <Motif step={1}><Surface x={x + 24} y={92} width={compact ? width - 48 : 224} height={compact ? 124 : 144} radius={24} tone="paper" /><Folder x={x + (compact ? 116 : 80)} y={116} width={72} height={62} /><Label x={x + (compact ? width / 2 : 136)} y={206} text="Open Folder" kind="title" /><Label x={x + (compact ? width / 2 : 136)} y={230} text="Déjà sur cet ordinateur" kind="note" /></Motif>
        <Motif step={2}><Surface x={compact ? x + 24 : x + 288} y={compact ? 240 : 92} width={compact ? width - 48 : 224} height={compact ? 124 : 144} radius={24} tone="paper" /><LogoTile logo="github" x={compact ? x + 116 : x + 368} y={compact ? 258 : 112} size={56} /><Label x={compact ? x + width / 2 : x + 400} y={compact ? 324 : 206} text="Clone Repository" kind="title" /><Label x={compact ? x + width / 2 : x + 400} y={compact ? 348 : 230} text="Seulement sur GitHub" kind="note" /></Motif>
        <Surface x={x + 24} y={compact ? 392 : 260} width={width - 48} height={56} radius={18} tone="accent" />
        <Check x={x + 50} y={compact ? 420 : 288} />
        <text x={x + 76} y={compact ? 422 : 290} fill="var(--sur-em)" fontFamily="var(--font-t)" fontSize="15" fontWeight="650">Vérifie le chemin</text>
        <LogoTile logo="antigravity" x={x + width - 64} y={compact ? 400 : 268} size={40} />
      </BrowserFrame>
      {[1,2,3,4].map((number, index) => <NumberMarker key={number} x={compact ? 32 + index * 88 : 132 + index * 136} y={compact ? 528 : 340} number={number} accent={number === 3} />)}
    </>;
  };
  return <Diagram id="ouvrir-ou-cloner" title="Deux portes vers le même projet" says="Ouvre le dossier s'il existe ici. Clone le dépôt s'il vit seulement sur GitHub." description="Une fenêtre Antigravity propose Open Folder et Clone Repository, puis demande de vérifier le chemin, le dossier et la branche." wideHeight={360} compactHeight={548} wide={render(false)} compact={render(true)} />;
}

export function BouclePetiteTacheDiagram() {
  const labels = ["Lire", "Modifier", "Ouvrir", "Tester", "Corriger"] as const;
  const render = (compact: boolean) => <>
    <Edge path={compact ? "M164 44 C280 44 280 350 164 350 C48 350 48 44 164 44" : "M100 112 C100 12 580 12 580 112 C580 212 100 212 100 112"} head={false} trajectory accent step={0} />
    {labels.map((label, index) => {
      const angle = compact ? -Math.PI / 2 + index * Math.PI * 2 / 5 : Math.PI + index * Math.PI * 2 / 5;
      const x = compact ? 164 + Math.cos(angle) * 112 : 340 + Math.cos(angle) * 240;
      const y = compact ? 196 + Math.sin(angle) * 154 : 112 + Math.sin(angle) * 88;
      return <Motif step={index} key={label}><circle cx={x} cy={y} r={label === "Ouvrir" ? 24 : 18} fill={label === "Ouvrir" ? "var(--em)" : "var(--carte)"} /><Label x={x} y={y + 40} text={label} kind="title" tone={label === "Ouvrir" ? "accent" : undefined} />{label === "Modifier" ? <><LogoTile logo="codex" x={x - 42} y={y - 20} size={32} /><LogoTile logo="claude-code" x={x + 10} y={y - 20} size={32} /></> : null}</Motif>;
    })}
    {compact ? <PhoneFrame x={120} y={140} width={88} height={136} accent><Surface x={132} y={170} width={64} height={40} radius={10} tone="paper" /></PhoneFrame> : <BrowserFrame x={278} y={60} width={124} height={104}><Surface x={294} y={104} width={92} height={36} radius={10} tone="paper" /></BrowserFrame>}
  </>;
  return <Diagram id="boucle-petite-tache" title="La petite tâche revient dans le navigateur" says="Lire et modifier ne suffisent pas. Le résultat doit s'ouvrir, se tester puis se corriger." description="Une boucle circulaire relie lire, modifier, ouvrir, tester et corriger autour d'un écran, avec Codex et Claude Code." wideHeight={240} compactHeight={388} wide={render(false)} compact={render(true)} />;
}

export function DepotVersHebergeurDiagram() {
  const labels = ["Commit", "Push", "Construire", "Adresse publique", "Tester"] as const;
  const render = (compact: boolean) => <>{labels.map((label, index) => {
    const x = compact ? 32 : 8 + index * 136;
    const y = compact ? 8 + index * 94 : 72;
    return <Motif step={index} key={label}>
      {label === "Commit" ? <><Surface x={x} y={y} width={compact ? 264 : 112} height={56} radius={16} tone="paper" /><Stroke path={`M${x + 20} ${y + 28} H${x + (compact ? 244 : 92)}`} /></> : label === "Push" ? <LogoTile logo="github" x={compact ? x + 104 : x + 28} y={y} size={56} /> : label === "Construire" ? <LogoTile logo="vercel" x={compact ? x + 104 : x + 28} y={y} size={56} /> : label === "Adresse publique" ? <Surface x={x} y={y} width={compact ? 264 : 112} height={56} radius={16} tone="surface" /> : <PhoneFrame x={compact ? x + 92 : x + 34} y={y - 16} width={80} height={104} accent><Check x={compact ? x + 132 : x + 74} y={y + 46} /></PhoneFrame>}
      <Label x={compact ? x + 132 : x + 56} y={y + (label === "Tester" ? 112 : 82)} text={label} kind="title" tone={label === "Tester" ? "accent" : undefined} />
      {index < labels.length - 1 ? <Edge points={compact ? [[164, y + 84], [164, y + 102]] : [[x + 112, y + 28], [x + 136, y + 28]]} step={index} /> : null}
    </Motif>;
  })}</>;
  return <Diagram id="depot-vers-hebergeur" title="La publication finit dans les mains" says="Une version connue monte, se construit, reçoit une adresse puis se teste comme un visiteur." description="Une frise relie commit, push GitHub, construction Vercel, adresse publique et test sur téléphone." wideHeight={208} compactHeight={480} wide={render(false)} compact={render(true)} />;
}

export function InfrastructurePriveeDiagram() {
  const floors = ["Compte", "Réseau privé", "Agent", "Journaux", "Sauvegarde"] as const;
  const render = (compact: boolean) => <>
    <Motif><Surface x={compact ? 48 : 168} y={8} width={compact ? 232 : 344} height={compact ? 420 : 264} radius={28} tone="paper" />{floors.map((label, index) => {
      const y = 32 + index * (compact ? 72 : 46);
      const logo = label === "Réseau privé" ? "tailscale" : label === "Agent" ? "hermes" : label === "Compte" ? "cloudflare" : null;
      return <g key={label}><Surface x={compact ? 68 : 192} y={y} width={compact ? 192 : 296} height={compact ? 52 : 34} radius={12} tone={label === "Sauvegarde" ? "accent" : "surface"} />{logo ? <LogoTile logo={logo} x={compact ? 76 : 200} y={y + (compact ? 6 : -3)} size={40} /> : null}{label === "Sauvegarde" ? <text x={compact ? 164 : 340} y={y + (compact ? 27 : 18)} textAnchor="middle" dominantBaseline="central" fill="var(--sur-em)" fontFamily="var(--font-t)" fontSize="17" fontWeight="650">Sauvegarde</text> : <Label x={compact ? 164 : 340} y={y + (compact ? 26 : 17)} text={label} kind="title" />}</g>;
    })}<Stroke path={compact ? "M88 392 H112 V320 H136 V248 H160 V176 H184 V104" : "M212 248 H244 V202 H276 V156 H308 V110 H340 V64"} accent /></Motif>
    <Person x={compact ? 100 : 236} y={compact ? 394 : 242} accent />
    <Motif step={6}><Surface x={compact ? 84 : 536} y={compact ? 456 : 80} width={compact ? 160 : 128} height={80} radius={20} tone="surface" /><Check x={compact ? 164 : 600} y={compact ? 484 : 108} /><Label x={compact ? 164 : 600} y={compact ? 518 : 144} text="Copie restaurée" kind="note" tone="accent" /></Motif>
  </>;
  return <Diagram id="infrastructure-privee" title="La tour tient par ses cinq étages" says="Le réseau et l'agent ne suffisent pas. Les journaux et la restauration gardent le système compréhensible." description="Une tour technique superpose compte, réseau privé, agent, journaux et sauvegarde. Un escalier humain mène à une copie restaurée." wideHeight={288} compactHeight={544} wide={render(false)} compact={render(true)} />;
}

export function RemiseDesClesDiagram() {
  const labels = ["Dépôt", "Hébergement", "Domaine", "Mesure"] as const;
  const logos = ["github", "vercel", "search", "posthog"] as const;
  const render = (compact: boolean) => <>
    <Motif><circle cx={compact ? 164 : 276} cy={compact ? 156 : 132} r={compact ? 64 : 72} fill="none" stroke="var(--t2)" strokeWidth="5" />{labels.map((label, index) => {
      const angle = -Math.PI / 2 + index * Math.PI / 2;
      const cx = (compact ? 164 : 276) + Math.cos(angle) * (compact ? 104 : 124);
      const cy = (compact ? 156 : 132) + Math.sin(angle) * (compact ? 104 : 96);
      return <g key={label}><LogoTile logo={logos[index]} x={cx - 22} y={cy - 22} size={44} step={index} /><Stroke path={`M${cx} ${cy + 22} V${cy + 54}`} /><Label x={cx} y={cy + 72} text={label} kind="note" /></g>;
    })}</Motif>
    <Motif step={5}><Surface x={compact ? 44 : 440} y={compact ? 332 : 56} width={compact ? 240 : 216} height={136} radius={24} tone="paper" /><Label x={compact ? 164 : 548} y={compact ? 372 : 96} text="Procédure" kind="title" tone="accent" /><Stroke path={compact ? "M76 402 H252 M76 426 H224" : "M472 128 H624 M472 152 H596"} accent /><Check x={compact ? 236 : 612} y={compact ? 444 : 176} /></Motif>
    <Person x={compact ? 164 : 116} y={compact ? 506 : 210} />
    <Stroke path={compact ? "M96 536 Q164 492 232 536" : "M52 244 Q116 196 180 244"} />
  </>;
  return <Diagram id="remise-des-cles" title="La livraison tient dans la main du client" says="Les comptes ouvrent les services. La procédure lui permet de continuer quand tu n'es plus là." description="Un anneau porte les clés du dépôt, de l'hébergement, du domaine et de la mesure, accompagné d'une procédure mise en avant." wideHeight={272} compactHeight={552} wide={render(false)} compact={render(true)} />;
}
