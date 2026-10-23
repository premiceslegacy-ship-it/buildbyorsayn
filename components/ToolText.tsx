import type { ReactNode } from "react";
import { ToolLogo } from "@/components/ToolLogo";

export function ToolText({ name, children }: { name: string; children?: ReactNode }) {
  return <span className="tlw"><ToolLogo name={name} />{children ?? name}</span>;
}
