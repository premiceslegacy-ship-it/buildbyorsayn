export type FeedVideo = { video_id: string; title: string; published_at: string };

export type YoutubeNewsItem = {
  id: string;
  source: "youtube";
  title: string;
  publishedAt: string;
  thumbnail: string;
  href: string;
  blocLabel: null;
  sentence: null;
  isFresh: false;
  newsId: null;
};

export type BuildNewsItem = {
  id: string;
  source: "build";
  title: string;
  publishedAt: string;
  thumbnail: string;
  href: string | null;
  blocLabel: string | null;
  sentence: string;
  isFresh: boolean;
  newsId: string;
};

export type NouveautesItem = YoutubeNewsItem | BuildNewsItem;

export const NOUVEAUTES_LIMIT = 60;

export const youtubeWatchUrl = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`;
export const youtubeThumbnailUrl = (videoId: string) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

export function mergeNouveautesItems(
  videos: FeedVideo[],
  buildNews: Array<{
    id: string;
    title: string;
    published_at: string;
    thumbnail: string;
    bloc_label: string | null;
    internal_url: string | null;
    sentence: string;
    isFresh?: boolean;
  }>,
): NouveautesItem[] {
  return [
    ...videos.map((video): YoutubeNewsItem => ({
      id: `youtube:${video.video_id}`,
      source: "youtube",
      title: video.title,
      publishedAt: video.published_at,
      thumbnail: youtubeThumbnailUrl(video.video_id),
      href: youtubeWatchUrl(video.video_id),
      blocLabel: null,
      sentence: null,
      isFresh: false,
      newsId: null,
    })),
    ...buildNews.map((entry): BuildNewsItem => ({
      id: `build:${entry.id}`,
      source: "build",
      title: entry.title,
      publishedAt: entry.published_at,
      thumbnail: entry.thumbnail,
      href: entry.internal_url,
      blocLabel: entry.bloc_label,
      sentence: entry.sentence,
      isFresh: entry.isFresh ?? false,
      newsId: entry.id,
    })),
  ].filter((item) => Number.isFinite(Date.parse(item.publishedAt)))
    .sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt) || left.id.localeCompare(right.id));
}

export function formatVideoDate(publishedAt: string): string {
  return new Date(publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });
}

export type VideoMonth = { key: string; label: string; videos: FeedVideo[] };

export type NewsMonth = { key: string; label: string; items: NouveautesItem[] };

export function groupNouveautesByMonth(items: NouveautesItem[]): NewsMonth[] {
  const groups = new Map<string, NouveautesItem[]>();
  for (const item of items) {
    const date = new Date(item.publishedAt);
    if (Number.isNaN(date.valueOf())) continue;
    const key = new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "2-digit", timeZone: "Europe/Paris" }).format(date);
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }
  return [...groups.entries()].map(([key, entries]) => ({
    key,
    label: new Date(entries[0].publishedAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric", timeZone: "Europe/Paris" }).replace(/^./, (letter) => letter.toUpperCase()),
    items: entries,
  }));
}

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
