import { Diagram, Edge, FixedLine, Label } from "../primitives";
import { Document, Motif, Surface, Terminal, ToolLogo } from "./shared";

export function TerminalInstallationHermesMockup() {
  const command = "curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash";
  const render = (compact: boolean) => {
    const x = compact ? 12 : 40;
    const width = compact ? 304 : 600;
    return <>
      <Motif><Terminal x={x} y={8} width={width} height={compact ? 272 : 232}>
        <Label x={x + 20} y={34} text="Terminal" anchor="start" kind="note" />
        <Label x={x + 22} y={76} text="$" anchor="start" tone="accent" />
        <Label x={x + 42} y={76} text={compact ? "curl -fsSL|hermes-agent.nousresearch.com|/install.sh | bash" : command} maxChars={compact ? 31 : 72} anchor="start" />
        <FixedLine path={`M${x + 22} ${compact ? 150 : 122} H${x + width - 22}`} />
        <Label x={x + 22} y={compact ? 184 : 154} text="Installation terminée" anchor="start" kind="title" tone="accent" />
        <ToolLogo name="Ghostty" x={x + width - 102} y={compact ? 208 : 164} size={42} />
        <ToolLogo name="Hermes Agent" x={x + width - 56} y={compact ? 208 : 164} size={42} />
      </Terminal></Motif>
      <Motif step={1}><Label x={compact ? 20 : 56} y={compact ? 306 : 270} text="1  Vérifie le domaine" anchor="start" tone="accent" /><Label x={compact ? 20 : 262} y={compact ? 334 : 270} text="2  Colle une seule fois" anchor="start" /><Label x={compact ? 20 : 474} y={compact ? 362 : 270} text="3  Recharge le terminal" anchor="start" /></Motif>
    </>;
  };
  return <Diagram id="terminal-installation-hermes" title="La commande, au bon endroit" says="Tu contrôles le domaine, tu colles une fois, puis tu recharges le terminal." description="Une fenêtre Ghostty montre la commande officielle d'installation Hermes et trois repères de contrôle." wideHeight={288} compactHeight={376} wide={render(false)} compact={render(true)} />;
}

export function TroisVoyantsInstallationDiagram() {
  const labels = ["Version", "Diagnostic", "État complet"] as const;
  const render = (compact: boolean) => <>{labels.map((label, index) => {
    const x = compact ? 24 : 32 + index * 216;
    const y = compact ? 8 + index * 112 : 24;
    return <Motif key={label} step={index}>
      <Surface x={x} y={y} width={compact ? 280 : 184} height={80} radius={40} tone={index === 1 ? "accent" : "paper"} />
      <circle cx={x + 34} cy={y + 40} r={9} fill={index === 1 ? "var(--sur-em)" : "var(--t3)"} />
      <Label x={x + 58} y={y + 40} text={label} anchor="start" kind="title" tone={index === 1 ? "on-accent" : undefined} />
      {index === 1 ? <ToolLogo name="Hermes Agent" x={x + (compact ? 222 : 132)} y={y + 20} size={40} /> : null}
    </Motif>;
  })}</>;
  return <Diagram id="trois-voyants-installation" title="Trois voyants, trois réponses" says="La version existe, le diagnostic cherche les problèmes et l'état complet confirme la configuration." description="Trois voyants affichent version, diagnostic et état complet. Le diagnostic est en émeraude." wideHeight={128} compactHeight={312} wide={render(false)} compact={render(true)} />;
}

export function PremierEssaiTerminalMockup() {
  const render = (compact: boolean) => {
    const leftX = compact ? 16 : 24;
    const rightX = compact ? 16 : 256;
    const rightY = compact ? 248 : 16;
    return <>
      <Motif><Terminal x={leftX} y={16} width={compact ? 296 : 208} height={compact ? 208 : 264}>
        <Label x={leftX + 18} y={44} text="Aucun client réel" anchor="start" kind="note" />
        {["demande-01.txt", "demande-02.txt", "demande-03.txt"].map((name, index) => <g key={name}><Document x={leftX + 18} y={68 + index * 44} width={32} height={34} /><Label x={leftX + 62} y={86 + index * 44} text={name} anchor="start" /></g>)}
      </Terminal></Motif>
      <Edge points={compact ? [[164, 224], [164, 248]] : [[232, 148], [256, 148]]} step={1} />
      <Motif step={2}><Surface x={rightX} y={rightY} width={compact ? 296 : 400} height={compact ? 280 : 264} radius={24} tone="paper" />
        <ToolLogo name="Hermes Agent" x={rightX + (compact ? 238 : 338)} y={rightY + 18} size={40} />
        {["Faits", "Manques", "Décision", "Source"].map((label, index) => <g key={label}><Label x={rightX + 24} y={rightY + 44 + index * 48} text={label} anchor="start" kind="title" /><FixedLine path={`M${rightX + 118} ${rightY + 44 + index * 48} H${rightX + (compact ? 266 : 358)}`} /></g>)}
        <Label x={rightX + 24} y={rightY + 244} text="Aucun envoi" anchor="start" tone="accent" />
      </Motif>
      <Motif step={3}><Label x={compact ? 24 : 272} y={compact ? 558 : 304} text="1  Sources fictives   2  Interdits écrits   3  Sortie vérifiable" maxChars={compact ? 30 : 72} anchor="start" kind="note" /></Motif>
    </>;
  };
  return <Diagram id="premier-essai-terminal" title="Trois faux dossiers, une sortie vérifiable" says="Le terminal lit des sources fictives et produit une fiche sans action extérieure." description="Un terminal montre trois faux fichiers à gauche et une fiche Faits, Manques, Décision, Source à droite." wideHeight={328} compactHeight={600} wide={render(false)} compact={render(true)} />;
}
