import type { LiquidGlassOptions } from "@/lib/ui/liquidGlass";

/** Réglages du verre liquide partagés par la navbar de l'accueil et la barre d'onglets membre. Le flou de repli est volontairement plus fort pour WebKit/Firefox, où le contenu ne peut pas être réfracté. */
export const BARRE_VERRE: LiquidGlassOptions = { teinte: "rgba(8,12,10,.54)", reflet: 0.85, bord: 0.4, force: 2.4, dispersion: 0.8, angle: -28, flou: 7, saturation: 1.8, luminosite: 1.0, flouRepli: 16 };

/** La barre d'onglets passe sur des miniatures claires : teinte plus sombre et flou de repli renforcé pour garder les libellés lisibles. */
export const TABBAR_VERRE: LiquidGlassOptions = { teinte: "rgba(8,12,10,.58)", reflet: 0.9, bord: 0.5, force: 2.6, dispersion: 0.9, angle: -28, flou: 6, saturation: 1.8, luminosite: 1.0, flouRepli: 16 };
