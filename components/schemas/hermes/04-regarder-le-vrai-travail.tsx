import { Fork, Steps } from "../kit";

const EM = "#22d96e";

export function DiagnosticDiagram() {
  return <Steps
    title="Trouve la cause avant l'outil"
    description="Tu rejoues un dossier récent pour voir où il s'arrête, puis tu choisis l'aide la plus petite."
    legend="L'outil vient après la cause, sinon il cache le problème."
    ariaLabel="Quatre étapes : ouvrir le dernier dossier, remettre les messages et fichiers dans l'ordre, trouver le premier arrêt, puis choisir la plus petite aide. La dernière étape est mise en avant."
    accent={EM}
    items={[
      { label: "Dernier dossier", detail: "Messages, formulaire, devis" },
      { label: "Dans l'ordre", detail: "Qui a attendu, et quoi" },
      { label: "Premier arrêt", detail: "Là où le travail bloque" },
      { label: "Plus petite aide", detail: "Un champ, une règle, un agent" },
    ]}
    accentIndex={3}
  />;
}

export function FilmDuDernierDevisDiagram() {
  return <Steps
    title="Rejoue le dernier devis"
    description="Exemple d'un plaquiste : deux photos arrivent, la hauteur manque, et le dossier attend trois jours."
    legend="Le vrai blocage est la pièce manquante, pas la rédaction du devis."
    ariaLabel="Cinq images du dernier devis d'un plaquiste : la demande arrive sur WhatsApp, deux photos suivent, la hauteur de plafond manque, le dossier attend trois jours, puis la question part par Gmail. La hauteur manquante est mise en avant."
    accent={EM}
    items={[
      { label: "Demande", detail: "Le prospect écrit", tools: ["WhatsApp"] },
      { label: "Deux photos", detail: "Les pièces arrivent" },
      { label: "Sans hauteur", detail: "Aucune mesure du plafond" },
      { label: "Trois jours", detail: "Le dossier attend" },
      { label: "Question", detail: "La mesure est redemandée", tools: ["Gmail"] },
    ]}
    accentIndex={2}
  />;
}

export function SymptomeTroisCausesDiagram() {
  return <Fork
    title="Un symptôme, plusieurs causes"
    description="La même réponse lente peut venir d'une pièce absente ou d'un prix que personne ne valide."
    legend="Chaque cause demande sa propre réponse, jamais le même outil."
    ariaLabel="Une réponse lente a deux causes possibles. Une pièce absente se règle en la demandant plus tôt. Un prix bloqué se règle avec une règle et un responsable. Mieux rédiger est écarté car cela ne règle aucune des deux."
    accent={EM}
    situation="Réponse lente"
    outcomes={[
      { label: "Pièce absente", condition: "Demande-la dès le début" },
      { label: "Prix bloqué", condition: "Une règle et un responsable" },
      { label: "Mieux rédiger", condition: "Ne règle aucune des deux", rejected: true },
    ]}
  />;
}
