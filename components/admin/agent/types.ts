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
  kind: "publication" | "mail" | "nouveaute";
  createdAt: string;
  expiresAt: string;
  preview?: {
    title: string;
    sentence: string;
    thumbnail: string;
    internalUrl?: string | null;
    blocLabel?: string | null;
    publishedAt: string;
  } | null;
  videoPreview?: {
    id: string;
    title: string;
    locationLabel: string;
    position: number;
    durationSeconds: number | null;
    thumbnailUrl: string | null;
    steps: { summary: boolean; chapters: boolean; thumbnail: boolean; transcript: boolean };
    reviewUrl: string;
  } | null;
  mailPreview?: {
    subject: string;
    audience: "all" | "free" | "beginner" | "full";
    recipientCount: number | null;
  } | null;
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
