import { AdCard, Compare, Curves, Fork, Ladder, NativeAds, Steps } from "../kit";

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

export function PubsQuiNeFontPasPubDiagram() {
  const photo = "/schemas/sites/atelier-velo-reparation.jpg";
  return <NativeAds
    title="Six façons de ne pas ressembler à une publicité"
    description="Le même atelier de vélos, présenté dans six formats que la personne lit déjà tous les jours."
    legend="Le format imite un contenu, jamais le fait que c'est une publicité : la mention « Sponsorisé » reste visible."
    ariaLabel="Six publicités d'un atelier de vélos : un faux article de presse, une note de téléphone avec une liste cochée et barrée, une réponse à une question de story, un message reçu, un tableau blanc avec deux cercles, et une comparaison entre tes problèmes et ma solution. Chacune porte la mention Sponsorisé."
    accent={EM}
    formats={[
      { kind: "press", name: "L'article", sponsor: "Sponsorisé", source: "Le Journal du vélo", headline: "À Lyon, cet atelier trouve le grincement de ton vélo en 48 h", image: photo, caption: "Le mécanicien montre la pièce, puis le devis, avant de toucher à quoi que ce soit.", why: "On lit un titre de presse, pas une promesse de vendeur : le fait passe avant l'offre.", when: "Quand ton offre a un fait vérifiable à raconter (un délai, une méthode, un cas)." },
      { kind: "notes", name: "La note de téléphone", sponsor: "Sponsorisé", date: "17 janvier 2026 à 10 h 44", title: "Pourquoi je change d'atelier", items: [{ text: "Diagnostic sous 48 h", struck: "Trois semaines d'attente" }, { text: "Devis validé avant la réparation", struck: "Une facture surprise" }, { text: "Fiche de diagnostic remise", struck: "« C'est réglé » sans preuve" }], image: photo, why: "Une liste personnelle, avec ce qu'on quitte barré : le lecteur compare tout seul.", when: "Quand ton offre remplace une habitude que la personne connaît déjà." },
      { kind: "story", name: "La réponse à une question", sponsor: "Sponsorisé", account: "Atelier de Mehdi", image: photo, question: "Tu répares aussi les vélos électriques ?", answer: ["Oui, batterie comprise.", "Dépose-le le matin, diagnostic le lendemain."], why: "Une vraie question de client, une réponse courte : on dirait une conversation.", when: "Quand tu réponds déjà aux mêmes questions chaque semaine." },
      { kind: "dm", name: "Le message reçu", sponsor: "Sponsorisé", image: photo, from: "Exemple, à remplacer par un vrai message de client, avec son accord", messages: ["Mon vélo ne grince plus du tout !", "Merci pour la fiche de diagnostic, je sais enfin ce qui a été changé."], why: "Un message de client, présenté comme on le reçoit : la preuve parle à ta place.", when: "Quand tu as de vrais messages de clients et leur accord pour les montrer." },
      { kind: "whiteboard", name: "Le tableau blanc", sponsor: "Sponsorisé", left: "Mon vélo grince", right: "Pas trois semaines sans vélo", middle: "48 h", caption: "Atelier de Mehdi, Lyon", why: "Un schéma fait à la main ressemble à une explication, pas à une annonce.", when: "Quand ton offre se comprend par la rencontre de deux besoins." },
      { kind: "versus", name: "Tes problèmes, ma solution", sponsor: "Sponsorisé", leftTitle: "tes problèmes", rightTitle: "ma solution", bubbles: ["Ça grince en côte", "Pas de devis avant", "Trois semaines d'attente", "Aucune preuve"], image: photo, caption: "Diagnostic sous 48 h, devis avant la réparation", why: "Les bulles reprennent les phrases que le client se dit déjà : il se reconnaît avant de lire l'offre.", when: "Quand ton offre répond à des frustrations que tu entends souvent." },
    ]}
  />;
}

export function MiniVideoDessineeDiagram() {
  return <Steps
    title="Une mini-vidéo dessinée en quatre plans"
    description="Le même atelier de vélos, raconté en vingt secondes par un dessin animé, sans voix de vendeur."
    legend="Le héros du dessin est ton client : l'atelier arrive à la fin, une fois le problème reconnu."
    ariaLabel="Quatre plans d'une mini-vidéo dessinée : un cycliste entend un grincement en côte, il dépose son vélo à l'atelier, il reçoit une fiche avec la pièce montrée, il remonte la côte en silence."
    accent={EM}
    accentIndex={2}
    items={[
      { label: "Plan 1, le grincement", detail: "Un cycliste dessiné monte une côte, un bruit sort de la pédale. Voix off : « Ça grince seulement quand tu forces. »" },
      { label: "Plan 2, le dépôt", detail: "Il pose son vélo à l'atelier, le mécanicien note le bruit. Voix off : « Tu le déposes le matin. »" },
      { label: "Plan 3, la preuve", detail: "Le mécanicien montre la pièce usée et le devis. Voix off : « Tu vois la pièce avant de payer. »" },
      { label: "Plan 4, le silence", detail: "Le cycliste remonte la même côte sans bruit. Texte : « Diagnostic sous 48 h. Décris le bruit. »" },
    ]}
  />;
}
