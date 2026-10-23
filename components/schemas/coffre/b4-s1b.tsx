import { FileCard, Fork, Ladder, Steps, WebPage } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function ResultatVersCompetencesDiagram() {
  return <Steps
    title="Du résultat jusqu'aux tâches"
    description="Exemple : un formulaire de devis, découpé du résultat accepté jusqu'au contrôle commun."
    legend="Pars toujours de la première carte : sans résultat clair, le reste n'a pas de but."
    ariaLabel="Cinq couches dans l'ordre. Le résultat : une demande complète sans donnée exposée. Les domaines : message, design, code et sécurité. Une compétence : organiser le formulaire mobile. Une tâche : ordonner les champs. Le contrôle : une demande valide arrive une fois."
    accent={EM}
    accentIndex={0}
    items={[
      { label: "Résultat", detail: "Une demande complète, sans fuite" },
      { label: "Domaines", detail: "Message, design, code, sécurité" },
      { label: "Compétence", detail: "Organiser le formulaire mobile" },
      { label: "Tâche", detail: "Ordonner les champs" },
      { label: "Contrôle", detail: "Une demande valide arrive une fois" },
    ]}
  />;
}

export function FormulaireQuatreMetiersMockup() {
  return <WebPage
    title="Un formulaire, quatre métiers"
    description="Cet écran de devis paraît simple, pourtant quatre décisions différentes s'y croisent."
    legend="Le contrôle commun vérifie la rencontre des quatre, pas chaque morceau séparé."
    ariaLabel="Une page de demande de devis. Le titre Décris ton besoin vient du copy. L'ordre des champs Besoin, Date souhaitée et Photos vient de l'UX. Le bouton Envoyer ma demande dépend du code. La phrase sur les coordonnées privées relève de la sécurité."
    accent={EM}
    page={{
      url: "tonsite.fr/devis",
      nav: "Demande de devis",
      heading: "Décris ton chantier, reçois un devis sous 48 h",
      subtitle: "Tes coordonnées restent privées",
      button: "Envoyer ma demande",
      fields: [{ label: "Besoin", value: "Cloison de 12 m²" }, { label: "Date souhaitée", value: "Mars", kind: "select" }, { label: "Photos du projet", kind: "file" }],
    }}
    annotations={[
      { number: 1, target: "heading", label: "Copy : les mots du libellé", why: "Le titre dit la tâche (décrire) et la suite (un devis sous 48 h) : on sait pourquoi on remplit.", alt: "Une question : De quoi as-tu besoin ?" },
      { number: 2, target: "image", label: "UX : l'ordre des champs", why: "Le besoin d'abord, puis la date, puis les photos : du plus simple au plus lourd.", alt: "Les photos en option, après l'envoi." },
      { number: 3, target: "button", label: "Code : l'envoi, une seule fois", why: "Le bouton se désactive après le clic, pour éviter deux demandes identiques.", alt: "Un écran de confirmation avec un numéro de demande." },
      { number: 4, target: "subtitle", label: "Sécurité : secrets hors du navigateur", why: "La phrase promet la confidentialité : les clés restent sur le serveur, jamais dans la page.", alt: "Un lien vers la politique de confidentialité." },
    ]}
  />;
}

export function FicheCompetenceAnnoteeMockup() {
  return <FileCard
    title="Une fiche par compétence"
    description="Exemple : la fiche de la compétence qui organise le formulaire de devis sur mobile."
    legend="Si une ligne reste vague, la compétence n'est pas encore prête à être confiée."
    ariaLabel="Une fiche de compétence intitulée Organiser le formulaire mobile. Elle reçoit les questions du devis, lit les demandes déjà reçues, décide de l'ordre des champs, évite un champ oublié, remet une demande complète, se vérifie par un test sur téléphone et a la gérante pour propriétaire."
    accent={EM}
    filename="competence-formulaire.md"
    lines={[
      { text: "# Organiser le formulaire mobile", tone: "heading" },
      { text: "Reçoit : les questions du devis" },
      { text: "Source : les demandes déjà reçues" },
      { text: "Décide : l'ordre des champs" },
      { text: "Évite : un champ oublié" },
      { text: "Remet : une demande complète" },
      { text: "Vérifie : un test sur téléphone" },
      { text: "Propriétaire : la gérante" },
    ]}
    annotations={[
      { line: 2, label: "Ce qu'elle reçoit" },
      { line: 4, label: "La décision prise" },
      { line: 6, label: "Ce qu'elle remet" },
      { line: 7, label: "Comment on vérifie" },
      { line: 8, label: "Qui confirme ou refuse" },
    ]}
  />;
}

export function QuandArreterDeDecouperDiagram() {
  return <Fork
    title="Quand arrêter de découper"
    description="Une tâche est prête quand une personne peut la recevoir sans deviner son but."
    legend="Tant qu'une entrée ou une sortie reste floue, découpe encore d'un cran."
    ariaLabel="Une question : cette tâche peut-elle voyager seule ? Si l'entrée reste « tout le contexte », il faut découper encore. Si la sortie reste « quelque chose de propre », il faut découper encore. Si l'entrée, la sortie, la source, le responsable et le contrôle sont nommés, la tâche est prête et on s'arrête."
    accent={EM}
    situation="Cette tâche peut-elle voyager seule ?"
    outcomes={[
      { label: "Entrée floue", condition: "« Tout le contexte » : découpe encore", rejected: true },
      { label: "Sortie floue", condition: "« Quelque chose de propre » : découpe encore", rejected: true },
      { label: "Tâche prête", condition: "Entrée, sortie, source, responsable et contrôle nommés", recommended: true },
    ]}
  />;
}

export function PratiqueSourcesRegleDiagram() {
  return <Ladder
    title="Une règle se gagne"
    description="Une idée devient règle en partant de tes projets, puis en résistant aux sources et aux cas contraires."
    legend="Ne saute pas de marche : une répétition propose une règle, un cas contraire la teste."
    ariaLabel="Une échelle de cinq marches, d'une impression à une règle testée : tes projets et ce que tu peux montrer, des sources sérieuses datées avec leurs désaccords, une répétition qui propose une règle, un cas contraire qui la met à l'épreuve, puis une règle écrite avec tes mots. Le cas contraire est mis en avant."
    accent={EM}
    lowLabel="Une impression"
    highLabel="Une règle testée"
    accentIndex={3}
    rungs={[
      { label: "Tes projets", detail: "Erreurs et résultats montrables" },
      { label: "Sources sérieuses", detail: "Datées, avec leurs désaccords" },
      { label: "Répétition", detail: "Propose une règle" },
      { label: "Cas contraire", detail: "Met la règle à l'épreuve" },
      { label: "Règle écrite", detail: "Avec tes propres mots" },
    ]}
  />;
}

export const b4_s1b_VISUALS = [
  { name: "ResultatVersCompetences", kind: "schema", chapter: "b4-s1b", component: ResultatVersCompetencesDiagram },
  { name: "FormulaireQuatreMetiers", kind: "maquette", chapter: "b4-s1b", component: FormulaireQuatreMetiersMockup },
  { name: "FicheCompetenceAnnotee", kind: "maquette", chapter: "b4-s1b", component: FicheCompetenceAnnoteeMockup },
  { name: "QuandArreterDeDecouper", kind: "schema", chapter: "b4-s1b", component: QuandArreterDeDecouperDiagram },
  { name: "PratiqueSourcesRegle", kind: "schema", chapter: "b4-s1b", component: PratiqueSourcesRegleDiagram },
] as const satisfies readonly HandcraftedVisual[];
