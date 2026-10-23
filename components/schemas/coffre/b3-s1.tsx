import { Curves, Ladder, Steps, WebPage, Workflow } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function CodeTropTotDiagram() {
  return <Curves
    title="Plus tard, plus cher"
    description="Exemple illustratif : ce que coûte une même question oubliée, selon le moment où tu la découvres."
    legend="Une inconnue écrite se résout, une inconnue cachée finit dans le produit."
    ariaLabel="Deux courbes illustratives sur quatre moments, du brief à la mise en ligne. Quand l'inconnue est cachée, le coût de correction grimpe à chaque étape. Quand elle est écrite dans le brief, il reste presque plat."
    accent={EM}
    labels={["Brief", "Maquette", "Code", "En ligne"]}
    series={[
      { name: "Inconnue cachée", values: [1, 2, 4, 7] },
      { name: "Inconnue écrite", values: [1, 1.2, 1.3, 1.4], accent: true },
    ]}
    annotations={[
      { series: 0, point: 2, label: "Formulaire à refaire" },
      { series: 1, point: 1, label: "Réglée dans le brief" },
    ]}
  />;
}

export function BriefQuatreReponsesDiagram() {
  return <Steps
    title="Le brief en quatre réponses"
    description="Exemple d'un artisan en rénovation : quatre réponses écrites avant toute décision technique."
    legend="S'il manque une réponse, écris « inconnu » au lieu de laisser l'IA choisir."
    ariaLabel="Quatre réponses forment le brief d'un artisan en rénovation : qui, des propriétaires autour de Grenoble ; la scène, une rénovation complète à lancer ; le geste, décrire son chantier ; la preuve, des photos avant et après. Le geste est mis en avant."
    accent={EM}
    accentIndex={2}
    items={[
      { label: "Qui", detail: "Des propriétaires près de Grenoble" },
      { label: "Scène", detail: "Une rénovation complète à lancer" },
      { label: "Geste", detail: "Décrire son chantier" },
      { label: "Preuve", detail: "Photos avant et après" },
    ]}
  />;
}

export function RouteDuSiteDiagram() {
  return <Workflow
    title="La route complète du site"
    description="Six étapes dans l'ordre : chacune livre à la suivante une décision écrite."
    legend="Le code arrive à l'avant-dernière étape, quand les choix chers sont faits."
    ariaLabel="La route d'un site en six étapes : cadrer le besoin, choisir le message à partir du brief, dessiner la page à partir du titre, fixer le style sur la maquette, préparer la technique selon la direction, puis vérifier selon le plan. La technique est mise en avant."
    accent={EM}
    actors={[]}
    accentIndex={4}
    steps={[
      { actor: 0, label: "Cadrer le besoin" },
      { actor: 0, label: "Choisir le message", transfer: "brief" },
      { actor: 0, label: "Dessiner la page", transfer: "titre" },
      { actor: 0, label: "Fixer le style", transfer: "maquette" },
      { actor: 0, label: "Préparer la technique", transfer: "direction" },
      { actor: 0, label: "Vérifier", transfer: "plan" },
    ]}
  />;
}

export function PageRenovationAnnoteeDiagram() {
  return <WebPage
    title="La page avant le framework"
    description="Exemple d'une entreprise de rénovation : chaque bloc répond à une question avant de demander le contact."
    legend="L'artisan corrige cette maquette avant qu'une seule ligne de code existe."
    ariaLabel="Maquette annotée d'une page de rénovation à Grenoble. Le titre nomme la zone et le type de chantier, l'image montre des réalisations autorisées, le déroulé explique la suite, et le bouton ouvre un formulaire court qui prépare le rappel."
    accent={EM}
    page={{
      url: "renovation-grenoble.fr",
      nav: "Rénovation Grenoble",
      eyebrow: "Grenoble et alentours",
      heading: "Rénove à Grenoble sans chercher cinq artisans",
      subtitle: "Un seul interlocuteur du devis à la réception, avec un devis détaillé sous 5 jours.",
      button: "Décrire mon chantier",
      photo: "piece",
      proofs: ["Cuisine", "Salle de bain", "Maison entière"],
      offer: "Devis détaillé sous 5 jours, avant tout engagement",
    }}
    annotations={[
      { number: 1, target: "heading", label: "La zone et le type de chantier", why: "On voit tout de suite si la page parle de soi : la zone et le chantier sont dans le titre.", alt: "Le délai moyen d'un chantier." },
      { number: 2, target: "image", label: "Des réalisations autorisées", why: "Des photos de chantiers que les clients ont acceptées : la preuve se voit avant toute parole.", alt: "Un curseur avant et après." },
      { number: 3, target: "offer", label: "La précision avant le clic", why: "Le délai et l'absence d'engagement répondent à « et ensuite ? » avant que la question ne bloque le clic.", alt: "Une frise du déroulé en quatre étapes." },
      { number: 4, target: "button", label: "Un formulaire court, utile au rappel", why: "Juste de quoi te rappeler et préparer le rendez-vous : le reste vient à l'appel.", alt: "Un numéro de téléphone pour ceux qui préfèrent appeler." },
    ]}
  />;
}

export function FeuVertAvantCodeDiagram() {
  return <Ladder
    title="Quatre voyants avant le code"
    description="Le code démarre quand ces quatre décisions sont assez claires pour construire."
    legend="Un voyant rouge ne bloque pas tout : va chercher la réponse, puis reviens."
    ariaLabel="Quatre voyants à allumer avant de coder : un public précis, une action principale nette, une preuve qui existe, des données demandées pour une raison. Le dernier voyant, les données, donne le feu vert."
    accent={EM}
    lowLabel="Idée"
    highLabel="Feu vert"
    accentIndex={3}
    rungs={[
      { label: "Public", detail: "Une personne précise" },
      { label: "Action", detail: "Un geste principal net" },
      { label: "Preuve", detail: "Elle existe déjà" },
      { label: "Données", detail: "Chaque champ a une raison" },
    ]}
  />;
}

export const b3_s1_VISUALS = [
  { name: "CodeTropTot", kind: "schema", chapter: "b3-s1", component: CodeTropTotDiagram },
  { name: "BriefQuatreReponses", kind: "schema", chapter: "b3-s1", component: BriefQuatreReponsesDiagram },
  { name: "RouteDuSite", kind: "schema", chapter: "b3-s1", component: RouteDuSiteDiagram },
  { name: "PageRenovationAnnotee", kind: "maquette", chapter: "b3-s1", component: PageRenovationAnnoteeDiagram },
  { name: "FeuVertAvantCode", kind: "schema", chapter: "b3-s1", component: FeuVertAvantCodeDiagram },
] as const satisfies readonly HandcraftedVisual[];
