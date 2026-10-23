import { AdCard, Chat, Compare, Rings, WebPage } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function AnatomieOffreClaireDiagram() {
  return <WebPage
    title="Une offre tient sur une page"
    description="Exemple d'offre pour un cabinet de courtage : chaque bloc répond à une question du prospect."
    legend="Le prospect doit pouvoir la raconter sans employer le mot IA."
    ariaLabel="Une page d'offre annotée pour les cabinets de courtage montre pour qui et quel résultat, la scène reconnue, les livrables, la limite annoncée et la preuve disponible."
    accent={EM}
    page={{
      url: "relance-dossiers.fr",
      nav: "Relance Dossiers",
      eyebrow: "Pour les cabinets de courtage",
      heading: "Tes dossiers de courtage arrivent complets au rendez-vous",
      subtitle: "Chaque matin, les pièces manquantes et qui les relance. La rédaction reste chez toi.",
      button: "Voir un dossier rejoué",
      screen: { title: "Dossier rejoué : cabinet Durand", rows: [{ left: "Pièces reçues", right: "4 sur 6", state: "ok" }, { left: "Avis d'impôt", right: "manquant", state: "warn" }, { left: "Relance", right: "à valider", state: "todo" }] },
      proofs: ["Pièces", "Relances", "Tableau"],
    }}
    annotations={[
      { number: 1, target: "heading", label: "Pour qui et quel résultat", why: "Le prospect se reconnaît (cabinet de courtage) et voit un résultat, sans mot technique.", alt: "Un chiffre de son quotidien, comme les dossiers en retard chaque semaine." },
      { number: 2, target: "subtitle", label: "La scène et la limite", why: "Elle décrit un matin réel et annonce ce que tu ne fais pas : la rédaction reste chez lui.", alt: "La limite en plus petit, sous le bouton." },
      { number: 3, target: "image", label: "La preuve disponible", why: "Un vrai dossier rejoué convainc plus qu'une promesse, et il se vérifie.", alt: "Une vidéo de quinze secondes sur le même dossier." },
      { number: 4, target: "proofs", label: "Ce que tu livres", why: "Trois livrables nommés : il sait exactement ce qu'il reçoit.", alt: "Une vignette d'exemple pour chaque livrable." },
    ]}
  />;
}

export function MessageQuiOuvreDiagram() {
  return <AdCard
    title="Un message qui cherche une réponse"
    description="Le même premier message à une restauratrice, écrit comme un pitch puis comme une vraie question."
    legend="Une scène qu'elle reconnaît et une seule question facile à répondre."
    ariaLabel="Deux premiers messages sont comparés : un pitch sur des solutions digitales innovantes qui demande un appel, puis une question courte sur les réservations reçues après le service."
    accent={EM}
    variant="email"
    beforeTitle="Le pitch"
    afterTitle="La question"
    before={{
      subject: "Solutions digitales pour restaurants",
      preview: "Découvre notre offre innovante",
      text: "Bonjour, nous proposons des solutions digitales innovantes aux restaurants. Serais-tu disponible pour un appel ?",
      action: "Réserver un appel",
    }}
    after={{
      subject: "Les réservations après le service",
      preview: "Une seule question",
      text: "Bonjour Lina, quand une réservation arrive après le service, qui la reprend le lendemain ?",
      action: "Répondre",
    }}
  />;
}

export function PrixCommePerimetreDiagram() {
  return <Rings
    title="Le prix entoure un périmètre"
    description="Avant le montant, le client voit ce qui est inclus, ce qu'il garde et ce qui demande une suite."
    legend="Annonce le prix après avoir décrit ces quatre cercles, jamais avant."
    ariaLabel="Des cercles entourent le prix : ce qui est inclus, ce qui reste à la charge du client, ce qui reste en option et ce qui est hors offre. Le cercle inclus est mis en avant."
    accent={EM}
    core="Le prix"
    accentIndex={0}
    rings={[
      { label: "Inclus", detail: "Liste de pièces et relances préparées" },
      { label: "À sa charge", detail: "Valider chaque envoi" },
      { label: "En option", detail: "Un suivi après le pilote" },
      { label: "Hors offre", detail: "La rédaction des dossiers" },
    ]}
  />;
}

export function ObjectionQuestionDiagram() {
  return <Chat
    title="Une objection cache une question"
    description="« C'est trop cher » peut parler du montant, du travail inclus ou du risque. Tu demandes avant de répondre."
    legend="Tu réponds au vrai frein avec le mécanisme, sans remise ni promesse de gain."
    ariaLabel="Un gérant écrit que c'est trop cher. Tu demandes si le frein est le montant, le travail inclus ou le risque. Il répond le risque, et tu expliques que l'outil prépare tandis que l'équipe garde l'envoi, puis proposes un exemple."
    accent={EM}
    platform="WhatsApp"
    contact="Gérant de restaurant"
    messages={[
      { from: "agent", text: "C'est trop cher pour nous.", time: "10:02" },
      { from: "person", text: "Qu'est-ce qui te semble trop grand : le montant, le travail inclus ou le risque ?", time: "10:04" },
      { from: "agent", text: "Le risque. Que ça réponde seul aux clients.", time: "10:09" },
      { from: "person", text: "L'outil prépare. Ton équipe garde l'envoi et le prix. Je te montre sur un exemple ?", time: "10:11" },
    ]}
    backstageTitle="Ce que tu fais"
    actions={[
      { label: "Tu classes l'objection : le risque" },
      { label: "Tu montres le mécanisme, pas un gain" },
      { label: "Tu proposes une preuve sur un cas" },
    ]}
  />;
}

export function UneVariableALaFoisDiagram() {
  return <Compare
    title="Change une seule chose"
    description="Deux essais de prospection auprès de restaurants : tout reste identique sauf le message."
    legend="Si les réponses changent, tu sais quelle ligne l'explique."
    ariaLabel="Deux essais sont comparés : même segment de restaurants du quartier, même canal Instagram, même moment après le service. Seul le message change, d'un long pitch à une question sur les réservations."
    accent={EM}
    beforeTitle="Essai 1"
    afterTitle="Essai 2"
    rows={[
      { before: "Restaurants du quartier", after: "Restaurants du quartier" },
      { before: "Message Instagram", after: "Message Instagram" },
      { before: "Mardi, après le service", after: "Mardi, après le service" },
      { before: "Long pitch sur la solution", after: "Une question sur les réservations" },
    ]}
  />;
}

export const b5_s2_VISUALS = [
  { name: "AnatomieOffreClaire", kind: "schema", chapter: "b5-s2", component: AnatomieOffreClaireDiagram },
  { name: "MessageQuiOuvre", kind: "schema", chapter: "b5-s2", component: MessageQuiOuvreDiagram },
  { name: "PrixCommePerimetre", kind: "schema", chapter: "b5-s2", component: PrixCommePerimetreDiagram },
  { name: "ObjectionQuestion", kind: "schema", chapter: "b5-s2", component: ObjectionQuestionDiagram },
  { name: "UneVariableALaFois", kind: "schema", chapter: "b5-s2", component: UneVariableALaFoisDiagram },
] as const satisfies readonly HandcraftedVisual[];
