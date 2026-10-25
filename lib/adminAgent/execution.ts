import "server-only";

import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { assertBuildNewsThumbnail } from "@/lib/buildNews/thumbnail.server";
import { createBuildNews } from "@/lib/buildNews/server";
import { buildNewsInputSchema } from "@/lib/buildNews/model";
import { displayLocationFromBlocId } from "@/lib/blocCatalog";
import { recordVideoPublishedNews } from "@/lib/nouveautes/autoNews.server";
import { videoChapterSchema, validateChapterTimeline } from "@/lib/mux/adminLessons";
import { cleanupMuxAsset } from "@/lib/mux/assetCleanup.server";
import { AgentToolError } from "./types";
const MAX_ADMIN_EMAIL_BODY_BYTES = 25 * 1024;
const preparedNewsStoragePath = z.string().regex(/^news\/[0-9a-f-]{36}\/[0-9a-f]{12}\.(?:jpg|png|webp)$/i);

export const preparedNewsSchema = z.object({
  news: buildNewsInputSchema,
  thumbnailStoragePath: preparedNewsStoragePath,
  sourceVideoId: z.string().uuid().nullable(),
}).strict();

export const preparedMailSchema = z.object({
  campaignId: z.string().uuid(),
  audience: z.enum(["all", "free", "beginner", "full"]),
  recipientCount: z.number().int().min(0).max(10).optional(),
  subject: z.string().trim().min(1).max(160),
  preheader: z.string().trim().max(200).default(""),
  body: z.string().trim().min(1).max(20_000),
  ctaLabel: z.string().trim().max(80).default("Voir la mise à jour"),
  ctaUrl: z.literal("").or(
    z.string().trim().max(2_048).url().refine((value) => URL.canParse(value) && new URL(value).protocol === "https:"),
  ).default(""),
}).strict();

function preparedMailExecutionBody(payload: z.infer<typeof preparedMailSchema>) {
  const body = JSON.stringify({
    ...payload,
    selectedUserIds: [],
    approved: true,
    confirmation: "ENVOYER",
  });
  if (Buffer.byteLength(body, "utf8") > MAX_ADMIN_EMAIL_BODY_BYTES) {
    throw new AgentToolError("Le contenu du mail est trop long.");
  }
  return body;
}

export function validatePreparedMailForExecution(payload: unknown) {
  const parsed = preparedMailSchema.parse(payload);
  preparedMailExecutionBody(parsed);
  return parsed;
}

type PublishableVideo = {
  id: string;
  bloc_id: string;
  position: number;
  summary: unknown;
  transcript: unknown;
  transcript_segments: unknown;
  chapters: unknown;
  thumbnail: unknown;
  status: unknown;
  mux_asset_id: unknown;
  playback_id: unknown;
  duration_seconds: unknown;
  published_at: unknown;
  replaced_at: unknown;
  created_by_agent_token_id: unknown;
};
function assertPublishableVideo(data: PublishableVideo) {
  if (data.published_at) throw new AgentToolError("La vidéo est déjà publiée.");
  if (data.status !== "ready" || !data.mux_asset_id || !data.playback_id || !data.duration_seconds) {
    throw new AgentToolError("La vidéo n'est pas prête.");
  }
  const missing: string[] = [];
  if (typeof data.transcript !== "string" || data.transcript.trim().length < 20) {
    missing.push("la transcription");
  }
  if (typeof data.summary !== "string" || !data.summary.trim()) {
    missing.push("le résumé");
  }
  if (!data.thumbnail || typeof data.thumbnail !== "string") {
    missing.push("la miniature");
  }
  const hasChapters = Array.isArray(data.chapters) && data.chapters.length > 0;
  if (!hasChapters) missing.push("les chapitres");
  if (missing.length > 0) {
    const detail = missing.length === 1
      ? missing[0]
      : `${missing.slice(0, -1).join(", ")} et ${missing.at(-1)}`;
    throw new AgentToolError(`Il manque ${detail}.`);
  }
  const chapters = z.array(videoChapterSchema).min(1).safeParse(data.chapters);
  if (!chapters.success) throw new AgentToolError("Les chapitres sont invalides.");
  if (typeof data.duration_seconds !== "number") throw new AgentToolError("La vidéo n'est pas prête.");
  if (validateChapterTimeline(chapters.data, data.duration_seconds)) {
    throw new AgentToolError("Les chapitres sont invalides.");
  }
}

export async function validateAgentPublicationTarget(videoId: string, signal?: AbortSignal, expectedTokenId?: string) {
  const admin = createAdminSupabase({ signal });
  const { data, error } = await admin
    .from("video_lessons")
    .select("id,bloc_id,position,summary,transcript,transcript_segments,chapters,thumbnail,status,mux_asset_id,playback_id,duration_seconds,published_at,replaced_at,created_by_agent_token_id")
    .eq("id", videoId)
    .maybeSingle();
  if (error) throw new Error("La vidéo ne peut pas être vérifiée.");
  if (!data) throw new AgentToolError("Cette vidéo n'existe pas.");
  if (data.replaced_at) throw new AgentToolError("Cette vidéo a été remplacée et ne peut plus être publiée.");
  if (expectedTokenId && data.created_by_agent_token_id !== expectedTokenId) {
    throw new AgentToolError("Ce jeton ne peut pas publier une vidéo créée par un autre jeton.");
  }
  assertPublishableVideo(data as PublishableVideo);
  return data as PublishableVideo & { replaced_at?: string | null; created_by_agent_token_id?: string | null };
}

export async function executeAgentPublication(videoId: string, actorUserId: string, signal?: AbortSignal, expectedTokenId?: string) {
  const data = await validateAgentPublicationTarget(videoId, signal, expectedTokenId);
  const admin = createAdminSupabase({ signal });

  const published = await admin.rpc("publish_video_lesson", {
    p_video_id: videoId,
    p_actor_user_id: actorUserId,
  });
  if (published.error || !Array.isArray(published.data) || published.data.length !== 1) {
    throw new Error("La publication a échoué.");
  }
  await recordVideoPublishedNews(videoId, { actorUserId });
  const previousAssetId = typeof published.data[0]?.previous_mux_asset_id === "string"
    ? published.data[0].previous_mux_asset_id
    : null;
  if (previousAssetId && !await cleanupMuxAsset(previousAssetId, signal)) {
    throw new Error("La publication est faite, mais l'ancien asset Mux attend son nettoyage.");
  }
  return {
    blocNumero: displayLocationFromBlocId(data.bloc_id),
    position: data.position as number,
    previousAssetId,
  };
}

export function validatePreparedNewsForExecution(payload: unknown) {
  const parsed = preparedNewsSchema.parse(payload);
  buildNewsInputSchema.parse(parsed.news);
  return parsed;
}

export async function executePreparedNews(payload: unknown, actorUserId: string) {
  const parsed = validatePreparedNewsForExecution(payload);
  await assertBuildNewsThumbnail(parsed.thumbnailStoragePath);
  return createBuildNews(parsed.news, actorUserId, parsed.thumbnailStoragePath);
}

export async function executePreparedMail(payload: unknown) {
  const parsed = validatePreparedMailForExecution(payload);
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
  if (!cookieHeader) throw new Error("La session admin doit être renouvelée.");
  const { POST } = await import("@/app/api/admin/send-email/route");
  const request = new NextRequest("http://localhost/api/admin/send-email", {
    method: "POST",
    headers: { "content-type": "application/json", cookie: cookieHeader },
    body: preparedMailExecutionBody(parsed),
  });
  const response = await POST(request);
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("La session admin doit être renouvelée.");
    }
    throw new Error("L'envoi du mail a échoué.");
  }
  return response.json() as Promise<{ ok: true; accepted: number; total: number }>;
}
