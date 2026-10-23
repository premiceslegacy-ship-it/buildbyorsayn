import { AdCard, Ladder, WebPage } from "../kit";
import type { HandcraftedVisual } from "../coffre/types";

const EM = "#22d96e";

export function SceneAvantSloganDiagram() {
  return <AdCard
    title="La scène avant le slogan"
    description="Le même message, d'abord en slogan vague, puis réécrit autour d'un moment et d'un progrès."
    legend="L'après montre un moment, un objet et un progrès visible."
    ariaLabel="Deux publications. Avant : « Nous aidons les PME à gagner du temps grâce à l'IA, simplement, rapidement et sans effort », bouton Réserver une démo. Après : « Quand un devis revient signé, vois tout de suite la pièce qui manque avant de lancer le chantier », bouton Montre-moi un dossier bloqué."
    accent={EM}
    variant="social"
    beforeTitle="Le slogan"
    afterTitle="La scène"
    before={{ account: "Ton entreprise", text: "Nous aidons les PME à gagner du temps grâce à l'IA, simplement, rapidement et sans effort.", visual: "Un robot souriant", action: "Réserver une démo" }}
    after={{ account: "Ton entreprise", text: "Quand un devis revient signé, vois tout de suite la pièce qui manque avant de lancer le chantier.", visual: "Un devis signé, une pièce surlignée", action: "Montre un dossier bloqué" }}
  />;
}

export function EchelleDePromesseDiagram() {
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

export function PageQuiAideAChoisirDiagram() {
  return <WebPage
    title="Une page qui aide à choisir"
    description="Le premier écran porte une idée : la scène, le mécanisme, la preuve et un geste volontaire."
    legend="Retire toute urgence ou fonction que tu ne peux pas montrer."
    ariaLabel="Une page web annotée. Titre : repère la pièce qui manque avant le chantier, il ouvre la porte. Sous-titre : nous préparons le dossier, tu valides chaque envoi, il montre le mécanisme. Bouton : montre-moi un dossier bloqué, un geste volontaire. Preuves : démo sur un dossier fictif, aucun envoi sans toi, elles réduisent le doute."
    accent={EM}
    page={{
      url: "tonsite.fr",
      nav: "Ton entreprise",
      eyebrow: "Pour les artisans du bâtiment",
      heading: "Repère la pièce qui manque avant que le chantier s'arrête",
      subtitle: "Nous préparons le dossier, tu valides chaque envoi.",
      button: "Montre-moi un dossier bloqué",
      screen: { title: "Devis signé, pièce manquante", rows: [{ left: "Devis 2024-118", right: "signé", state: "ok" }, { left: "Attestation d'assurance", right: "manquante", state: "warn" }, { left: "Chantier", right: "bloqué", state: "warn" }] },
      proofs: ["Démo sur un dossier fictif", "Aucun envoi sans toi"],
    }}
    annotations={[
      { number: 1, target: "heading", label: "Le titre ouvre la porte", why: "Il nomme une peur précise du métier, pas une fonction du produit.", alt: "Une scène datée : Mardi, le chantier s'arrête." },
      { number: 2, target: "subtitle", label: "Le sous-titre montre le mécanisme", why: "Qui prépare, qui valide : le fonctionnement tient en une phrase.", alt: "Trois étapes sous le bouton." },
      { number: 3, target: "button", label: "Un geste volontaire", why: "Le bouton demande de voir, pas d'acheter : l'engagement est minimal.", alt: "Un lien vers une démo de deux minutes." },
      { number: 4, target: "proofs", label: "La preuve réduit le doute", why: "Deux phrases honnêtes : c'est une démo, et rien ne part sans toi.", alt: "L'avis d'un vrai artisan." },
    ]}
  />;
}

export const doctrine11 = [
  { name: "SceneAvantSlogan", kind: "schema", chapter: "09-message-decision-preuve.md", component: SceneAvantSloganDiagram },
  { name: "EchelleDePromesse", kind: "schema", chapter: "09-message-decision-preuve.md", component: EchelleDePromesseDiagram },
  { name: "PageQuiAideAChoisir", kind: "maquette", chapter: "09-message-decision-preuve.md", component: PageQuiAideAChoisirDiagram },
] as const satisfies readonly HandcraftedVisual[];
