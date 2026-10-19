export type FeedVideo = { video_id: string; title: string; published_at: string };

export const NOUVEAUTES_LIMIT = 60;

export const youtubeWatchUrl = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`;
export const youtubeThumbnailUrl = (videoId: string) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

export function formatVideoDate(publishedAt: string): string {
  return new Date(publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });
}
