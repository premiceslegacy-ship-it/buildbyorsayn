import { AdCard, Ladder, WebPage } from "../kit";
import type { HandcraftedVisual } from "../coffre/types";

const EM = "#22d96e";

function SceneAvantSloganDiagram() {
  return <AdCard
    title="La scène avant le slogan"
    description="Le même message, d'abord en slogan vague, puis réécrit autour d'un moment et d'un progrès."
    legend="L'après montre un moment, un objet réel et un progrès visible."
    ariaLabel="Deux publications sur un réseau social. Avant : un slogan sur l'IA qui fait gagner du temps, un robot souriant en image, le bouton Réserver une démo. Après : quand un devis revient signé, on voit la pièce qui manque avant de lancer le chantier, avec la photo du devis et le bouton Voir un dossier bloqué."
    accent={EM}
    variant="social"
    beforeTitle="Le slogan"
    afterTitle="La scène"
    before={{
      account: "Bâti Dossiers",
      text: "Nous aidons les PME à gagner du temps grâce à l'IA, simplement, rapidement et sans effort.",
      image: "/schemas/ads/robot-souriant.jpg",
      visual: "Un robot souriant en 3D",
      overlay: "L'IA au service de votre croissance",
      headline: "Gagnez du temps avec l'IA",
      domain: "BATIDOSSIERS.FR",
      action: "Réserver une démo",
      pins: { text: 1, image: 2, headline: 3, action: 4 },
    }}
    after={{
      account: "Bâti Dossiers",
      text: "Quand un devis revient signé, vois tout de suite la pièce qui manque avant de lancer le chantier.",
      image: "/schemas/ads/devis-signe-surligne.jpg",
      visual: "Un devis signé avec une ligne surlignée",
      headline: "Repère la pièce qui manque avant le chantier",
      domain: "BATIDOSSIERS.FR",
      action: "Voir un dossier bloqué",
      pins: { text: 1, image: 2, headline: 3, action: 4 },
    }}
    beforeNotes={[
      { pin: 1, role: "Une promesse sans scène", why: "« Gagner du temps » ne dit ni qui, ni quand, ni quoi : n'importe quelle entreprise pourrait signer cette phrase.", alt: "Une scène datée : « Mardi, le devis est signé, la pièce manque »." },
      { pin: 2, role: "Une image décorative", why: "Un robot souriant ne prouve aucun travail et ressemble à mille autres annonces.", alt: "Une photo du vrai document ou du vrai chantier." },
      { pin: 3, role: "Un titre qui répète", why: "Il redit la promesse du texte sans rien ajouter de vérifiable.", alt: "Le bénéfice en clair : « Repère la pièce qui manque »." },
      { pin: 4, role: "Un bouton qui engage trop tôt", why: "« Réserver une démo » demande une décision avant d'avoir montré quoi que ce soit.", alt: "Un geste léger : « Voir un dossier bloqué »." },
    ]}
    afterNotes={[
      { pin: 1, role: "Une scène reconnue", why: "Un moment réel (le devis signé) et un progrès (voir la pièce) : le client s'y reconnaît.", alt: "La même scène racontée par un client, avec son prénom." },
      { pin: 2, role: "Un objet réel", why: "Un devis signé dont une ligne est surlignée : on voit la pièce qui manque, pas un symbole.", alt: "Une capture de l'écran qui la signale." },
      { pin: 3, role: "Le bénéfice en titre", why: "Le titre dit ce qu'on gagne, avant le chantier, en une ligne.", alt: "Un chiffre de ta démo, si tu en as un." },
      { pin: 4, role: "Un geste volontaire", why: "Voir un dossier engage moins que réserver : on demande un regard, pas une décision.", alt: "Un lien « Voir un exemple » sous le texte." },
    ]}
  />;
}

function EchelleDePromesseDiagram() {
  return <Ladder
    title="La promesse s'arrête à la preuve"
    description="Chaque promesse demande une preuve plus forte, du problème reconnu au résultat mesuré."
    legend="Ne transforme pas une démo en résultat général."
    ariaLabel="Une échelle de quatre marches. Problème : une friction que le client reconnaît. Mécanisme, mis en avant : une démo sur un dossier fictif le montre. Compétence : un livrable accepté le prouve. Résultat : un effet mesuré dans un contexte précis."
    accent={EM}
    accentIndex={1}
    lowLabel="Facile à prouver"
    highLabel="Exigeant"
    rungs={[
      { label: "Problème", detail: "Une friction que le client reconnaît" },
      { label: "Mécanisme", detail: "Une démo sur un dossier fictif" },
      { label: "Compétence", detail: "Un livrable accepté" },
      { label: "Résultat", detail: "Un effet mesuré, dans son contexte" },
    ]}
  />;
}

function PageQuiAideAChoisirDiagram() {
  return <WebPage
    title="Une page qui aide à choisir"
    description="Le premier écran porte une idée : la scène, le mécanisme, la preuve et un geste volontaire."
    legend="Retire toute urgence ou fonction que tu ne peux pas montrer."
    ariaLabel="Une page web annotée. Le titre repère la pièce qui manque avant le chantier. Le sous-titre montre le mécanisme : le dossier est préparé et chaque envoi est validé. Le bouton ouvre un dossier bloqué. L'écran montre le devis signé, la pièce manquante et le chantier bloqué."
    accent={EM}
    page={{
      url: "atelier-dupont.fr",
      nav: "Atelier Dupont",
      eyebrow: "Pour les artisans du bâtiment",
      heading: "Repère la pièce qui manque avant que le chantier s'arrête",
      subtitle: "Nous préparons le dossier, tu valides chaque envoi.",
      button: "Montre-moi un dossier bloqué",
      screen: { title: "Devis signé, pièce manquante", rows: [{ left: "Devis 2024-118", right: "signé", state: "ok" }, { left: "Attestation d'assurance", right: "manquante", state: "warn" }, { left: "Chantier", right: "bloqué", state: "warn" }] },
    }}
    annotations={[
      { number: 1, target: "heading", label: "Le titre ouvre la porte", why: "Il nomme une peur précise du métier, pas une fonction du produit.", alt: "Une scène datée : Mardi, le chantier s'arrête." },
      { number: 2, target: "subtitle", label: "Le sous-titre montre le mécanisme", why: "Qui prépare, qui valide : le fonctionnement tient en une phrase.", alt: "Trois étapes sous le bouton." },
      { number: 3, target: "button", label: "Un geste volontaire", why: "Le bouton demande de voir, pas d'acheter : l'engagement est minimal.", alt: "Un lien vers une démo de deux minutes." },
    ]}
  />;
}

export const doctrine11 = [
  { name: "SceneAvantSlogan", kind: "schema", chapter: "09-message-decision-preuve.md", component: SceneAvantSloganDiagram },
  { name: "EchelleDePromesse", kind: "schema", chapter: "09-message-decision-preuve.md", component: EchelleDePromesseDiagram },
  { name: "PageQuiAideAChoisir", kind: "maquette", chapter: "09-message-decision-preuve.md", component: PageQuiAideAChoisirDiagram },
] as const satisfies readonly HandcraftedVisual[];
