import { AdCard, Rings, Steps, WebPage, Workflow } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function MemeVeriteTroisSurfacesDiagram() {
  return <Rings
    title="La même vérité partout"
    description="Le produit, la page et la conversation commerciale emploient les mêmes mots et gardent les mêmes limites."
    legend="Une contradiction attire peut-être un clic, puis déçoit au premier usage."
    ariaLabel="Trois cercles autour d'un même centre, la même promesse. Le produit, mis en avant, fait ce qui est promis aujourd'hui. La page reprend les mêmes mots. La conversation commerciale garde les mêmes limites."
    accent={EM}
    core="Même promesse"
    accentIndex={0}
    rings={[
      { label: "Produit", detail: "Ce qu'il fait aujourd'hui" },
      { label: "Page", detail: "Les mêmes mots" },
      { label: "Conversation", detail: "Les mêmes limites" },
    ]}
  />;
}

export function PromesseProduitPreuveDiagram() {
  return <Steps
    title="Trois lignes qui se répondent"
    description="Exemple : la page du tableau de demandes d'Amine, entreprise de nettoyage, alignée avant publication."
    legend="Si la preuve ne couvre pas la promesse, réduis la promesse."
    ariaLabel="Trois lignes à aligner. La promesse : regroupe tes demandes dans un seul tableau. Le produit : le formulaire remplit le tableau. La preuve, mise en avant : une capture de l'écran du tableau."
    accent={EM}
    accentIndex={2}
    items={[
      { label: "Promesse", detail: "Tes demandes dans un seul tableau" },
      { label: "Produit", detail: "Le formulaire remplit le tableau" },
      { label: "Preuve", detail: "La capture de l'écran réel" },
    ]}
  />;
}

export function AvantApresPromesseAssistantDiagram() {
  return <AdCard
    title="Montrer la validation humaine"
    description="La même annonce pour un assistant de relances, avant et après l'alignement sur le vrai produit."
    legend="L'après dit ce que le produit fait, validation comprise."
    ariaLabel="Deux publications pour un assistant de relances. Avant : l'assistant envoie toutes tes relances automatiquement, ce que le produit ne fait pas. Après : il prépare tes relances, puis tu valides chaque envoi, avec un visuel de brouillon à valider."
    accent={EM}
    variant="social"
    beforeTitle="Promesse fausse"
    afterTitle="Promesse tenue"
    before={{
      account: "Assistant relances",
      text: "L'assistant envoie toutes tes relances automatiquement.",
      visual: "Relances parties seules",
      action: "Essayer",
    }}
    after={{
      account: "Assistant relances",
      text: "Prépare tes relances, puis valide chaque envoi.",
      visual: "Brouillon à valider",
      action: "Voir un brouillon",
    }}
  />;
}

export function LandingProduitAnnoteeDiagram() {
  return <WebPage
    title="Une page qui guide vers l'action"
    description="Exemple : la page du tableau de demandes d'Amine, où chaque bloc répond à une question précise."
    legend="Un bloc qui ne fait avancer aucune décision peut partir."
    ariaLabel="Une page de produit annotée. Le titre dit pour qui et ce que le produit aide à faire. L'image montre l'écran principal du tableau. Les preuves répondent aux doutes. La question fréquente montre une limite : pas de planning des équipes. Le bouton Voir le tableau donne l'action suivante."
    accent={EM}
    page={{
      url: "tableau-demandes.fr",
      nav: "Demandes",
      eyebrow: "Pour les entreprises de nettoyage",
      heading: "Les demandes de tes clients de nettoyage, dans un seul tableau",
      subtitle: "Le formulaire remplit le tableau. Tu prépares la relance, puis tu la valides.",
      button: "Voir le tableau",
      screen: { title: "Tableau des demandes", rows: [{ left: "Mme Roux, bureaux", right: "devis à relancer", state: "warn" }, { left: "Copropriété Les Tilleuls", right: "visite jeudi", state: "ok" }, { left: "M. Lopez, vitres", right: "nouvelle demande", state: "todo" }] },
      proofs: ["Capture de l'écran réel", "Relance validée par toi"],
      faq: "Le tableau planifie-t-il mes équipes ?",
    }}
    annotations={[
      { number: 1, target: "heading", label: "Pour qui, et ce qu'il aide à faire", why: "Le titre nomme le métier et promet un seul endroit pour toutes les demandes.", alt: "Un chiffre : combien de demandes se perdent chaque mois." },
      { number: 2, target: "image", label: "La démonstration de l'écran", why: "L'écran réel montre le produit tel qu'il sera utilisé, avec de vraies lignes.", alt: "Une courte vidéo de l'écran." },
      { number: 3, target: "proofs", label: "Les preuves répondent aux doutes", why: "Chaque preuve répond à un doute : est-ce réel, et qui garde la main.", alt: "L'avis d'un vrai client." },
      { number: 4, target: "faq", label: "La limite, dite avant l'achat", why: "Dire que le tableau ne planifie pas les équipes évite une déception après l'achat.", alt: "La réponse ouverte directement sous la question." },
      { number: 5, target: "button", label: "L'action qui vient ensuite", why: "Un seul geste, placé après les preuves et la limite.", alt: "Un lien Voir un exemple à côté." },
    ]}
  />;
}

export function ParcoursDeVenteTesteDiagram() {
  return <Workflow
    title="Tester tout le chemin de vente"
    description="Le test suit la personne de l'arrivée jusqu'à la confirmation, puis vérifie la reprise après une erreur."
    legend="Les captures vérifient l'allure, les assertions le comportement : il faut les deux."
    ariaLabel="Un relais en cinq passages. Arrivée sur la page. Lecture de la première vue. Envoi du formulaire. Confirmation affichée après la réponse. Reprise après une erreur simulée, mise en avant."
    accent={EM}
    accentIndex={4}
    actors={[]}
    steps={[
      { actor: 0, label: "Arrivée" },
      { actor: 0, label: "Lecture", transfer: "première vue" },
      { actor: 0, label: "Envoi", transfer: "le formulaire" },
      { actor: 0, label: "Confirmation", transfer: "la réponse" },
      { actor: 0, label: "Reprise", transfer: "une erreur" },
    ]}
  />;
}

export const b6_s5_VISUALS = [
  { name: "MemeVeriteTroisSurfaces", kind: "schema", chapter: "b6-s5", component: MemeVeriteTroisSurfacesDiagram },
  { name: "PromesseProduitPreuve", kind: "schema", chapter: "b6-s5", component: PromesseProduitPreuveDiagram },
  { name: "AvantApresPromesseAssistant", kind: "schema", chapter: "b6-s5", component: AvantApresPromesseAssistantDiagram },
  { name: "LandingProduitAnnotee", kind: "maquette", chapter: "b6-s5", component: LandingProduitAnnoteeDiagram },
  { name: "ParcoursDeVenteTeste", kind: "schema", chapter: "b6-s5", component: ParcoursDeVenteTesteDiagram },
] as const satisfies readonly HandcraftedVisual[];
