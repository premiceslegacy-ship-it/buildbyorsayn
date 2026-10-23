import { Steps } from "../kit";

const EM = "#22d96e";

export function LeCheminDuMessageDiagram() {
  return <Steps
    title="Du terrain au message"
    description="Une offre utile suit le réel avant de chercher l'attention."
    ariaLabel="Cinq étapes vont du test au message montré, avec la compréhension mise en avant."
    accent={EM}
    accentIndex={1}
    items={[
      { label: "Tester", detail: "Sortir de ta tête" },
      { label: "Comprendre", detail: "Écouter une personne" },
      { label: "Vendre", detail: "Poser les questions" },
      { label: "Écrire", detail: "Garder ses mots" },
      { label: "Montrer", detail: "Allumer l'attention" },
    ]}
  />;
}
