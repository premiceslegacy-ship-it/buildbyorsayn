export type FeedVideo = { video_id: string; title: string; published_at: string };

export const NOUVEAUTES_LIMIT = 60;

export const youtubeWatchUrl = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`;
export const youtubeThumbnailUrl = (videoId: string) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

export function formatVideoDate(publishedAt: string): string {
  return new Date(publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });
}

export type VideoMonth = { key: string; label: string; videos: FeedVideo[] };

export function groupVideosByMonth(videos: FeedVideo[]): VideoMonth[] {
  const groups = new Map<string, FeedVideo[]>();
  for (const video of videos) {
    const date = new Date(video.published_at);
    if (Number.isNaN(date.valueOf())) continue;
    const key = new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "2-digit", timeZone: "Europe/Paris" }).format(date);
    const list = groups.get(key) ?? [];
    list.push(video);
    groups.set(key, list);
  }
  return [...groups.entries()].map(([key, entries]) => ({ key, label: new Date(entries[0].published_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric", timeZone: "Europe/Paris" }).replace(/^./, (letter) => letter.toUpperCase()), videos: entries }));
}
