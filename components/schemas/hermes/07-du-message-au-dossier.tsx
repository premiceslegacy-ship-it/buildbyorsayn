import { Diagram, Edge, FixedLine, Label } from "../primitives";
import { Bubble, Hand, Motif, Phone, Stroke, Surface, ToolLogo } from "./shared";

export function TelegramDevisAvecValidationMockup() {
  const render = (compact: boolean) => {
    const x = compact ? 44 : 184;
    const width = compact ? 240 : 312;
    return <>
      <Motif><Phone x={x} y={8} width={width} height={compact ? 472 : 408}>
        <ToolLogo name="Telegram" x={x + 18} y={28} size={36} />
        <ToolLogo name="Hermes Agent" x={x + width - 54} y={28} size={36} />
        <Bubble x={x + 22} y={78} width={width - 44} height={72} /><Label x={x + 40} y={104} text="Un devis pour vendredi ?" anchor="start" /><Label x={x + 40} y={128} text="Demande reçue" anchor="start" kind="note" />
        <Surface x={x + 22} y={166} width={width - 44} height={compact ? 176 : 144} radius={20} tone="surface" /><Label x={x + 40} y={194} text="Informations manquantes" anchor="start" kind="title" /><Label x={x + 40} y={224} text="Surface et photos" anchor="start" /><FixedLine path={`M${x + 40} ${compact ? 252 : 242} H${x + width - 40}`} /><Label x={x + 40} y={compact ? 282 : 270} text="Brouillon prêt" anchor="start" /><Label x={x + 40} y={compact ? 310 : 294} text="À : prospect" anchor="start" kind="note" />
        {[["Valider", true], ["Corriger", false], ["Refuser", false]].map(([label, accent], index) => {
          const bx = compact ? x + 22 : x + 22 + index * 90;
          const by = compact ? 354 + index * 34 : 330;
          return <g key={String(label)}><Surface x={bx} y={by} width={compact ? width - 44 : 82} height={compact ? 28 : 40} radius={14} tone={accent ? "accent" : "paper"} /><Label x={bx + (compact ? (width - 44) / 2 : 41)} y={by + (compact ? 14 : 20)} text={String(label)} tone={accent ? "on-accent" : undefined} /></g>;
        })}
      </Phone></Motif>
      <Motif step={1}><Label x={compact ? 164 : 96} y={compact ? 512 : 112} text="1  Demande reçue" kind="note" /><Label x={compact ? 164 : 96} y={compact ? 540 : 224} text="2  Travail préparé" kind="note" /><Label x={compact ? 164 : 584} y={compact ? 568 : 350} text="3  Tu décides ici" kind="note" tone="accent" /></Motif>
    </>;
  };
  return <Diagram id="telegram-devis-validation" title="Une vraie conversation, une vraie pause" says="Le bot rassemble les manques et montre le texte final avant tes trois choix." description="Une conversation Telegram montre le message du prospect, les informations manquantes, un brouillon et les boutons Valider, Corriger, Refuser." wideHeight={432} compactHeight={584} wide={render(false)} compact={render(true)} />;
}

export function SousLaBulleDeMessageDiagram() {
  const render = (compact: boolean) => <>
    <Motif><Bubble x={compact ? 40 : 232} y={8} width={compact ? 248 : 216} height={88} accent /><ToolLogo name="WhatsApp" x={compact ? 64 : 256} y={26} size={40} /><Label x={compact ? 128 : 320} y={50} text="Message" anchor="start" kind="title" /></Motif>
    <Edge points={compact ? [[164, 96], [164, 136]] : [[340, 96], [340, 120]]} accent step={0} />
    {["Dossier", "Préparation"].map((label, index) => {
      const x = compact ? 48 - index * 12 : 176 - index * 40;
      const y = compact ? 136 + index * 104 : 120 + index * 80;
      const width = compact ? 232 + index * 24 : 328 + index * 80;
      return <Motif key={label} step={index + 1}><Surface x={x} y={y} width={width} height={80} radius={24} tone="paper" /><ToolLogo name={index === 0 ? "Notion" : "Hermes Agent"} x={x + 18} y={y + 18} size={42} /><Label x={x + 76} y={y + 40} text={label} anchor="start" kind="title" tone={index === 0 ? "accent" : undefined} /></Motif>;
    })}
  </>;
  return <Diagram id="sous-bulle-message" title="Sous la bulle, le travail apparaît" says="Le message reste visible au-dessus du dossier et de la préparation en coulisse." description="Une bulle WhatsApp flotte au-dessus de deux couches : Dossier et Préparation." wideHeight={296} compactHeight={320} wide={render(false)} compact={render(true)} />;
}

export function TroisCanauxMemeValidationMockup() {
  const channels = ["Telegram", "WhatsApp", "Slack"] as const;
  const render = (compact: boolean) => <>
    {channels.map((channel, index) => {
      const x = compact ? 24 + index * 20 : 16 + index * 176;
      const y = compact ? 8 + index * 136 : 16;
      return <Motif key={channel} step={index}><Phone x={x} y={y} width={compact ? 208 : 152} height={compact ? 112 : 208}><ToolLogo name={channel} x={x + 16} y={y + 20} size={38} /><Label x={x + 66} y={y + 38} text={channel} anchor="start" kind="title" /><Bubble x={x + 18} y={y + (compact ? 64 : 88)} width={compact ? 172 : 116} height={compact ? 34 : 62} /></Phone></Motif>;
    })}
    <Motif step={4}><Surface x={compact ? 48 : 552} y={compact ? 424 : 64} width={compact ? 232 : 112} height={96} radius={28} tone="accent" /><Hand x={compact ? 78 : 576} y={compact ? 438 : 76} scale={.75} onAccent /><Label x={compact ? 164 : 608} y={compact ? 494 : 138} text="Ton accord" kind="title" tone="on-accent" /></Motif>
    {channels.map((channel, index) => <Edge key={channel} points={compact ? [[128 + index * 20, 120 + index * 136], [164, 424]] : [[92 + index * 176, 224], [92 + index * 176, 256], [552, 112]]} accent step={index} />)}
  </>;
  return <Diagram id="trois-canaux-validation" title="Trois canaux, le même geste" says="Telegram, WhatsApp et Slack convergent vers une seule décision humaine explicite." description="Trois téléphones Telegram, WhatsApp et Slack convergent vers une main nommée Ton accord." wideHeight={280} compactHeight={536} wide={render(false)} compact={render(true)} />;
}

export function TicketQuatreEtatsDiagram() {
  const states = ["Préparé", "Validé", "Envoyé", "Refusé"] as const;
  const render = (compact: boolean) => <>
    <Motif><Stroke path={compact ? "M64 48 V360" : "M72 96 H608"} soft /></Motif>
    {states.map((state, index) => {
      const x = compact ? 40 : 40 + index * 176;
      const y = compact ? 24 + index * 104 : 64;
      return <Motif key={state} step={index}><circle cx={compact ? 64 : x + 32} cy={compact ? y + 24 : 96} r={state === "Envoyé" ? 12 : 8} fill={state === "Envoyé" ? "var(--em)" : "var(--t3)"} /><Surface x={compact ? 96 : x} y={compact ? y : 120} width={compact ? 192 : 128} height={48} radius={16} tone={state === "Envoyé" ? "accent" : "paper"} /><Label x={compact ? 192 : x + 64} y={compact ? y + 24 : 144} text={state} kind="title" tone={state === "Envoyé" ? "on-accent" : undefined} /></Motif>;
    })}
    <Motif step={5}><Stroke path={compact ? "M64 360 Q64 408 112 408" : "M568 96 Q632 96 632 160"} dashed /><Label x={compact ? 128 : 632} y={compact ? 412 : 188} text="Pas de second envoi" anchor={compact ? "start" : "end"} tone="accent" /></Motif>
  </>;
  return <Diagram id="ticket-quatre-etats" title="Le ticket sait où il s'est arrêté" says="Un état écrit empêche de répéter un envoi quand la connexion a coupé." description="Un ticket glisse entre Préparé, Validé, Envoyé et Refusé puis bloque un second envoi." wideHeight={208} compactHeight={440} wide={render(false)} compact={render(true)} />;
}
