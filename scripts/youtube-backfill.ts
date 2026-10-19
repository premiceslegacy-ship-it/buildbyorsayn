import { requireChannelId, storeYoutubeFeed, type YoutubeEntry } from "../lib/youtube/feed";

type PlaylistPage = {
  nextPageToken?: string;
  items?: { snippet: { title: string; publishedAt: string; resourceId: { videoId: string } } }[];
};

async function main() {
  const channelId = requireChannelId();
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY is not configured.");
  const playlistId = `UU${channelId.slice(2)}`;

  const entries: YoutubeEntry[] = [];
  let pageToken: string | undefined;
  do {
    const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    url.search = new URLSearchParams({ part: "snippet", maxResults: "50", playlistId, key: apiKey, ...(pageToken ? { pageToken } : {}) }).toString();
    const response = await fetch(url);
    if (!response.ok) throw new Error(`YouTube API responded ${response.status}`);
    const page = (await response.json()) as PlaylistPage;
    for (const item of page.items ?? []) {
      entries.push({ videoId: item.snippet.resourceId.videoId, title: item.snippet.title, publishedAt: item.snippet.publishedAt });
    }
    pageToken = page.nextPageToken;
  } while (pageToken);

  // Private/deleted uploads come back with placeholder titles and no usable id.
  const stored = await storeYoutubeFeed({
    entries: entries.filter((entry) => /^[A-Za-z0-9_-]{11}$/.test(entry.videoId) && entry.title !== "Private video" && entry.title !== "Deleted video"),
    deletedIds: [],
  });
  console.log(`Backfilled ${stored} videos.`);
}

main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exit(1); });
