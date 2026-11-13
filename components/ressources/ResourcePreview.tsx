import { Compare, Workflow } from "@/components/schemas/kit";
import type { FreeResource } from "@/lib/freeResources";

const NB = " ";
const EM = "#22d96e";

/**
 * Le rendu de chaque ressource, avec les schémas du kit BUILD : on montre ce que le skill change avant de demander un compte.
 * Les exemples sont des illustrations : les faits viennent de la personne, la ressource ne les invente jamais.
 */
export function ResourcePreview({ resource }: { resource: FreeResource }) {
  if (resource.preview === "compare") {
    return (
      <Compare
        title="Le même texte, avant et après"
        description="Un exemple tiré du skill : la formule part, un fait prend sa place."
        ariaLabel="Trois phrases réécrites avec SLOP : une ouverture de formulaire devient une scène datée, une fausse opposition devient une action vérifiable, un groupe de trois devient une mesure."
        legend={`Exemple d'illustration${NB}: les faits viennent de toi, le skill ne les invente jamais.`}
        accent={EM}
        beforeTitle="Sans SLOP"
        afterTitle="Avec SLOP"
        rows={[
          { before: "Dans un monde où l'attention est rare, il est essentiel de se démarquer.", after: "Mardi, une cliente m'a demandé le prix d'une cuisine. Il n'était nulle part sur mon site." },
          { before: "Ce n'est pas un outil, c'est un véritable allié.", after: "Il relance tes clients et te montre qui n'a pas répondu depuis dix jours." },
          { before: "Rapide, simple et efficace.", after: "Installé en dix minutes." },
        ]}
      />
    );
  }
  return (
    <Workflow
      title="De ton texte à la vidéo"
      description="Claude orchestre, les outils génèrent, tu valides chaque étape."
      ariaLabel="Le workflow vidéo : tu donnes le sujet, Claude écrit le script à l'oral et prépare les prompts avec Codex, les outils créent la voix, le personnage et les scènes muettes, tu valides, puis le lip-sync et l'assemblage terminent."
      legend="Rien n'est généré sans que ton IA t'ait annoncé le prix."
      accent={EM}
      actors={["Toi", "Claude", "Les outils"]}
      accentIndex={1}
      steps={[
        { actor: 0, label: "Tu donnes le sujet", transfer: "Un texte" },
        { actor: 1, label: "Il écrit le script à l'oral", tool: "Claude" },
        { actor: 1, label: "Il prépare les prompts", tool: "Codex" },
        { actor: 2, label: "Voix, personnage, scènes muettes" },
        { actor: 0, label: "Tu valides l'étape", humanValidation: true },
        { actor: 2, label: "Lip-sync et assemblage" },
      ]}
    />
  );
}
