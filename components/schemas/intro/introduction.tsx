import { Compare, Cycle, Rings, Steps } from "../kit";
import type { HandcraftedVisual } from "../coffre/types";

const EM = "#22d96e";

function ConsommerOuConstruireDiagram() {
  return <Compare
    title="Regarder ou construire"
    description="Regarder te donne l'impression d'avancer. Construire te laisse un objet que tu peux montrer."
    legend="Avant d'ouvrir le programme, nomme le livrable que tu veux terminer."
    ariaLabel="À gauche, regarder : trois vidéos de plus, l'impression d'être productif, l'onglet se ferme et rien ne change. À droite, construire : une idée choisie, un objet terminé, un retour du réel."
    accent={EM}
    beforeTitle="Regarder"
    afterTitle="Construire"
    rows={[
      { before: "Trois vidéos de plus", after: "Une idée choisie" },
      { before: "L'impression d'avancer", after: "Un objet terminé" },
      { before: "Rien ne change", after: "Un retour du réel" },
    ]}
  />;
}

function CarteDuParcoursBUILDDiagram() {
  return <Steps
    title="Un seul trajet en trois temps"
    description="Tu comprends le besoin, tu construis une réponse, puis tu la rends plus facile à reprendre."
    legend="Tu peux revenir en arrière, mais tu ne sautes jamais la compréhension."
    ariaLabel="Trois temps dans l'ordre. Comprendre, mis en avant : le problème et la personne. Construire : un objet qui répond. Améliorer : ce qui marche, plus facile à reprendre."
    accent={EM}
    accentIndex={0}
    items={[
      { label: "Comprendre", detail: "Le problème et la personne" },
      { label: "Construire", detail: "Un objet qui répond au besoin" },
      { label: "Améliorer", detail: "Ce qui marche, plus simple à reprendre" },
    ]}
  />;
}

function BoussoleDesQuatreHabitudesDiagram() {
  return <Rings
    title="Quatre habitudes pour avancer"
    description="L'action reste au centre. La curiosité, l'erreur encaissée et le rythme la rendent durable."
    legend="Une première version imparfaite te donne au moins une réponse."
    ariaLabel="Quatre cercles autour de ton avancée. Au centre, mis en avant : exécuter, assez vite pour obtenir une réponse. Puis rester curieux pour comprendre. Puis encaisser l'erreur sans défendre ton ego. Tout autour, garder un rythme que tu peux tenir."
    accent={EM}
    core="Avancer"
    accentIndex={0}
    rings={[
      { label: "Exécuter", detail: "Assez vite pour obtenir une réponse" },
      { label: "Rester curieux", detail: "Comprendre ce qui se passe" },
      { label: "Encaisser l'erreur", detail: "Sans défendre ton ego" },
      { label: "Tenir le rythme", detail: "Un rythme que tu peux garder" },
    ]}
  />;
}

function UnBlocUnLivrableDiagram() {
  return <Cycle
    title="Chaque bloc ferme une boucle"
    description="Tu produis une première version, tu la montres, tu notes le retour."
    legend="Un bloc, un livrable, un retour du réel."
    ariaLabel="Une boucle en quatre étapes. Décider, mis en avant : ce que tu vas produire. Terminer : une première version. Montrer : à une vraie personne. Noter : ce que le retour change. Puis le bloc suivant repart en mieux."
    accent={EM}
    entryIndex={0}
    centerLabel="Bloc suivant, en mieux"
    steps={[
      { label: "Décider", detail: "Le livrable" },
      { label: "Terminer", detail: "Version un" },
      { label: "Montrer", detail: "Une vraie personne" },
      { label: "Noter", detail: "Le retour" },
    ]}
  />;
}

export const INTRO_VISUALS = [
  { name: "ConsommerOuConstruire", kind: "schema", chapter: "introduction", component: ConsommerOuConstruireDiagram },
  { name: "CarteDuParcoursBUILD", kind: "schema", chapter: "introduction", component: CarteDuParcoursBUILDDiagram },
  { name: "BoussoleDesQuatreHabitudes", kind: "schema", chapter: "introduction", component: BoussoleDesQuatreHabitudesDiagram },
  { name: "UnBlocUnLivrable", kind: "schema", chapter: "introduction", component: UnBlocUnLivrableDiagram },
] as const satisfies readonly HandcraftedVisual[];
