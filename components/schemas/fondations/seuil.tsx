import { Fork, Ladder, Steps } from "../kit";

const EM = "#22d96e";

export function CeQueTuPossedesDiagram() {
  return <Steps
    title="Range le projet dans ta mallette"
    description="Les éléments importants restent hors de la conversation."
    ariaLabel="Le brief, les sources, les choix, le code et la procédure appartiennent à la personne."
    accent={EM}
    accentIndex={4}
    items={[
      { label: "Brief", detail: "Le point de départ" },
      { label: "Sources", detail: "La matière choisie" },
      { label: "Choix", detail: "Les décisions prises" },
      { label: "Code", detail: "Le projet", tools: ["GitHub"] },
      { label: "Procédure", detail: "Les gestes à refaire" },
    ]}
  />;
}

export function PremierProjetVersMethodeDiagram() {
  return <Ladder
    title="Le chantier suivant part plus haut"
    description="Quatre briques du premier projet forment la nouvelle marche."
    ariaLabel="La question, la règle, l'exemple et le test construisent le projet suivant."
    accent={EM}
    lowLabel="Premier projet"
    highLabel="Méthode"
    accentIndex={4}
    rungs={[
      { label: "Question", detail: "Ce qui a guidé" },
      { label: "Règle", detail: "Ce qui doit rester" },
      { label: "Exemple", detail: "Ce qui montre" },
      { label: "Test", detail: "Ce qui vérifie" },
      { label: "Projet suivant", detail: "Le nouveau départ" },
    ]}
  />;
}

export function DeuxPortesDuSeuilDiagram() {
  return <Fork
    title="Deux portes après les Fondations"
    description="Tu peux repartir d'une page vide ou garder ce que tu as construit."
    ariaLabel="Deux portes opposent repartir de zéro à garder ma méthode, avec le second choix mis en avant."
    accent={EM}
    situation="Je choisis"
    outcomes={[
      { label: "Repartir de zéro", condition: "La page blanche se répète", rejected: true },
      { label: "Garder ma méthode", condition: "L'atelier reste à toi", recommended: true },
    ]}
  />;
}
