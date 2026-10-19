import { formatVideoDate, youtubeThumbnailUrl, youtubeWatchUrl, type FeedVideo } from "@/lib/nouveautes/videos";

export function NewVideoMarker() {
  // Revealed client-side by NouveautesSeen once the member's last visit is known.
  return (
    <span data-new-badge hidden className="rounded-full bg-[#e8d5b0] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#0e0e0f]">
      Nouveau
    </span>
  );
}

export function NouveautesGrid({ videos }: { videos: FeedVideo[] }) {
  return (
    <ul data-testid="nouveautes-grid" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <li key={video.video_id} data-video-card data-published-at={video.published_at} className="group flex flex-col gap-3">
          <a href={youtubeWatchUrl(video.video_id)} target="_blank" rel="noopener" className="relative block aspect-video overflow-hidden rounded-xl border border-white/10 bg-black/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={youtubeThumbnailUrl(video.video_id)} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
          </a>
          <div className="flex items-center gap-2">
            <NewVideoMarker />
            <time dateTime={video.published_at} className="text-[13px] text-white/40">{formatVideoDate(video.published_at)}</time>
          </div>
          <p className="text-[17px] font-semibold tracking-tight text-[#f0ede8]">{video.title}</p>
          <a href={youtubeWatchUrl(video.video_id)} target="_blank" rel="noopener" className="text-[13px] text-[#e8d5b0] hover:underline">
            Regarder et commenter sur YouTube
          </a>
        </li>
      ))}
    </ul>
  );
}
