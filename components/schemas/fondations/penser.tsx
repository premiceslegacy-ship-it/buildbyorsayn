import { Diagram, Edge, Label } from "../primitives";
import { Document, Folder, Motif, Stroke, Surface } from "./shared";
import { Check, LogoTile, TinyCard } from "./shared-b";

export function QuestionsAvantOutilsDiagram() {
  const table = (compact: boolean) => {
    const cx = compact ? 164 : 340;
    const cy = compact ? 172 : 132;
    const points = compact
      ? [[84, 80], [244, 80], [84, 264], [244, 264]] as const
      : [[176, 52], [504, 52], [176, 212], [504, 212]] as const;
    const labels = ["Personne", "Problème", "Action", "Preuve"] as const;
    return <>
      <Motif><ellipse cx={cx} cy={cy} rx={compact ? 92 : 154} ry={compact ? 70 : 92} fill="var(--carte)" /><Stroke path={`M${cx - (compact ? 52 : 88)} ${cy} H${cx + (compact ? 52 : 88)} M${cx} ${cy - (compact ? 36 : 52)} V${cy + (compact ? 36 : 52)}`} soft /></Motif>
      {points.map(([x, y], index) => <TinyCard key={labels[index]} x={x - (compact ? 56 : 72)} y={y - 24} width={compact ? 112 : 144} height={48} label={labels[index]} accent={labels[index] === "Preuve"} step={index} />)}
      <Motif step={5}><Surface x={compact ? 94 : 278} y={compact ? 348 : 278} width={compact ? 140 : 124} height={compact ? 56 : 52} radius={18} tone="paper" /><Label x={compact ? 164 : 340} y={compact ? 376 : 304} text="Outil ensuite" kind="title" /><Stroke path={`M${cx} ${compact ? 320 : 238} V${compact ? 348 : 278}`} dashed /></Motif>
    </>;
  };
  return <Diagram id="questions-avant-outils" title="L'outil attend son tour" says="La personne, le problème, l'action et la preuve se décident avant le logiciel." description="Quatre cartes entourent une table : personne, problème, action et preuve. L'outil attend sous la table." wideHeight={336} compactHeight={404} wide={table(false)} compact={table(true)} />;
}

export function ToiEtTonIADiagram() {
  const scene = (compact: boolean) => compact ? <>
    <Motif><Surface x={16} y={8} width={296} height={150} radius={24} /><LogoTile logo="claude" x={36} y={28} size={40} /><LogoTile logo="chatgpt" x={80} y={28} size={40} /><LogoTile logo="gemini" x={124} y={28} size={40} /><TinyCard x={36} y={92} width={108} height={42} label="Préparer" /><TinyCard x={176} y={92} width={108} height={42} label="Construire" /></Motif>
    <Edge points={[[164, 158], [164, 198]]} step={2} />
    <Motif step={3}><Surface x={16} y={198} width={296} height={154} radius={24} tone="paper" /><Document x={48} y={226} width={64} height={80} /><Stroke path="M184 236 H272 M184 260 H248" /><TinyCard x={172} y={286} width={112} height={42} label="Choisir" /><Check x={116} y={322} /><Label x={140} y={322} text="Vérifier" anchor="start" kind="title" tone="accent" /></Motif>
  </> : <>
    <Motif><Surface x={16} y={32} width={300} height={176} radius={28} /><Label x={40} y={60} text="Ton IA" anchor="start" kind="note" /><LogoTile logo="claude" x={40} y={80} size={44} /><LogoTile logo="chatgpt" x={92} y={80} size={44} /><LogoTile logo="gemini" x={144} y={80} size={44} /><TinyCard x={40} y={148} width={112} height={44} label="Préparer" /><TinyCard x={168} y={148} width={124} height={44} label="Construire" /></Motif>
    <Edge points={[[316, 120], [364, 120]]} step={2} />
    <Motif step={3}><Surface x={364} y={32} width={300} height={176} radius={28} tone="paper" /><Label x={388} y={60} text="Toi" anchor="start" kind="note" /><Document x={392} y={84} width={64} height={80} /><Stroke path="M484 92 H632 M484 118 H604" /><TinyCard x={484} y={148} width={88} height={44} label="Choisir" /><Check x={596} y={170} /><Label x={620} y={170} text="Vérifier" anchor="start" kind="title" tone="accent" /></Motif>
  </>;
  return <Diagram id="toi-et-ton-ia" title="Un établi partagé" says="L'IA prépare et construit. Tu choisis puis tu contrôles ce qui engage le projet." description="Sur un établi partagé, Claude, ChatGPT et Gemini préparent et construisent, puis une personne choisit et vérifie." wideHeight={240} compactHeight={360} wide={scene(false)} compact={scene(true)} />;
}

export function FormulaireSousControleDiagram() {
  const wide = <>
    <Motif><Document x={12} y={72} width={76} height={96} /><Label x={50} y={194} text="Demande" kind="title" /></Motif>
    {[[120, "Accord"], [260, "Ranger"], [400, "Confirmer"], [540, "Relire"]].map(([x, label], index) => <Motif step={index + 1} key={String(label)}><Surface x={Number(x)} y={56} width={112} height={128} radius={24} tone={label === "Relire" ? "accent" : "surface"} /><Stroke path={`M${Number(x) + 24} 80 V160 M${Number(x) + 88} 80 V160 M${Number(x) + 24} 104 H${Number(x) + 88}`} /><Label x={Number(x) + 56} y={208} text={String(label)} kind="title" tone={label === "Relire" ? "accent" : undefined} />{label === "Confirmer" ? <LogoTile logo="gmail" x={Number(x) + 36} y={108} size={40} /> : null}{label === "Relire" ? <Check x={Number(x) + 56} y={128} /> : null}</Motif>)}
    <Edge path="M88 120 H652" step={0} />
    <g data-schema-edge="true" data-schema-step="1"><path data-schema-line="true" pathLength="1" d="M176 184 V244 H72" fill="none" stroke="var(--err)" strokeWidth="1.5" strokeDasharray="1 1" strokeLinecap="round" strokeLinejoin="round" /></g>
    <Label x={72} y={270} text="Accord manquant" anchor="start" kind="note" tone="error" />
  </>;
  const compact = <>
    <Motif><Document x={126} y={8} width={76} height={84} /><Label x={164} y={112} text="Demande" kind="title" /></Motif>
    <Edge points={[[164, 124], [164, 152]]} step={0} />
    {[[152, "Accord"], [232, "Ranger"], [312, "Confirmer"], [392, "Relire"]].map(([y, label], index) => <Motif step={index + 1} key={String(label)}><Surface x={44} y={Number(y)} width={240} height={56} radius={18} tone={label === "Relire" ? "accent" : "surface"} />{label === "Relire" ? <text x="164" y={Number(y) + 29} textAnchor="middle" dominantBaseline="central" fill="var(--sur-em)" fontFamily="var(--font-t)" fontSize="17" fontWeight="650">Relire</text> : <Label x={164} y={Number(y) + 28} text={String(label)} kind="title" />}{label === "Confirmer" ? <LogoTile logo="gmail" x={236} y={Number(y) + 8} size={40} /> : null}{label === "Relire" ? <Check x={260} y={Number(y) + 28} /> : null}</Motif>)}
    <g data-schema-edge="true" data-schema-step="1"><path data-schema-line="true" pathLength="1" d="M44 180 H16 V476 H84" fill="none" stroke="var(--err)" strokeWidth="1.5" strokeDasharray="1 1" strokeLinecap="round" strokeLinejoin="round" /></g>
    <Label x={92} y={480} text="Accord manquant" anchor="start" kind="note" tone="error" />
  </>;
  return <Diagram id="formulaire-sous-controle" title="La demande passe cinq contrôles" says="Chaque étape garde une sortie claire, y compris quand l'accord manque." description="Une demande traverse accord, rangement, confirmation et relecture. Sans accord, elle revient vers une personne." wideHeight={284} compactHeight={500} wide={wide} compact={compact} />;
}

export function DossierProjetVivantDiagram() {
  const folder = (compact: boolean) => {
    const x = compact ? 24 : 24;
    const width = compact ? 280 : 412;
    const tabs = ["Brief", "Marque", "Choix", "Tests"] as const;
    return <>
      <Motif><Folder x={x} y={compact ? 52 : 64} width={width} height={compact ? 200 : 184} />{tabs.map((label, index) => <g key={label}><Surface x={x + 24 + index * (compact ? 62 : 86)} y={(compact ? 32 : 40) - index * 5} width={compact ? 58 : 78} height={56 + index * 5} radius={12} tone="paper" /><Label x={x + 53 + index * (compact ? 62 : 86)} y={compact ? 62 : 68} text={label} kind="note" /></g>)}<LogoTile logo="github" x={x + width - 68} y={compact ? 168 : 144} size={44} /></Motif>
      <Edge points={compact ? [[164, 260], [164, 304]] : [[436, 156], [488, 156]]} step={4} />
      <Motif step={5}><Folder x={compact ? 64 : 488} y={compact ? 304 : 72} width={compact ? 200 : 168} height={compact ? 112 : 136} accent /><Label x={compact ? 164 : 572} y={compact ? 368 : 140} text="Projet suivant" kind="title" tone="accent" /></Motif>
    </>;
  };
  return <Diagram id="dossier-projet-vivant" title="Le contexte devient un dossier" says="Le prochain projet repart des choix relus, pas d'une conversation à retrouver." description="Un dossier ouvert contient le brief, la marque, les choix et les tests, puis se rouvre pour le projet suivant." wideHeight={240} compactHeight={424} wide={folder(false)} compact={folder(true)} />;
}
