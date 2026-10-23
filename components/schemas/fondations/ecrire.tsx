import { Ladder, Steps, WebPage, Workflow } from "../kit";

const EM = "#22d96e";

export function CarteDuMessageDiagram() {
  return <Steps
    title="Une histoire en cinq images"
    description="Le message garde le même fil jusqu'au prochain geste."
    ariaLabel="Une bande de cinq images montre le moment, le problème, le changement, le comment et le geste."
    accent={EM}
    accentIndex={2}
    items={[
      { label: "Moment", detail: "La scène commence" },
      { label: "Problème", detail: "Quelque chose coince" },
      { label: "Changement", detail: "La suite devient claire" },
      { label: "Comment", detail: "Le mécanisme apparaît" },
      { label: "Geste", detail: "La personne avance" },
    ]}
  />;
}

export function MemeOffreQuatreMomentsDiagram() {
  return <Ladder
    title="Le message avance avec la personne"
    description="Chaque vitrine donne le détail utile au bon moment."
    ariaLabel="Quatre marches vont de découvre à décide, avec compare mis en avant."
    accent={EM}
    lowLabel="Peu d'informations"
    highLabel="Prêt à choisir"
    accentIndex={2}
    rungs={[
      { label: "Découvre", detail: "Une scène attire" },
      { label: "Comprend", detail: "Le problème devient clair" },
      { label: "Compare", detail: "Les différences comptent" },
      { label: "Décide", detail: "Le prochain geste rassure" },
    ]}
  />;
}

export function MecanismeVisibleDiagram() {
  return <Workflow
    title="Ouvre la machine"
    description="On voit ce qui entre, ce qui bouge et qui valide."
    ariaLabel="Une machine transparente transforme une entrée par des étapes, une validation humaine et un résultat."
    accent={EM}
    actors={["Machine", "Humain"]}
    accentIndex={2}
    steps={[
      { actor: 0, label: "Entrée", transfer: "reçu" },
      { actor: 0, label: "Étapes", transfer: "traité" },
      { actor: 1, label: "Validation", humanValidation: true },
      { actor: 0, label: "Résultat", transfer: "livré" },
    ]}
  />;
}

export function PreuveAuBonEndroitDiagram() {
  return <WebPage
    title="Chaque doute trouve sa preuve"
    description="La preuve reste juste à côté de la question concernée."
    ariaLabel="Une page relie mon cas à un exemple, ton travail à une démo et pour moi aux conditions."
    accent={EM}
    page={{
      nav: "Preuves",
      heading: "Mon cas ?",
      subtitle: "Ton travail ?",
      button: "Pour moi ?",
      imageLabel: "Démo",
      proofs: ["Exemple", "Conditions"],
    }}
    annotations={[
      { number: 1, target: "heading", label: "Exemple" },
      { number: 2, target: "image", label: "Démo" },
      { number: 3, target: "proofs", label: "Conditions" },
    ]}
  />;
}
