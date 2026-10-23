import { FileCard, Steps } from "../kit";

const EM = "#22d96e";

export function TemplateTreeDiagram() {
  return <FileCard
    title="Le dossier du pilote"
    description="Quatre espaces séparent les règles, les skills testés, les missions et les essais."
    legend="Les secrets et les journaux sensibles restent dans leurs systèmes protégés."
    ariaLabel="Le dossier du pilote contient connaissance pour les règles et décisions, procedures pour les skills testés, projets pour les missions en cours et apprentissage pour les méthodes candidates."
    accent={EM}
    filename="pilote/"
    lines={[
      { text: "connaissance/     règles et décisions" },
      { text: "procedures/       skills testés" },
      { text: "projets/          missions en cours" },
      { text: "apprentissage/    méthodes candidates" },
    ]}
    annotations={[
      { line: 1, label: "Ce qui fait foi" },
      { line: 2, label: "Ce qui est prêt" },
      { line: 4, label: "Ce qui est encore testé" },
    ]}
  />;
}

export function ArborescencePiloteTerminalMockup() {
  return <FileCard
    title="L'arborescence réelle du pilote"
    description="Exemple : ce que tu vois dans le terminal quand tu ouvres le dossier."
    legend="Une personne qui arrive après toi doit s'y retrouver en dix minutes."
    ariaLabel="Un terminal Ghostty affiche le dossier pilote avec quatre sous-dossiers : connaissance, procedures, projets et apprentissage."
    accent={EM}
    filename="pilote/"
    tool="Ghostty"
    lines={[
      { text: "├── connaissance/       règles" },
      { text: "├── procedures/         skills testés" },
      { text: "├── projets/            missions" },
      { text: "└── apprentissage/      candidats" },
    ]}
    annotations={[
      { line: 1, label: "Ce qui fait foi" },
      { line: 2, label: "Ce qui est prêt" },
      { line: 4, label: "Ce qui est encore testé" },
    ]}
  />;
}

export function ContratMissionLisibleMockup() {
  return <FileCard
    title="Le contrat montre ce qui manque"
    description="Une valeur critique manque : écris A_RENSEIGNER et garde le pilote éteint."
    legend="Un blanc visible protège mieux qu'une réponse inventée."
    ariaLabel="Un contrat de mission avec résultat, sources, opérations, interdits, limites et arrêt remplis. Le responsable et la validation valent A_RENSEIGNER, donc l'activation est impossible."
    accent={EM}
    filename="contrat-mission.md"
    lines={[
      { text: "Résultat : rapport du lundi" },
      { text: "Responsable : A_RENSEIGNER", tone: "heading" },
      { text: "Sources : tableau marketing" },
      { text: "Opérations : lire et préparer" },
      { text: "Interdits : publier" },
      { text: "Limites : trois idées" },
      { text: "Validation : A_RENSEIGNER", tone: "heading" },
      { text: "Arrêt : source absente" },
      { text: "Activation : impossible", tone: "heading" },
    ]}
    annotations={[
      { line: 2, label: "Qui décide" },
      { line: 7, label: "Ce qui manque" },
      { line: 9, label: "Pourquoi c'est bloqué" },
    ]}
  />;
}

export function PassationEnSixCartesDiagram() {
  return <Steps
    title="Six cartes pour reprendre"
    description="Exemple : Clara reprend le rapport du lundi sans le refaire ni publier par erreur."
    legend="Pas de journaux recopiés : seulement ce qui évite de refaire ou de doubler."
    ariaLabel="Six cartes de passation : fait, vérifié, touché, validé, incertain et ensuite. Dans l'exemple, une donnée YouTube manque et il faut relancer seulement la collecte."
    accent={EM}
    items={[
      { label: "Fait", detail: "Rapport marketing préparé" },
      { label: "Vérifié", detail: "Chiffres relus à la source" },
      { label: "Touché", detail: "Le dossier rapports, rien d'autre" },
      { label: "Validé", detail: "Aucune publication tentée" },
      { label: "Incertain", detail: "Donnée YouTube manquante" },
      { label: "Ensuite", detail: "Relancer la collecte seulement" },
    ]}
    accentIndex={5}
  />;
}
