import type { CSSProperties } from "react";

export type TileLogo = "build" | "claude" | "openai" | "hermes" | "stripe" | "cursor" | "supabase" | "figma" | "vercel" | "telegram" | "gmail" | "notion";

/** Tuile 3D : un logo réel (fichier officiel) posé sur une tuile en relief. Décorative : le nom écrit à côté suffit. */
export function Tile({ logo, size, className = "", style }: { logo: TileLogo; size?: number; className?: string; style?: CSSProperties }) {
  const s = { ...(size ? ({ "--s": `${size}px` } as CSSProperties) : null), ...style };
  return (
    <div className={`tuile ${className}`.trim()} style={s} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/da/logos/${logo}.svg`} alt="" width={64} height={64} />
    </div>
  );
}
