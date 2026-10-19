import { NOUVEAUTES_LIMIT, type FeedVideo } from "./videos";

export const YOUTUBE_VIDEOS_CACHE_TAG = "youtube-videos";
const REVALIDATE_SECONDS = 300;

/**
 * Public list of channel videos. Reads PostgREST with the anon key and no
 * cookies so Next's data cache can share one response across every visitor
 * (the page itself stays dynamic for the nav identity). The WebSub route and
 * the cron invalidate YOUTUBE_VIDEOS_CACHE_TAG, so a new upload shows up
 * immediately instead of after the 5-minute window.
 */
export async function loadNouveautesVideos(fetchImpl: typeof fetch = fetch): Promise<FeedVideo[]> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!base || !anonKey) return [];
  try {
    const query = new URLSearchParams({ select: "video_id,title,published_at", order: "published_at.desc", limit: String(NOUVEAUTES_LIMIT) });
    const response = await fetchImpl(`${base}/rest/v1/youtube_videos?${query}`, {
      headers: { apikey: anonKey },
      next: { revalidate: REVALIDATE_SECONDS, tags: [YOUTUBE_VIDEOS_CACHE_TAG] },
    });
    if (!response.ok) throw new Error(`PostgREST responded ${response.status}`);
    return (await response.json()) as FeedVideo[];
  } catch (error) {
    console.error("nouveautes.load.failed", error instanceof Error ? error.message : error);
    return [];
  }
}
