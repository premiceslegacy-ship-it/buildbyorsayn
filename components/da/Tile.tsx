import type { CSSProperties } from "react";
import { ToolLogo } from "@/components/ToolLogo";

export type TileLogo = "build" | "claude" | "openai" | "hermes" | "stripe" | "cursor" | "supabase" | "figma" | "vercel" | "telegram" | "gmail" | "notion";

const TOOL_NAMES: Record<TileLogo, string> = {
  build: "BUILD",
  claude: "Claude",
  openai: "ChatGPT",
  hermes: "Hermes Agent",
  stripe: "Stripe",
  cursor: "Cursor",
  supabase: "Supabase",
  figma: "Figma",
  vercel: "Vercel",
  telegram: "Telegram",
  gmail: "Gmail",
  notion: "Notion",
};

/** Tuile 3D : un logo réel (fichier officiel) posé sur une tuile en relief. Décorative : le nom écrit à côté suffit. */
export function Tile({ logo, size, className = "", style }: { logo: TileLogo; size?: number; className?: string; style?: CSSProperties }) {
  const s = { ...(size ? ({ "--s": `${size}px` } as CSSProperties) : null), ...style };
  return (
    <div className={`tuile tuile--rendered ${className}`.trim()} style={s} aria-hidden="true">
      <ToolLogo name={TOOL_NAMES[logo]} size={128} />
    </div>
  );
}
