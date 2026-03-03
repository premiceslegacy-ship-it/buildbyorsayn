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
        "relative rounded-2xl overflow-hidden bg-[#161617]/60 border border-white/10 backdrop-blur-xl shadow-2xl",
        "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/[0.05] before:to-transparent before:pointer-events-none",
        "after:absolute after:inset-0 after:rounded-2xl after:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] after:pointer-events-none",
        className
      )}
      {...props}
    >
      <div className="absolute top-0 left-0 z-0 h-full w-full rounded-2xl 
          shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),0_0_12px_rgba(232,213,176,0.05)] 
      transition-all 
      dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(232,213,176,0.05),inset_-3px_-3px_0.5px_-3.5px_rgba(232,213,176,0.15),0_0_12px_rgba(232,213,176,0.05)]" />
      <div
        className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-2xl"
        style={{ backdropFilter: 'url("#container-glass")' }}
      />

      <div className="relative z-10 h-full">
        {children}
      </div>
      <GlassFilter />
    </div>
  )
}

function GlassFilter() {
  return (
    <svg className="hidden">
      <defs>
        <filter
          id="container-glass"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}
