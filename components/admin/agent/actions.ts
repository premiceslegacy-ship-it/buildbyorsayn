"use server";

import {
  createAgentToken,
  decideRequest,
  getAgentMode,
  listAgentJournal,
  listAgentTokens,
  listPendingRequests,
  revokeAgentToken,
  setAgentMode,
  setAgentPermissions,
  type AgentMode,
  type AgentPermission,
} from "@/lib/adminAgent";
import type { AgentActionResult, AgentViewData } from "./types";

function publicError(error: unknown, fallback: string) {
  if (error instanceof Error && [
    "Accès refusé.",
    "La confirmation AUTORISER est requise.",
    "Demande introuvable.",
    "La publication a échoué.",
    "L'envoi du mail a échoué.",
    "La vidéo est encore en traitement.",
    "La transcription est requise avant publication.",
    "Le résumé est requis avant publication.",
    "La miniature est requise avant publication.",
  ].includes(error.message)) return error.message;
  return fallback;
}

export async function loadAgentViewAction(): Promise<AgentActionResult<AgentViewData>> {
  try {
    const [tokens, requests, journal, mode] = await Promise.all([
      listAgentTokens(),
      listPendingRequests(),
      listAgentJournal(),
      getAgentMode(),
    ]);
    return {
      ok: true,
      data: {
        tokens: tokens.map((token) => ({
          id: token.id,
          name: token.name,
          lastFour: token.last_four,
          permissions: token.permissions,
          expiresAt: token.expires_at,
          lastUsedAt: token.last_used_at,
          revokedAt: token.revoked_at,
          createdAt: token.created_at,
        })),
        requests: requests.map((request) => ({
          id: request.id,
          kind: request.kind,
          createdAt: request.created_at,
          expiresAt: request.expires_at,
        })),
        journal: journal.map((entry) => ({
          id: entry.id,
          action: entry.action,
          result: entry.result,
          createdAt: entry.created_at,
        })),
        mode,
      },
    };
  } catch (error) {
    return { ok: false, error: publicError(error, "La vue Agent ne peut pas être chargée.") };
  }
}

export async function createAgentTokenAction(input: {
  name: string;
  permissions: AgentPermission[];
  expiresInDays: number;
}): Promise<AgentActionResult<{ token: string }>> {
  try {
    const created = await createAgentToken(input);
    return { ok: true, data: { token: created.token } };
  } catch (error) {
    return { ok: false, error: publicError(error, "Le jeton n'a pas pu être créé.") };
  }
}

export async function revokeAgentTokenAction(tokenId: string): Promise<AgentActionResult<{ revoked: boolean }>> {
  try {
    return { ok: true, data: await revokeAgentToken(tokenId) };
  } catch (error) {
    return { ok: false, error: publicError(error, "Le jeton n'a pas pu être révoqué.") };
  }
}

export async function updateAgentPermissionsAction(
  tokenId: string,
  permissions: AgentPermission[],
): Promise<AgentActionResult<AgentPermission[]>> {
  try {
    return { ok: true, data: await setAgentPermissions(tokenId, permissions) };
  } catch (error) {
    return { ok: false, error: publicError(error, "Les permissions n'ont pas pu être enregistrées.") };
  }
}

export async function setAgentModeAction(
  mode: AgentMode,
  confirmation?: string,
): Promise<AgentActionResult<AgentMode>> {
  try {
    return { ok: true, data: await setAgentMode(mode, confirmation) };
  } catch (error) {
    return { ok: false, error: publicError(error, "Le mode n'a pas pu être enregistré.") };
  }
}

export async function decideAgentRequestAction(
  requestId: string,
  decision: "approve" | "refuse",
  confirmation?: string,
): Promise<AgentActionResult<{ status: string }>> {
  try {
    const request = (await listPendingRequests()).find((candidate) => candidate.id === requestId);
    if (!request) return { ok: false, error: "Demande introuvable." };
    const expected = request.kind === "publication" ? "PUBLIER" : "ENVOYER";
    if (decision === "approve" && confirmation !== expected) {
      return { ok: false, error: `Saisis ${expected} pour valider.` };
    }
    const result = await decideRequest(requestId, decision);
    return { ok: true, data: { status: result.status } };
  } catch (error) {
    return { ok: false, error: publicError(error, "La demande n'a pas pu être traitée.") };
  }
}
