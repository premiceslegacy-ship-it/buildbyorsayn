export type CoffreTemplate =
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

export type CoffreVisualDefinition = {
  name: string;
  kind: "schema" | "maquette";
  chapter: string;
  template: CoffreTemplate;
  title: string;
  description: string;
  ariaLabel: string;
  labels: readonly string[];
  tools: readonly string[];
  accentIndex: number;
};
