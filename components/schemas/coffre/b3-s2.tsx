import { Compare, FileCard, Rings, Steps, WebPageCompare } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function TriangleDeDirectionDiagram() {
  return <Rings
    title="Trois décisions, une direction"
    description="Le message, la structure et le style se décident ensemble, autour d'une seule page."
    legend="Si une couche raconte une autre histoire, toute la page se contredit."
    ariaLabel="Ta page est au centre de trois couches : le message dit ce que la personne doit comprendre, la structure décide quand elle le comprend, le style lui fait sentir la bonne chose. Le message est mis en avant."
    accent={EM}
    core="Ta page"
    accentIndex={0}
    rings={[
      { label: "Message", detail: "Ce qu'elle doit comprendre" },
      { label: "Structure", detail: "Quand elle le comprend" },
      { label: "Style", detail: "Ce qu'elle ressent" },
    ]}
  />;
}

export function TitreInterchangeableOuPrecisDiagram() {
  return <Compare
    title="Vague ou précis"
    description="Le titre vague irait à cinq concurrents. Le précis nomme le projet, la zone et la manière."
    legend="Si un concurrent peut signer ton titre tel quel, réécris-le."
    ariaLabel="Deux titres pour une entreprise de rénovation. Vague : des rénovations de qualité, pour tous vos projets, une solution adaptée, contactez-nous. Précis : ta rénovation complète, à Grenoble, avec un seul interlocuteur, et un bouton décrire mon chantier."
    accent={EM}
    beforeTitle="Titre vague"
    afterTitle="Titre précis"
    rows={[
      { before: "Des rénovations de qualité", after: "Ta rénovation complète" },
      { before: "Pour tous vos projets", after: "À Grenoble" },
      { before: "Une solution adaptée", after: "Un seul interlocuteur" },
      { before: "Contactez-nous", after: "Décrire mon chantier" },
    ]}
  />;
}

export function QuestionsDansLaPageDiagram() {
  return <Steps
    title="La page suit les doutes"
    description="De haut en bas, chaque section répond au doute qui apparaît juste avant elle."
    legend="Écris la question au-dessus de chaque bloc : deux blocs pour la même, garde le meilleur."
    ariaLabel="Quatre doutes dans l'ordre de la page : est-ce pour moi, le titre nomme son cas ; est-ce crédible, un chantier réel le montre ; comment ça marche, le déroulé en étapes ; et maintenant, un bouton clair. Le dernier doute est mis en avant."
    accent={EM}
    accentIndex={3}
    items={[
      { label: "Pour moi ?", detail: "Le titre nomme son cas" },
      { label: "Crédible ?", detail: "Un chantier réel montré" },
      { label: "Comment ?", detail: "Le déroulé en étapes" },
      { label: "Et maintenant ?", detail: "Un seul bouton clair" },
    ]}
  />;
}

export function ReferenceDecoupeeDiagram() {
  return <FileCard
    title="Une référence, découpée"
    description="Exemple : une page aimée devient quatre choix visuels nommés, plus ce que tu refuses."
    legend="Tu prélèves des décisions visibles, tu ne copies jamais la page."
    ariaLabel="Une note de référence visuelle en six lignes : densité, beaucoup d'air ; contraste, texte sombre sur fond clair ; typographie, un seul caractère en deux tailles ; mouvement, presque aucun ; anti-référence, les carrousels qui bougent seuls."
    accent={EM}
    filename="reference.md"
    tool="Figma"
    lines={[
      { text: "# Référence : site d'un ébéniste", tone: "heading" },
      { text: "Densité : beaucoup d'air" },
      { text: "Contraste : sombre sur clair" },
      { text: "Typographie : un caractère, deux tailles" },
      { text: "Mouvement : presque aucun" },
      { text: "Refusé : carrousels automatiques", tone: "muted" },
    ]}
    annotations={[
      { line: 2, label: "Combien d'air autour du texte" },
      { line: 4, label: "Un choix que tu peux répéter" },
      { line: 6, label: "L'anti-référence dit ce que tu refuses" },
    ]}
  />;
}

export function TroisCalquesUnePageDiagram() {
  return <WebPageCompare
    title="Trois calques, une histoire"
    description="Exemple d'une architecte d'intérieur : message, sections et allure doivent mener au même geste."
    legend="Relis le titre, le formulaire et l'image comme une seule phrase."
    ariaLabel="Deux versions d'une page d'architecte d'intérieur. À gauche, trois histoires : le titre promet une estimation en deux minutes, la page demande quinze champs et l'image montre un salon de luxe. À droite, une seule histoire : planifier sa pièce avant d'acheter, une visite et un budget clair, un plan réel et un bouton préparer ma visite."
    accent={EM}
    beforeTitle="Trois histoires"
    afterTitle="Une seule histoire"
    before={{
      url: "interieur-lille.fr",
      nav: "Atelier intérieur",
      heading: "Ton estimation en deux minutes",
      subtitle: "Remplis les quinze champs du formulaire.",
      button: "Envoyer",
      imageLabel: "Salon de luxe",
    }}
    after={{
      url: "interieur-lille.fr",
      nav: "Atelier intérieur",
      heading: "Planifie ta pièce avant d'acheter",
      subtitle: "Une visite, un budget clair, un plan d'aménagement.",
      button: "Préparer ma visite",
      imageLabel: "Plan d'une pièce réelle",
      proofs: ["Plan", "Budget", "Matières"],
    }}
  />;
}

export const b3_s2_VISUALS = [
  { name: "TriangleDeDirection", kind: "schema", chapter: "b3-s2", component: TriangleDeDirectionDiagram },
  { name: "TitreInterchangeableOuPrecis", kind: "schema", chapter: "b3-s2", component: TitreInterchangeableOuPrecisDiagram },
  { name: "QuestionsDansLaPage", kind: "schema", chapter: "b3-s2", component: QuestionsDansLaPageDiagram },
  { name: "ReferenceDecoupee", kind: "schema", chapter: "b3-s2", component: ReferenceDecoupeeDiagram },
  { name: "TroisCalquesUnePage", kind: "maquette", chapter: "b3-s2", component: TroisCalquesUnePageDiagram },
] as const satisfies readonly HandcraftedVisual[];
