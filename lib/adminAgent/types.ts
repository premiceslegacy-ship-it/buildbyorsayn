export const AGENT_PERMISSION_VALUES = [
  "liste_blocs",
  "lister_videos",
  "envoyer_video",
  "lire_transcription",
  "ecrire_chapitres",
  "ecrire_resume",
  "choisir_miniature",
  "deposer_miniature",
  "demander_publication",
  "synchroniser_video",
  "deposer_sous_titres",
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

export class AgentToolError extends Error {
  readonly isAgentToolError = true;

  constructor(message: string) {
    super(message);
    this.name = "AgentToolError";
  }
}
