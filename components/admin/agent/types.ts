import type { AgentMode, AgentPermission } from "@/lib/adminAgent";

export type AgentTokenView = {
  id: string;
  name: string;
  lastFour: string;
  permissions: AgentPermission[];
  expiresAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
};

export type AgentRequestView = {
  id: string;
  kind: "publication" | "mail";
  createdAt: string;
  expiresAt: string;
};

export type AgentJournalView = {
  id: string;
  action: string;
  result: string;
  createdAt: string;
};

export type AgentViewData = {
  tokens: AgentTokenView[];
  requests: AgentRequestView[];
  journal: AgentJournalView[];
  mode: AgentMode;
};

export type AgentActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };
