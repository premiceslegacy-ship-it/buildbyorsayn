import { Compare, Fork, Ladder } from "../kit";

export function AdoptionLaddersDiagramV2() {
  return <Ladder title="Six marches, dans cet ordre" description="Les droits grandissent seulement après une preuve." ariaLabel="L'escalier monte de Observer à Préparer, Quelques cas, Plus de cas, Un nouvel outil et Suivre." rungs={[
    { label: "Observer", detail: "Lecture seule" },
    { label: "Préparer", detail: "Aucune action extérieure" },
    { label: "Quelques cas", detail: "Petit échantillon" },
    { label: "Plus de cas", detail: "Qualité mesurée" },
    { label: "Un nouvel outil", detail: "Droit précis" },
    { label: "Suivre", detail: "Qualité et coût" },
  ]} accentIndex={5} lowLabel="Peu de droits" highLabel="Preuves accumulées" />;
}

export function EscalierDesDroitsDiagram() {
  return <Ladder title="Chaque marche garde sa barrière" description="Le droit suivant attend la preuve du précédent." ariaLabel="Quatre marches montent de Lire à Préparer, Proposer et Agir. Agir est mis en avant." rungs={[
    { label: "Lire", detail: "Voir sans modifier" },
    { label: "Préparer", detail: "Créer un brouillon" },
    { label: "Proposer", detail: "Demander un accord" },
    { label: "Agir", detail: "Exécuter dans Hermes" },
  ]} accentIndex={3} lowLabel="Lecture seule" highLabel="Action" />;
}

export function TableauAvantApresPiloteMockup() {
  return <Compare title="Avant et pilote regardent les mêmes cas" description="Même type de dossiers, Même période. Compare les mêmes cas, Compte les corrections, puis Décide à la date prévue." ariaLabel="Avant et Pilote comparent Acceptés, Corrections, Oublis, Temps humain et Coût total. Même type de dossiers et Même période. Compare les mêmes cas, Compte les corrections, puis Décide à la date prévue." beforeTitle="Avant" afterTitle="Pilote" rows={[
    { before: "Acceptés", after: "Acceptés" },
    { before: "Corrections", after: "Corrections" },
    { before: "Oublis", after: "Oublis" },
    { before: "Temps humain", after: "Temps humain" },
    { before: "Coût total", after: "Coût total" },
  ]} />;
}

export function SortieDeSecoursDiagram() {
  return <Fork title="La route garde une sortie humaine" description="Le travail manuel reste possible à chaque palier." ariaLabel="Continuer et Arrêter gardent une sortie vers Reprendre à la main. Reprendre à la main est mis en avant." situation="Le pilote tourne"
    outcomes={[
      { label: "Continuer", condition: "Les mesures tiennent" },
      { label: "Arrêter", condition: "La qualité baisse", rejected: true },
      { label: "Reprendre à la main", condition: "Les sources restent intactes", recommended: true },
    ]} />;
}
