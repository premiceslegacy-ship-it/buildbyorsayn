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
import { executeAgentPublication, preparedMailSchema } from "./execution";
import { AgentAuthError, requireAgentPermission } from "./security";
import type { AgentPermission, AgentTokenContext, AgentToolResult } from "./types";

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
  if (!section) throw new Error("Chapitre inconnu.");
  return section;
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
  const { error } = await createAdminSupabase().from("admin_agent_requests").insert({
    id,
    token_id: context.id,
    kind,
    target_id: targetId,
    payload,
    idempotency_key: id,
  });
  if (error) throw new Error("La demande n'a pas pu être créée.");
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
      const { data, error } = await admin.from("video_lessons").select("duration_seconds").eq("id", input.videoId).maybeSingle();
      if (error || !data) throw new Error("Vidéo introuvable.");
      const timelineError = validateChapterTimeline(input.chapters, data.duration_seconds);
      if (timelineError) throw new Error(timelineError);
      const updated = await admin.from("video_lessons").update({ chapters: input.chapters, updated_at: new Date().toISOString() })
        .eq("id", input.videoId).is("published_at", null).select("id").maybeSingle();
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
      const { data, error } = await admin.from("video_lessons").select("duration_seconds").eq("id", input.videoId).maybeSingle();
      if (error || !data) throw new Error("Vidéo introuvable.");
      if (!data.duration_seconds || input.timeSeconds >= data.duration_seconds) throw new Error("Le temps dépasse la vidéo.");
      const updated = await admin.from("video_lessons")
        .update({ thumbnail: `mux:${input.timeSeconds}`, updated_at: new Date().toISOString() })
        .eq("id", input.videoId).is("published_at", null).select("id").maybeSingle();
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
      return createRequest(context, "mail", campaignId, { ...input, campaignId });
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
  if (!parsed.success) throw new AgentAuthError(400, "Arguments invalides.");
  try {
    return asResult(await tool.run(parsed.data, context));
  } catch {
    return {
      content: [{ type: "text", text: "L'outil n'a pas pu terminer cette action." }],
      isError: true,
    };
  }
}
