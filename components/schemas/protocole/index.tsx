import { LocataireVsCapitalDiagram, ProtocolePipelineDiagram } from "../protocole.tsx";
import { createCourseVisualComponent } from "./kit-instance";
import { PROTOCOLE_ZERO_VISUALS } from "./protocole-zero";

export const PROTOCOLE_VISUAL_DEFINITIONS = PROTOCOLE_ZERO_VISUALS;

export const PROTOCOLE_VISUAL_CATALOG = [
  { name: "LocataireVsCapitalDiagram", kind: "schema" as const, chapter: "introduction", template: "curves" as const, component: LocataireVsCapitalDiagram },
  { name: "ProtocolePipelineDiagram", kind: "schema" as const, chapter: "introduction", template: "workflow" as const, component: ProtocolePipelineDiagram },
  ...PROTOCOLE_ZERO_VISUALS.map((definition) => ({
    ...definition,
    component: createCourseVisualComponent(definition, "protocole"),
  })),
];
