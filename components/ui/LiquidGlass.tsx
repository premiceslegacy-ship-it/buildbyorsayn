"use client";

import { createElement, useEffect, useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { applyLiquidGlass, type LiquidGlassOptions } from "@/lib/ui/liquidGlass";

type Tag = "nav" | "header";
type LiquidGlassProps<T extends Tag> = Omit<ComponentPropsWithoutRef<T>, "children"> & { glass?: LiquidGlassOptions; children?: ReactNode };

function useLiquidGlass(glass: LiquidGlassOptions | undefined) {
  const ref = useRef<HTMLElement>(null);
  const { teinte, bord, force, flou, dispersion, reflet, angle, saturation, luminosite, flouRepli } = glass ?? {};
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    return applyLiquidGlass(element, { teinte, bord, force, flou, dispersion, reflet, angle, saturation, luminosite, flouRepli });
  }, [teinte, bord, force, flou, dispersion, reflet, angle, saturation, luminosite, flouRepli]);
  return ref;
}

function glassClass(className: string | undefined) {
  return className ? `verre-liquide ${className}` : "verre-liquide";
}

/**
 * Barres flottantes en verre liquide (réfraction de bord, dispersion, arêtes lumineuses).
 * Le verre se réserve à ce qui flotte au-dessus du contenu : navbar de l'accueil, barre d'onglets mobile.
 */
export function LiquidGlassNav({ glass, className, children, ...props }: LiquidGlassProps<"nav">) {
  const ref = useLiquidGlass(glass);
  return createElement("nav", { ref, className: glassClass(className), ...props }, children);
}

export function LiquidGlassHeader({ glass, className, children, ...props }: LiquidGlassProps<"header">) {
  const ref = useLiquidGlass(glass);
  return createElement("header", { ref, className: glassClass(className), ...props }, children);
}
