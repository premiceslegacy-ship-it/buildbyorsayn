"use client";

type VideoCardProps = {
  title: string;
  youtubeId: string;
  description?: string;
};

export function VideoCard({ title, youtubeId, description }: VideoCardProps) {
  return (
    <div className="space-y-4">
      <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
          // The site sends Cross-Origin-Embedder-Policy: credentialless; without this attribute Chromium refuses to load
          // the YouTube document (it sends no COEP header) and the player stays blank.
          {...{ credentialless: "true" }}
        />
      </div>
      <div>
        <p className="text-[17px] font-semibold text-[#f0ede8] tracking-tight">{title}</p>
        {description && (
          <p className="text-[15px] text-white/50 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
