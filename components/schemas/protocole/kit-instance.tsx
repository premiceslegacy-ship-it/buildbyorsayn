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

export type CourseVisualTemplate =
  | "ad-card"
  | "big-number"
  | "chat"
  | "compare"
  | "curves"
  | "cycle"
  | "file-card"
  | "fork"
  | "funnel"
  | "ladder"
  | "rings"
  | "steps"
  | "tool-map"
  | "web-page"
  | "web-compare"
  | "workflow";

export type CourseVisualDefinition = {
  name: string;
  kind: "schema" | "maquette";
  chapter: string;
  template: CourseVisualTemplate;
  title: string;
  description: string;
  ariaLabel: string;
  labels: readonly string[];
  tools?: readonly string[];
  accentIndex: number;
};

const EMERALD = "#22d96e";

function labelsFor(definition: CourseVisualDefinition, minimum = 1): string[] {
  const labels = [...definition.labels];
  while (labels.length < minimum) labels.push(labels.at(-1) ?? definition.title);
  return labels;
}

function boundedAccent(definition: CourseVisualDefinition, length: number): number {
  return Math.max(0, Math.min(definition.accentIndex, length - 1));
}

function CourseVisual({ course, definition }: { course: string; definition: CourseVisualDefinition }) {
  const labels = labelsFor(definition);
  const accentIndex = boundedAccent(definition, labels.length);
  const tools = [...(definition.tools ?? [])];
  const frame = {
    title: definition.title,
    description: definition.description,
    ariaLabel: definition.ariaLabel,
    accent: EMERALD,
  };
  let visual: React.ReactNode;

  switch (definition.template) {
    case "ad-card":
      visual = <AdCard {...frame} variant="social" beforeTitle={labels[0]} afterTitle={labels[2]} before={{ text: labels[1], visual: labels[0] }} after={{ text: labels[3], visual: labels[2], action: labels[accentIndex] }} />;
      break;
    case "big-number":
      visual = <BigNumber {...frame} before={{ value: labels[0], label: labels[1] }} after={{ value: labels[2], label: labels[3] }} sentence={labels[accentIndex]} />;
      break;
    case "chat":
      visual = <Chat {...frame} platform={tools.includes("WhatsApp") ? "WhatsApp" : tools.includes("Telegram") ? "Telegram" : "Neutre"} contact={labels[0]} messages={labels.slice(1, 4).map((text, index) => ({ from: index % 2 ? "agent" : "person", text, time: "" }))} actions={labels.slice(0, 4).map((label, index) => ({ label, tool: tools[index], humanValidation: index === accentIndex }))} />;
      break;
    case "compare": {
      const midpoint = Math.max(2, Math.ceil(labels.length / 2));
      const before = labels.slice(1, midpoint);
      const after = labels.slice(midpoint + 1);
      const rowCount = Math.max(before.length, after.length, 1);
      visual = <Compare {...frame} beforeTitle={labels[0]} afterTitle={labels[midpoint]} rows={Array.from({ length: rowCount }, (_, index) => ({ before: before[index] ?? labels[0], after: after[index] ?? labels[midpoint] }))} />;
      break;
    }
    case "curves": {
      const axisLabels = labels.slice(0, 6);
      visual = <Curves {...frame} labels={axisLabels} series={[{ name: labels[0], values: axisLabels.map((_, index) => index + (index >= accentIndex ? 2 : 0)), kind: "step", accent: true }, { name: labels.at(-1) ?? definition.title, values: axisLabels.map((_, index) => Math.max(0, 4 - index)), kind: "line" }]} annotations={[{ series: 0, point: Math.min(accentIndex, axisLabels.length - 1), label: labels[accentIndex] }]} />;
      break;
    }
    case "cycle":
      visual = <Cycle {...frame} steps={labels.slice(0, 5).map((label, index) => ({ label, tool: tools[index] }))} entryIndex={Math.min(accentIndex, 4)} centerLabel={labels[accentIndex]} />;
      break;
    case "file-card":
      visual = <FileCard {...frame} filename={definition.name.toLocaleLowerCase("fr").includes("skill") ? "SKILL.md" : `${definition.title}.md`} lines={labels.map((text, index) => ({ text, tone: index === accentIndex ? "heading" : "normal" }))} annotations={[{ line: accentIndex + 1, label: labels[accentIndex] }]} tool={tools[0]} />;
      break;
    case "fork":
      visual = <Fork {...frame} situation={labels[0]} outcomes={labels.slice(1).map((label, index) => ({ label, condition: "", recommended: index + 1 === accentIndex, rejected: index === labels.length - 2 && accentIndex !== labels.length - 1 }))} />;
      break;
    case "funnel":
      visual = <Funnel {...frame} stages={labels.slice(0, 6).map((label, index) => ({ label, value: Math.max(18, 100 - index * 17), valueLabel: "" }))} leakIndex={Math.min(accentIndex, Math.min(labels.length, 6) - 1)} leakLabel={labels[accentIndex]} tool={tools[0]} />;
      break;
    case "ladder":
      visual = <Ladder {...frame} rungs={labels.slice(0, 6).map((label) => ({ label, detail: "" }))} accentIndex={Math.min(accentIndex, 5)} lowLabel={labels[0]} highLabel={labels.at(-1)} />;
      break;
    case "rings": {
      const core = labels[accentIndex];
      const rings = labels.filter((_, index) => index !== accentIndex).slice(0, 4);
      visual = <Rings {...frame} core={core} rings={rings.map((label) => ({ label, detail: "" }))} accentIndex={0} />;
      break;
    }
    case "steps":
      visual = <Steps {...frame} items={labels.slice(0, 6).map((label, index) => ({ label, detail: "", tools: tools[index] ? [tools[index]] : undefined }))} accentIndex={Math.min(accentIndex, 5)} />;
      break;
    case "tool-map": {
      const toolNames = tools.length ? tools : labels.slice(0, 6);
      const groups = toolNames.slice(0, 4).map((name, index) => ({ role: labels[index] ?? labels[accentIndex], tools: [{ name, description: labels[index] ?? labels[accentIndex] }] }));
      visual = <ToolMap {...frame} groups={groups} accentGroup={Math.min(accentIndex, groups.length - 1)} />;
      break;
    }
    case "web-compare":
      visual = <WebPageCompare {...frame} beforeTitle={labels[0]} afterTitle={labels[2]} before={{ heading: labels[0], subtitle: labels[1], button: labels[0], imageLabel: labels[1] }} after={{ heading: labels[2], subtitle: labels[3], button: labels[accentIndex], imageLabel: labels.at(-1) }} />;
      break;
    case "web-page":
      visual = <WebPage {...frame} page={{ nav: labels[0], heading: labels[0], subtitle: labels[1], button: labels[accentIndex], imageLabel: labels[2], proofs: labels.slice(3, 6), offer: labels[6], faq: labels[7] }} annotations={[{ number: 1, target: "heading", label: labels[0] }, { number: 2, target: "button", label: labels[accentIndex] }, { number: 3, target: "proofs", label: labels[3] }]} />;
      break;
    case "workflow":
      visual = <Workflow {...frame} actors={[labels[0], labels[accentIndex], labels.at(-1) ?? definition.title]} steps={labels.slice(0, 6).map((label, index) => ({ actor: index % 3, label, transfer: index ? labels[index - 1] : undefined, tool: tools[index], humanValidation: index === accentIndex }))} accentIndex={Math.min(accentIndex, 5)} />;
      break;
  }

  return <div data-course-visual={definition.name} data-course={course} data-course-template={definition.template}>{visual}</div>;
}

export function createCourseVisualComponent(definition: CourseVisualDefinition, course: string): ComponentType {
  const Visual = () => <CourseVisual course={course} definition={definition} />;
  Visual.displayName = `${definition.name}CourseVisual`;
  return Visual;
}
