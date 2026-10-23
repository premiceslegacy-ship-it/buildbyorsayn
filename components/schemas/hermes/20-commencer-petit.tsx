import { Compare, Fork, Ladder } from "../kit";

const EM = "#22d96e";

export function AdoptionLaddersDiagramV2() {
  return <Ladder
    title="Six marches, dans cet ordre"
    description="Tu montes d'une marche seulement quand la précédente a fait ses preuves."
    legend="Lis du bas vers le haut : chaque droit s'ajoute après une preuve."
    ariaLabel="Six marches : observer sur des dossiers fictifs, préparer sans rien envoyer, quelques vrais cas validés, plus de cas, un nouvel outil avec un droit précis, puis suivre la qualité et le coût."
    accent={EM}
    rungs={[
      { label: "Observer", detail: "Dossiers fictifs" },
      { label: "Préparer", detail: "Rien n'est envoyé" },
      { label: "Quelques cas", detail: "Tu valides tout" },
      { label: "Plus de cas", detail: "Après les preuves" },
      { label: "Nouvel outil", detail: "Un droit précis" },
      { label: "Suivre", detail: "Qualité et coût" },
    ]}
    accentIndex={5}
    lowLabel="Peu de droits"
    highLabel="Preuves accumulées"
  />;
}

export function EscalierDesDroitsDiagram() {
  return <Ladder
    title="Chaque marche garde sa barrière"
    description="Le droit suivant attend la preuve du précédent, comme un permis de conduire."
    legend="Tu ne commences pas sur l'autoroute, de nuit, avec une remorque."
    ariaLabel="Quatre marches de droits : lire sans modifier, préparer un brouillon, proposer en demandant un accord, puis agir une opération précise après preuve."
    accent={EM}
    rungs={[
      { label: "Lire", detail: "Voir sans modifier" },
      { label: "Préparer", detail: "Créer un brouillon" },
      { label: "Proposer", detail: "Demander ton accord" },
      { label: "Agir", detail: "Une opération, après preuve" },
    ]}
    accentIndex={3}
    lowLabel="Lecture seule"
    highLabel="Action"
  />;
}

export function TableauAvantApresPiloteMockup() {
  return <Compare
    title="Mesure le résultat complet"
    description="Une réponse rapide ne vaut rien si elle demande vingt minutes de correction."
    legend="Compare les mêmes cas, sur la même période, et fixe la date de revue."
    ariaLabel="Ce qu'on regarde d'habitude, comme la vitesse ou le ressenti, face à ce que le pilote mesure : dossiers acceptés sans correction, corrections et oublis, temps humain et coût total, mêmes cas sur la même période."
    accent={EM}
    beforeTitle="On regarde souvent"
    afterTitle="Tu mesures"
    rows={[
      { before: "La vitesse de réponse", after: "Dossiers acceptés sans correction" },
      { before: "Un bon ressenti", after: "Corrections et oublis comptés" },
      { before: "Le prix de l'outil", after: "Temps humain et coût total" },
      { before: "Le jour de la démo", after: "Mêmes cas, même période" },
    ]}
  />;
}

export function SortieDeSecoursDiagram() {
  return <Fork
    title="Une sortie à chaque palier"
    description="Si la qualité baisse, les doublons montent ou le coût dérive, tu arrêtes."
    legend="Les sources restent intactes, donc le retour au manuel ne perd rien."
    ariaLabel="Quand le pilote tourne, on continue si les mesures tiennent, on arrête si la qualité baisse, et on revient au travail manuel sans perdre les dossiers."
    accent={EM}
    situation="Le pilote tourne"
    outcomes={[
      { label: "Continuer", condition: "Les mesures tiennent" },
      { label: "Arrêter", condition: "Qualité, doublons ou coût" },
      { label: "Revenir au manuel", condition: "Sources et étapes intactes", recommended: true },
    ]}
  />;
}
