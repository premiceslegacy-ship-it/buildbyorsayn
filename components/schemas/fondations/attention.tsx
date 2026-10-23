import { AdCard, Compare, Curves, Fork, Ladder } from "../kit";

const EM = "#22d96e";

export function UneIdeeUnePersonneDiagram() {
  return <Compare
    title="Une idée pour une personne"
    description="Exemple : le même contenu écrit pour tout le monde, puis pour les fleuristes et leurs commandes tardives."
    legend="Si tu ne peux pas nommer le métier visé, tu écris encore dans la colonne de gauche."
    ariaLabel="Un contenu pour tout le monde vise les entrepreneurs ambitieux avec cinq promesses et personne ne s'y reconnaît. Un contenu pour une personne vise les fleuristes qui reçoivent des commandes tardives, porte une seule idée et montre leur veille de livraison."
    accent={EM}
    beforeTitle="Pour tout le monde"
    afterTitle="Pour une personne"
    rows={[
      { before: "« Entrepreneurs ambitieux »", after: "Les fleuristes et leurs commandes tardives" },
      { before: "Cinq promesses à la fois", after: "Une seule idée" },
      { before: "Personne ne se reconnaît", after: "La fleuriste revoit sa veille de livraison" },
    ]}
  />;
}

export function TroisTempsAttentionDiagram() {
  return <Ladder
    title="Trois temps, trois formats"
    description="Un post fait découvrir, une démonstration ouvre l'échange, une page claire propose l'offre."
    legend="Ne demande pas l'achat sur la première marche : chaque format prépare le suivant."
    ariaLabel="Trois marches : découvrir avec un post qui montre une scène, mis en avant, comprendre avec une démonstration de ta façon de travailler, puis agir sur une page qui présente l'offre et ses conditions."
    accent={EM}
    lowLabel="Te découvre"
    highLabel="Passe à l'action"
    accentIndex={0}
    rungs={[
      { label: "Découvrir", detail: "Un post montre une scène" },
      { label: "Comprendre", detail: "Une démo montre comment tu travailles" },
      { label: "Agir", detail: "Une page présente l'offre et ses conditions" },
    ]}
  />;
}

export function ObserverSansCopierDiagram() {
  return <AdCard
    title="Garde le principe, pas la phrase"
    description="Exemple : une accroche de coach recopiée par une organisatrice de mariages, puis réécrite avec ses faits."
    legend="Les deux ouvrent sur une scène : seule la seconde vient de son vrai métier."
    ariaLabel="Deux publications d'une organisatrice de mariages. À gauche, l'accroche d'un coach recopiée avec deux mots changés et une photo de salle de sport. À droite, la même mécanique avec ses faits : la veille du mariage, trois horaires circulent, avec la photo de sa feuille de route annotée."
    accent={EM}
    variant="social"
    beforeTitle="Copiée, deux mots changés"
    afterTitle="Même mécanique, ses faits"
    before={{
      account: "Amel Mariages",
      text: "« Tu tiens trois jours, puis les mariages reprennent le dessus. »",
      image: "/schemas/ads/salle-de-sport.jpg",
      visual: "Une photo de salle de sport",
      headline: "Tiens la distance",
      domain: "AMELMARIAGES.FR",
      action: "En savoir plus",
      pins: { text: 1, image: 2, headline: 3, action: 4 },
    }}
    after={{
      account: "Amel Mariages",
      text: "« La veille du mariage, trois horaires différents circulent. Voici qui les vérifie. »",
      image: "/schemas/ads/feuille-de-route-mariage.jpg",
      visual: "Sa feuille de route annotée, sur la table de la salle",
      headline: "Une feuille de route que tout le monde relit",
      domain: "AMELMARIAGES.FR",
      action: "Voir la feuille de route",
      pins: { text: 1, image: 2, headline: 3, action: 4 },
    }}
    beforeNotes={[
      { pin: 1, role: "Une accroche empruntée", why: "Deux mots changés sur la phrase d'un coach : la scène n'est pas la sienne.", alt: "Garder la mécanique (une scène qui se répète) avec ses propres faits." },
      { pin: 2, role: "Une photo qui n'est pas la sienne", why: "Une salle de sport ne prouve rien pour un mariage.", alt: "Son propre document, sur son vrai lieu." },
      { pin: 3, role: "Un titre sans objet", why: "« Tiens la distance » parle de sport, pas de mariage.", alt: "Le bénéfice du client : des horaires que personne ne contredit." },
      { pin: 4, role: "Un bouton générique", why: "« En savoir plus » ne promet rien de précis.", alt: "Un verbe et un objet : « Voir la feuille de route »." },
    ]}
    afterNotes={[
      { pin: 1, role: "La même mécanique, ses faits", why: "Elle garde la scène qui se répète, mais prend un moment qu'elle vit vraiment : la veille du mariage.", alt: "La scène racontée par une mariée, avec son accord." },
      { pin: 2, role: "Son vrai objet", why: "Sa feuille de route annotée, sur la table de la salle : la preuve est dans l'image.", alt: "Une photo de la feuille signée par le traiteur." },
      { pin: 3, role: "Le bénéfice en titre", why: "Le titre dit ce que le client obtient : une feuille que tout le monde relit.", alt: "Le nombre de mariages déjà passés avec cette feuille, si c'est vrai." },
      { pin: 4, role: "Un geste précis", why: "Le bouton nomme l'objet qu'on va voir.", alt: "Un lien « Demander un exemple »." },
    ]}
  />;
}

export function VolumePuisQualiteDiagram() {
  return <Curves
    title="Cherche large, puis renforce"
    description="Exemple illustratif : le nombre d'angles testés baisse pendant que les bonnes conversations montent."
    legend="Quand la courbe verte monte d'elle-même, arrête de chercher et renforce cette direction."
    ariaLabel="Courbes illustratives sur quatre temps : varier, comparer, choisir, renforcer. Les angles testés passent de six à un, les bonnes conversations montent de zéro à cinq, avec une direction marquée au dernier temps."
    accent={EM}
    labels={["Varier", "Comparer", "Choisir", "Renforcer"]}
    series={[
      { name: "Angles testés", values: [6, 4, 2, 1] },
      { name: "Bonnes conversations", values: [0, 1, 3, 5], kind: "step", accent: true },
    ]}
    annotations={[{ series: 1, point: 3, label: "Une direction" }]}
  />;
}

export function SourceVersBibliothequeDiagram() {
  return <Fork
    title="Une question, quatre formats"
    description="Exemple d'Amel, organisatrice de mariages : une question posée en appel devient quatre contenus."
    legend="Le format change à chaque carte, la question de départ et ses limites restent les mêmes."
    ariaLabel="La question d'une mariée, qui vérifie l'heure des prestataires, devient un post sur trois horaires qui circulent la veille, une vidéo sur la vérification de la feuille de route, un e-mail sur les informations demandées aux prestataires et une page sur ce que la coordination inclut."
    accent={EM}
    situation="« Qui vérifie l'heure des prestataires ? »"
    outcomes={[
      { label: "Post", condition: "La veille, trois horaires circulent" },
      { label: "Vidéo", condition: "Elle vérifie la feuille de route" },
      { label: "E-mail", condition: "Les infos demandées aux prestataires" },
      { label: "Page", condition: "Ce que la coordination inclut" },
    ]}
  />;
}
