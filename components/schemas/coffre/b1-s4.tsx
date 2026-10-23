import { Compare, FileCard, Fork, WebPage } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function PhraseDeLigneDiagram() {
  return <FileCard
    title="Une phrase en quatre pièces"
    description="Exemple : une phrase de ligne qui nomme le client, le résultat, le geste et ta réponse."
    legend="Ta phrase doit ouvrir une conversation, jamais fermer le diagnostic."
    ariaLabel="Une phrase de ligne d'exemple en quatre lignes : j'aide les cabinets de courtage, à boucler des dossiers complets, en améliorant la relance des pièces, grâce à une liste que la courtière valide. Chaque ligne est annotée : client, résultat, geste qui bloque, ta réponse."
    accent={EM}
    filename="ma-ligne.md"
    lines={[
      { text: "# Ma phrase de ligne", tone: "heading" },
      { text: "J'aide les cabinets de courtage" },
      { text: "à boucler des dossiers complets" },
      { text: "en améliorant la relance des pièces" },
      { text: "grâce à une liste que la courtière valide." },
    ]}
    annotations={[
      { line: 2, label: "Le client" },
      { line: 3, label: "Le résultat" },
      { line: 4, label: "Le geste qui bloque" },
      { line: 5, label: "Ta réponse" },
    ]}
  />;
}

export function EntretienDernierCasDiagram() {
  return <Compare
    title="Demande le dernier cas"
    description="Une demande d'avis t'apporte un compliment, une question sur le dernier cas t'ouvre des faits."
    legend="Observe les mots employés, ce que la personne ouvre et où elle hésite."
    ariaLabel="À gauche, demander son avis : on obtient un compliment poli, sans documents ni étapes. À droite, demander le dernier cas : la personne ouvre un vrai dossier, montre ses étapes et ses hésitations."
    accent={EM}
    beforeTitle="« Ton avis ? »"
    afterTitle="« Montre-moi le dernier cas »"
    rows={[
      { before: "« C'est sympa »", after: "Un vrai dossier ouvert" },
      { before: "Aucun document", after: "Les étapes réelles" },
      { before: "Aucune décision vue", after: "Là où elle hésite" },
    ]}
  />;
}

export function DemoEtroiteDiagram() {
  return <WebPage
    title="Une démo petite et honnête"
    description="Exemple avec des données fictives : la démo montre son travail, ses limites et ta reprise en main."
    legend="Une petite démo qui tient le cas principal t'apprend plus qu'une grande qui l'évite."
    ariaLabel="Une page de démonstration avec des données fictives : elle liste les pièces manquantes d'un dossier de courtage, dit qu'elle ne relance jamais seule, et attend un bouton Valider la relance."
    accent={EM}
    page={{
      url: "demo-courtage.local",
      nav: "Démo",
      eyebrow: "Données fictives",
      heading: "Deux pièces manquent",
      subtitle: "Pièce d'identité expirée, avis d'impôt absent.",
      button: "Valider la relance",
      screen: { title: "Dossier Martin", rows: [{ left: "Pièce d'identité", right: "expirée", state: "warn" }, { left: "Avis d'impôt", right: "absent", state: "warn" }, { left: "Bulletin de salaire", right: "reçu", state: "ok" }], footer: "Données fictives" },
      proofs: ["Ne relance jamais seule", "Tu relis avant l'envoi"],
    }}
    annotations={[
      { number: 1, target: "heading", label: "Son travail : la liste préparée", why: "La démo fait une seule chose et la montre en résultat, pas en promesse.", alt: "Une capture du vrai dossier, floutée." },
      { number: 2, target: "proofs", label: "Ses limites, dites clairement", why: "Dire ce qu'elle ne fait pas rassure plus que cacher les trous.", alt: "Une ligne de limites en bas de l'écran." },
      { number: 3, target: "button", label: "Ta reprise en main", why: "La reprise en main reste un clic humain : rien ne part sans ta validation.", alt: "Un second bouton Corriger à côté." },
    ]}
  />;
}

export function TroisDecisionsDiagram() {
  return <Fork
    title="Trois verdicts possibles"
    description="Après l'entretien, tu continues, tu modifies ou tu arrêtes, selon ce que le cas réel a montré."
    legend="Écris ton verdict avec les faits qui le soutiennent : sans cas réel, pas de verdict."
    ariaLabel="Après l'entretien, trois verdicts : continuer si la scène revient et reste contrôlable, modifier si la personne ou le geste est mal choisi, arrêter si le besoin est rare."
    accent={EM}
    situation="Après l'entretien"
    outcomes={[
      { label: "Continuer", condition: "La scène revient, tu la contrôles" },
      { label: "Modifier", condition: "Mauvaise personne ou mauvais geste" },
      { label: "Arrêter", condition: "Le besoin est rare", rejected: true },
    ]}
  />;
}

export const b1_s4_VISUALS = [
  { name: "PhraseDeLigne", kind: "schema", chapter: "b1-s4", component: PhraseDeLigneDiagram },
  { name: "EntretienDernierCas", kind: "schema", chapter: "b1-s4", component: EntretienDernierCasDiagram },
  { name: "DemoEtroite", kind: "schema", chapter: "b1-s4", component: DemoEtroiteDiagram },
  { name: "TroisDecisions", kind: "schema", chapter: "b1-s4", component: TroisDecisionsDiagram },
] as const satisfies readonly HandcraftedVisual[];
