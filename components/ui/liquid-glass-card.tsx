"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const VARIANTS = {
  default: [
    "bg-white/[0.04] border border-[#c9b48a]/15 backdrop-blur-[16px]",
    "shadow-[0_16px_40px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(201,180,138,0.05)]",
    "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/[0.08] before:pointer-events-none",
    "after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_24px_rgba(255,255,255,0.025)] after:pointer-events-none",
  ],
  elevated: [
    // outer layer: gradient fill + two-plane drop shadow for depth
    "bg-gradient-to-b from-white/[0.055] to-white/[0.015] border border-[#c9b48a]/22 backdrop-blur-[20px]",
    "shadow-[0_1px_0_rgba(255,255,255,0.07)_inset,0_24px_56px_-16px_rgba(0,0,0,0.55),0_8px_16px_-8px_rgba(0,0,0,0.4)]",
    // double border: an inset liner reads as a border within the border
    "before:absolute before:inset-px before:rounded-[inherit] before:border before:border-white/[0.055] before:pointer-events-none before:z-[1]",
    // volume: soft gold wash up top, darkened floor at the bottom
    "after:absolute after:inset-0 after:rounded-[inherit] after:pointer-events-none",
    "after:bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(232,213,176,0.07),transparent_60%)]",
    "after:shadow-[inset_0_-24px_40px_-32px_rgba(0,0,0,0.9),inset_0_0_32px_rgba(255,255,255,0.02)]",
    // hover: the card lifts slightly
    "transition-[transform,box-shadow,border-color] duration-300 ease-out",
    "hover:-translate-y-0.5 hover:border-[#c9b48a]/32",
    "hover:shadow-[0_1px_0_rgba(255,255,255,0.09)_inset,0_32px_64px_-16px_rgba(0,0,0,0.6),0_10px_20px_-8px_rgba(0,0,0,0.45)]",
  ],
} as const

export type LiquidCardVariant = keyof typeof VARIANTS

export function LiquidCard({
  className,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<"div"> & { variant?: LiquidCardVariant }) {
  return (
    <div
      className={cn("relative rounded-lg overflow-hidden", VARIANTS[variant], className)}
      {...props}
    >
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  )
}
