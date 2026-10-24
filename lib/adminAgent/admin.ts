import "server-only";

import { z } from "zod";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { getVerifiedAdmin, recordAdminAction } from "@/lib/mux/adminServer";
import { DEFAULT_AGENT_TOKEN_DAYS, generateAgentToken, hashAgentToken } from "./security";
import { removeBuildNewsThumbnail } from "@/lib/buildNews/thumbnail.server";
import { executeAgentPublication, executePreparedMail, executePreparedNews, preparedNewsSchema } from "./execution";
import {
  AGENT_PERMISSION_VALUES,
  type AgentMode,
  type AgentPermission,
  type AgentRequestDecision,
} from "./types";

const uuidSchema = z.string().uuid();
const permissionsSchema = z.array(z.enum(AGENT_PERMISSION_VALUES)).max(AGENT_PERMISSION_VALUES.length)
  .refine((values) => new Set(values).size === values.length);

export const DEFAULT_AGENT_PERMISSIONS = [
  "liste_blocs",
  "statut_video",
  "journal",
] as const satisfies readonly AgentPermission[];

async function requireHumanAdmin() {
  const user = await getVerifiedAdmin();
  if (!user) throw new Error("Accès refusé.");
  return user;
}

export async function listAgentTokens() {
  await requireHumanAdmin();
  const { data, error } = await createAdminSupabase()
    .from("admin_agent_tokens")
    .select("id,name,last_four,permissions,expires_at,last_used_at,revoked_at,created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error("Les jetons sont indisponibles.");
  return data ?? [];
}

export async function createAgentToken(input: {
  name: string;
  permissions?: AgentPermission[];
  expiresInDays?: number;
}) {
  const user = await requireHumanAdmin();
  const parsed = z.object({
    name: z.string().trim().min(1).max(80),
    permissions: permissionsSchema.default(() => [...DEFAULT_AGENT_PERMISSIONS]),
    expiresInDays: z.number().int().min(1).max(365).default(DEFAULT_AGENT_TOKEN_DAYS),
  }).strict().parse(input);
  const token = generateAgentToken();
  const expiresAt = new Date(Date.now() + parsed.expiresInDays * 86_400_000).toISOString();
  const { data, error } = await createAdminSupabase()
    .from("admin_agent_tokens")
    .insert({
      name: parsed.name,
      token_hash: hashAgentToken(token),
      last_four: token.slice(-4),
      permissions: parsed.permissions,
      expires_at: expiresAt,
      created_by: user.id,
    })
    .select("id,name,last_four,permissions,expires_at,created_at")
    .single();
  if (error || !data) throw new Error("Le jeton n'a pas pu être créé.");
  await recordAdminAction({
    actorUserId: user.id,
    action: "agent.token_create",
    targetType: "agent_token",
    targetId: data.id,
    result: "completed",
    approved: true,
    details: { permissionCount: parsed.permissions.length, expiresInDays: parsed.expiresInDays },
  });
  return { ...data, token };
}

export async function revokeAgentToken(tokenId: string) {
  const user = await requireHumanAdmin();
  const id = uuidSchema.parse(tokenId);
  const { data, error } = await createAdminSupabase()
    .from("admin_agent_tokens")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id)
    .is("revoked_at", null)
    .select("id")
    .maybeSingle();
  if (error) throw new Error("Le jeton n'a pas pu être révoqué.");
  if (data) await recordAdminAction({
    actorUserId: user.id,
    action: "agent.token_revoke",
    targetType: "agent_token",
    targetId: id,
    result: "completed",
    approved: true,
  });
  return { revoked: Boolean(data) };
}


export async function setAgentPermissions(tokenId: string, permissions: AgentPermission[]) {
  const user = await requireHumanAdmin();
  const id = uuidSchema.parse(tokenId);
  const parsed = permissionsSchema.parse(permissions);
  const { data, error } = await createAdminSupabase()
    .from("admin_agent_tokens")
    .update({ permissions: parsed })
    .eq("id", id)
    .is("revoked_at", null)
    .select("id")
    .maybeSingle();
  if (error || !data) throw new Error("Les permissions n'ont pas pu être enregistrées.");
  await recordAdminAction({
    actorUserId: user.id,
    action: "agent.permissions_update",
    targetType: "agent_token",
    targetId: id,
    result: "completed",
    approved: true,
    details: { permissionCount: parsed.length },
  });
  return parsed;
}

export async function setAgentMode(mode: AgentMode, confirmation?: string) {
  const user = await requireHumanAdmin();
  const parsed = z.enum(["prepare", "autopublish"]).parse(mode);
  if (parsed === "autopublish" && confirmation !== "AUTORISER") {
    throw new Error("La confirmation AUTORISER est requise.");
  }
  const { error } = await createAdminSupabase()
    .from("admin_agent_settings")
    .update({ mode: parsed, updated_by: user.id, updated_at: new Date().toISOString() })
    .eq("singleton", true);
  if (error) throw new Error("Le mode n'a pas pu être enregistré.");
  await recordAdminAction({
    actorUserId: user.id,
    action: "agent.mode_update",
    targetType: "agent_settings",
    targetId: "singleton",
    result: "completed",
    approved: true,
    details: { mode: parsed },
  });
  return parsed;
}

export async function getAgentMode(): Promise<AgentMode> {
  await requireHumanAdmin();
  const { data, error } = await createAdminSupabase()
    .from("admin_agent_settings")
    .select("mode")
    .eq("singleton", true)
    .maybeSingle();
  if (error || !data) throw new Error("Le mode de l'agent est indisponible.");
  return z.enum(["prepare", "autopublish"]).parse(data.mode);
}

async function cleanupNewsPayload(payload: unknown) {
  const parsed = preparedNewsSchema.safeParse(payload);
  if (parsed.success) await removeBuildNewsThumbnail(parsed.data.thumbnailStoragePath).catch(() => undefined);
}

export async function listPendingRequests() {
  const user = await requireHumanAdmin();
  const admin = createAdminSupabase();
  const expired = await admin.rpc("expire_admin_agent_requests", { p_actor_user_id: user.id });
  if (expired.error) throw new Error("Les demandes sont indisponibles.");
  const expiredRequests = Array.isArray(expired.data) ? expired.data : [];
  await Promise.all(expiredRequests
    .filter((request) => request?.request_payload)
    .map((request) => cleanupNewsPayload(request.request_payload)));
  const { data, error } = await admin.from("admin_agent_requests")
    .select("id,kind,target_id,payload,status,expires_at,created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(100);
  if (error) throw new Error("Les demandes sont indisponibles.");
  return data ?? [];
}

export async function listAgentJournal(limit = 100) {
  await requireHumanAdmin();
  const safeLimit = z.number().int().min(1).max(200).parse(limit);
  const { data, error } = await createAdminSupabase()
    .from("admin_action_audit")
    .select("id,action,target_type,target_id,result,approved_by,details,created_at")
    .like("action", "agent.%")
    .order("created_at", { ascending: false })
    .limit(safeLimit);
  if (error) throw new Error("Le journal est indisponible.");
  return data ?? [];
}

type ClaimedRequest = {
  request_id: string;
  request_kind: "publication" | "mail" | "nouveaute";
  request_target_id: string;
  request_payload: unknown;
  request_status: string;
  request_claimed: boolean;
};

export async function decideRequest(requestId: string, decision: AgentRequestDecision) {
  const user = await requireHumanAdmin();
  const id = uuidSchema.parse(requestId);
  const choice = z.enum(["approve", "refuse"]).parse(decision);
  const admin = createAdminSupabase();

  if (choice === "refuse") {
    const { data, error } = await admin.rpc("refuse_admin_agent_request", {
      p_request_id: id,
      p_actor_user_id: user.id,
    });
    if (error || !Array.isArray(data) || data.length !== 1) throw new Error("Demande introuvable.");
    const refused = data[0] as { request_status?: unknown; request_payload?: unknown };
    const status = typeof refused.request_status === "string" ? refused.request_status : "missing";
    if (status === "missing") throw new Error("Demande introuvable.");
    if (status === "refused" || status === "expired") await cleanupNewsPayload(refused.request_payload);
    if (status === "refused") await recordAdminAction({
      actorUserId: user.id,
      action: "agent.request_refuse",
      targetType: "agent_request",
      targetId: id,
      result: "refused",
      approved: true,
    });
    return { status };
  }

  const { data, error } = await admin.rpc("claim_admin_agent_request", {
    p_request_id: id,
    p_actor_user_id: user.id,
  });
  if (error || !Array.isArray(data) || data.length !== 1) throw new Error("Demande introuvable.");
  const claimed = data[0] as ClaimedRequest;
  if (claimed.request_status === "approved") return { status: "approved", replayed: true };
  if (claimed.request_status !== "executing" || claimed.request_claimed !== true) {
    return { status: claimed.request_status, replayed: true };
  }

  let executed = false;
  try {
    const result = claimed.request_kind === "publication"
      ? await executeAgentPublication(claimed.request_target_id, user.id)
      : claimed.request_kind === "nouveaute"
        ? await executePreparedNews(claimed.request_payload, user.id)
        : await executePreparedMail(claimed.request_payload);
    executed = true;
    const completed = await admin.from("admin_agent_requests")
      .update({ status: "approved", executed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("status", "executing");
    if (completed.error) throw new Error("La demande n'a pas pu être finalisée.");
    await recordAdminAction({
      actorUserId: user.id,
      action: "agent.request_approve",
      targetType: "agent_request",
      targetId: id,
      result: "approved",
      approved: true,
      details: { kind: claimed.request_kind },
    });
    return { status: "approved", result };
  } catch (executionError) {
    if (!executed && claimed.request_kind === "nouveaute") await cleanupNewsPayload(claimed.request_payload);
    await admin.from("admin_agent_requests")
      .update({ status: "failed", error_code: "execution_failed", updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("status", "executing");
    await recordAdminAction({
      actorUserId: user.id,
      action: "agent.request_approve",
      targetType: "agent_request",
      targetId: id,
      result: "failed",
      approved: true,
      details: { kind: claimed.request_kind },
    }).catch(() => undefined);
    throw executionError;
  }
}
