export const AGENT_PERMISSION_VALUES = [
  "liste_blocs",
  "envoyer_video",
  "ecrire_chapitres",
  "ecrire_resume",
  "choisir_miniature",
  "demander_publication",
  "preparer_mail",
  "statut_video",
  "journal",
] as const;

export type AgentPermission = (typeof AGENT_PERMISSION_VALUES)[number];
export type AgentMode = "prepare" | "autopublish";

export type AgentTokenContext = {
  id: string;
  name: string;
  lastFour: string;
  permissions: AgentPermission[];
  createdBy: string;
};

export type AgentToolResult = {
  content: Array<{ type: "text"; text: string }>;
  structuredContent?: Record<string, unknown>;
  isError?: boolean;
};

export type AgentRequestDecision = "approve" | "refuse";
