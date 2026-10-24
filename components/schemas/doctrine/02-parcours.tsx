import { FileCard, Ladder, Steps } from "../kit";
import type { HandcraftedVisual } from "../coffre/types";

const EM = "#22d96e";

function HuitQuestionsEnRelaisDiagram() {
  return <Steps
    title="Huit questions tiennent le travail"
    description="Exemple : un devis de rénovation. Les quatre premières ouvrent le dossier, les quatre suivantes le ferment."
    legend="Écris « inconnu » quand tu ne sais pas : le trou devient visible."
    ariaLabel="Huit questions posées à un devis de rénovation. Problème : les devis partent en retard. Résultat : un devis signé reçu. Découpage : chiffrer, rédiger, valider. Informations : métré, tarifs, photos. Circulation : de Gmail au CRM, puis à toi. Clés : lire le CRM, sans envoyer. Preuve, mise en avant : le devis relu par toi. Apprentissage : la remise devient une règle écrite."
    accent={EM}
    accentIndex={6}
    items={[
      { label: "Problème", detail: "Les devis partent en retard" },
      { label: "Résultat", detail: "Un devis signé reçu" },
      { label: "Découpage", detail: "Chiffrer, rédiger, valider" },
      { label: "Informations", detail: "Métré, tarifs, photos" },
      { label: "Circulation", detail: "Gmail, CRM, puis toi" },
      { label: "Clés", detail: "Lire le CRM, sans envoyer" },
      { label: "Preuve", detail: "Le devis relu par toi" },
      { label: "Apprentissage", detail: "La remise devient une règle" },
    ]}
  />;
}

function QuatreNiveauxDeMethodeDiagram() {
  return <Ladder
    title="Du principe au choix"
    description="Exemple sur les devis : chaque niveau devient plus précis, de la règle qui tranche au skill qui choisit."
    legend="Retrouver une recette ne donne jamais la permission d'agir."
    ariaLabel="Une échelle de quatre marches sur les devis. Doctrine : aucun prix sans accord, elle aide à trancher. Méthode : chiffrer un chantier. SOP : les étapes fixes du devis type. Skill, mis en avant : il choisit la route selon le chantier."
    accent={EM}
    accentIndex={3}
    lowLabel="Général"
    highLabel="Précis"
    rungs={[
      { label: "Doctrine", detail: "« Aucun prix sans accord »" },
      { label: "Méthode", detail: "Chiffrer un chantier" },
      { label: "SOP", detail: "Les étapes fixes du devis type" },
      { label: "Skill", detail: "Choisit la route selon le chantier" },
    ]}
  />;
}

function DossierDeMissionDiagram() {
  return <FileCard
    title="Le petit dossier utile"
    description="Exemple : la mission emporte l'objectif, les limites, les faits, les sources et la preuve de fin."
    legend="Pas d'archives entières : seulement ce qui sert à cette mission."
    ariaLabel="Un fichier mission.md pour préparer la relance d'un devis : objectif, un brouillon non envoyé ; limites, rien envoyé et prix inchangés ; fait, devis sans réponse depuis dix jours ; sources permises, CRM et fil d'e-mails ; inconnu, budget du client ; preuve de fin, brouillon relu avec source citée."
    accent={EM}
    filename="mission.md"
    tool="Hermes Agent"
    lines={[
      { text: "# Préparer la relance d'un devis", tone: "heading" },
      { text: "Objectif : un brouillon, non envoyé" },
      { text: "Limites : rien envoyé, prix inchangés" },
      { text: "Fait : devis sans réponse, 10 jours" },
      { text: "Sources permises : CRM, fil Gmail" },
      { text: "Inconnu : budget du client", tone: "muted" },
      { text: "Preuve : brouillon relu, source citée" },
    ]}
    annotations={[
      { line: 4, label: "Un fait, avec sa source" },
      { line: 6, label: "L'inconnu reste écrit" },
      { line: 7, label: "Une fin vérifiable" },
    ]}
  />;
}

export const doctrine02 = [
  { name: "HuitQuestionsEnRelais", kind: "schema", chapter: "00-parcours.md", component: HuitQuestionsEnRelaisDiagram },
  { name: "QuatreNiveauxDeMethode", kind: "schema", chapter: "00-parcours.md", component: QuatreNiveauxDeMethodeDiagram },
  { name: "DossierDeMission", kind: "schema", chapter: "00-parcours.md", component: DossierDeMissionDiagram },
] as const satisfies readonly HandcraftedVisual[];
