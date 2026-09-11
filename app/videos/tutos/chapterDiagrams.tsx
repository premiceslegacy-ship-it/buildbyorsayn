import type { ReactNode } from "react";
import {
  DiagnosticDiagram,
  DecompositionDiagram,
  KnowledgeLayersDiagram,
  ExecutionLoopDiagram,
  AuthorityLayersDiagram,
  ProofLayersDiagram,
  TransmissionDiagram,
  WorkshopDiagram,
  FederatedBrainDiagram,
  PoleMapDiagram,
  DataFormatsDiagram,
  SkillsSopDiagram,
  ToolAccessDiagram,
  WorkflowCrossPoleDiagram,
  AdoptionLaddersDiagram,
  TemplateTreeDiagram,
} from "./diagrams";

/**
 * Split out of chapters.tsx so the Hermes Agent grid page (which never
 * renders a diagram) doesn't pull all 17 diagram components into its bundle
 * - only the chapter detail page imports this.
 */
export const CHAPTER_DIAGRAMS: Record<string, ReactNode> = {
  "01-diagnostic-et-offre.md": <DiagnosticDiagram />,
  "02-decomposition-et-agents.md": <DecompositionDiagram />,
  "03-connaissance-memoire-contexte.md": <KnowledgeLayersDiagram />,
  "04-evenements-inbox-execution.md": <ExecutionLoopDiagram />,
  "05-autorite-outils-couts.md": <AuthorityLayersDiagram />,
  "06-preuve-iteration-skills.md": <ProofLayersDiagram />,
  "07-methode-offre-transmission.md": <TransmissionDiagram />,
  "08-fiches-atelier.md": <WorkshopDiagram />,
  "entreprise-01-cerveau-federe.md": <FederatedBrainDiagram />,
  "entreprise-02-cartographie-poles.md": <PoleMapDiagram />,
  "entreprise-formats.md": <DataFormatsDiagram />,
  "entreprise-04-competences-skills-sop.md": <SkillsSopDiagram />,
  "entreprise-05-outils-api-cli-mcp.md": <ToolAccessDiagram />,
  "entreprise-06-workflows-interpoles.md": <WorkflowCrossPoleDiagram />,
  "entreprise-07-adoption-preuves-promotion.md": <AdoptionLaddersDiagram />,
  "entreprise-08-templates-et-exercices.md": <TemplateTreeDiagram />,
};
