import { Steps } from "../kit";

const EM = "#22d96e";

export function DeLideeALURLDiagram() {
  return <Steps
    title="De l'idée à l'URL"
    description="Le parcours suit l'ordre réel d'un projet : le besoin d'abord, l'adresse publique en dernier."
    legend="Chaque étape s'appuie sur la précédente : sans besoin clair, le domaine ne sert à rien."
    ariaLabel="Cinq étapes : le besoin d'une personne et son action, mis en avant, les mots techniques comme modèle, API et agent, la direction visuelle, la page avec son message et son code, puis la mise en ligne avec GitHub, Vercel, le domaine et les accès."
    accent={EM}
    accentIndex={0}
    items={[
      { label: "Besoin", detail: "Une personne, une action" },
      { label: "Les mots", detail: "Modèle, API, agent" },
      { label: "Direction", detail: "Le style décidé" },
      { label: "Page", detail: "Message, page et code" },
      { label: "En ligne", detail: "Domaine et accès remis", tools: ["GitHub", "Vercel"] },
    ]}
  />;
}
