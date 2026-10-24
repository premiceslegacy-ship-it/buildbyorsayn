"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { applyLiquidGlass, type LiquidGlassOptions } from "@/lib/ui/liquidGlass";

type LiquidGlassProps = ComponentPropsWithoutRef<"nav"> & { glass?: LiquidGlassOptions };

/**
 * Barre flottante en verre liquide (réfraction de bord, dispersion, arêtes lumineuses).
 * Le verre se réserve à ce qui flotte au-dessus du contenu : barre d'onglets mobile, pas les cartes ni le texte.
 */
export function LiquidGlassNav({ glass, children, ...props }: LiquidGlassProps) {
  const ref = useRef<HTMLElement>(null);
  const teinte = glass?.teinte;
  const bord = glass?.bord;
  const force = glass?.force;
  const flou = glass?.flou;
  const dispersion = glass?.dispersion;
  const reflet = glass?.reflet;
  const angle = glass?.angle;
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    return applyLiquidGlass(element, { teinte, bord, force, flou, dispersion, reflet, angle });
  }, [teinte, bord, force, flou, dispersion, reflet, angle]);
  return <nav ref={ref} {...props}>{children}</nav>;
}
