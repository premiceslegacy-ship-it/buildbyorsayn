import { Fork, Steps } from "../kit";

export function DiagnosticDiagram() {
  return <Steps title="Du travail réel à la plus petite aide" description="Tu retrouves la cause avant de choisir ce que l'agent doit faire." ariaLabel="Trois étapes relient Travail réel, Cause et Plus petite aide." items={[
    { label: "Travail réel", detail: "Observe le dernier dossier" },
    { label: "Cause", detail: "Trouve ce qui bloque" },
    { label: "Plus petite aide", detail: "Aide seulement ici" },
  ]} accentIndex={2} />;
}

export function FilmDuDernierDevisDiagram() {
  return <Steps title="Rejoue le dernier devis" description="Le film du dossier fait apparaître l'attente invisible." ariaLabel="Cinq images montrent Demande, Photos, Mesure absente, Question et Devis. Mesure absente est mise en avant." items={[
    { label: "Demande", detail: "Le besoin arrive", tools: ["WhatsApp"] },
    { label: "Photos", detail: "Les pièces suivent" },
    { label: "Mesure absente", detail: "Le trajet bloque" },
    { label: "Question", detail: "Le manque remonte", tools: ["Gmail"] },
    { label: "Devis", detail: "Le dossier repart" },
  ]} accentIndex={2} />;
}

export function SymptomeTroisCausesDiagram() {
  return <Fork title="Un voyant, trois causes" description="La même lenteur peut venir de trois problèmes différents." ariaLabel="Réponse lente se divise vers Pièce, Règle et Responsable. Les trois causes sont mises en avant." situation="Réponse lente" outcomes={[
    { label: "Pièce", condition: "Une information manque", recommended: true },
    { label: "Règle", condition: "Le choix reste flou", recommended: true },
    { label: "Responsable", condition: "Personne ne décide", recommended: true },
  ]} />;
}
