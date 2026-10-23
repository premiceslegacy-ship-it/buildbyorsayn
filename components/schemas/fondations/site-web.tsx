import { Funnel, Ladder, Steps, WebPage, WebPageCompare } from "../kit";

const EM = "#22d96e";

export function LandingRateeLandingUtileMockup() {
  return <WebPageCompare
    title="Jolie ne veut pas dire claire"
    description="La seconde page guide la fleuriste jusqu'à une commande compréhensible."
    ariaLabel="Deux pages comparent une expérience florale vague à une commande de bouquet précise."
    accent={EM}
    beforeTitle="Page ratée"
    afterTitle="Page utile"
    before={{
      eyebrow: "Expérience florale",
      heading: "Sublimez chaque instant",
      subtitle: "Des créations uniques",
      button: "Découvrir",
      imageLabel: "Image abstraite",
      proofs: ["Commencer", "Trois cartes", "Faux compteur"],
    }}
    after={{
      nav: "Maison Lila",
      heading: "Ton bouquet prêt pour demain",
      subtitle: "Dis-nous l'occasion et le budget. Maison Lila te rappelle avant de composer.",
      button: "Commander un bouquet",
      imageLabel: "Composition en cours",
      proofs: ["Trois bouquets réels"],
      offer: "Rappel pendant les horaires d'ouverture",
      faq: "Comment ça se passe ?",
    }}
  />;
}

export function AnatomiePremierEcranMockup() {
  return <WebPage
    title="Quatre réponses dès le premier écran"
    description="Le regard comprend pour qui, quoi, comment et quel geste faire."
    ariaLabel="Une page de plaquiste répond à quatre questions autour du titre, du sous-titre et du bouton."
    accent={EM}
    page={{
      eyebrow: "Plaquiste à Lyon",
      heading: "Ton devis part avec les bonnes mesures",
      subtitle: "Envoie ton plan et trois photos. Karim te rappelle avant de chiffrer.",
      button: "Préparer ma demande",
      imageLabel: "Photo de chantier",
      proofs: ["Tes photos restent jointes au projet"],
    }}
    annotations={[
      { number: 1, target: "heading", label: "Pour qui ?" },
      { number: 2, target: "image", label: "Quel changement ?" },
      { number: 3, target: "subtitle", label: "Comment ?" },
      { number: 4, target: "button", label: "Quel geste ?" },
    ]}
  />;
}

export function TrajetDeDecisionDiagram() {
  return <Steps
    title="La page répond dans l'ordre"
    description="Chaque section prépare la question qui arrive ensuite."
    ariaLabel="Le trajet demande si c'est pour moi, ce qui change, comment, si je peux croire et quoi faire."
    accent={EM}
    accentIndex={4}
    items={[
      { label: "C'est pour moi ?", detail: "Je me reconnais" },
      { label: "Qu'est-ce qui change ?", detail: "Je vois le résultat" },
      { label: "Comment ?", detail: "Je suis le chemin" },
      { label: "Je peux croire ?", detail: "Je trouve la preuve" },
      { label: "Je fais quoi ?", detail: "J'avance" },
    ]}
  />;
}

export function SiteParTranchesDiagram() {
  return <Ladder
    title="Termine une tranche avant la suivante"
    description="Le premier écran devient complet, visible et testable."
    ariaLabel="Le premier écran s'ouvre, se teste, se corrige puis permet de continuer."
    accent={EM}
    lowLabel="Une tranche"
    highLabel="Page complète"
    accentIndex={3}
    rungs={[
      { label: "Premier écran", detail: "Figma, Claude Code, Codex" },
      { label: "Ouvrir", detail: "Voir le vrai rendu" },
      { label: "Tester", detail: "Essayer le geste" },
      { label: "Corriger", detail: "Valider la tranche" },
      { label: "Puis continuer", detail: "Construire la suivante" },
    ]}
  />;
}

export function SiteTrouveEtUtiliseDiagram() {
  return <Funnel
    title="Une visite doit aller quelque part"
    description="La mesure suit le trajet jusqu'à l'action utile."
    ariaLabel="Un entonnoir va de la recherche au client par la page, le bouton et le formulaire mis en avant."
    accent={EM}
    leakIndex={3}
    leakLabel="À mesurer"
    tool="PostHog"
    stages={[
      { label: "Recherche", value: 100, valueLabel: "", detail: "Search Console" },
      { label: "Page", value: 82, valueLabel: "" },
      { label: "Bouton", value: 58, valueLabel: "" },
      { label: "Formulaire", value: 39, valueLabel: "" },
      { label: "Client", value: 24, valueLabel: "" },
    ]}
  />;
}
