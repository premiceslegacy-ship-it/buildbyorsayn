import { Compare } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function MethodeQuiResteDiagram() {
  return <Compare
    title="La méthode reste chez toi"
    description="Une méthode dite en conversation s'efface, alors qu'écrite dans un skill elle revient à chaque tâche."
    legend="Un outil peut disparaître, le dossier du skill reste à toi."
    ariaLabel="Comparaison entre une méthode gardée dans une conversation et une méthode écrite dans un skill. Dans la conversation, elle finit avec la discussion, tu réexpliques chaque semaine, les mots changent et elle dépend d'un outil. Dans le skill, elle reste dans ton dossier, l'agent la charge au besoin, un SKILL.md fixe les étapes et elle passe d'un outil à l'autre."
    accent={EM}
    beforeTitle="Dans une conversation"
    afterTitle="Dans un skill"
    rows={[
      { before: "Elle finit avec la discussion", after: "Elle reste dans ton dossier" },
      { before: "Tu réexpliques chaque semaine", after: "L'agent la charge au besoin" },
      { before: "Les mots changent à chaque fois", after: "Un SKILL.md fixe les étapes" },
      { before: "Elle dépend d'un seul outil", after: "Elle passe d'un outil à l'autre" },
    ]}
  />;
}

export const intro_4_VISUALS = [
  { name: "MethodeQuiReste", kind: "schema", chapter: "intro-4", component: MethodeQuiResteDiagram },
] as const satisfies readonly HandcraftedVisual[];
