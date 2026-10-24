"use server";

import Mux from "@mux/ts";
import { createClient } from "@/lib/supabase/server";
import { resolveMcpProfileTier } from "@/lib/mcpAccess";
import { canReadBlocSection } from "@/lib/blocAccess";
import lessonsFile from "@/lib/blocLessons.json";
import type { LessonRecord } from "@/lib/blocCatalog";

export type LessonPlayback =
  | {
      ok: true;
      playbackId: string;
      tokens: { playback: string; thumbnail: string; storyboard: string };
      viewerEmail: string;
      startSeconds: number;
    }
  | { ok: false };

const SECTION_ID = /^b\d+-s[0-9a-z]+$/;
const MIN_TOKEN_LIFETIME_SECONDS = 7200;

/**
 * Signs short-lived Mux playback tokens for one lesson. Every gate is
 * evaluated server-side from the verified session: the client only chooses a
 * section id, never a playback id.
 */
export async function getLessonPlayback(sectionId: string): Promise<LessonPlayback> {
  try {
    if (typeof sectionId !== "string" || !SECTION_ID.test(sectionId)) return { ok: false };

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { ok: false };

    const { data: profile, error: profileError } = await supabase.from("profiles")
      .select("tier").eq("id", user.id).maybeSingle();
    const tier = resolveMcpProfileTier(profile, profileError);

    // Dynamic on purpose: the private corpus is only loaded after the caller is authenticated (same boundary as lib/blocData.server.ts).
    const { BLOCS_DATA } = await import("@/lib/mockData");
    const bloc = BLOCS_DATA.find((item) => item.sections.some((section) => section.id === sectionId));
    if (!bloc || !canReadBlocSection(tier, bloc.id, sectionId)) return { ok: false };
    const lesson = (lessonsFile.lessons as LessonRecord[]).find((item) => item.sectionId === sectionId);
    if (!lesson?.playbackId) return { ok: false };

    const claims: Record<string, string> = process.env.MUX_PLAYBACK_RESTRICTION_ID
      ? { playback_restriction_id: process.env.MUX_PLAYBACK_RESTRICTION_ID }
      : {};
    const mux = new Mux({
      jwtSigningKey: process.env.MUX_SIGNING_KEY,
      jwtPrivateKey: process.env.MUX_PRIVATE_KEY,
    });
    const lifetime = Math.max(MIN_TOKEN_LIFETIME_SECONDS, (lesson.durationSeconds ?? 0) + 3600);
    const signed = await mux.jwt.signPlaybackId(lesson.playbackId, {
      expiration: `${lifetime}s`,
      type: [["video", claims], ["thumbnail", claims], ["storyboard", claims]],
    });
    const playback = signed["playback-token"];
    const thumbnail = signed["thumbnail-token"];
    const storyboard = signed["storyboard-token"];
    if (!playback || !thumbnail || !storyboard) return { ok: false };

    let startSeconds = 0;
    const { data: progress } = await supabase.from("lesson_progress")
      .select("position_seconds, completed")
      .eq("user_id", user.id).eq("section_id", sectionId).maybeSingle();
    if (progress && !progress.completed && Number.isFinite(progress.position_seconds)) {
      startSeconds = Math.max(0, progress.position_seconds);
    }

    return {
      ok: true,
      playbackId: lesson.playbackId,
      tokens: { playback, thumbnail, storyboard },
      viewerEmail: user.email ?? "",
      startSeconds,
    };
  } catch {
    console.error("lesson.playback.failed", sectionId);
    return { ok: false };
  }
}
