import { Compare, Fork, Ladder, Steps } from "../kit";

const EM = "#22d96e";

export function CroyanceVersQuestionDiagram() {
  return <Compare
    title="Ouvre la croyance"
    description="Une phrase fermée devient une question qu'un appel ou un message peut trancher cette semaine."
    legend="À gauche, rien à vérifier. À droite, un appel suffit pour avoir une réponse."
    ariaLabel="Trois croyances fermées, comme le marché est saturé, deviennent trois questions vérifiables sur les restaurants du quartier, le service du soir et quatre restaurateurs à appeler."
    accent={EM}
    beforeTitle="Croyance"
    afterTitle="Question à vérifier"
    rows={[
      { before: "« Le marché est saturé »", after: "« Les restaurants du quartier ratent-ils des réservations ? »" },
      { before: "« Personne ne veut ça »", after: "« Qui décroche pendant le service du soir ? »" },
      { before: "« Ça ne marchera pas »", after: "« Que disent quatre restaurateurs cette semaine ? »" },
    ]}
  />;
}

export function PetitTestTroisSortiesDiagram() {
  return <Fork
    title="Un test, trois sorties"
    description="Exemple d'Inès, webdesigner : avant d'appeler, elle écrit ce qui la fera continuer, modifier ou arrêter."
    legend="Choisis la sortie à la date fixée, d'après ce que les personnes ont fait."
    ariaLabel="Le test d'Inès, quatre appels à des restaurateurs, mène à trois sorties : continuer si un restaurateur veut essayer la page, modifier si le vrai besoin est ailleurs, arrêter si leur site leur suffit."
    accent={EM}
    situation="Quatre appels à des restaurateurs"
    outcomes={[
      { label: "Continuer", condition: "Un restaurateur veut essayer la page" },
      { label: "Modifier", condition: "Le vrai besoin : de meilleures photos" },
      { label: "Arrêter", condition: "Leur site actuel leur suffit" },
    ]}
  />;
}

export function UneSeuleChoseChangeDiagram() {
  return <Compare
    title="Change une seule chose"
    description="Si la personne, le moment et le message changent ensemble, tu ne sais plus ce qui a compté."
    legend="Garde la colonne de droite : le seul écart entre deux essais explique le résultat."
    ariaLabel="À gauche, le deuxième essai change de personnes, de jour et de message. À droite, il garde les mêmes restaurateurs et le même mardi à 15 h, seul le message change."
    accent={EM}
    beforeTitle="Tout change d'un coup"
    afterTitle="Une seule chose change"
    rows={[
      { before: "D'autres personnes", after: "Les mêmes restaurateurs" },
      { before: "Un autre jour, une autre heure", after: "Mardi 15 h, comme la fois d'avant" },
      { before: "Un autre message", after: "Seul le message change" },
    ]}
  />;
}

export function EchelleEngagementDiagram() {
  return <Ladder
    title="Le geste parle plus fort"
    description="Plus la marche est haute, plus le geste demande un effort réel à la personne."
    legend="Un « c'est super » reste en bas : compte seulement les marches au-dessus."
    ariaLabel="Cinq marches montent du compliment « c'est super » au paiement, en passant par un épisode raconté, un document envoyé et un devis demandé, mis en avant."
    accent={EM}
    lowLabel="Parole"
    highLabel="Geste"
    accentIndex={3}
    rungs={[
      { label: "Compliment", detail: "« C'est super »" },
      { label: "Récit", detail: "Elle raconte un épisode précis" },
      { label: "Document", detail: "Elle t'envoie un fichier" },
      { label: "Devis", detail: "Elle demande un prix" },
      { label: "Paiement", detail: "Elle accepte un essai payant" },
    ]}
  />;
}

export function CeQueTuGardesDiagram() {
  return <Steps
    title="Ce que chaque test te laisse"
    description="Exemple d'Inès : sa question, son action, la réponse et sa décision finissent dans son propre dossier."
    legend="Lis dans l'ordre : la décision arrive après la réponse du terrain, jamais avant."
    ariaLabel="Inès note sa question sur les réservations perdues, ses quatre appels, la réponse d'un restaurateur sur quatre, sa décision de tester une page de réservation, puis range le tout dans son dossier, mis en avant."
    accent={EM}
    accentIndex={4}
    items={[
      { label: "Question", detail: "Ratent-ils des réservations ?" },
      { label: "Action", detail: "Quatre appels" },
      { label: "Réponse", detail: "Un sur quatre en rate" },
      { label: "Décision", detail: "Tester une page" },
      { label: "Dossier", detail: "Notes et brief rangés" },
    ]}
  />;
}
