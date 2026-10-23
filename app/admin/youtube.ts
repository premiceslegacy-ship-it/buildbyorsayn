const YOUTUBE_VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

export function extractYoutubeVideoId(value: string) {
  const input = value.trim();
  if (YOUTUBE_VIDEO_ID.test(input)) return input;
  try {
    const url = new URL(input);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    let candidate: string | null = null;
    if (host === "youtu.be") candidate = url.pathname.split("/").filter(Boolean)[0] ?? null;
    if (host === "youtube.com" || host === "m.youtube.com") {
      candidate = url.searchParams.get("v");
      if (!candidate) {
        const [kind, id] = url.pathname.split("/").filter(Boolean);
        if (["embed", "live", "shorts"].includes(kind)) candidate = id ?? null;
      }
    }
    return candidate && YOUTUBE_VIDEO_ID.test(candidate) ? candidate : null;
  } catch {
    return null;
  }
}
