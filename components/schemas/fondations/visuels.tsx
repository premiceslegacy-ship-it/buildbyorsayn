import { FileCard, Steps, WebPage, WebPageCompare, Workflow } from "../kit";

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
      imageLabel: "Faux tableau de bord",
      proofs: ["Carte vide", "Faux chiffre"],
    }}
    after={{
      nav: "Maison Lila",
      heading: "Ton bouquet prêt pour demain",
      subtitle: "Choisis l'occasion. Maison Lila te rappelle avant la composition.",
      button: "Commander un bouquet",
      imageLabel: "Bouquets dans l'atelier",
      proofs: ["Métier visible", "Sans faux chiffre"],
    }}
  />;
}

export function ReferencesVersDirectionDiagram() {
  return <Workflow
    title="Une référence, une pièce"
    description="Chaque source apporte une décision, jamais une page à copier."
    ariaLabel="Pinterest et Figma aident à extraire la lumière, le cadre, la matière et ce qu'il faut éviter avant notre direction."
    accent={EM}
    actors={["Références", "Direction"]}
    accentIndex={4}
    steps={[
      { actor: 0, label: "Lumière", tool: "Pinterest" },
      { actor: 0, label: "Cadre", tool: "Figma" },
      { actor: 0, label: "Matière" },
      { actor: 0, label: "À éviter" },
      { actor: 1, label: "Notre direction", humanValidation: true },
    ]}
  />;
}

export function BriefPhotoAnnoteMockup() {
  return <WebPage
    title="Le brief pointe vers l'image"
    description="Chaque décision désigne une zone visible de la photo."
    ariaLabel="Une fausse interface annote une tasse noire mate, son cadrage, sa lumière, sa matière, sa zone de texte et l'absence de logo."
    accent={EM}
    page={{
      nav: "OpenAI + Gemini",
      eyebrow: "Sans logo",
      heading: "Tasse noire mate",
      subtitle: "Plan serré, lumière de fenêtre",
      button: "Bois sombre",
      imageLabel: "Texte ici",
      proofs: ["Format du site"],
      faq: "Sans logo",
    }}
    annotations={[
      { number: 1, target: "heading", label: "Sujet reconnaissable" },
      { number: 2, target: "image", label: "Espace réservé au H1" },
      { number: 3, target: "subtitle", label: "Lumière cohérente" },
      { number: 4, target: "button", label: "Matières nommées" },
      { number: 5, target: "proofs", label: "Format du site" },
      { number: 6, target: "faq", label: "Refus visibles" },
    ]}
  />;
}

export function DesignSystemOuvertMockup() {
  return <>
    <FileCard
      title="Les décisions restent ouvertes"
      description="Le fichier nomme les règles que l'interface applique."
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
      description="Chaque décision rejoint le composant qu'elle contrôle."
      ariaLabel="Une page applique les règles au texte, à la surface, au chargement, à l'erreur et au bouton action."
      accent={EM}
      page={{ heading: "Texte", subtitle: "Surface", button: "Action", imageLabel: "Chargement", proofs: ["Erreur"] }}
      annotations={[
        { number: 1, target: "button", label: "Couleur et forme" },
        { number: 2, target: "heading", label: "Typographie" },
        { number: 3, target: "proofs", label: "État visible" },
      ]}
    />
  </>;
}

export function EcranDansTousSesEtatsMockup() {
  return <Steps
    title="Le même écran dans tous ses états"
    description="La qualité reste visible quand tout ne se passe pas bien."
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
