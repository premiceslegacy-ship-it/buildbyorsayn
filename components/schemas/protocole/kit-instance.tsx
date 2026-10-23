import type { ComponentType } from "react";
import { LabelVisual } from "../coffre/render";
import type { HandcraftedVisual } from "../coffre/types";

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

export type CourseVisualEntry = CourseVisualDefinition | HandcraftedVisual;

export function createCourseVisualComponent(entry: CourseVisualEntry, course: string): ComponentType {
  if ("component" in entry) return entry.component;
  const definition: CourseVisualDefinition = entry;
  const Visual = () => <div data-course={course}><LabelVisual definition={definition} /></div>;
  Visual.displayName = `${definition.name}CourseVisual`;
  return Visual;
}
