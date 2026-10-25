import type { ComponentPropsWithoutRef, ReactNode } from "react";

type LiquidGlassProps<T extends "nav" | "header"> = Omit<ComponentPropsWithoutRef<T>, "children"> & { children?: ReactNode };

/**
 * Surface de verre commune aux éléments flottants. Toute la matière est rendue
 * par le CSS afin d'être identique avant et après hydratation, y compris sur WebKit.
 */
export function LiquidGlassNav({ className, children, ...props }: LiquidGlassProps<"nav">) {
  return <nav className={className ? `verre-liquide ${className}` : "verre-liquide"} {...props}>{children}</nav>;
}

export function LiquidGlassHeader({ className, children, ...props }: LiquidGlassProps<"header">) {
  return <header className={className ? `verre-liquide ${className}` : "verre-liquide"} {...props}>{children}</header>;
}
