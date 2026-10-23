import { Diagram, Edge, Label } from "../primitives";
import { Document, Folder, Motif, Person, Stroke, Surface } from "./shared";
import { Check, LogoTile, TinyCard } from "./shared-b";

export function ModeleContexteReponseDiagram() {
  const render = (compact: boolean) => compact ? <>
    <Motif><Surface x={28} y={8} width={272} height={72} radius={20} tone="paper" /><Label x={164} y={44} text="Contexte" kind="title" /></Motif>
    <Edge points={[[164, 80], [164, 120]]} step={0} />
    <Motif step={1}><path d="M92 120 H236 L204 232 H124 Z" fill="var(--carte)" /><Stroke path="M112 148 H216 M120 172 H208 M128 196 H200" /><Label x={164} y={256} text="Suites possibles" kind="title" /><LogoTile logo="claude" x={78} y={156} size={32} /><LogoTile logo="chatgpt" x={218} y={156} size={32} /><LogoTile logo="gemini" x={148} y={114} size={32} /></Motif>
    <Edge points={[[164, 272], [164, 312]]} step={2} />
    <Motif step={3}><Surface x={44} y={312} width={240} height={88} radius={22} /><Label x={164} y={340} text="Réponse" kind="title" /><Check x={112} y={372} /><Label x={136} y={372} text="À vérifier" anchor="start" tone="accent" /></Motif>
  </> : <>
    <Motif><Surface x={8} y={72} width={144} height={88} radius={22} tone="paper" /><Label x={80} y={116} text="Contexte" kind="title" /></Motif>
    <Edge points={[[152, 116], [208, 116]]} step={0} />
    <Motif step={1}><path d="M208 44 H408 L360 188 H256 Z" fill="var(--carte)" /><Stroke path="M238 80 H380 M248 108 H370 M260 136 H358" /><LogoTile logo="claude" x={218} y={152} size={34} /><LogoTile logo="chatgpt" x={300} y={34} size={34} /><LogoTile logo="gemini" x={366} y={152} size={34} /><Label x={308} y={216} text="Suites possibles" kind="title" /></Motif>
    <Edge points={[[408, 116], [464, 116]]} step={2} />
    <Motif step={3}><Surface x={464} y={72} width={208} height={88} radius={22} /><Label x={568} y={104} text="Réponse" kind="title" /><Check x={520} y={140} /><Label x={544} y={140} text="À vérifier" anchor="start" tone="accent" /></Motif>
  </>;
  return <Diagram id="modele-contexte-reponse" title="Le modèle choisit une suite probable" says="Il transforme le contexte reçu. La réponse reste à vérifier dans le monde réel." description="Le contexte traverse un prisme de suites possibles. Une réponse sort et porte la mention à vérifier." wideHeight={240} compactHeight={408} wide={render(false)} compact={render(true)} />;
}

export function ValiseDuContexteDiagram() {
  const render = (compact: boolean) => compact ? <>
    <Motif><Surface x={32} y={32} width={264} height={176} radius={26} tone="paper" /><Stroke path="M112 32 V14 H216 V32 M32 76 H296" /><TinyCard x={52} y={96} width={224} height={30} label="Brief" /><TinyCard x={52} y={136} width={224} height={30} label="Fichier cible" /><TinyCard x={52} y={176} width={224} height={30} label="Règles utiles" accent /></Motif>
    <Edge points={[[164, 220], [164, 252]]} step={3} />
    <Motif step={4}><Surface x={32} y={252} width={264} height={164} radius={26} /><Stroke path="M52 276 Q116 252 160 286 T276 286 M52 312 Q106 284 160 324 T276 324 M52 350 Q116 314 168 362 T276 356" /><Label x={164} y={394} text="Trop de bruit" kind="title" /></Motif>
  </> : <>
    <Motif><Surface x={16} y={32} width={292} height={184} radius={28} tone="paper" /><Stroke path="M112 32 V12 H212 V32 M16 80 H308" /><TinyCard x={44} y={104} width={236} height={30} label="Brief" /><TinyCard x={44} y={144} width={236} height={30} label="Fichier cible" /><TinyCard x={44} y={184} width={236} height={30} label="Règles utiles" accent /></Motif>
    <Label x={162} y={244} text="Contexte choisi" kind="title" tone="accent" />
    <Motif step={4}><Surface x={372} y={32} width={292} height={184} radius={28} /><Stroke path="M396 68 Q460 32 512 76 T640 68 M396 108 Q448 74 512 116 T640 110 M396 150 Q460 104 520 158 T640 152 M396 188 Q452 148 512 194 T640 188" /><Label x={518} y={244} text="Trop de bruit" kind="title" /></Motif>
  </>;
  return <Diagram id="valise-du-contexte" title="Une valise, pas toute la maison" says="Trois documents choisis se retrouvent mieux qu'un historique qui déborde." description="Une valise ordonnée contient le brief, le fichier cible et les règles utiles. Un chariot voisin déborde de bruit." wideHeight={264} compactHeight={424} wide={render(false)} compact={render(true)} />;
}

export function ComptoirAPIDiagram() {
  const render = (compact: boolean) => compact ? <>
    <Motif><Document x={24} y={20} width={72} height={88} /><Label x={60} y={132} text="Demande" kind="title" /></Motif>
    <Edge path="M96 64 H148 V116" step={0} />
    <Motif step={1}><Surface x={40} y={148} width={248} height={124} radius={24} /><Stroke path="M40 188 H288 M96 188 V272 M232 188 V272" /><Label x={164} y={168} text="API" kind="title" /><Label x={164} y={232} text="Service" kind="title" /></Motif>
    <Edge path="M180 272 V312 H232" step={2} />
    <Motif step={3}><Surface x={136} y={312} width={168} height={72} radius={20} tone="paper" /><Label x={220} y={336} text="Réponse" kind="title" /><Label x={220} y={366} text="Statut" tone="accent" /></Motif>
  </> : <>
    <Motif><Document x={16} y={68} width={72} height={88} /><Label x={52} y={184} text="Demande" kind="title" /></Motif>
    <Edge points={[[88, 112], [152, 112]]} step={0} />
    <Motif step={1}><Surface x={152} y={32} width={264} height={176} radius={26} /><Stroke path="M152 84 H416 M224 84 V208 M344 84 V208" /><Label x={284} y={58} text="API" kind="title" /><Label x={284} y={146} text="Service" kind="title" /></Motif>
    <Edge points={[[416, 112], [472, 112]]} step={2} />
    <Motif step={3}><Surface x={472} y={68} width={192} height={88} radius={22} tone="paper" /><Label x={568} y={98} text="Réponse" kind="title" /><Label x={568} y={134} text="Statut" tone="accent" /></Motif>
  </>;
  return <Diagram id="comptoir-api" title="Le guichet entre deux logiciels" says="La demande entre dans un format prévu. La réponse revient avec son état." description="Une demande passe par un comptoir API vers un service. Le plateau revient avec une réponse et un statut." wideHeight={224} compactHeight={392} wide={render(false)} compact={render(true)} />;
}

export function RoleSeulMethodeCompleteDiagram() {
  const render = (compact: boolean) => compact ? <>
    <Motif><Surface x={40} y={8} width={248} height={112} radius={24} /><Surface x={104} y={28} width={120} height={40} radius={20} tone="paper" /><Label x={164} y={48} text="Designer" kind="title" /><Label x={164} y={94} text="Il improvise" /></Motif>
    <Edge points={[[164, 120], [164, 152]]} step={1} />
    <Motif step={2}><Surface x={24} y={152} width={280} height={220} radius={26} tone="paper" /><Document x={48} y={184} width={60} height={76} /><Folder x={132} y={184} width={72} height={76} /><Stroke path="M228 196 L280 248 M262 214 A24 24 0 1 0 238 238" accent /><Label x={78} y={292} text="Sources" /><Label x={168} y={292} text="Étapes" /><Check x={164} y={338} /><Label x={188} y={338} text="Test final" anchor="start" kind="title" tone="accent" /></Motif>
  </> : <>
    <Motif><Surface x={16} y={48} width={248} height={144} radius={26} /><Surface x={72} y={72} width={136} height={44} radius={22} tone="paper" /><Label x={140} y={94} text="Designer" kind="title" /><Label x={140} y={154} text="Il improvise" /></Motif>
    <Edge points={[[264, 120], [320, 120]]} step={1} />
    <Motif step={2}><Surface x={320} y={24} width={344} height={192} radius={28} tone="paper" /><Document x={348} y={60} width={64} height={80} /><Folder x={438} y={60} width={84} height={80} /><Stroke path="M550 72 L630 152 M606 88 A34 34 0 1 0 572 122" accent /><Label x={380} y={174} text="Sources" /><Label x={480} y={174} text="Étapes" /><Check x={574} y={186} /><Label x={598} y={186} text="Test final" anchor="start" kind="title" tone="accent" /></Motif>
  </>;
  return <Diagram id="role-seul-methode-complete" title="Le badge ne remplit pas l'établi" says="Un rôle donne une posture. La méthode apporte les sources, les étapes et le test." description="À gauche, un badge Designer flotte sur une table vide. À droite, des sources, des étapes et un test final occupent l'établi." wideHeight={240} compactHeight={380} wide={render(false)} compact={render(true)} />;
}

export function QuiFaitQuoiIADiagram() {
  const labels = ["Produire", "Relier", "Organiser", "Décider"] as const;
  const render = (compact: boolean) => <>{labels.map((label, index) => {
    const x = compact ? 32 : 20 + index * 168;
    const y = compact ? 16 + index * 100 : 40 + (index % 2) * 28;
    const logo = index === 0 ? "openrouter" : index === 1 ? "claude" : index === 2 ? "hermes" : null;
    return <Motif step={index} key={label}>
      <Surface x={x} y={y} width={compact ? 264 : 136} height={72} radius={22} tone={label === "Décider" ? "accent" : "surface"} />
      {logo ? <><LogoTile logo={logo} x={x + (compact ? 16 : 8)} y={y + (compact ? 16 : 22)} size={compact ? 40 : 28} />{index === 0 ? <LogoTile logo="gemini" x={x + (compact ? 48 : 34)} y={y + (compact ? 16 : 22)} size={compact ? 40 : 28} /> : null}</> : <Person x={x + 36} y={y + 24} accent />}
      {label === "Décider" ? <text x={x + (compact ? 88 : 76)} y={y + 37} dominantBaseline="central" fill="var(--sur-em)" fontFamily="var(--font-t)" fontSize="17" fontWeight="650">Décider</text> : <Label x={x + (compact ? 88 : 76)} y={y + 36} text={label} anchor="start" kind="title" />}
      {index < labels.length - 1 ? <Edge points={compact ? [[164, y + 72], [164, y + 100]] : [[x + 136, y + 36], [x + 168, 76 + ((index + 1) % 2) * 28]]} step={index} /> : null}
    </Motif>;
  })}</>;
  return <Diagram id="qui-fait-quoi-ia" title="Quatre rôles, une porte finale" says="Le modèle produit, le MCP relie, l'agent organise et tu gardes la décision." description="Une scène en quatre plans sépare produire, relier, organiser et décider. La décision humaine ouvre la porte finale." wideHeight={176} compactHeight={388} wide={render(false)} compact={render(true)} />;
}
