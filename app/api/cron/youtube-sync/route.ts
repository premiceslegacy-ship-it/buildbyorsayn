import { revalidateTag } from "next/cache";
import { YOUTUBE_VIDEOS_CACHE_TAG } from "@/lib/nouveautes/loadVideos";
import { verifyMcpCleanupAuthorization } from "@/lib/mcp/cronAuth";
import { renewYoutubeWebSub, syncYoutubeChannel } from "@/lib/youtube/feed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const NO_STORE = { "cache-control": "no-store" };

export async function GET(request: Request): Promise<Response> {
  if (!verifyMcpCleanupAuthorization(request.headers.get("authorization"), process.env.CRON_SECRET ?? "")) {
    return Response.json({ ok: false }, { status: 401, headers: NO_STORE });
  }
  try {
    const synced = await syncYoutubeChannel();
    revalidateTag(YOUTUBE_VIDEOS_CACHE_TAG, { expire: 0 });
    await renewYoutubeWebSub();
    return Response.json({ ok: true, synced }, { headers: NO_STORE });
  } catch (error) {
    console.error("youtube.cron.failed", error instanceof Error ? error.message : error);
    return Response.json({ ok: false }, { status: 500, headers: NO_STORE });
  }
}
