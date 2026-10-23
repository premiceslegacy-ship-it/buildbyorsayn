import { ToolMap } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function UnOutilUnRoleDiagram() {
  return <ToolMap
    title="Un outil, un rôle"
    description="Six rôles autour de ton projet, et un seul outil principal pour tenir chacun d'eux."
    legend="Si tu ne sais pas dire pourquoi un logo est là, il sort de la carte."
    ariaLabel="Une carte de six rôles avec un outil chacun. Chercher avec NotebookLM, Penser avec Claude, Dessiner avec Figma, Construire avec Claude Code, Données avec Supabase, Livrer avec Vercel, mis en avant."
    accent={EM}
    accentGroup={5}
    groups={[
      { role: "Chercher", tools: [{ name: "NotebookLM", description: "Lire tes sources" }] },
      { role: "Penser", tools: [{ name: "Claude", description: "Clarifier le projet" }] },
      { role: "Dessiner", tools: [{ name: "Figma", description: "Poser les écrans" }] },
      { role: "Construire", tools: [{ name: "Claude Code", description: "Écrire le code" }] },
      { role: "Données", tools: [{ name: "Supabase", description: "Garder les données" }] },
      { role: "Livrer", tools: [{ name: "Vercel", description: "Mettre en ligne" }] },
    ]}
  />;
}

export const intro_2_VISUALS = [
  { name: "UnOutilUnRole", kind: "schema", chapter: "intro-2", component: UnOutilUnRoleDiagram },
] as const satisfies readonly HandcraftedVisual[];
