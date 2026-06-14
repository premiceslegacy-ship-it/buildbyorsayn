"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function LiquidCard({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden bg-white/[0.04] border border-[#c9b48a]/15 backdrop-blur-[16px]",
        "shadow-[0_16px_40px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(201,180,138,0.05)]",
        "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/[0.08] before:pointer-events-none",
        "after:absolute after:inset-0 after:rounded-lg after:shadow-[inset_0_0_24px_rgba(255,255,255,0.025)] after:pointer-events-none",
        className
      )}
      {...props}
    >
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  )
}
