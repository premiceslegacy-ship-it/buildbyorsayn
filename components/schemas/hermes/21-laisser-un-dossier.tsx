import { FileCard, Steps } from "../kit";

export function TemplateTreeDiagram() {
  return <FileCard title="Le dossier du pilote" description="Quatre espaces séparent les sources, les méthodes, les missions et les essais." ariaLabel="Le dossier du pilote contient connaissance, procedures, projets et apprentissage." filename="pilote/" lines={[
    { text: "connaissance/     Règles" },
    { text: "procedures/       Skills testés" },
    { text: "projets/          Missions" },
    { text: "apprentissage/    Candidats" },
  ]} annotations={[
    { line: 1, label: "Ce qui fait foi" },
    { line: 2, label: "Ce qui est prêt" },
    { line: 4, label: "Ce qui est encore testé" },
  ]} />;
}

export function ArborescencePiloteTerminalMockup() {
  return <FileCard title="L'arborescence réelle du pilote" description="Le terminal montre les quatre dossiers sans flèche abstraite." ariaLabel="Un explorateur de fichiers montre connaissance, procedures, projets et apprentissage avec Règles, Skills testés, Missions et Candidats." filename="pilote/" tool="Ghostty" lines={[
    { text: "├── connaissance/       Règles" },
    { text: "├── procedures/         Skills testés" },
    { text: "├── projets/            Missions" },
    { text: "└── apprentissage/      Candidats" },
  ]} annotations={[
    { line: 1, label: "Ce qui fait foi" },
    { line: 2, label: "Ce qui est prêt" },
    { line: 4, label: "Ce qui est encore testé" },
  ]} />;
}

export function ContratMissionLisibleMockup() {
  return <FileCard title="Le contrat montre ce qui manque" description="Un blanc visible protège mieux qu'une réponse inventée." ariaLabel="Le contrat contient huit champs. Responsable vaut A_RENSEIGNER et rend l'activation impossible." filename="contrat-mission.md" lines={[
    { text: "Résultat : rapport du lundi" },
    { text: "Responsable : A_RENSEIGNER", tone: "heading" },
    { text: "Sources : tableau marketing" },
    { text: "Opérations : lire et préparer" },
    { text: "Interdits : publier" },
    { text: "Limites : trois idées" },
    { text: "Validation : A_RENSEIGNER", tone: "heading" },
    { text: "Arrêt : source absente" },
    { text: "Activation impossible", tone: "heading" },
  ]} annotations={[
    { line: 2, label: "Qui décide" },
    { line: 7, label: "Ce qui manque" },
    { line: 9, label: "Pourquoi c'est bloqué" },
  ]} />;
}

export function PassationEnSixCartesDiagram() {
  return <Steps title="Six cartes suffisent pour reprendre" description="La prochaine personne continue sans refaire ni doubler une action." ariaLabel="La passation contient Fait, Vérifié, Touché, Validé, Incertain et Ensuite. Ensuite est mis en avant." items={[
    { label: "Fait", detail: "Le travail terminé" },
    { label: "Vérifié", detail: "La preuve observée" },
    { label: "Touché", detail: "Les objets modifiés" },
    { label: "Validé", detail: "Les accords reçus" },
    { label: "Incertain", detail: "Les doutes restants" },
    { label: "Ensuite", detail: "La prochaine action" },
  ]} accentIndex={5} />;
}
