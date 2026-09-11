"use client";

import { Frame, Box, Arrow, SUBTEXT, GOLD } from "@/components/ui/diagram-primitives";

export function ProtocolePipelineDiagram() {
  const w = 156, h = 88, gap = 24, y = 70;
  const steps = [
    { label: "01 - Absorption", sub: "greffer des compétences" },
    { label: "02 - Sprint Cash", sub: "premiers 10k€" },
    { label: "03 - Distillation", sub: "capital organique" },
    { label: "Antifragile", sub: "l'état final" },
  ];
  return (
    <Frame
      title="Les trois phases, dans l'ordre"
      explainer="Chaque phase dépend de la précédente : tu ne sprintes pas sur du cash avant d'avoir greffé les compétences, tu ne distilles pas avant d'avoir le terrain de la phase 2."
      caption="Lecture : la flèche pointillée montre que l'état final n'est pas un palier fixe - chaque nouveau cycle (nouvelle compétence, nouvelle niche) repasse par les trois phases et enrichit le capital organique déjà en place."
      viewBox="0 0 720 200"
    >
      {steps.map((s, i) => (
        <g key={s.label}>
          <Box x={10 + i * (w + gap)} y={y} w={w} h={h} label={s.label} sub={s.sub} accent={i === steps.length - 1} />
          {i < steps.length - 1 && (
            <Arrow x1={10 + i * (w + gap) + w} y1={y + h / 2} x2={10 + (i + 1) * (w + gap)} y2={y + h / 2} />
          )}
        </g>
      ))}
      <path
        d={`M${10 + 3 * (w + gap) + w / 2} ${y + h + 8} C ${10 + 3 * (w + gap) + w / 2} ${y + h + 40}, ${10 + w / 2} ${y + h + 40}, ${10 + w / 2} ${y + h + 8}`}
        fill="none"
        stroke="#e8d5b066"
        strokeWidth={1.25}
        strokeDasharray="3 4"
        markerEnd="url(#protocole-loop-arrow)"
      />
      <defs>
        <marker id="protocole-loop-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
          <path d="M0,0.7 L7,3.5 L0,6.3 Z" fill="#e8d5b088" />
        </marker>
      </defs>
      <text x={360} y={y + h + 62} textAnchor="middle" fontSize="10.5" fill={SUBTEXT}>chaque nouveau cycle repart de la phase 01, avec plus de capital qu'avant</text>
    </Frame>
  );
}

export function LocataireVsCapitalDiagram() {
  const w = 300, h = 130, gap = 40, y = 50;
  return (
    <Frame
      title="Locataire numérique vs capital organique"
      explainer="Même outil IA, deux trajectoires opposées selon ce que tu en fais une fois la session terminée."
      caption="Lecture : le locataire recommence de zéro à chaque changement d'outil. Le capital organique encaisse le changement et continue d'accumuler - c'est la définition même de l'antifragile."
      viewBox="0 0 720 230"
    >
      <Box x={40} y={y} w={w} h={h} label="Locataire numérique" sub="dépend de l'outil, recommence à zéro au moindre changement" />
      <Box x={40 + w + gap} y={y} w={w} h={h} label="Capital organique" sub="encode l'expertise, résiste et s'accumule dans le temps" accent />
      <text x={40 + w / 2} y={y + h + 26} textAnchor="middle" fontSize="10.5" fill={SUBTEXT}>outil retiré ou changé -&gt; retour à zéro</text>
      <text x={40 + w + gap + w / 2} y={y + h + 26} textAnchor="middle" fontSize="10.5" fill={GOLD} fontWeight={600}>outil retiré ou changé -&gt; le capital reste</text>
    </Frame>
  );
}
