import type { ComponentType } from "react";
import { Compare, Cycle, FileCard, Fork, Funnel, Ladder, Rings, Steps, ToolMap } from "@/components/schemas/kit";
import type { CoffreVisualDefinition, CoffreVisualEntry } from "./types";

/** Définition minimale commune aux cours dont les schémas sont décrits par des libellés. */
export type LabelVisualDefinition = Omit<CoffreVisualDefinition, "tools" | "template"> & { template: string; tools?: readonly string[] };

const EMERALD = "#22d96e";

/** Libellés uniques, dans l'ordre : on n'invente jamais de libellé, de chiffre, de message ni de fichier. */
function uniqueLabels(definition: LabelVisualDefinition): string[] {
  return [...new Set(definition.labels.map((label) => label.trim()).filter(Boolean))];
}

function accentIndex(definition: LabelVisualDefinition, length: number): number {
  return Math.max(0, Math.min(definition.accentIndex, length - 1));
}

export function LabelVisual({ definition }: { definition: LabelVisualDefinition }) {
  const labels = uniqueLabels(definition);
  const accent = accentIndex(definition, labels.length);
  // Le titre de la carte est la phrase qui dit l'idée ; un simple libellé n'est jamais un titre.
  const frame = { title: definition.description, description: "", ariaLabel: definition.ariaLabel, accent: EMERALD };
  const tools = definition.tools ?? [];
  const steps = () => <Steps {...frame} items={labels.slice(0, 6).map((label, index) => ({ label, detail: "", tools: tools[index] ? [tools[index]] : undefined }))} accentIndex={Math.min(accent, 5)} />;
  const pairs = () => {
    const half = Math.ceil(labels.length / 2);
    const before = labels.slice(0, half), after = labels.slice(half);
    return <Compare {...frame} beforeTitle="Avant" afterTitle="Après" rows={before.map((label, index) => ({ before: label, after: after[index] ?? "" })).filter((row) => row.after)} />;
  };
  let visual: React.ReactNode;

  switch (definition.template) {
    case "cycle":
      visual = <Cycle {...frame} steps={labels.slice(0, 5).map((label, index) => ({ label, tool: tools[index] }))} entryIndex={Math.min(accent, 4)} centerLabel={labels[accent]} />;
      break;
    case "file-card":
      visual = <FileCard {...frame} filename={definition.name.toLocaleLowerCase("fr").includes("skill") ? "SKILL.md" : "fiche.md"} lines={labels.map((text, index) => ({ text: index === 0 ? `# ${text}` : text, tone: index === 0 ? "heading" : "normal" }))} annotations={[]} tool={tools[0]} />;
      break;
    case "fork":
      visual = <Fork {...frame} situation={labels.includes(definition.title) ? "Ta décision" : definition.title} outcomes={labels.map((label, index) => ({ label, condition: "", recommended: index === accent, rejected: false }))} />;
      break;
    case "funnel":
      visual = <Funnel {...frame} stages={labels.slice(0, 6).map((label, index) => ({ label, value: Math.max(30, 100 - index * 14), valueLabel: "" }))} leakIndex={Math.min(accent, Math.min(labels.length, 6) - 1)} leakLabel={labels[accent]} tool={tools[0]} />;
      break;
    case "ladder":
    case "curves":
      visual = <Ladder {...frame} rungs={labels.slice(0, 6).map((label) => ({ label, detail: "" }))} accentIndex={Math.min(accent, 5)} lowLabel={labels[0]} highLabel={labels.at(-1)} />;
      break;
    case "rings": {
      const core = labels[accent];
      const ringLabels = labels.filter((_, index) => index !== accent).slice(0, 4);
      visual = <Rings {...frame} core={core} rings={ringLabels.map((label) => ({ label, detail: "" }))} accentIndex={0} />;
      break;
    }
    case "tool-map":
      visual = tools.length
        ? <ToolMap {...frame} groups={tools.slice(0, 4).map((name, index) => ({ role: labels[index] ?? name, tools: [{ name, description: "" }] }))} accentGroup={Math.min(accent, Math.min(tools.length, 4) - 1)} />
        : steps();
      break;
    case "compare":
    case "web-compare":
    case "ad-card":
      visual = labels.length >= 2 ? pairs() : steps();
      break;
    default:
      // workflow, chat, web-page, big-number : sans données réelles, on montre les étapes telles qu'elles sont écrites.
      visual = steps();
  }

  return <div data-coffre-visual={definition.name} data-coffre-template={definition.template}>{visual}</div>;
}

export function createCoffreVisualComponent(entry: CoffreVisualEntry): ComponentType {
  if ("component" in entry) return entry.component;
  const definition: CoffreVisualDefinition = entry;
  const CoffreVisual = () => <LabelVisual definition={definition} />;
  CoffreVisual.displayName = `${definition.name}CoffreVisual`;
  return CoffreVisual;
}
