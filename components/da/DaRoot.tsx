import "@/app/da.css";
import "@/app/da-app.css";
import type { ReactNode } from "react";
import { preload } from "react-dom";

/**
 * Racine de la direction artistique « Émeraude sur noir ».
 * Tout le style vit sous la classe .da (app/da.css) : une page qui n'est pas enveloppée ici garde son style actuel.
 */
export function DaRoot({ children, className = "" }: { children: ReactNode; className?: string }) {
  // Les deux polices de la direction artistique sont déclarées dans da.css : sans préchargement, le navigateur ne les demande qu'après
  // avoir téléchargé et lu la feuille de style. Le préchargement les met en route avec elle.
  preload("/fonts/GeneralSans-Variable.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  preload("/fonts/Geist-Variable.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  return <div className={`da ${className}`.trim()}>{children}</div>;
}
