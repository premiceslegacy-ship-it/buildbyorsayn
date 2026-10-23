import { Compare, Steps, WebPageCompare } from "../kit";

const EM = "#22d96e";

export function SceneTravailPreuveChoixDiagram() {
  return <Steps
    title="Une offre montre le travail"
    description="Exemple : une offre de suivi de devis, dans l'ordre où le client la lit."
    legend="Le client voit d'abord son mardi, puis ce que tu prépares, puis la preuve."
    ariaLabel="Quatre étapes dans l'ordre de lecture du client : sa journée avec un devis oublié, le travail préparé, la preuve de deux dossiers comparables, puis son choix de valider le prix et l'envoi."
    accent={EM}
    items={[
      { label: "Sa journée", detail: "Le devis resté dans sa boîte mail" },
      { label: "Travail préparé", detail: "Une relance prête à relire" },
      { label: "Preuve", detail: "Deux dossiers comparables" },
      { label: "Son choix", detail: "Il valide le prix et l'envoi" },
    ]}
    accentIndex={3}
  />;
}

export function OffreCRMAvantApresMockup() {
  return <WebPageCompare
    title="De la promesse vague à la fiche"
    description="La même offre, avec une phrase de magie puis avec ce que le prospect reçoit vraiment."
    legend="Compare les deux titres : le second se filme, le premier non."
    ariaLabel="Deux pages d'offre côte à côte. À gauche, le titre Agent IA de qualification commerciale. À droite, le titre Chaque nouveau prospect reçoit une fiche claire, avec le besoin, les pièces manquantes et la prochaine question."
    accent={EM}
    beforeTitle="Avant"
    afterTitle="Après"
    before={{ nav: "Qualif.IA", heading: "Agent IA de qualification commerciale", subtitle: "Automatise et gagne du temps.", button: "En savoir plus", imageLabel: "Logo robot" }}
    after={{ nav: "Suivi prospects", heading: "Chaque nouveau prospect reçoit une fiche claire", subtitle: "Tu vois son besoin, les pièces manquantes et la prochaine question.", button: "Voir une fiche type", imageLabel: "Fiche prospect" }}
  />;
}

export function PreuveAuMemeNiveauDiagram() {
  return <Compare
    title="La preuve répond à la promesse"
    description="Chaque promesse appelle une preuve du même niveau, pas une jolie démonstration."
    legend="Une démonstration montre que l'outil agit, pas encore l'effet chez le client."
    ariaLabel="Trois promesses et la preuve qui leur correspond : un dossier plus complet se prouve par deux dossiers comparables, moins de retours par des corrections comptées sur une période, et un outil qui sait agir par une démonstration."
    accent={EM}
    beforeTitle="Tu promets"
    afterTitle="Tu montres"
    rows={[
      { before: "Un dossier plus complet", after: "Deux dossiers comparables" },
      { before: "Moins de retours", after: "Corrections comptées sur une période" },
      { before: "Il sait agir", after: "Une démonstration" },
    ]}
  />;
}
