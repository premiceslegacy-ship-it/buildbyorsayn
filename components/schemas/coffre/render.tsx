import type { ComponentType } from "react";
import {
  AdCard,
  BigNumber,
  Chat,
  Compare,
  Curves,
  Cycle,
  FileCard,
  Fork,
  Funnel,
  Ladder,
  Rings,
  Steps,
  ToolMap,
  WebPage,
  WebPageCompare,
  Workflow,
} from "@/components/schemas/kit";
import type { CoffreVisualDefinition } from "./types";

const EMERALD = "#22d96e";

function safeLabels(definition: CoffreVisualDefinition, minimum = 4): string[] {
  const labels = [...definition.labels];
  while (labels.length < minimum) labels.push(labels.at(-1) ?? definition.title);
  return labels;
}

function accentIndex(definition: CoffreVisualDefinition, length: number): number {
  return Math.max(0, Math.min(definition.accentIndex, length - 1));
}

function Visual({ definition }: { definition: CoffreVisualDefinition }) {
  const labels = safeLabels(definition);
  const accent = accentIndex(definition, labels.length);
  const frame = {
    title: definition.title,
    description: definition.description,
    ariaLabel: definition.ariaLabel,
    accent: EMERALD,
  };
  let visual: React.ReactNode;

  switch (definition.template) {
    case "ad-card":
      visual = <AdCard {...frame} variant="social" beforeTitle={labels[0]} afterTitle={labels[2]} before={{ text: labels[1], visual: labels[0] }} after={{ text: labels[3], visual: labels[2], action: labels[accent] }} />;
      break;
    case "big-number":
      visual = <BigNumber {...frame} before={{ value: labels[0], label: labels[1] }} after={{ value: labels[2], label: labels[3] }} sentence={labels[accent]} />;
      break;
    case "chat":
      visual = <Chat {...frame} platform={definition.tools.includes("WhatsApp") ? "WhatsApp" : definition.tools.includes("Telegram") ? "Telegram" : "Neutre"} contact={labels[0]} messages={labels.slice(1, 4).map((text, index) => ({ from: index % 2 ? "agent" : "person", text, time: "" }))} actions={labels.slice(0, 4).map((label, index) => ({ label, tool: definition.tools[index], humanValidation: index === accent }))} />;
      break;
    case "compare": {
      const midpoint = Math.max(2, Math.ceil(labels.length / 2));
      const before = labels.slice(1, midpoint);
      const after = labels.slice(midpoint + 1);
      const rowCount = Math.max(before.length, after.length, 1);
      visual = <Compare {...frame} beforeTitle={labels[0]} afterTitle={labels[midpoint]} rows={Array.from({ length: rowCount }, (_, index) => ({ before: before[index] ?? labels[0], after: after[index] ?? labels[midpoint] }))} />;
      break;
    }
    case "curves":
      visual = <Curves {...frame} labels={labels.slice(0, 6)} series={[{ name: labels[0], values: labels.slice(0, 6).map((_, index) => index + (index >= accent ? 2 : 0)), kind: "step", accent: true }, { name: labels.at(-1) ?? definition.title, values: labels.slice(0, 6).map((_, index) => Math.max(0, 4 - index)), kind: "line" }]} annotations={[{ series: 0, point: Math.min(accent, Math.min(labels.length, 6) - 1), label: labels[accent] }]} />;
      break;
    case "cycle":
      visual = <Cycle {...frame} steps={labels.slice(0, 5).map((label, index) => ({ label, tool: definition.tools[index] }))} entryIndex={Math.min(accent, 4)} centerLabel={labels[accent]} />;
      break;
    case "file-card":
      visual = <FileCard {...frame} filename={definition.name.toLocaleLowerCase("fr").includes("skill") ? "SKILL.md" : `${definition.title}.md`} lines={labels.map((text, index) => ({ text, tone: index === accent ? "heading" : "normal" }))} annotations={[{ line: accent + 1, label: labels[accent] }]} tool={definition.tools[0]} />;
      break;
    case "fork":
      visual = <Fork {...frame} situation={labels[0]} outcomes={labels.slice(1).map((label, index) => ({ label, condition: "", recommended: index + 1 === accent, rejected: index === labels.length - 2 && accent !== labels.length - 1 }))} />;
      break;
    case "funnel":
      visual = <Funnel {...frame} stages={labels.slice(0, 6).map((label, index) => ({ label, value: Math.max(18, 100 - index * 17), valueLabel: `${Math.max(18, 100 - index * 17)}` }))} leakIndex={Math.min(accent, Math.min(labels.length, 6) - 1)} leakLabel={labels[accent]} tool={definition.tools[0]} />;
      break;
    case "ladder":
      visual = <Ladder {...frame} rungs={labels.slice(0, 6).map((label) => ({ label, detail: "" }))} accentIndex={Math.min(accent, 5)} lowLabel={labels[0]} highLabel={labels.at(-1)} />;
      break;
    case "rings": {
      const core = labels[accent];
      const ringLabels = labels.filter((_, index) => index !== accent).slice(0, 4);
      visual = <Rings {...frame} core={core} rings={ringLabels.map((label) => ({ label, detail: "" }))} accentIndex={0} />;
      break;
    }
    case "steps":
      visual = <Steps {...frame} items={labels.slice(0, 6).map((label, index) => ({ label, detail: "", tools: definition.tools[index] ? [definition.tools[index]] : undefined }))} accentIndex={Math.min(accent, 5)} />;
      break;
    case "tool-map": {
      const tools = definition.tools.length ? definition.tools : labels.slice(0, 6);
      const groups = tools.slice(0, 3).map((name, index) => ({ role: labels[index] ?? labels[accent], tools: [{ name, description: labels[index + 1] ?? labels[accent] }] }));
      visual = <ToolMap {...frame} groups={groups} accentGroup={Math.min(accent, groups.length - 1)} />;
      break;
    }
    case "web-compare":
      visual = <WebPageCompare {...frame} beforeTitle={labels[0]} afterTitle={labels[2]} before={{ heading: labels[0], subtitle: labels[1], button: labels[0], imageLabel: labels[1] }} after={{ heading: labels[2], subtitle: labels[3], button: labels[accent], imageLabel: labels.at(-1) }} />;
      break;
    case "web-page":
      visual = <WebPage {...frame} page={{ nav: labels[0], heading: labels[0], subtitle: labels[1], button: labels[accent], imageLabel: labels[2], proofs: labels.slice(3, 6), offer: labels[6], faq: labels[7] }} annotations={[{ number: 1, target: "heading", label: labels[0] }, { number: 2, target: "button", label: labels[accent] }, { number: 3, target: "proofs", label: labels[3] }]} />;
      break;
    case "workflow":
      visual = <Workflow {...frame} actors={[labels[0], labels[accent], labels.at(-1) ?? definition.title]} steps={labels.slice(0, 6).map((label, index) => ({ actor: index % 3, label, transfer: index ? labels[index - 1] : undefined, tool: definition.tools[index], humanValidation: index === accent }))} accentIndex={Math.min(accent, 5)} />;
      break;
  }

  return <div data-coffre-visual={definition.name} data-coffre-template={definition.template}>{visual}</div>;
}

export function createCoffreVisualComponent(definition: CoffreVisualDefinition): ComponentType {
  const CoffreVisual = () => <Visual definition={definition} />;
  CoffreVisual.displayName = `${definition.name}CoffreVisual`;
  return CoffreVisual;
}
