import "server-only";

import { listBuildNews } from "@/lib/buildNews/server";
import { loadNouveautesFeed, type NouveautesFeed, type NouveautesSourceStatus } from "./loadVideos";
import { mergeNouveautesItems } from "./videos";

export async function loadMemberNouveautesFeed(): Promise<NouveautesFeed> {
  const [youtube, buildResult] = await Promise.all([
    loadNouveautesFeed(),
    listBuildNews().then((rows) => ({ ok: true as const, rows })).catch(() => ({ ok: false as const, rows: [] })),
  ]);
  const buildStatus: NouveautesSourceStatus = buildResult.ok
    ? buildResult.rows.length ? "ready" : "empty"
    : "error";
  const items = mergeNouveautesItems(youtube.videos, buildResult.rows);
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
