import { Diagram, Edge, FixedLine, Label } from "../primitives";
import { Bubble, Hand, Motif, Phone, Stroke, Surface, ToolLogo } from "./shared";
import { MiniRows, NumberPin, Panel } from "./chapter-shared";

export function FicheProspectQualifieMockup() {
  const fields = ["Personne", "Besoin", "Prix à valider", "Responsable", "Prochaine action : mardi"] as const;
  const draw = (compact: boolean) => <>
    <Panel x={compact ? 12 : 72} y={8} width={compact ? 304 : 536} height={compact ? 392 : 304} radius={24}>
      <ToolLogo name="Notion" x={compact ? 264 : 556} y={20} size={36} />
      <ToolLogo name="Gmail" x={compact ? 224 : 516} y={20} size={36} />
      <Label x={compact ? 32 : 96} y={42} text="Prospect qualifié" anchor="start" kind="title" />
      {fields.map((field, index) => <g key={field}>
        <Label x={compact ? 36 : 104} y={(compact ? 94 : 92) + index * (compact ? 56 : 44)} text={field} anchor="start" kind={index === 2 || index === 4 ? "title" : "text"} tone={index === 2 ? "accent" : undefined} maxChars={compact ? 25 : 40} />
        <FixedLine path={`M${compact ? 36 : 104} ${(compact ? 116 : 112) + index * (compact ? 56 : 44)} H${compact ? 288 : 576}`} accent={index === 4} />
      </g>)}
    </Panel>
    {[{ n: 1, y: 136 }, { n: 2, y: 192 }, { n: 3, y: 248 }].map((pin) => <NumberPin key={pin.n} x={compact ? 18 : 650} y={compact ? pin.y : 82 + pin.n * 58} number={pin.n} accent={pin.n === 2} />)}
    <Label x={compact ? 164 : 340} y={compact ? 436 : 348} text="1 Ce qu'il veut   2 Ce qui manque   3 Qui reprend" kind="note" maxChars={compact ? 27 : 58} />
  </>;
  return <Diagram id="fiche-prospect-qualifie" title="Cinq champs pour savoir quoi faire" says="La fiche montre le besoin, le manque, le responsable et la prochaine date sans recopier toute la conversation." description="Une fiche CRM affiche cinq champs, une alerte Prix à valider et Prochaine action mardi." wideHeight={368} compactHeight={456} wide={draw(false)} compact={draw(true)} />;
}

export function QuestionsQuiOuvrentUneRouteDiagram() {
  const draw = (compact: boolean) => {
    const points = compact ? [[164, 16], [164, 112], [76, 196], [164, 280], [252, 364]] as const : [[16, 128], [176, 128], [336, 56], [496, 128], [664, 128]] as const;
    return <>
      <Edge points={points} head={false} trajectory accent />
      {["Objectif", "Pièce", "Date"].map((label, index) => {
        const x = compact ? [164, 76, 252][index] : [176, 336, 496][index];
        const y = compact ? [112, 196, 364][index] : [128, 56, 128][index];
        return <Motif key={label} step={index}><circle cx={x} cy={y} r="28" fill="var(--em)" /><Label x={x} y={y} text={label} kind="title" tone="on-accent" /></Motif>;
      })}
      <Motif step={4}><Surface x={compact ? 28 : 264} y={compact ? 420 : 208} width={compact ? 272 : 152} height={56} radius={18} tone="surface" /><Label x={compact ? 164 : 340} y={compact ? 448 : 236} text="Détail secondaire" kind="muted-title" /></Motif>
    </>;
  };
  return <Diagram id="questions-route" title="Trois questions ouvrent la route" says="Objectif, pièce et date changent la direction. Le détail secondaire reste sur le bas-côté." description="Une route bifurque à Objectif, Pièce et Date tandis que Détail secondaire reste en dehors." wideHeight={280} compactHeight={492} wide={draw(false)} compact={draw(true)} />;
}

export function MessageVersFicheCRMDiagram() {
  const draw = (compact: boolean) => <>
    <Motif><Phone x={compact ? 64 : 16} y={8} width={compact ? 200 : 160} height={compact ? 160 : 232}>
      <ToolLogo name="WhatsApp" x={compact ? 80 : 32} y={24} size={40} />
      <ToolLogo name="Gmail" x={compact ? 124 : 76} y={24} size={40} />
      <Bubble x={compact ? 84 : 36} y={80} width={compact ? 160 : 120} height={64} />
      <Label x={compact ? 164 : 96} y={112} text="Message d'origine" kind="title" maxChars={compact ? 18 : 14} />
    </Phone></Motif>
    <Edge points={compact ? [[164, 168], [164, 224]] : [[176, 124], [232, 124]]} accent head={false} />
    <Stroke path={compact ? "M164 168 V412" : "M176 124 H640"} dashed accent />
    <Panel x={compact ? 24 : 232} y={compact ? 224 : 24} width={compact ? 280 : 432} height={compact ? 208 : 200} radius={24} step={1}>
      <ToolLogo name="Notion" x={compact ? 248 : 604} y={compact ? 236 : 36} size={40} />
      <Label x={compact ? 48 : 256} y={compact ? 258 : 58} text="Fiche prospect" anchor="start" kind="title" />
      {["Personne", "Besoin", "Manque", "Responsable", "Prochaine action"].map((field, index) => <g key={field}><Label x={compact ? 48 : 256} y={(compact ? 302 : 98) + index * (compact ? 28 : 26)} text={field} anchor="start" tone={index === 4 ? "accent" : undefined} /><FixedLine path={`M${compact ? 176 : 408} ${(compact ? 302 : 98) + index * (compact ? 28 : 26)} H${compact ? 280 : 640}`} /></g>)}
    </Panel>
  </>;
  return <Diagram id="message-fiche-crm" title="La fiche garde le fil vers l'origine" says="Le message remplit cinq champs, mais le fil émeraude permet toujours de revenir à la source." description="WhatsApp et Gmail alimentent une fiche prospect Notion, reliée au message d'origine." wideHeight={248} compactHeight={448} wide={draw(false)} compact={draw(true)} />;
}

export function RelanceDansWhatsAppMockup() {
  const draw = (compact: boolean) => <>
    <Motif><Phone x={compact ? 24 : 64} y={8} width={compact ? 280 : 552} height={compact ? 420 : 312}>
      <ToolLogo name="WhatsApp" x={compact ? 44 : 88} y={28} size={40} />
      <ToolLogo name="Hermes Agent" x={compact ? 244 : 556} y={28} size={40} />
      <Label x={compact ? 164 : 340} y={48} text="Brouillon de relance" kind="title" />
      <Bubble x={compact ? 46 : 96} y={92} width={compact ? 236 : 360} height={compact ? 144 : 112} />
      <Label x={compact ? 66 : 120} y={124} text="Ton besoin : devis oubliés" anchor="start" />
      <Label x={compact ? 66 : 120} y={156} text="Le dossier est prêt" anchor="start" />
      <Label x={compact ? 66 : 120} y={194} text="Relire mardi ou mercredi ?" anchor="start" kind="title" tone="accent" maxChars={compact ? 24 : 32} />
      <Panel x={compact ? 60 : 472} y={compact ? 276 : 224} width={compact ? 208 : 128} height={64} radius={20} accent step={3}>
        <Hand x={compact ? 78 : 486} y={compact ? 282 : 230} scale={.65} onAccent />
        <Label x={compact ? 174 : 544} y={compact ? 308 : 256} text="Valider l'envoi" kind="title" tone="on-accent" />
      </Panel>
    </Phone></Motif>
    {[1, 2, 3].map((number, index) => <NumberPin key={number} x={compact ? 42 : 646} y={(compact ? 124 : 112) + index * 58} number={number} accent={number === 3} />)}
    <Label x={compact ? 164 : 340} y={compact ? 462 : 356} text="1 Besoin réel   2 État   3 Prochain geste" kind="note" maxChars={compact ? 25 : 50} />
  </>;
  return <Diagram id="relance-whatsapp" title="Le message reste un brouillon" says="Le besoin, l'état du dossier et le choix de date sont visibles avant le bouton de validation." description="Une interface WhatsApp montre une relance précise, la fiche liée et Valider l'envoi." wideHeight={376} compactHeight={480} wide={draw(false)} compact={draw(true)} />;
}
