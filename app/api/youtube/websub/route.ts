import { revalidateTag } from "next/cache";
import { YOUTUBE_VIDEOS_CACHE_TAG } from "@/lib/nouveautes/loadVideos";
import { parseYoutubeAtom, requireChannelId, storeYoutubeFeed, verifyWebSubSignature, websubTopic } from "@/lib/youtube/feed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// A real notification is a single Atom entry (a few KB). Refuse anything large before reading or hashing it.
const MAX_WEBSUB_BODY_BYTES = 256 * 1024;

// Hub verification of intent (WebSub §5.3).
export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const mode = params.get("hub.mode");
  const challenge = params.get("hub.challenge");
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!channelId || !challenge || params.get("hub.topic") !== websubTopic(channelId) || (mode !== "subscribe" && mode !== "unsubscribe")) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(challenge, { status: 200, headers: { "content-type": "text/plain", "cache-control": "no-store" } });
}

// Content distribution. A bad signature is acknowledged (202) and dropped, per spec.
export async function POST(request: Request): Promise<Response> {
  try {
    const declared = Number(request.headers.get("content-length") ?? 0);
    if (Number.isFinite(declared) && declared > MAX_WEBSUB_BODY_BYTES) return new Response(null, { status: 413 });
    const body = await request.text();
    if (body.length > MAX_WEBSUB_BODY_BYTES) return new Response(null, { status: 413 });
    const secret = process.env.YOUTUBE_WEBSUB_SECRET ?? "";
    if (!verifyWebSubSignature(body, request.headers.get("x-hub-signature"), secret)) {
      return new Response(null, { status: 202 });
    }
    await storeYoutubeFeed(parseYoutubeAtom(body, requireChannelId()));
    revalidateTag(YOUTUBE_VIDEOS_CACHE_TAG, { expire: 0 });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("youtube.websub.failed", error instanceof Error ? error.message : error);
    return new Response(null, { status: 500 });
  }
}
