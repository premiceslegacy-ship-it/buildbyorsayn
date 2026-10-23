import { formatVideoDate, youtubeThumbnailUrl, youtubeWatchUrl, type FeedVideo } from "@/lib/nouveautes/videos";

export function NewVideoMarker() {
  // Revealed client-side by NouveautesSeen once the member's last visit is known.
  return (
    <span data-new-badge hidden className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-[#b9f5cf]">
      Nouveau
    </span>
  );
}

export function NouveautesGrid({ videos }: { videos: FeedVideo[] }) {
  return (
    <ul data-testid="nouveautes-grid" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <li key={video.video_id} data-video-card data-published-at={video.published_at} className="group flex flex-col gap-3">
          <a href={youtubeWatchUrl(video.video_id)} target="_blank" rel="noopener" className="relative block aspect-video overflow-hidden rounded-xl border border-border bg-background-secondary">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={youtubeThumbnailUrl(video.video_id)} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
          </a>
          <div className="flex items-center gap-2">
            <NewVideoMarker />
            <time dateTime={video.published_at} className="text-[13px] text-text-tertiary">{formatVideoDate(video.published_at)}</time>
          </div>
          <p className="text-[17px] font-semibold tracking-tight text-text">{video.title}</p>
          <a href={youtubeWatchUrl(video.video_id)} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center text-[13px] text-accent hover:underline">
            Regarder et commenter sur YouTube
          </a>
        </li>
      ))}
    </ul>
  );
}
