import { Curves, Fork, Funnel, Ladder, Workflow } from "../kit";

const EM = "#22d96e";

export function UneIdeeUnePersonneDiagram() {
  return <Funnel
    title="Éclaire la bonne personne"
    description="Le faisceau devient précis au lieu de viser toute la foule."
    ariaLabel="Une scène devient une idée précise qui atteint fortement la bonne personne."
    accent={EM}
    leakIndex={0}
    leakLabel="Les autres passent"
    stages={[
      { label: "Une scène", value: 100, valueLabel: "" },
      { label: "Une idée", value: 72, valueLabel: "" },
      { label: "Bonne personne", value: 46, valueLabel: "" },
    ]}
  />;
}

export function TroisTempsAttentionDiagram() {
  return <Ladder
    title="Trois portes, trois engagements"
    description="Chaque pièce demande un peu plus à la personne."
    ariaLabel="Trois marches passent de découvrir à comprendre puis agir, avec comprendre mis en avant."
    accent={EM}
    lowLabel="Voir"
    highLabel="Faire"
    accentIndex={1}
    rungs={[
      { label: "Découvrir", detail: "Entrer dans la scène" },
      { label: "Comprendre", detail: "Suivre le raisonnement" },
      { label: "Agir", detail: "Faire le prochain geste" },
    ]}
  />;
}

export function ObserverSansCopierDiagram() {
  return <Workflow
    title="Garde la mécanique, change le costume"
    description="Tu reconstruis avec tes faits au lieu de reprendre l'affiche."
    ariaLabel="Une affiche révèle sa scène, sa tension, son explication, sa preuve et son action, puis renaît avec tes faits."
    accent={EM}
    actors={["Calque", "Ton contenu"]}
    accentIndex={5}
    steps={[
      { actor: 0, label: "Scène" },
      { actor: 0, label: "Tension" },
      { actor: 0, label: "Explication" },
      { actor: 0, label: "Preuve" },
      { actor: 0, label: "Action" },
      { actor: 1, label: "Tes faits", humanValidation: true },
    ]}
  />;
}

export function VolumePuisQualiteDiagram() {
  return <Curves
    title="Cherche large, puis renforce"
    description="Plusieurs essais laissent apparaître une direction nette."
    ariaLabel="Les essais se comparent, la compréhension monte, puis une direction se renforce."
    accent={EM}
    labels={["Essayer", "Comparer", "Comprendre", "Renforcer"]}
    series={[
      { name: "Essais", values: [9, 7, 4, 2] },
      { name: "Direction", values: [1, 3, 6, 10], kind: "step", accent: true },
    ]}
    annotations={[{ series: 1, point: 3, label: "Renforcer" }]}
  />;
}

export function SourceVersBibliothequeDiagram() {
  return <Fork
    title="Une source nourrit quatre formats"
    description="La même conversation reste disponible dans plusieurs rayons."
    ariaLabel="Une conversation réelle alimente un post, une vidéo, un e-mail et une page."
    accent={EM}
    situation="Conversation"
    outcomes={[
      { label: "Post", condition: "Montre la scène", recommended: true },
      { label: "Vidéo", condition: "Démontre le chemin" },
      { label: "E-mail", condition: "Développe l'idée" },
      { label: "Page", condition: "Présente l'offre" },
    ]}
  />;
}
