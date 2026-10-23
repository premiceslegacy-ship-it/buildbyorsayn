import { Steps } from "../kit";

const EM = "#22d96e";

export function DeLideeALURLDiagram() {
  return <>
    <Steps
      title="Du besoin au code"
      description="Une main valide chaque objet avant la publication."
      ariaLabel="Le besoin devient un brief, une maquette puis du code."
      accent={EM}
      accentIndex={2}
      items={[
        { label: "Besoin", detail: "Le point de départ" },
        { label: "Brief", detail: "Les décisions utiles" },
        { label: "Maquette", detail: "La forme validée", tools: ["Figma"] },
        { label: "Code", detail: "La page construite" },
      ]}
    />
    <Steps
      title="Du code au domaine"
      description="La version connue traverse les bons services jusqu'à l'adresse publique."
      ariaLabel="Le code passe par GitHub et Vercel avant d'allumer le domaine."
      accent={EM}
      accentIndex={2}
      items={[
        { label: "GitHub", detail: "Garde la version", tools: ["GitHub"] },
        { label: "Vercel", detail: "Met la page en ligne", tools: ["Vercel"] },
        { label: "Domaine", detail: "Donne l'adresse publique" },
      ]}
    />
  </>;
}
