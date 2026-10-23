import { Diagram, Edge, FixedLine, Label } from "../primitives";
import { Document, Hand, Motif, Person, Stroke, Surface, ToolLogo } from "./shared";
import { Panel } from "./chapter-shared";

export function ParcoursProspectCompletDiagram() {
  const stops = [["Découvre", "Instagram"], ["Demande", "Gmail"], ["Échange", "Notion"], ["Choisit", "Google Agenda"], ["Reçoit", "Stripe"]] as const;
  const draw = (compact: boolean) => <>
    <Edge path={compact ? "M64 28 C250 72 72 136 264 196 C76 256 252 320 64 388" : "M24 112 C160 24 256 200 380 112 C488 36 568 180 656 112"} accent trajectory head={false} />
    {stops.map(([label, tool], index) => {
      const x = compact ? [48, 220, 56, 216, 48][index] : 16 + index * 132;
      const y = compact ? 8 + index * 88 : [88, 32, 128, 40, 88][index];
      return <Motif key={label} step={index}><ToolLogo name={tool} x={x} y={y} size={48} /><Label x={x + 24} y={y + 66} text={label} kind="title" /><Label x={x + 24} y={y + 88} text="P-1042" tone="accent" /></Motif>;
    })}
  </>;
  return <Diagram id="parcours-prospect-complet" title="Le même identifiant traverse cinq scènes" says="La personne découvre, demande, échange, choisit et reçoit sans perdre son dossier." description="Un ruban continu émeraude relie Découvre, Demande, Échange, Choisit et Reçoit avec l'identifiant P-1042." wideHeight={232} compactHeight={464} wide={draw(false)} compact={draw(true)} />;
}

export function WorkflowMarketingDiagram() {
  const steps = [["Sources", "Perplexity"], ["Idées", "Notion"], ["Trois angles", "Hermes Agent"], ["Ton choix", "Hermes Agent"], ["Publication", "Instagram"]] as const;
  const draw = (compact: boolean) => <>{steps.map(([label, tool], index) => {
    const x = compact ? 24 : 4 + index * 136;
    const y = compact ? 8 + index * 112 : 32;
    const accent = label === "Ton choix";
    return <g key={label}><Panel x={x} y={y} width={compact ? 280 : 120} height={80} radius={20} accent={accent} step={index}>
      {accent ? <Hand x={x + 18} y={y + 12} scale={.62} onAccent /> : <ToolLogo name={tool} x={x + 12} y={y + 18} size={42} />}
      <Label x={x + (compact ? 80 : 66)} y={y + 40} text={label} anchor={compact ? "start" : "middle"} kind="title" maxChars={compact ? 24 : 12} tone={accent ? "on-accent" : undefined} />
    </Panel>{index < 4 ? <Edge points={compact ? [[164, y + 80], [164, y + 112]] : [[x + 120, 72], [x + 136, 72]]} accent={index === 2} step={index} /> : null}</g>;
  })}</>;
  return <Diagram id="workflow-marketing" title="La ligne éditoriale s'arrête devant ta main" says="Les sources deviennent trois angles. Ton choix ouvre seulement ensuite la publication." description="Une ligne de montage relie Sources, Idées, Trois angles, Ton choix et Publication avec les logos Perplexity, Notion, Hermes et Instagram." wideHeight={144} compactHeight={528} wide={draw(false)} compact={draw(true)} />;
}

export function WorkflowAdsDiagram() {
  const draw = (compact: boolean) => <>
    <Panel x={compact ? 8 : 16} y={8} width={compact ? 312 : 648} height={compact ? 416 : 272} radius={26}>
      <ToolLogo name="Perplexity" x={compact ? 24 : 32} y={24} size={44} />
      <ToolLogo name="Figma" x={compact ? 76 : 84} y={24} size={44} />
      <ToolLogo name="Hermes Agent" x={compact ? 128 : 136} y={24} size={44} />
      <ToolLogo name="Meta Ads" x={compact ? 232 : 552} y={24} size={44} />
      <ToolLogo name="Google Ads" x={compact ? 276 : 600} y={24} size={44} />
      <Label x={compact ? 28 : 36} y={96} text="Recherche" anchor="start" kind="title" />
      <Stroke path={`M${compact ? 132 : 136} 96 H${compact ? 292 : 632}`} soft />
      {["Angle A", "Angle B", "Angle C"].map((label, index) => <Panel key={label} x={(compact ? 28 : 40) + index * (compact ? 88 : 152)} y={132} width={compact ? 76 : 128} height={96} radius={16} step={index}><Label x={(compact ? 66 : 104) + index * (compact ? 88 : 152)} y={180} text={label} kind="title" maxChars={compact ? 8 : 12} /></Panel>)}
      <Panel x={compact ? 52 : 236} y={compact ? 260 : 164} width={compact ? 224 : 208} height={72} radius={36} accent step={4}><Hand x={compact ? 70 : 254} y={compact ? 268 : 172} scale={.62} onAccent /><Label x={compact ? 182 : 354} y={compact ? 296 : 200} text="Ta validation" kind="title" tone="on-accent" /></Panel>
      <Label x={compact ? 28 : 504} y={compact ? 370 : 156} text="Lancement" anchor="start" kind="title" />
      <Label x={compact ? 28 : 504} y={compact ? 398 : 190} text="Rapport" anchor="start" tone="accent" />
      <Label x={compact ? 292 : 632} y={compact ? 398 : 234} text="Dépenses" anchor="end" kind="note" />
    </Panel>
  </>;
  return <Diagram id="workflow-ads" title="La campagne reste sur la table avant de partir" says="Recherche, variantes, validation, lancement et rapport occupent cinq zones distinctes." description="Une table de création Ads montre Recherche, trois variantes, Ta validation, Lancement, Rapport et Dépenses avec les logos réels." wideHeight={288} compactHeight={432} wide={draw(false)} compact={draw(true)} />;
}

export function WorkflowCRMDevisSupportDiagram() {
  const branches = [["Rendez-vous", "Google Agenda"], ["Devis", "Stripe"], ["Support", "Gmail"]] as const;
  const draw = (compact: boolean) => <>
    <Panel x={compact ? 48 : 248} y={8} width={compact ? 232 : 184} height={112} radius={28} accent step={0}>
      <ToolLogo name="Notion" x={compact ? 68 : 268} y={24} size={48} />
      <ToolLogo name="WhatsApp" x={compact ? 116 : 316} y={24} size={48} />
      <Label x={compact ? 164 : 340} y={92} text="Prospect" kind="title" tone="on-accent" />
    </Panel>
    {branches.map(([label, tool], index) => {
      const x = compact ? 24 : 24 + index * 224;
      const y = compact ? 168 + index * 112 : 176;
      return <g key={label}>
        <Edge points={compact ? [[164, 120], [164, y], [x + 140, y]] : [[340, 120], [340, 152], [x + 96, 176]]} accent={index === 1} head={false} step={index} />
        <Panel x={x} y={y} width={compact ? 280 : 192} height={80} radius={20} step={index + 1}><ToolLogo name={tool} x={x + 12} y={y + 12} size={44} /><Label x={x + 68} y={y + 40} text={label} anchor="start" kind="title" /></Panel>
      </g>;
    })}
  </>;
  return <Diagram id="workflow-crm-devis-support" title="Une fiche, trois décisions" says="Le prospect reste central. Rendez-vous, devis et support repartent chacun vers leur outil et leur responsable." description="Une fiche Prospect Notion et WhatsApp se divise en trois branches : Rendez-vous, Devis et Support." wideHeight={272} compactHeight={496} wide={draw(false)} compact={draw(true)} />;
}

export function WorkflowCrossPoleDiagramV2() {
  const steps = ["Pub", "Demande", "Échange", "Devis", "Suivi"] as const;
  const draw = (compact: boolean) => <>
    <Stroke path={compact ? "M72 36 V444" : "M40 104 H640"} accent />
    {steps.map((label, index) => {
      const x = compact ? 72 : 72 + index * 136;
      const y = compact ? 40 + index * 96 : 104;
      return <Motif key={label} step={index}><circle cx={x} cy={y} r={index === 2 ? 28 : 18} fill={index === 2 ? "var(--em)" : "#262b28"} stroke="rgba(241,245,242,.35)" /><Label x={compact ? 112 : x} y={compact ? y : y + 50} text={label} anchor={compact ? "start" : "middle"} kind="title" tone={index === 2 ? "accent" : undefined} /><Label x={compact ? 264 : x} y={compact ? y : y - 38} text="P-1042" anchor={compact ? "end" : "middle"} tone="accent" /></Motif>;
    })}
  </>;
  return <Diagram id="workflow-interpoles-v2" title="Le prospect garde son histoire" says="Pub, demande, échange, devis et suivi partagent le même dossier sans partager la même décision." description="Une ligne continue relie Pub, Demande, Échange, Devis et Suivi avec le même identifiant P-1042." wideHeight={192} compactHeight={480} wide={draw(false)} compact={draw(true)} />;
}
