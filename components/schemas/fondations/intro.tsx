import { Steps } from "../kit";

const EM = "#22d96e";

export function LeCheminDuMessageDiagram() {
  return <Steps
    title="Du terrain au message"
    description="Chaque chapitre te laisse un objet concret pour ton projet, dans l'ordre où tu t'en serviras."
    legend="Chaque étape nourrit la suivante : le terrain d'abord, l'attention en dernier."
    ariaLabel="Cinq chapitres dans l'ordre : tester une croyance, comprendre la personne avec sa fiche, vendre avec quatre questions prêtes, écrire un message simple, montrer une première idée de contenu. Le test est mis en avant."
    accent={EM}
    accentIndex={0}
    items={[
      { label: "Tester", detail: "Une croyance à vérifier" },
      { label: "Comprendre", detail: "La fiche de la personne" },
      { label: "Vendre", detail: "Quatre questions prêtes" },
      { label: "Écrire", detail: "Un message simple" },
      { label: "Montrer", detail: "Une idée de contenu" },
    ]}
  />;
}
