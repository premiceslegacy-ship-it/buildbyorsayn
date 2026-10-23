import { BigNumber, Ladder, Workflow } from "../kit";
import type { HandcraftedVisual } from "../coffre/types";

const EM = "#22d96e";

export function RadiographieDuDernierCasDiagram() {
  return <Workflow
    title="Rejouer le dernier cas"
    description="Exemple : un devis de rénovation rejoué pas à pas. La rédaction va vite, le dossier attend ailleurs."
    legend="Entoure un seul blocage observé, pas celui qu'on te raconte."
    ariaLabel="Le dernier devis rejoué dans l'ordre. Le client envoie sa demande par Gmail. Tu rédiges le devis en quinze minutes. L'associé doit valider une remise inhabituelle : le dossier attend ici, mis en avant. Puis tu envoies le devis par Gmail."
    accent={EM}
    accentIndex={2}
    actors={["Le client", "Toi", "L'associé"]}
    steps={[
      { actor: 0, label: "Demande", tool: "Gmail" },
      { actor: 1, label: "Rédaction", transfer: "la demande" },
      { actor: 2, label: "Valide la remise", transfer: "le devis", humanValidation: true },
      { actor: 1, label: "Envoi", transfer: "l'accord", tool: "Gmail" },
    ]}
  />;
}

export function EscalierDesReponsesDiagram() {
  return <Ladder
    title="La réponse la plus simple d'abord"
    description="Exemple : la remise qui bloque les devis. Chaque marche ajoute du coût, des erreurs et de l'entretien."
    legend="Arrête-toi à la première marche qui règle le blocage."
    ariaLabel="Un escalier de quatre marches face à la remise qui bloque les devis. Clarifier, mis en avant : écrire la règle de remise. Régler : un modèle de devis dans l'outil existant. Relier : envoyer la demande Gmail dans le CRM. Agent : adapter le devis à chaque chantier."
    accent={EM}
    accentIndex={0}
    lowLabel="Simple"
    highLabel="Coûteux"
    rungs={[
      { label: "Clarifier", detail: "Écrire la règle de remise" },
      { label: "Régler", detail: "Un modèle de devis dans l'outil" },
      { label: "Relier", detail: "La demande Gmail va au CRM" },
      { label: "Agent", detail: "Adapter le devis au chantier" },
    ]}
  />;
}

export function PhotoAvantApresDiagram() {
  return <BigNumber
    title="Une photo avant l'essai"
    description="Exemple : tu mesures l'attente d'un devis aujourd'hui, avant de changer quoi que ce soit."
    legend="Décide avant l'essai ce que la mesure peut changer."
    ariaLabel="Exemple. Avant, deux jours d'attente mesurés sur les derniers devis. Après, la même mesure reprise après l'essai, avec un objectif d'un jour fixé à l'avance. La comparaison décide : garder, réduire, élargir ou arrêter."
    accent={EM}
    before={{ value: "2 jours", label: "Attente mesurée d'un devis" }}
    after={{ value: "1 jour", label: "Objectif fixé avant l'essai" }}
    sentence="Même mesure avant et après, puis tu choisis : garder, réduire, élargir ou arrêter."
  />;
}

export const doctrine03 = [
  { name: "RadiographieDuDernierCas", kind: "schema", chapter: "01-diagnostic-et-offre.md", component: RadiographieDuDernierCasDiagram },
  { name: "EscalierDesReponses", kind: "schema", chapter: "01-diagnostic-et-offre.md", component: EscalierDesReponsesDiagram },
  { name: "PhotoAvantApres", kind: "schema", chapter: "01-diagnostic-et-offre.md", component: PhotoAvantApresDiagram },
] as const satisfies readonly HandcraftedVisual[];
