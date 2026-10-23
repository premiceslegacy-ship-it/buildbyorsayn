import Image from "next/image";
import { TOOL_LOGOS, toolLogoSrc } from "@/lib/tools/registry";

export function ToolLogo({ name, size = 20 }: { name: string; size?: number }) {
  const logo = TOOL_LOGOS[name];
  const src = toolLogoSrc(name);
  if (!logo || !src) return null;
  return <span className={`tlg${logo.dark ? " tlg--d" : ""}${logo.bare ? " tlg--b" : ""}`} aria-hidden="true"><Image src={src} alt="" width={size} height={size} /></span>;
}
