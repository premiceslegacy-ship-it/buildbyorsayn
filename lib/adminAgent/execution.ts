import "server-only";

import { NextRequest } from "next/server";
import { z } from "zod";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { videoChapterSchema, validateChapterTimeline } from "@/lib/mux/adminLessons";

export const preparedMailSchema = z.object({
  campaignId: z.string().uuid(),
  audience: z.enum(["all", "free", "beginner", "full"]),
  subject: z.string().trim().min(1).max(160),
  preheader: z.string().trim().max(200).default(""),
  body: z.string().trim().min(1).max(20_000),
  ctaLabel: z.string().trim().max(80).default("Voir la mise à jour"),
  ctaUrl: z.string().trim().max(2_048).url().refine((value) => new URL(value).protocol === "https:").or(z.literal("")),
}).strict();

export async function executeAgentPublication(videoId: string, actorUserId: string, signal?: AbortSignal) {
  const admin = createAdminSupabase({ signal });
  const { data, error } = await admin
    .from("video_lessons")
    .select("id,section_id,summary,transcript,chapters,thumbnail,status,mux_asset_id,playback_id,duration_seconds")
    .eq("id", videoId)
    .maybeSingle();
  if (error || !data) throw new Error("Vidéo introuvable.");

  const chapters = z.array(videoChapterSchema).min(1).safeParse(data.chapters);
  const timelineError = chapters.success
    ? validateChapterTimeline(chapters.data, data.duration_seconds)
    : "Les chapitres sont invalides.";
  if (data.status !== "ready" || !data.mux_asset_id || !data.playback_id || !data.duration_seconds) {
    throw new Error("La vidéo est encore en traitement.");
  }
  if (typeof data.transcript !== "string" || data.transcript.trim().length < 20) {
    throw new Error("La transcription est requise avant publication.");
  }
  if (typeof data.summary !== "string" || !data.summary.trim()) throw new Error("Le résumé est requis avant publication.");
  if (!data.thumbnail || typeof data.thumbnail !== "string") throw new Error("La miniature est requise avant publication.");
  if (timelineError) throw new Error(timelineError);

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
  const parsed = preparedMailSchema.parse(payload);
  const { POST } = await import("@/app/api/admin/send-email/route");
  const request = new NextRequest("http://localhost/api/admin/send-email", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      ...parsed,
      selectedUserIds: [],
      approved: true,
      confirmation: "ENVOYER",
    }),
  });
  const response = await POST(request);
  if (!response.ok) throw new Error("L'envoi du mail a échoué.");
  return response.json() as Promise<{ ok: true; accepted: number; total: number }>;
}
