import { Compare, Cycle, FileCard, Fork, Steps } from "../kit";

const EM = "#22d96e";

export function MedecinAvantOrdonnanceDiagram() {
  return <Compare
    title="Écoute avant de proposer"
    description="Exemple de Thomas, paysagiste : le même appel avec Nora, la démo trop tôt, puis à sa place."
    legend="Lis chaque ligne de gauche à droite : même moment de l'appel, deux façons de le mener."
    ariaLabel="Trop tôt, Thomas ouvre sa démo, Nora répond que ça a l'air bien et l'appel s'arrête. Dans l'ordre, il demande la dernière demande perdue, Nora raconte les photos et l'adresse séparées, puis il propose une liste à valider le soir."
    accent={EM}
    beforeTitle="Démo trop tôt"
    afterTitle="Dans l'ordre"
    rows={[
      { before: "Thomas ouvre sa démo", after: "« Raconte-moi la dernière demande perdue »" },
      { before: "« Ça a l'air bien »", after: "Photos par message, adresse par mail" },
      { before: "L'appel s'arrête là", after: "Une liste à valider chaque soir" },
    ]}
  />;
}

export function QuatreQuestionsDeVenteDiagram() {
  return <Steps
    title="Quatre questions sur le dernier épisode"
    description="Exemple : la dernière relance oubliée. Tu poses ces questions dans l'ordre, sans parler de ton offre."
    legend="Passe à la question suivante seulement quand la scène est racontée jusqu'au bout."
    ariaLabel="Quatre questions explorent la dernière relance oubliée : que s'est-il passé, comment as-tu géré, qu'est-ce que ça t'a demandé, et que faudrait-il changer pour agir. La première est mise en avant."
    accent={EM}
    accentIndex={0}
    items={[
      { label: "Dernière fois", detail: "Que s'est‑il passé ?" },
      { label: "Aujourd'hui", detail: "Comment as‑tu géré ?" },
      { label: "Coût réel", detail: "Ça t'a demandé quoi ?" },
      { label: "Pour changer", detail: "Que faudrait‑il changer ?" },
    ]}
  />;
}

export function CheminDeVenteDiagram() {
  return <Cycle
    title="Avance seulement si l'étape tient"
    description="Exemple : des demandes arrivent à deux endroits. Tu comprends, tu reformules, puis tu relies ton offre."
    legend="Si une étape casse, tu reviens à « Comprendre » au lieu de pousser ton offre."
    ariaLabel="La vente suit cinq étapes en boucle : comprendre la scène, reformuler avec ses mots en demandant ce qui manque, relier l'offre à son cas, proposer ce que tu fais et ce qu'elle fournit, vérifier que le chemin lui convient. Reformuler est mis en avant."
    accent={EM}
    entryIndex={1}
    centerLabel="Clarifier si besoin"
    steps={[
      { label: "Comprendre", detail: "Écouter la dernière scène" },
      { label: "Reformuler", detail: "« Si je résume… J'ai raté quoi ? »" },
      { label: "Relier", detail: "Ton offre face à son cas" },
      { label: "Proposer", detail: "Ce que tu fais, ce qu'elle fournit" },
      { label: "Vérifier", detail: "Le chemin lui convient ?" },
    ]}
  />;
}

export function OffreFacileAChoisirDiagram() {
  return <FileCard
    title="Une offre tient sur une page"
    description="Exemple : l'offre de Thomas pour Nora. Quatre réponses écrites avant de parler du prix."
    legend="Si une des quatre parties reste vide, la personne devra deviner : complète-la d'abord."
    ariaLabel="Le fichier offre-nora.md répond à quatre questions : ce qui change, toutes les demandes visibles le soir ; comment, un formulaire puis une liste où Nora choisit qui répond ; ce qu'elle fournit, ses services et ses zones ; la limite, l'outil ne chiffre pas les travaux."
    accent={EM}
    filename="offre-nora.md"
    lines={[
      { text: "# Ce qui change", tone: "heading" },
      { text: "Toutes les demandes visibles le soir" },
      { text: "# Comment", tone: "heading" },
      { text: "Formulaire, puis liste à valider" },
      { text: "# Ce que tu fournis", tone: "heading" },
      { text: "Tes services et tes zones" },
      { text: "# Limite", tone: "heading" },
      { text: "L'outil ne chiffre pas les travaux" },
    ]}
    annotations={[
      { line: 2, label: "Le changement" },
      { line: 4, label: "Le chemin" },
      { line: 6, label: "Son effort" },
      { line: 8, label: "Où tu t'arrêtes" },
    ]}
  />;
}

export function ObjectionQuestionCacheeDiagram() {
  return <Fork
    title="Déplie l'objection"
    description="« C'est trop cher » peut cacher quatre questions différentes. Tu ne choisis pas à la place du client."
    legend="Pour savoir quelle carte est la bonne, demande : « Tu compares avec quoi ? »"
    ariaLabel="L'objection c'est trop cher peut cacher quatre questions : la valeur, je ne vois pas ce que je reçois ; la comparaison, un autre devis coûte moins ; le budget, je n'ai pas cette somme ; la priorité, ce problème peut attendre."
    accent={EM}
    situation="« C'est trop cher »"
    outcomes={[
      { label: "Valeur ?", condition: "Je ne vois pas ce que je reçois" },
      { label: "Comparaison ?", condition: "Un autre devis coûte moins" },
      { label: "Budget ?", condition: "Je n'ai pas cette somme" },
      { label: "Priorité ?", condition: "Ce problème peut attendre" },
    ]}
  />;
}
