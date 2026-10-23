import type { ComponentType } from "react";
import { LabelVisual } from "../coffre/render";

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

export function createCourseVisualComponent(definition: CourseVisualDefinition, course: string): ComponentType {
  const Visual = () => <div data-course={course}><LabelVisual definition={definition} /></div>;
  Visual.displayName = `${definition.name}CourseVisual`;
  return Visual;
}
