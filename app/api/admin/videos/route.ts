import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { isJsonMediaType, readBoundedBody } from "@/lib/mcp/http";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { getSiteOrigin } from "@/lib/siteOrigin";
import { blocIdFromDisplayNumber } from "@/lib/blocCatalog";
import {
  adminVideoCreateSchema,
  buildMuxPassthrough,
  parseTranscriptSegments,
  tierForBloc,
  validateChapterTimeline,
} from "@/lib/mux/adminLessons";
import {
  createMuxAdminClient,
  getVerifiedAdmin,
  recordAdminAction,
  type AdminVideoLessonRow,
} from "@/lib/mux/adminServer";

const MAX_CREATE_BODY_BYTES = 300 * 1024;

function jsonError(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function GET() {
  const user = await getVerifiedAdmin();
  if (!user) return jsonError("Accès refusé.", 403);

  const admin = createAdminSupabase();
  const { data, error } = await admin
    .from("video_lessons")
    .select("id,bloc_id,position,title,summary,transcript,transcript_segments,transcript_source,deliverables,chapters,thumbnail,tier_required,status,mux_upload_id,mux_asset_id,playback_id,duration_seconds,error_code,published_at,replaced_at,approved_at,created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) return jsonError("Les vidéos sont indisponibles.", 503);

  return NextResponse.json({ ok: true, videos: (data ?? []) as AdminVideoLessonRow[] });
}

export async function POST(request: NextRequest) {
  const user = await getVerifiedAdmin();
  if (!user) return jsonError("Accès refusé.", 403);
  if (!isJsonMediaType(request.headers.get("content-type"))) return jsonError("Corps JSON requis.", 415);

  const bounded = await readBoundedBody(request, MAX_CREATE_BODY_BYTES);
  if (bounded.ok === false) return jsonError("Requête invalide.", bounded.reason === "too_large" ? 413 : 400);

  let raw: unknown;
  try {
    raw = JSON.parse(bounded.text);
  } catch {
    return jsonError("Requête invalide.", 400);
  }
  const parsed = adminVideoCreateSchema.safeParse(raw);
  if (!parsed.success) return jsonError("Vidéo, transcription ou chapitres invalides.", 400);
  const timelineError = validateChapterTimeline(parsed.data.chapters);
  if (timelineError) return jsonError(timelineError, 400);

  const blocId = blocIdFromDisplayNumber(parsed.data.blocNumero);
  if (!blocId) return jsonError("Bloc inconnu.", 400);

  const videoId = randomUUID();
  let uploadId: string | null = null;
  try {
    const mux = createMuxAdminClient();
    const upload = await mux.video.uploads.create({
      cors_origin: getSiteOrigin(),
      timeout: 3_600,
      new_asset_settings: {
        playback_policies: ["signed"],
        video_quality: "basic",
        passthrough: buildMuxPassthrough(videoId),
        meta: { external_id: `${blocId}:${parsed.data.position}`, title: parsed.data.title },
        inputs: [{
          generated_subtitles: [{ language_code: "fr", name: "Français", passthrough: "build-fr-auto" }],
        }],
      },
    }, { signal: request.signal });
    uploadId = upload.id;
    if (!upload.url) throw new Error("URL d'envoi Mux absente.");

    const admin = createAdminSupabase({ signal: request.signal });
    const { error } = await admin.from("video_lessons").insert({
      id: videoId,
      bloc_id: blocId,
      position: parsed.data.position,
      title: parsed.data.title,
      summary: parsed.data.summary,
      transcript: parsed.data.transcript,
      transcript_segments: parseTranscriptSegments(parsed.data.transcript),
      transcript_source: parsed.data.transcript.trim() ? "manual" : "automatic",
      deliverables: parsed.data.deliverables,
      chapters: parsed.data.chapters,
      tier_required: tierForBloc(blocId),
      status: "waiting",
      mux_upload_id: upload.id,
      created_by: user.id,
    });
    if (error) throw new Error("Écriture vidéo impossible.");

    await recordAdminAction({
      actorUserId: user.id,
      action: "video.upload_created",
      targetType: "video_lesson",
      targetId: videoId,
      result: "completed",
      details: {
        blocNumero: parsed.data.blocNumero,
        position: parsed.data.position,
        tier: tierForBloc(blocId),
        fileBytes: parsed.data.file.size,
        mimeType: parsed.data.file.type,
      },
    });

    return NextResponse.json({ ok: true, videoId, uploadUrl: upload.url }, { status: 201 });
  } catch {
    if (uploadId) {
      let cancelled = false;
      try {
        await createMuxAdminClient().video.uploads.cancel(uploadId);
        cancelled = true;
      } catch {
        console.error("admin.video.orphan_upload_cleanup_failed");
      }
      if (cancelled) {
        try {
          const { error: cleanupError } = await createAdminSupabase()
            .from("video_lessons")
            .update({ status: "cancelled", error_code: "admin_create_rolled_back", updated_at: new Date().toISOString() })
            .eq("id", videoId)
            .eq("mux_upload_id", uploadId)
            .is("published_at", null);
          if (cleanupError) console.error("admin.video.orphan_row_cleanup_failed");
        } catch {
          console.error("admin.video.orphan_row_cleanup_failed");
        }
      }
    }
    console.error("admin.video.create_failed");
    return jsonError("L'envoi ne peut pas démarrer.", 503);
  }
}
