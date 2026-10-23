import "server-only";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { getSiteOrigin } from "@/lib/siteOrigin";
import {
  MAX_ADMIN_VIDEO_BYTES,
  VIDEO_MIME_TYPES,
  buildMuxPassthrough,
  tierForSection,
  validateChapterTimeline,
  videoChapterSchema,
} from "@/lib/mux/adminLessons";
import { createMuxAdminClient, recordAdminAction } from "@/lib/mux/adminServer";
import {
  executeAgentPublication,
  preparedMailSchema,
  validateAgentPublicationTarget,
  validatePreparedMailForExecution,
} from "./execution";
import { AgentAuthError, requireAgentPermission } from "./security";
import {
  AgentToolError,
  type AgentPermission,
  type AgentTokenContext,
  type AgentToolResult,
} from "./types";

const uuid = z.string().uuid();
const videoIdInput = z.object({ videoId: uuid }).strict();
const writeChaptersInput = z.object({
  videoId: uuid,
  chapters: z.array(videoChapterSchema).min(1).max(40),
}).strict();
const writeSummaryInput = z.object({ videoId: uuid, summary: z.string().trim().min(1).max(2_000) }).strict();
const chooseThumbnailInput = z.object({ videoId: uuid, timeSeconds: z.number().int().min(0).max(43_200) }).strict();
const uploadInput = z.object({
  sectionId: z.string().regex(/^b\d+-s[0-9a-z]+$/),
  title: z.string().trim().min(1).max(200),
  file: z.object({
    name: z.string().trim().min(1).max(255),
    size: z.number().int().positive().max(MAX_ADMIN_VIDEO_BYTES),
    type: z.enum(VIDEO_MIME_TYPES),
  }).strict(),
}).strict();
const prepareMailInput = preparedMailSchema.omit({ campaignId: true });
const journalInput = z.object({ limit: z.number().int().min(1).max(100).default(30) }).strict();

type ToolDefinition = {
  title: string;
  description: string;
  permission: AgentPermission;
  schema: z.ZodObject<any>;
  run: (input: any, context: AgentTokenContext) => Promise<Record<string, unknown>>;
};

function asResult(value: Record<string, unknown>): AgentToolResult {
  return {
    content: [{ type: "text", text: JSON.stringify(value) }],
    structuredContent: value,
  };
}

async function assertSectionExists(sectionId: string) {
  const { BLOCS_DATA } = await import("@/lib/mockData");
  const section = BLOCS_DATA.flatMap((bloc) => bloc.sections).find((candidate) => candidate.id === sectionId);
  if (!section) throw new AgentToolError("Ce chapitre n'existe pas.");
  return section;
}

function requestCreationError(error: unknown): AgentToolError | null {
  const message = typeof error === "object" && error && "message" in error
    ? String(error.message)
    : "";
  const messages: Record<string, string> = {
    agent_token_inactive: "Jeton invalide.",
    agent_video_missing: "Cette vidéo n'existe pas.",
    agent_video_published: "La vidéo est déjà publiée.",
    agent_video_not_ready: "La vidéo n'est pas prête.",
    agent_video_missing_transcript: "La transcription manque.",
    agent_video_missing_summary: "Le résumé manque.",
    agent_video_missing_chapters: "Les chapitres manquent ou sont invalides.",
    agent_video_missing_thumbnail: "La miniature manque.",
    agent_mail_invalid_segment: "Ce segment n'est pas autorisé.",
    agent_mail_no_recipients: "Ce segment ne contient aucun compte actif autorisé.",
    agent_mail_too_many_recipients: "Ce segment contient trop de destinataires pour un envoi sûr.",
    agent_pending_token_limit: "Ce jeton a déjà 20 demandes en attente.",
    agent_pending_global_limit: "La file contient déjà 100 demandes en attente.",
  };
  const key = Object.keys(messages).find((candidate) => message.includes(candidate));
  return key ? new AgentToolError(messages[key]) : null;
}

async function auditTool(context: AgentTokenContext, tool: AgentPermission, targetId: string, details: Record<string, string | number | boolean | null> = {}) {
  await recordAdminAction({
    actorUserId: context.createdBy,
    action: `agent.${tool}`,
    targetType: tool === "liste_blocs" || tool === "journal" ? "agent_token" : "video_lesson",
    targetId,
    result: "completed",
    details: { tokenId: context.id, ...details },
  });
}

async function createRequest(
  context: AgentTokenContext,
  kind: "publication" | "mail",
  targetId: string,
  payload: Record<string, unknown>,
) {
  const id = randomUUID();
  const { data, error } = await createAdminSupabase().rpc("create_admin_agent_request", {
    p_token_id: context.id,
    p_kind: kind,
    p_target_id: targetId,
    p_payload: payload,
    p_idempotency_key: id,
  });
  if (error) throw requestCreationError(error) ?? new Error("La demande n'a pas pu être créée.");
  if (!Array.isArray(data) || data.length !== 1 || data[0]?.request_id !== id) {
    throw new Error("La demande n'a pas pu être créée.");
  }
  await recordAdminAction({
    actorUserId: context.createdBy,
    action: "agent.request_create",
    targetType: "agent_request",
    targetId: id,
    result: "pending",
    details: { tokenId: context.id, kind, targetId },
  });
  return { requestId: id, status: "pending", expiresInDays: 7 };
}

async function requireWritableVideo(videoId: string, options: { ready?: boolean; playback?: boolean } = {}) {
  const { data, error } = await createAdminSupabase().from("video_lessons")
    .select("id,status,published_at,duration_seconds,playback_id")
    .eq("id", videoId)
    .maybeSingle();
  if (error) throw new Error("La vidéo ne peut pas être vérifiée.");
  if (!data) throw new AgentToolError("Cette vidéo n'existe pas.");
  if (data.published_at) throw new AgentToolError("La vidéo est déjà publiée.");
  if (["errored", "cancelled"].includes(data.status)) {
    throw new AgentToolError("Cette vidéo ne peut plus être modifiée.");
  }
  if (options.ready && data.status !== "ready") throw new AgentToolError("La vidéo n'est pas prête.");
  if (options.playback && !data.playback_id) throw new AgentToolError("La vidéo n'est pas prête.");
  return data;
}

export const ADMIN_AGENT_TOOLS = {
  liste_blocs: {
    title: "Lister les blocs",
    description: "Liste les chapitres publics du programme sans donnée de membre.",
    permission: "liste_blocs",
    schema: z.object({}).strict(),
    async run(_input, context) {
      const { BLOCS_DATA } = await import("@/lib/mockData");
      const blocs = BLOCS_DATA.map((bloc) => ({
        id: bloc.id,
        title: bloc.titre,
        chapters: bloc.sections.map((section) => ({ id: section.id, title: section.title })),
      }));
      await auditTool(context, "liste_blocs", context.id, { count: blocs.length });
      return { blocs };
    },
  },
  envoyer_video: {
    title: "Envoyer une vidéo",
    description: "Crée un envoi direct Mux signé. Le fichier ne passe pas par BUILD.",
    permission: "envoyer_video",
    schema: uploadInput,
    async run(input, context) {
      const section = await assertSectionExists(input.sectionId);
      const videoId = randomUUID();
      const mux = createMuxAdminClient();
      let upload;
      try {
        upload = await mux.video.uploads.create({
          cors_origin: getSiteOrigin(),
          timeout: 3_600,
          new_asset_settings: {
            playback_policies: ["signed"],
            video_quality: "basic",
            passthrough: buildMuxPassthrough(videoId),
            meta: { external_id: input.sectionId, title: input.title },
            inputs: [{ generated_subtitles: [{ language_code: "fr", name: "Français", passthrough: "build-fr-auto" }] }],
          },
        });
      } catch {
        throw new Error("L'envoi ne peut pas démarrer.");
      }
      if (!upload.url) throw new Error("URL d'envoi Mux absente.");
      const { error } = await createAdminSupabase().from("video_lessons").insert({
        id: videoId,
        section_id: input.sectionId,
        title: input.title || section.title,
        summary: "",
        transcript: "",
        deliverables: [],
        chapters: [],
        tier_required: tierForSection(input.sectionId),
        status: "waiting",
        mux_upload_id: upload.id,
        created_by: context.createdBy,
      });
      if (error) {
        await mux.video.uploads.cancel(upload.id).catch(() => undefined);
        throw new Error("L'envoi ne peut pas démarrer.");
      }
      await auditTool(context, "envoyer_video", videoId, {
        sectionId: input.sectionId,
        fileBytes: input.file.size,
        mimeType: input.file.type,
      });
      return { videoId, uploadUrl: upload.url, method: "PUT" };
    },
  },
  ecrire_chapitres: {
    title: "Écrire les chapitres",
    description: "Enregistre des repères strictement croissants avant la fin de la vidéo.",
    permission: "ecrire_chapitres",
    schema: writeChaptersInput,
    async run(input, context) {
      const admin = createAdminSupabase();
      const data = await requireWritableVideo(input.videoId, { ready: true });
      const timelineError = validateChapterTimeline(input.chapters, data.duration_seconds);
      if (timelineError) throw new AgentToolError("Les chapitres sont invalides.");
      const updated = await admin.from("video_lessons").update({ chapters: input.chapters, updated_at: new Date().toISOString() })
        .eq("id", input.videoId).eq("status", "ready").is("published_at", null).select("id").maybeSingle();
      if (updated.error || !updated.data) throw new Error("Les chapitres n'ont pas pu être enregistrés.");
      await auditTool(context, "ecrire_chapitres", input.videoId, { chapterCount: input.chapters.length });
      return { videoId: input.videoId, chapterCount: input.chapters.length };
    },
  },
  ecrire_resume: {
    title: "Écrire le résumé",
    description: "Enregistre le résumé d'une vidéo non publiée.",
    permission: "ecrire_resume",
    schema: writeSummaryInput,
    async run(input, context) {
      await requireWritableVideo(input.videoId);
      const { data, error } = await createAdminSupabase().from("video_lessons")
        .update({ summary: input.summary, updated_at: new Date().toISOString() })
        .eq("id", input.videoId).is("published_at", null).select("id").maybeSingle();
      if (error || !data) throw new Error("Le résumé n'a pas pu être enregistré.");
      await auditTool(context, "ecrire_resume", input.videoId);
      return { videoId: input.videoId, saved: true };
    },
  },
  choisir_miniature: {
    title: "Choisir la miniature",
    description: "Choisit une image Mux à un temps donné, sans conserver de jeton signé.",
    permission: "choisir_miniature",
    schema: chooseThumbnailInput,
    async run(input, context) {
      const admin = createAdminSupabase();
      const data = await requireWritableVideo(input.videoId, { ready: true, playback: true });
      if (!data.duration_seconds || input.timeSeconds >= data.duration_seconds) {
        throw new AgentToolError("Le temps choisi dépasse la durée de la vidéo.");
      }
      const updated = await admin.from("video_lessons")
        .update({ thumbnail: `mux:${input.timeSeconds}`, updated_at: new Date().toISOString() })
        .eq("id", input.videoId).eq("status", "ready").is("published_at", null).select("id").maybeSingle();
      if (updated.error || !updated.data) throw new Error("La miniature n'a pas pu être enregistrée.");
      await auditTool(context, "choisir_miniature", input.videoId, { timeSeconds: input.timeSeconds });
      return { videoId: input.videoId, timeSeconds: input.timeSeconds };
    },
  },
  demander_publication: {
    title: "Demander la publication",
    description: "Crée une demande à valider, sauf si l'admin a confirmé le mode de publication autonome.",
    permission: "demander_publication",
    schema: videoIdInput,
    async run(input, context) {
      const video = await validateAgentPublicationTarget(input.videoId);
      await assertSectionExists(video.section_id);
      const { data } = await createAdminSupabase().from("admin_agent_settings").select("mode").eq("singleton", true).maybeSingle();
      if (data?.mode === "autopublish") {
        const result = await executeAgentPublication(input.videoId, context.createdBy);
        await auditTool(context, "demander_publication", input.videoId, { mode: "autopublish" });
        return { status: "published", ...result };
      }
      return createRequest(context, "publication", input.videoId, { videoId: input.videoId });
    },
  },
  preparer_mail: {
    title: "Préparer un mail",
    description: "Prépare un mail qui ne part qu'après approbation humaine et confirmation ENVOYER.",
    permission: "preparer_mail",
    schema: prepareMailInput,
    async run(input, context) {
      const campaignId = randomUUID();
      const payload = validatePreparedMailForExecution({ ...input, campaignId });
      return createRequest(context, "mail", campaignId, payload);
    },
  },
  statut_video: {
    title: "Lire le statut d'une vidéo",
    description: "Lit seulement l'état technique et les étapes de préparation nécessaires.",
    permission: "statut_video",
    schema: videoIdInput,
    async run(input, context) {
      const { data, error } = await createAdminSupabase().from("video_lessons")
        .select("id,section_id,title,status,duration_seconds,summary,transcript,chapters,thumbnail,published_at,error_code")
        .eq("id", input.videoId).maybeSingle();
      if (error || !data) throw new Error("Vidéo introuvable.");
      const result = {
        id: data.id,
        sectionId: data.section_id,
        title: data.title,
        status: data.status,
        durationSeconds: data.duration_seconds,
        hasTranscript: typeof data.transcript === "string" && data.transcript.trim().length >= 20,
        hasSummary: typeof data.summary === "string" && data.summary.trim().length > 0,
        chapterCount: Array.isArray(data.chapters) ? data.chapters.length : 0,
        hasThumbnail: Boolean(data.thumbnail),
        published: Boolean(data.published_at),
        errorCode: data.error_code,
      };
      await auditTool(context, "statut_video", input.videoId);
      return result;
    },
  },
  journal: {
    title: "Lire le journal",
    description: "Lit uniquement les actions de ce jeton, sans secret, adresse ni corps de mail.",
    permission: "journal",
    schema: journalInput,
    async run(input, context) {
      const { data, error } = await createAdminSupabase().from("admin_action_audit")
        .select("action,target_type,target_id,result,created_at,details")
        .contains("details", { tokenId: context.id })
        .order("created_at", { ascending: false })
        .limit(input.limit);
      if (error) throw new Error("Le journal est indisponible.");
      return { entries: data ?? [] };
    },
  },
} satisfies Record<AgentPermission, ToolDefinition>;

export type AdminAgentToolName = keyof typeof ADMIN_AGENT_TOOLS;

export async function invokeAdminAgentTool(
  name: string,
  rawInput: unknown,
  context: AgentTokenContext,
): Promise<AgentToolResult> {
  if (!(name in ADMIN_AGENT_TOOLS)) throw new AgentAuthError(404, "Outil inconnu.");
  const tool = ADMIN_AGENT_TOOLS[name as AdminAgentToolName];
  requireAgentPermission(context, tool.permission);
  const parsed = tool.schema.safeParse(rawInput);
  if (!parsed.success) {
    if (name === "preparer_mail" && rawInput && typeof rawInput === "object" && "audience" in rawInput) {
      const audience = (rawInput as { audience?: unknown }).audience;
      if (!preparedMailSchema.shape.audience.safeParse(audience).success) {
        throw new AgentAuthError(400, "Le segment du mail n'est pas autorisé.");
      }
    }
    throw new AgentAuthError(400, "Arguments invalides.");
  }
  try {
    return asResult(await tool.run(parsed.data, context));
  } catch (error) {
    if (
      error instanceof AgentToolError
      || (
        typeof error === "object"
        && error !== null
        && "isAgentToolError" in error
        && error.isAgentToolError === true
        && "message" in error
        && typeof error.message === "string"
      )
    ) {
      return {
        content: [{ type: "text", text: error.message }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: "L'outil n'a pas pu terminer cette action." }],
      isError: true,
    };
  }
}
