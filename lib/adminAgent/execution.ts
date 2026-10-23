import "server-only";

import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { videoChapterSchema, validateChapterTimeline } from "@/lib/mux/adminLessons";
import { AgentToolError } from "./types";

const MAX_ADMIN_EMAIL_BODY_BYTES = 25 * 1024;

export const preparedMailSchema = z.object({
  campaignId: z.string().uuid(),
  audience: z.enum(["all", "free", "beginner", "full"]),
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
  section_id: string;
  summary: unknown;
  transcript: unknown;
  chapters: unknown;
  thumbnail: unknown;
  status: unknown;
  mux_asset_id: unknown;
  playback_id: unknown;
  duration_seconds: unknown;
  published_at: unknown;
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

export async function validateAgentPublicationTarget(videoId: string, signal?: AbortSignal) {
  const admin = createAdminSupabase({ signal });
  const { data, error } = await admin
    .from("video_lessons")
    .select("id,section_id,summary,transcript,chapters,thumbnail,status,mux_asset_id,playback_id,duration_seconds,published_at")
    .eq("id", videoId)
    .maybeSingle();
  if (error) throw new Error("La vidéo ne peut pas être vérifiée.");
  if (!data) throw new AgentToolError("Cette vidéo n'existe pas.");
  assertPublishableVideo(data as PublishableVideo);
  return data as PublishableVideo;
}

export async function executeAgentPublication(videoId: string, actorUserId: string, signal?: AbortSignal) {
  const data = await validateAgentPublicationTarget(videoId, signal);
  const admin = createAdminSupabase({ signal });

  const published = await admin.rpc("publish_video_lesson", {
    p_video_id: videoId,
    p_actor_user_id: actorUserId,
  });
  if (published.error || !Array.isArray(published.data) || published.data.length !== 1) {
    throw new Error("La publication a échoué.");
  }
  return {
    sectionId: data.section_id as string,
    previousAssetId: typeof published.data[0]?.previous_mux_asset_id === "string"
      ? published.data[0].previous_mux_asset_id
      : null,
  };
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
