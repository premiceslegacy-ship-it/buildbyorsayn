"use client";

import { Frame, Box, Arrow, Bracket, SUBTEXT, GOLD } from "@/components/ui/diagram-primitives";

export function PromptContextDiagram() {
  const x = 20, y = 40, w = 600, h = 46;
  const forgotten = 150, loaded = 300;
  return (
    <Frame title="La fenêtre de contexte se remplit, puis oublie" viewBox="0 0 640 130">
      <rect x={x} y={y} width={forgotten} height={h} rx={8} fill="#ffffff06" stroke="#ffffff1a" strokeWidth={1} />
      <text x={x + forgotten / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize="10.5" fill="#d9d5cf55">oublié</text>

      <rect x={x + forgotten} y={y} width={loaded} height={h} rx={0} fill="#e8d5b01f" stroke={GOLD} strokeWidth={1.25} />
      <text x={x + forgotten + loaded / 2} y={y + h / 2 - 3} textAnchor="middle" fontSize="11" fontWeight={600} fill="#f0ede8">Contexte chargé</text>
      <text x={x + forgotten + loaded / 2} y={y + h / 2 + 12} textAnchor="middle" fontSize="9.5" fill={SUBTEXT}>fichiers de projet, règles, standards</text>

      <rect x={x + forgotten + loaded} y={y} width={w - forgotten - loaded} height={h} rx={8} fill="#ffffff0a" stroke="#ffffff26" strokeWidth={1} />
      <text x={x + forgotten + loaded + (w - forgotten - loaded) / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize="10" fill={SUBTEXT}>conversation en cours</text>

      <Bracket x={x + w + 14} y1={y} y2={y + h} label="limite du modèle" reach={8} />
      <text x={320} y={104} textAnchor="middle" fontSize="10.5" fill="#d9d5cf88">Quand la fenêtre est pleine, ce qui est à gauche s&apos;efface en premier.</text>
    </Frame>
  );
}

export function ApiFlowDiagram() {
  const w = 120, h = 60, gap = 26, y = 30;
  const steps = [
    { label: "Mon app", sub: "le client" },
    { label: "Requête (API)", sub: "la commande" },
    { label: "Service tiers", sub: "la cuisine" },
    { label: "Réponse (JSON)", sub: "le plat" },
  ];
  return (
    <Frame title="Une API, comme un serveur au restaurant" viewBox="0 0 640 150">
      {steps.map((s, i) => (
        <g key={s.label}>
          <Box x={10 + i * (w + gap)} y={y} w={w} h={h} label={s.label} sub={s.sub} accent={i === 0 || i === 3} />
          {i < steps.length - 1 && (
            <Arrow x1={10 + i * (w + gap) + w} y1={y + h / 2} x2={10 + (i + 1) * (w + gap)} y2={y + h / 2} />
          )}
        </g>
      ))}
      <path
        d={`M${10 + w / 2} ${y + h + 8} C ${10 + w / 2} ${y + h + 40}, ${10 + 3 * (w + gap) + w / 2} ${y + h + 40}, ${10 + 3 * (w + gap) + w / 2} ${y + h + 8}`}
        fill="none"
        stroke="#e8d5b066"
        strokeWidth={1.1}
        strokeDasharray="3 4"
      />
      <text x={320} y={y + h + 56} textAnchor="middle" fontSize="10" fill={SUBTEXT}>la réponse revient au client qui a passé la commande</text>
    </Frame>
  );
}

export function ProjectPipelineDiagram() {
  const w = 138, h = 58, gap = 18, y = 50;
  const steps = ["No-code (brouillon)", "GitHub (sauvegarde)", "IDE + IA", "Hébergeur (en ligne)"];
  return (
    <Frame title="De l'idée à l'URL en ligne" viewBox="0 0 640 190">
      {steps.map((label, i) => (
        <g key={label}>
          <Box x={10 + i * (w + gap)} y={y} w={w} h={h} label={label} accent={i === steps.length - 1} />
          {i < steps.length - 1 && (
            <Arrow x1={10 + i * (w + gap) + w} y1={y + h / 2} x2={10 + (i + 1) * (w + gap)} y2={y + h / 2} />
          )}
        </g>
      ))}
      <text x={10 + w / 2} y={y - 12} textAnchor="middle" fontSize="9.5" fill="#d9d5cf70">pas de comptes, pas de paiements</text>
      <rect x={10 + 2 * (w + gap) - 6} y={y + h + 18} width={w + 12} height={34} rx={8} fill="#ef444414" stroke="#ef444440" strokeWidth={1} />
      <text x={10 + 2 * (w + gap) + w / 2} y={y + h + 39} textAnchor="middle" fontSize={9.5} fill="#f8717199" fontWeight={600}>
        clés API : jamais dans le code
      </text>
    </Frame>
  );
}

export function ContextFilesDiagram() {
  const fileX = 20, fileW = 200, fileH = 38, gapY = 12, y0 = 12;
  const files = [
    { name: "BRIEF.md", sub: "projet et objectifs" },
    { name: "PRD.md", sub: "fonctionnalités, critères" },
    { name: "PROMPT-SYSTEM.md", sub: "comportement attendu" },
  ];
  const sessionX = 340, sessionY = 60, sessionW = 150, sessionH = 60;
  const codeX = 540, codeY = 60, codeW = 90, codeH = 60;
  return (
    <Frame title="Le dossier /docs qui cadre chaque session" viewBox="0 0 640 190">
      {files.map((f, i) => {
        const fy = y0 + i * (fileH + gapY);
        return (
          <g key={f.name}>
            <Box x={fileX} y={fy} w={fileW} h={fileH} label={f.name} sub={f.sub} />
            <Arrow x1={fileX + fileW} y1={fy + fileH / 2} x2={sessionX} y2={sessionY + sessionH / 2} />
          </g>
        );
      })}
      <Box x={sessionX} y={sessionY} w={sessionW} h={sessionH} label="Session IA" accent />
      <Arrow x1={sessionX + sessionW} y1={sessionY + sessionH / 2} x2={codeX} y2={codeY + codeH / 2} />
      <Box x={codeX} y={codeY} w={codeW} h={codeH} label="Code du projet" accent />
      <text x={sessionX + sessionW / 2} y={sessionY + sessionH + 26} textAnchor="middle" fontSize="10" fill="#d9d5cf70">
        Sans /docs : code générique
      </text>
    </Frame>
  );
}
