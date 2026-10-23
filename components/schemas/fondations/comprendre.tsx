import { Fork, Ladder, Steps, Workflow } from "../kit";

const EM = "#22d96e";

export function SousLeMotLaSceneDiagram() {
  return <Fork
    title="Ouvre le mot vague"
    description="Le carton premium cache une scène de travail précise."
    ariaLabel="Le mot premium s'ouvre sur un déclencheur, un geste, une gêne et un changement."
    accent={EM}
    situation="Premium"
    outcomes={[
      { label: "Déclencheur", condition: "Ce qui vient d'arriver", recommended: true },
      { label: "Geste", condition: "Ce que la personne fait" },
      { label: "Gêne", condition: "Ce qui bloque" },
      { label: "Changement", condition: "Ce qu'elle veut" },
    ]}
  />;
}

export function DecisionHumaineDiagram() {
  return <Fork
    title="Une décision regarde des deux côtés"
    description="Le progrès attire pendant que le risque retient."
    ariaLabel="La décision met en regard ce que je veux et ce que je crains."
    accent={EM}
    situation="Ma décision"
    outcomes={[
      { label: "Ce que je veux", condition: "Une porte s'ouvre", recommended: true },
      { label: "Ce que je crains", condition: "Un risque à éviter" },
    ]}
  />;
}

export function SixRessortsDansUneSceneDiagram() {
  return <Ladder
    title="Six angles autour d'une scène"
    description="Tu observes ces ressorts sans les utiliser comme des boutons."
    ariaLabel="Six angles lisibles montent du progrès à la sécurité autour d'une même scène."
    accent={EM}
    accentIndex={0}
    lowLabel="Une scène"
    highLabel="Six angles"
    rungs={[
      { label: "Progrès", detail: "Ce qui attire" },
      { label: "Identité", detail: "Ce que cela dit de moi" },
      { label: "Autres", detail: "Ce qu'ils vont penser" },
      { label: "Crédibilité", detail: "Ce que je peux croire" },
      { label: "Inaction", detail: "Ce que ne rien faire coûte" },
      { label: "Sécurité", detail: "Ce que je protège" },
    ]}
  />;
}

export function ConfianceVisibleDiagram() {
  return <Steps
    title="La confiance se regarde"
    description="Trois fenêtres rendent le choix compréhensible avant la décision."
    ariaLabel="Le livrable, les étapes et la sortie deviennent visibles avant je choisis."
    accent={EM}
    accentIndex={3}
    items={[
      { label: "Livrable", detail: "Ce que tu reçois" },
      { label: "Étapes", detail: "Comment on avance" },
      { label: "Sortie", detail: "Comment tu repars" },
      { label: "Je choisis", detail: "La décision reste humaine" },
    ]}
  />;
}

export function FaitMotQuestionDiagram() {
  return <Workflow
    title="Sépare avant d'interpréter"
    description="Trois feuilles gardent les notes propres jusqu'à la vérification."
    ariaLabel="Un fait et les mots exacts conduisent à une question, puis à vérifier."
    accent={EM}
    actors={["Notes"]}
    accentIndex={3}
    steps={[
      { actor: 0, label: "Fait", transfer: "vécu" },
      { actor: 0, label: "Mots exacts", transfer: "dit" },
      { actor: 0, label: "Question", transfer: "doute" },
      { actor: 0, label: "À vérifier", humanValidation: true },
    ]}
  />;
}
