// No `server-only` import: scripts/youtube-backfill.ts runs this outside Next.
// Never import this file from a client component (it reaches the service-role client).
import { createHmac, timingSafeEqual } from "node:crypto";
import { XMLParser } from "fast-xml-parser";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { requireSiteOrigin } from "@/lib/siteOrigin";

export type YoutubeEntry = { videoId: string; title: string; publishedAt: string; eventAt: string };
export type YoutubeTombstone = { videoId: string; deletedAt: string };
export type YoutubeFeedResult = { entries: YoutubeEntry[]; tombstones: YoutubeTombstone[] };

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const HUB_URL = "https://pubsubhubbub.appspot.com/subscribe";
const WEBSUB_LEASE_SECONDS = 864_000;

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_", parseTagValue: false });

const asArray = <T>(value: T | T[] | undefined): T[] => (value === undefined ? [] : Array.isArray(value) ? value : [value]);
const text = (value: unknown): string => (typeof value === "string" ? value.trim() : typeof value === "object" && value !== null && "#text" in value ? String((value as Record<string, unknown>)["#text"]).trim() : "");

export function parseYoutubeAtom(xml: string, channelId: string): YoutubeFeedResult {
  const parsed = parser.parse(xml) as { feed?: Record<string, unknown> };
  const feed = parsed.feed ?? {};
  const entries: YoutubeEntry[] = [];
  for (const entry of asArray(feed.entry as Record<string, unknown> | Record<string, unknown>[] | undefined)) {
    const videoId = text(entry["yt:videoId"]);
    if (text(entry["yt:channelId"]) !== channelId || !VIDEO_ID.test(videoId)) continue;
    const title = text(entry.title);
    const publishedAt = text(entry.published);
    const updatedAt = text(entry.updated);
    if (
      !title
      || Number.isNaN(Date.parse(publishedAt))
      || (updatedAt !== "" && Number.isNaN(Date.parse(updatedAt)))
    ) continue;
    // Some historical/API-derived entries have no Atom `updated`. Publication
    // time is a deterministic, conservative fallback; ingestion time would let
    // a stale replay overtake a newer tombstone.
    entries.push({ videoId, title, publishedAt, eventAt: updatedAt || publishedAt });
  }

  const tombstones: YoutubeTombstone[] = [];
  for (const deleted of asArray(feed["at:deleted-entry"] as Record<string, unknown> | Record<string, unknown>[] | undefined)) {
    const match = /^yt:video:([A-Za-z0-9_-]{11})$/.exec(String(deleted["@_ref"] ?? ""));
    const deletedAt = String(deleted["@_when"] ?? "").trim();
    if (match && !Number.isNaN(Date.parse(deletedAt))) {
      tombstones.push({ videoId: match[1], deletedAt });
    }
  }
  return { entries, tombstones };
}

const SHORTS_CHECK_CONCURRENCY = 6;

const WATCH_PREFIX = "https://www.youtube.com/watch";
// Without it, requests from EU addresses get a consent-page redirect that says nothing about the video.
const CONSENT_BYPASS_COOKIE = "SOCS=CAI";

/**
 * Is this upload a Short? youtube.com/shorts/<id> is authoritative: 200 for a
 * Short, a redirect to the watch page for any other video. Anything else
 * (consent page, rate limit, outage) is unknown and throws, so the caller
 * fails closed and retries (WebSub hub retry on 500, daily cron) instead of
 * publishing a Short. oEmbed cannot replace this: it reports 200x113 for
 * Shorts too.
 */
export async function isYoutubeShort(videoId: string, fetchImpl: typeof fetch = fetch): Promise<boolean> {
  const probe = await fetchImpl(`https://www.youtube.com/shorts/${videoId}`, {
    method: "HEAD",
    redirect: "manual",
    cache: "no-store",
    headers: { cookie: CONSENT_BYPASS_COOKIE, "user-agent": "Mozilla/5.0 (compatible; BUILD-feed/1.0)" },
  });
  if (probe.status === 200) return true;
  if (probe.status >= 300 && probe.status < 400 && probe.headers.get("location")?.startsWith(WATCH_PREFIX)) return false;
  throw new Error(`Shorts check for ${videoId} inconclusive (status ${probe.status})`);
}

export async function excludeShorts(entries: YoutubeEntry[], fetchImpl: typeof fetch = fetch): Promise<YoutubeEntry[]> {
  const kept: YoutubeEntry[] = [];
  for (let index = 0; index < entries.length; index += SHORTS_CHECK_CONCURRENCY) {
    const batch = entries.slice(index, index + SHORTS_CHECK_CONCURRENCY);
    const flags = await Promise.all(batch.map((entry) => isYoutubeShort(entry.videoId, fetchImpl)));
    batch.forEach((entry, position) => { if (!flags[position]) kept.push(entry); });
  }
  return kept;
}

export async function storeYoutubeFeed(result: YoutubeFeedResult, fetchImpl: typeof fetch = fetch): Promise<number> {
  const supabase = createAdminSupabase();
  const entries = await excludeShorts(result.entries, fetchImpl);
  if (entries.length === 0 && result.tombstones.length === 0) return 0;

  const { data, error } = await supabase.rpc("apply_youtube_feed_events", {
    p_entries: entries.map((entry) => ({
      video_id: entry.videoId,
      title: entry.title,
      published_at: entry.publishedAt,
      event_at: entry.eventAt,
    })),
    p_tombstones: result.tombstones.map((tombstone) => ({
      video_id: tombstone.videoId,
      deleted_at: tombstone.deletedAt,
    })),
  });
  if (error || typeof data !== "number") {
    throw new Error(`youtube feed event apply failed: ${error?.message ?? "invalid response"}`);
  }
  return data;
}

export function requireChannelId(): string {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!channelId) throw new Error("YOUTUBE_CHANNEL_ID is not configured.");
  return channelId;
}

export const websubTopic = (channelId: string) => `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${channelId}`;

export async function syncYoutubeChannel(fetchImpl: typeof fetch = fetch): Promise<number> {
  const channelId = requireChannelId();
  const response = await fetchImpl(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`YouTube feed responded ${response.status}`);
  return storeYoutubeFeed(parseYoutubeAtom(await response.text(), channelId), fetchImpl);
}

export async function renewYoutubeWebSub(fetchImpl: typeof fetch = fetch): Promise<void> {
  const channelId = requireChannelId();
  const secret = process.env.YOUTUBE_WEBSUB_SECRET;
  const verifyToken = process.env.YOUTUBE_WEBSUB_VERIFY_TOKEN;
  if (!secret) throw new Error("YOUTUBE_WEBSUB_SECRET is not configured.");
  if (!verifyToken) throw new Error("YOUTUBE_WEBSUB_VERIFY_TOKEN is not configured.");
  // The hub verifies this public callback before it starts sending signed notifications.
  const siteUrl = requireSiteOrigin();
  const response = await fetchImpl(HUB_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      "hub.mode": "subscribe",
      "hub.topic": websubTopic(channelId),
      "hub.callback": `${siteUrl}/api/youtube/websub`,
      "hub.verify": "async",
      "hub.secret": secret,
      "hub.verify_token": verifyToken,
      "hub.lease_seconds": String(WEBSUB_LEASE_SECONDS),
    }),
  });
  if (response.status !== 202 && response.status !== 204) throw new Error(`WebSub subscribe responded ${response.status}`);
}


export function verifyWebSubIntent(received: string | null, expected: string): boolean {
  if (!received || expected.length < 16) return false;
  const left = Buffer.from(received);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}
export function verifyWebSubSignature(body: string, header: string | null, secret: string): boolean {
  if (!header || !secret) return false;
  const expected = `sha1=${createHmac("sha1", secret).update(body).digest("hex")}`;
  const left = Buffer.from(header);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}
