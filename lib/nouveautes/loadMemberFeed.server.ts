import "server-only";

import { listBuildNews } from "@/lib/buildNews/server";
import { createClient } from "@/lib/supabase/server";
import { isNewsFresh } from "./seen";
import { loadNouveautesFeed, type NouveautesFeed, type NouveautesSourceStatus } from "./loadVideos";
import { mergeNouveautesItems } from "./videos";

function videoIdFromSourceKey(sourceKey: string | null | undefined): string | null {
  const match = sourceKey?.match(/^video:([^:]+):1$/);
  return match?.[1] ?? null;
}

export async function loadMemberNouveautesFeed(now = new Date()): Promise<NouveautesFeed> {
  const supabase = await createClient();
  const [{ data: { user } }, youtube, buildResult] = await Promise.all([
    supabase.auth.getUser(),
    loadNouveautesFeed(),
    listBuildNews().then((rows) => ({ ok: true as const, rows })).catch(() => ({ ok: false as const, rows: [] })),
  ]);

  const newsIds = buildResult.ok ? buildResult.rows.map((row) => row.id) : [];
  const videoIds = buildResult.ok ? buildResult.rows.flatMap((row) => {
    const videoId = videoIdFromSourceKey(row.source_key);
    return videoId ? [videoId] : [];
  }) : [];
  const [seenResult, progressResult] = user ? await Promise.all([
    newsIds.length ? supabase.from("build_news_seen").select("news_id").eq("user_id", user.id).in("news_id", newsIds) : Promise.resolve({ data: [], error: null }),
    videoIds.length ? supabase.from("lesson_progress").select("section_id").eq("user_id", user.id).in("section_id", videoIds) : Promise.resolve({ data: [], error: null }),
  ]) : [{ data: [], error: null }, { data: [], error: null }];
  const seenIds = new Set((seenResult.data ?? []).map((row) => row.news_id as string));
  const progressIds = new Set((progressResult.data ?? []).map((row) => row.section_id as string));
  const buildRows = buildResult.ok ? buildResult.rows.map((row) => {
    const videoId = videoIdFromSourceKey(row.source_key);
    return {
      ...row,
      isFresh: isNewsFresh(row.published_at, seenIds.has(row.id), Boolean(videoId && progressIds.has(videoId)), now),
    };
  }) : [];
  const buildStatus: NouveautesSourceStatus = buildResult.ok
    ? buildResult.rows.length ? "ready" : "empty"
    : "error";
  const items = mergeNouveautesItems(youtube.videos, buildRows);
  const status: NouveautesSourceStatus = items.length
    ? "ready"
    : youtube.sources.youtube === "error" && buildStatus === "error" ? "error" : "empty";
  return {
    status,
    videos: youtube.videos,
    items,
    sources: { youtube: youtube.sources.youtube, build: buildStatus },
  };
}
