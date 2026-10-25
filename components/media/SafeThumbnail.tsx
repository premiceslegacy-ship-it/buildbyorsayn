"use client";

import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string | null | undefined;
  alt?: string;
  sizes: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
  unoptimized?: boolean;
};

/** Image `fill` qui ne montre jamais de texte brut : alt descriptif, repli sombre avec icône. À placer dans un parent positionné. */
export function SafeThumbnail({ src, alt = "Miniature de la vidéo", sizes, priority, loading, unoptimized }: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!src || failedSrc === src) {
    return (
      <span aria-hidden="true" style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "#0a0f0c", color: "rgba(241,245,242,.4)" }}>
        <ImageIcon aria-hidden="true" size={24} />
      </span>
    );
  }
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} loading={priority ? undefined : loading} unoptimized={unoptimized} onError={() => setFailedSrc(src)} />;
}
