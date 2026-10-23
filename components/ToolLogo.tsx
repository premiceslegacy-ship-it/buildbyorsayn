import Image from "next/image";
import { TOOL_LOGOS, toolLogoSrc } from "@/lib/tools/registry";

/** Logo d'outil en tuile 3D (public/logos3d). Décoratif : le nom écrit à côté le dit déjà. */
export function ToolLogo({ name, size = 20 }: { name: string; size?: number }) {
  const logo = TOOL_LOGOS[name];
  const src = toolLogoSrc(name);
  if (!logo || !src) return null;
  const flat = logo.extension === "png";
  return <span className={`tlg${flat ? " tlg--flat" : ""}`} aria-hidden="true"><Image src={src} alt="" width={size} height={size} /></span>;
}
