import type { ComponentType } from "react";

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

/** Ancienne définition par libellés, rendue par le rendu générique. */
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

/** Schéma écrit à la main avec le kit : le composant porte toutes ses données. */
export type HandcraftedVisual = {
  name: string;
  kind: "schema" | "maquette";
  chapter: string;
  component: ComponentType;
};

export type CoffreVisualEntry = CoffreVisualDefinition | HandcraftedVisual;
