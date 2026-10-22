import "@/app/da.css";
import type { ReactNode } from "react";

/**
 * Racine de la direction artistique « Émeraude sur noir ».
 * Tout le style vit sous la classe .da (app/da.css) : une page qui n'est pas enveloppée ici garde son style actuel.
 */
export function DaRoot({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`da ${className}`.trim()}>{children}</div>;
}
