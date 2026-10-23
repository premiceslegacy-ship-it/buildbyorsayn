import { FileCard, Steps, WebPage, WebPageCompare } from "../kit";

const EM = "#22d96e";

export function LandingGeneriqueContreMarqueMockup() {
  return <WebPageCompare
    title="Le métier doit rester visible"
    description="La page utile montre une vraie scène et une action précise."
    ariaLabel="Deux pages comparent une promesse générique à une commande de bouquet concrète."
    accent={EM}
    beforeTitle="Interchangeable"
    afterTitle="Maison Lila"
    before={{
      eyebrow: "Innovation",
      heading: "Réinventez votre expérience",
      subtitle: "Des solutions innovantes pour vos besoins",
      button: "Commencer",
      proofs: ["Carte vide", "Faux chiffre"],
    }}
    after={{
      nav: "Maison Lila",
      heading: "Ton bouquet prêt demain matin",
      subtitle: "Choisis l'occasion. Maison Lila te rappelle avant la composition.",
      button: "Commander un bouquet",
      photo: "fleuriste",
      proofs: ["Métier visible", "Sans faux chiffre"],
    }}
  />;
}

export function ReferencesVersDirectionDiagram() {
  return <Steps
    title="Une référence, une décision"
    description="Chaque image épinglée t'apprend une seule chose : tu la nommes, puis tu l'écris dans ta direction."
    legend="Une référence par décision, plus une anti-référence pour tes refus."
    ariaLabel="Tu épingles des références sur Pinterest, tu en tires la lumière, la composition sur Figma, la matière et ce que tu refuses, puis tu écris ta direction visuelle."
    accent={EM}
    accentIndex={4}
    items={[
      { label: "Lumière", detail: "Une image de fenêtre, le matin", tools: ["Pinterest"] },
      { label: "Composition", detail: "Où l'œil entre dans la page", tools: ["Figma"] },
      { label: "Matière", detail: "Bois sombre, céramique mate" },
      { label: "À éviter", detail: "L'image que tu refuses" },
      { label: "Direction", detail: "Quatre décisions en une page" },
    ]}
  />;
}

export function BriefPhotoAnnoteMockup() {
  return <FileCard
    title="Le brief pointe vers l'image"
    description="Chaque ligne du brief désigne une zone visible de la photo."
    legend="Si une ligne ne se voit pas dans l'image, elle n'a rien à faire dans le brief."
    ariaLabel="Un brief de photo décrit une tasse noire mate : cadrage serré, lumière de fenêtre, matières nommées, zone réservée au titre, format du site et refus de logo."
    accent={EM}
    filename="brief-photo-tasse.md"
    tool="OpenAI + Gemini"
    lines={[
      { text: "# Tasse noire mate", tone: "heading" },
      { text: "Cadrage : plan serré, la tasse au centre" },
      { text: "Lumière : fenêtre à gauche, ombres douces" },
      { text: "Matières : céramique mate, bois sombre" },
      { text: "Zone de texte : en haut à gauche, pour le titre" },
      { text: "Format : celui du site, seize neuvièmes" },
      { text: "Refus : pas de logo, pas de texte dans l'image" },
    ]}
    annotations={[
      { line: 1, label: "Sujet reconnaissable" },
      { line: 2, label: "Cadrage choisi" },
      { line: 3, label: "Lumière cohérente" },
      { line: 4, label: "Matières nommées" },
      { line: 5, label: "Espace réservé au titre" },
      { line: 7, label: "Refus visibles" },
    ]}
  />;
}

export function DesignSystemOuvertMockup() {
  return <>
    <FileCard
      title="Les décisions restent ouvertes"
      description="Le fichier nomme les règles que l'interface applique."
      legend="Un rôle (« action principale ») vaut mieux qu'une couleur brute (« vert 500 »)."
      ariaLabel="Le fichier DESIGN-SYSTEM.md contient les couleurs, la typographie, les espacements, les formes, les états et le mobile."
      accent={EM}
      filename="DESIGN-SYSTEM.md"
      tool="Figma"
      lines={[
        { text: "# Couleurs", tone: "heading" },
        { text: "Typographie" },
        { text: "Espacements" },
        { text: "Formes" },
        { text: "États" },
        { text: "Mobile" },
      ]}
      annotations={[
        { line: 1, label: "Action, Texte, Surface" },
        { line: 5, label: "Erreur, Chargement" },
      ]}
    />
    <WebPage
      title="Les règles deviennent une interface"
      description="Chaque décision du fichier rejoint le composant qu'elle contrôle."
      legend="Ouvre le fichier avant de demander un écran : sans lui, chaque écran invente ses règles."
      ariaLabel="Une page de produit applique les règles : un titre lisible, un bouton d'action principale, et un écran qui montre le chargement, l'erreur et le succès."
      accent={EM}
      page={{
        nav: "Ton produit",
        heading: "Envoie tes devis en deux minutes",
        subtitle: "Choisis le client, vérifie le montant, envoie. Chaque étape te dit ce qui se passe.",
        button: "Envoyer le devis",
        screen: { title: "Envoi du devis", rows: [{ left: "Chargement", right: "en cours", state: "todo" }, { left: "Erreur", right: "montant manquant", state: "warn" }, { left: "Succès", right: "devis envoyé", state: "ok" }] },
      }}
      annotations={[
        { number: 1, target: "heading", label: "Typographie", why: "Le fichier fixe la taille et la police du titre : tous les écrans le reprennent.", alt: "Une seule police, deux graisses." },
        { number: 2, target: "button", label: "Couleur et forme", why: "L'action principale a un rôle, pas une couleur brute : elle change partout d'un seul coup.", alt: "Un bouton contour pour l'action secondaire." },
        { number: 3, target: "image", label: "États visibles", why: "Chargement, erreur et succès sont dessinés d'avance : rien n'est improvisé le jour de la panne.", alt: "Un état vide avec une phrase qui guide." },
      ]}
    />
  </>;
}

export function EcranDansTousSesEtatsMockup() {
  return <Steps
    title="Le même écran dans tous ses états"
    description="La qualité reste visible quand tout ne se passe pas bien."
    legend="Teste ces cinq états avant de dire que l'écran est fini."
    ariaLabel="Un formulaire passe par chargement, vide, erreur, succès et mobile, avec la correction mise en avant."
    accent={EM}
    accentIndex={2}
    items={[
      { label: "Chargement", detail: "Envoi en cours" },
      { label: "Vide", detail: "Commencer" },
      { label: "Erreur", detail: "Corriger l'adresse" },
      { label: "Succès", detail: "Demande reçue" },
      { label: "Mobile", detail: "Bouton entier" },
    ]}
  />;
}
