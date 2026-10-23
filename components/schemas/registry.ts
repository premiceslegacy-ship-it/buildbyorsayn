import { createElement, type ComponentType, type ReactElement } from "react";
import { FlowDiagram } from "./layouts";
import { AnnotatedMockup } from "./mockup";

export type ReaderVisualKind = "maquette" | "schema";
export type ReaderVisualComponent = ComponentType;

function normalizeVisualName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLocaleLowerCase("fr");
}

function ProjectStepsSchema() {
  return createElement(FlowDiagram, {
    id: "parcours-clair",
    title: "Une page guide vers une seule action",
    says: "Chaque bloc répond à la question qui arrive avant lui, puis prépare la décision suivante.",
    caption: "Le bouton arrive après la promesse et la preuve.",
    items: [
      { label: "Comprendre", sub: "une promesse claire" },
      { label: "Croire", sub: "une preuve concrète" },
      { label: "Agir", sub: "une action simple", accent: true },
    ],
  });
}

function OfferPageMockup() {
  return createElement(AnnotatedMockup, {
    title: "Une page qui se comprend dans l'ordre",
    description: "Le regard trouve la promesse, la preuve et l'action sans devoir décoder la mise en page.",
    blocks: [
      { kind: "header" },
      { kind: "heading", text: "Un résultat que ton client reconnaît" },
      { kind: "subtitle", text: "Une phrase explique pour qui, quand et comment." },
      { kind: "button", text: "Voir l'offre" },
      { kind: "image" },
      { kind: "proof", text: "Preuves" },
      { kind: "offer", text: "L'offre", detail: "Contenu, prix et prochaine étape" },
    ],
    annotations: [
      { number: 1, label: "Le titre nomme le résultat attendu.", x: 42, y: 23 },
      { number: 2, label: "La preuve arrive avant la demande d'action.", x: 76, y: 61 },
      { number: 3, label: "L'offre réunit les détails au même endroit.", x: 55, y: 86 },
    ],
  });
}

function registry(entries: ReadonlyArray<readonly [string, ReaderVisualComponent]>) {
  return new Map(entries.map(([name, component]) => [normalizeVisualName(name), component]));
}

export const SCHEMA_REGISTRY = registry([
  ["ParcoursClair", ProjectStepsSchema],
  ["ÉtapesDuProjet", ProjectStepsSchema],
  ["EtapesDuProjet", ProjectStepsSchema],
]);

export const MOCKUP_REGISTRY = registry([
  ["PageOffreAnnotée", OfferPageMockup],
  ["PageOffreAnnotee", OfferPageMockup],
]);

export function resolveReaderVisual(kind: ReaderVisualKind, name: string): ReaderVisualComponent | undefined {
  const component = (kind === "schema" ? SCHEMA_REGISTRY : MOCKUP_REGISTRY).get(normalizeVisualName(name));
  if (!component && process.env.NODE_ENV !== "production") {
    console.warn(`[reader] ${kind} inconnu : ${name}`);
  }
  return component;
}

export function readerVisualElement(kind: ReaderVisualKind, name: string): ReactElement | null {
  const component = resolveReaderVisual(kind, name);
  return component ? createElement(component) : null;
}
