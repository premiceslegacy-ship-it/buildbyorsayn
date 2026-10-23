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
      { label: "Pour moi ?", detail: "Le titre nomme son cas" },
      { label: "Crédible ?", detail: "Un chantier réel montré" },
      { label: "Comment ?", detail: "Le déroulé en étapes" },
      { label: "Et maintenant ?", detail: "Un seul bouton clair" },
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
    }}
    after={{
      url: "interieur-lille.fr",
      nav: "Atelier intérieur",
      heading: "Ta pièce planifiée avant le premier achat",
      subtitle: "Une visite à Lille, un budget chiffré, un plan coté. Réponse sous 48 h.",
      button: "Préparer ma visite",
      photo: "piece",
      proofs: ["Plan", "Budget", "Matières"],
    }}
    beforeNotes={[
      { pin: 1, role: "Le titre promet deux minutes", why: "Il annonce une démarche rapide, sur laquelle la suite de la page ne tient pas.", alt: "Promettre ce que la page tient vraiment : une visite et un budget clair." },
      { pin: 2, role: "Le formulaire demande quinze champs", why: "La page contredit son titre : quinze champs ne se remplissent pas en deux minutes.", alt: "Trois champs, le reste à la visite." },
      { pin: 3, role: "Le bouton ne dit rien", why: "« Envoyer » ne dit pas ce qui se passe ensuite.", alt: "Un verbe précis : Préparer ma visite." },
      { pin: 4, role: "Un second bouton à égalité", why: "Deux gestes pour une seule demande : le regard hésite.", alt: "Un seul bouton, le reste en simple lien." },
      { pin: 5, role: "Une image de salon de luxe", why: "Elle raconte une troisième histoire : le haut de gamme, loin de la demande d'estimation.", alt: "Le plan d'une vraie pièce, avec ses cotes." },
    ]}
    afterNotes={[
      { pin: 1, role: "Un titre, une promesse", why: "Planifier avant d'acheter : la page entière sert cette seule idée.", alt: "Un chiffre : économies faites sur un premier projet." },
      { pin: 2, role: "Un sous-titre qui montre le trajet", why: "Une visite, un budget clair, un plan : trois livrables, dans l'ordre.", alt: "Trois pastilles sous le titre." },
      { pin: 3, role: "Un bouton qui annonce la suite", why: "Préparer ma visite : le verbe dit ce qui se passe au clic.", alt: "Un numéro de téléphone en simple lien." },
      { pin: 4, role: "Un plan à la place du décor", why: "Un plan de pièce réelle tient la même histoire que le titre et le bouton.", alt: "Une photo avant et après du même projet." },
    ]}
  />;
}

export const b3_s2_VISUALS = [
  { name: "TriangleDeDirection", kind: "schema", chapter: "b3-s2", component: TriangleDeDirectionDiagram },
  { name: "TitreInterchangeableOuPrecis", kind: "schema", chapter: "b3-s2", component: TitreInterchangeableOuPrecisDiagram },
  { name: "QuestionsDansLaPage", kind: "schema", chapter: "b3-s2", component: QuestionsDansLaPageDiagram },
  { name: "ReferenceDecoupee", kind: "schema", chapter: "b3-s2", component: ReferenceDecoupeeDiagram },
  { name: "TroisCalquesUnePage", kind: "maquette", chapter: "b3-s2", component: TroisCalquesUnePageDiagram },
] as const satisfies readonly HandcraftedVisual[];
