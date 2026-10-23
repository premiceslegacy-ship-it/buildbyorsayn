import { Compare, Cycle, Fork, Rings, Steps } from "../kit";

const EM = "#22d96e";

export function MedecinAvantOrdonnanceDiagram() {
  return <Compare
    title="Écoute avant de proposer"
    description="La proposition utile arrive après le diagnostic."
    ariaLabel="Une scène trop tôt tend une proposition immédiatement, tandis que la bonne scène questionne, écoute puis propose."
    accent={EM}
    beforeTitle="Trop tôt"
    afterTitle="Dans l'ordre"
    rows={[
      { before: "Proposition", after: "Questions" },
      { before: "La personne se ferme", after: "Écoute" },
      { before: "Réponse automatique", after: "Proposition" },
    ]}
  />;
}

export function QuatreQuestionsDeVenteDiagram() {
  return <Steps
    title="Éclaire l'épisode réel"
    description="Chaque question révèle un objet différent sur la table."
    ariaLabel="Quatre questions éclairent la dernière fois, aujourd'hui, le coût réel et ce qui permettrait de changer."
    accent={EM}
    accentIndex={0}
    items={[
      { label: "Dernière fois", detail: "Que s'est-il passé ?" },
      { label: "Aujourd'hui", detail: "Comment tu gères ?" },
      { label: "Coût réel", detail: "Qu'est-ce que ça demande ?" },
      { label: "Pour changer", detail: "Qu'est-ce qui manque ?" },
    ]}
  />;
}

export function CheminDeVenteDiagram() {
  return <Cycle
    title="Chaque étape peut rouvrir la question"
    description="Tu avances seulement quand l'étape précédente tient."
    ariaLabel="La vente suit comprendre, reformuler, relier, proposer et vérifier, avec reformuler mis en avant."
    accent={EM}
    entryIndex={1}
    centerLabel="Clarifier si besoin"
    steps={[
      { label: "Comprendre", detail: "Écouter la scène" },
      { label: "Reformuler", detail: "Dire ce que tu as compris" },
      { label: "Relier", detail: "Montrer le bon lien" },
      { label: "Proposer", detail: "Présenter le chemin" },
      { label: "Vérifier", detail: "Laisser choisir" },
    ]}
  />;
}

export function OffreFacileAChoisirDiagram() {
  return <Rings
    title="Une offre montre ses quatre faces"
    description="La personne voit le résultat, le chemin, son rôle et la limite."
    ariaLabel="Une offre transparente entoure le changement de son chemin, de ton effort et de sa limite."
    accent={EM}
    core="Offre"
    accentIndex={0}
    rings={[
      { label: "Changement", detail: "Ce qui devient différent" },
      { label: "Chemin", detail: "Comment on y arrive" },
      { label: "Ton effort", detail: "Ce que tu fournis" },
      { label: "Limite", detail: "Où le travail s'arrête" },
    ]}
  />;
}

export function ObjectionQuestionCacheeDiagram() {
  return <Fork
    title="Déplie l'objection"
    description="Une phrase courte peut cacher plusieurs questions."
    ariaLabel="Trop cher s'ouvre sur la valeur, la comparaison et la priorité avant la question tu compares avec quoi."
    accent={EM}
    situation="Trop cher"
    outcomes={[
      { label: "Valeur ?", condition: "Le résultat est flou" },
      { label: "Comparaison ?", condition: "Un autre repère existe" },
      { label: "Priorité ?", condition: "Le moment ne convient pas" },
      { label: "Tu compares avec quoi ?", condition: "La question ouvre", recommended: true },
    ]}
  />;
}
