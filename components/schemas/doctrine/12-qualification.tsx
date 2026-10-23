import { Fork, WebPage, Workflow } from "../kit";
import type { HandcraftedVisual } from "../coffre/types";

const EM = "#22d96e";

export function TroisRoutesSelonLaClarteDiagram() {
  return <Fork
    title="La clarté choisit la route"
    description="La route dépend de ce que la personne comprend déjà de son besoin et de ton offre."
    legend="Un non-fit reste une bonne sortie si tu dis ce qui manque."
    ariaLabel="Selon ce que la personne comprend déjà, quatre routes : parler si besoin et offre sont clairs, montrer si le fonctionnement reste flou, diagnostiquer si le besoin est dur à nommer, ou une sortie utile qui dit quoi préparer."
    accent={EM}
    situation="Que comprend-elle déjà ?"
    outcomes={[
      { label: "Parler", condition: "Besoin et offre sont clairs" },
      { label: "Montrer", condition: "Fonctionnement flou" },
      { label: "Diagnostiquer", condition: "Le besoin est dur à nommer" },
      { label: "Sortie utile", condition: "Dire ce qu'il faut préparer" },
    ]}
  />;
}

export function FormulaireQuiRendQuelqueChoseMockup() {
  return <WebPage
    title="Un formulaire qui rend une carte"
    description="Trois questions qui changent la suite, puis une restitution que la personne garde."
    legend="Si une question ne change aucune décision, retire-la."
    ariaLabel="Une page de diagnostic pose trois questions, dernier cas, ce qui bloque et qui décide, puis le bouton Voir ma carte rend une scène observée, un point de perte et une prochaine décision."
    accent={EM}
    page={{
      url: "tonsite.fr/diagnostic",
      nav: "Atelier devis",
      eyebrow: "Diagnostic en trois questions",
      heading: "Où ton dernier devis a-t-il bloqué ?",
      subtitle: "Dernier cas, ce qui bloque, qui décide. Rien d'autre.",
      button: "Voir ma carte",
      fields: [{ label: "Dernier cas", value: "Le devis de la salle de bains" }, { label: "Ce qui bloque", value: "Le client attend le prix" }, { label: "Qui décide", value: "Mon associé", kind: "select" }],
      offer: "Tu repars avec une scène observée, un point de perte et une prochaine décision.",
    }}
    annotations={[
      { number: 1, target: "heading", label: "Part du dernier cas réel", why: "Une question sur le dernier cas appelle une réponse vraie, pas une réponse polie.", alt: "Une question sur le pire cas." },
      { number: 2, target: "button", label: "La personne repart avec quelque chose", why: "Le bouton annonce ce qu'on reçoit (une carte), pas ce qu'on donne (ses données).", alt: "Le résultat montré sur la même page." },
      { number: 3, target: "offer", label: "Ce que la carte rend tout de suite", why: "Trois éléments nommés : le visiteur sait qu'il ne donne pas ses réponses pour rien.", alt: "Une carte d'exemple, floutée, sous le formulaire." },
    ]}
  />;
}

export function MemePromesseJusquaLaValeurDiagram() {
  return <Workflow
    title="La même histoire jusqu'à la valeur"
    description="Du post à la livraison, chaque étape parle du même dossier de devis."
    legend="Si la promesse change après le clic, c'est là que tu perds la personne."
    ariaLabel="Le même dossier de devis traverse le post Instagram, la page, l'appel dans Google Agenda, la proposition par Gmail et la livraison, en gardant la même scène, la même preuve et la même limite."
    accent={EM}
    actors={["Toi"]}
    accentIndex={4}
    steps={[
      { actor: 0, label: "Post", tool: "Instagram" },
      { actor: 0, label: "Page", transfer: "scène" },
      { actor: 0, label: "Appel", tool: "Google Agenda", transfer: "preuve" },
      { actor: 0, label: "Proposition", tool: "Gmail", transfer: "limite" },
      { actor: 0, label: "Livraison", transfer: "le dossier" },
    ]}
  />;
}

export const doctrine12 = [
  { name: "TroisRoutesSelonLaClarte", kind: "schema", chapter: "10-qualification-experimentation-premiere-valeur.md", component: TroisRoutesSelonLaClarteDiagram },
  { name: "FormulaireQuiRendQuelqueChose", kind: "maquette", chapter: "10-qualification-experimentation-premiere-valeur.md", component: FormulaireQuiRendQuelqueChoseMockup },
  { name: "MemePromesseJusquaLaValeur", kind: "schema", chapter: "10-qualification-experimentation-premiere-valeur.md", component: MemePromesseJusquaLaValeurDiagram },
] as const satisfies readonly HandcraftedVisual[];
