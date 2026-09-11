import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function IllustratedCardGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4", className)}>
      {children}
    </div>
  );
}
