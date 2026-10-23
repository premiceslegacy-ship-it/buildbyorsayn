import { FileCard, Steps } from "../kit";

const EM = "#22d96e";

export function SkillCommeDossierOuvertDiagram() {
  return <FileCard
    title="Un skill est un dossier ouvert"
    description="Un skill est une fiche de méthode que ton agent relit : un fichier, et des dossiers autour."
    legend="Tu peux ouvrir chaque fichier et le relire, comme une fiche recette."
    ariaLabel="Le dossier d'un skill contient SKILL.md pour la méthode et le déclencheur, references pour les sources utiles, tests pour les cas qui protègent la suite, et scripts pour les opérations répétables."
    accent={EM}
    filename="classer-une-demande/"
    tool="GitHub"
    lines={[
      { text: "SKILL.md          la méthode" },
      { text: "references/       les sources utiles" },
      { text: "tests/            les cas qui cassent", tone: "heading" },
      { text: "scripts/          seulement si besoin" },
    ]}
    annotations={[
      { line: 1, label: "Déclencheur et choix" },
      { line: 2, label: "Lu seulement si utile" },
      { line: 3, label: "Une erreur devient un test" },
      { line: 4, label: "Opérations répétables" },
    ]}
  />;
}

export function SkillsSopDiagramV2() {
  return <Steps
    title="Du métier au skill"
    description="Exemple : on ne crée pas un skill marketing, on crée un geste précis."
    legend="Plus le geste est petit, plus il est facile à tester."
    ariaLabel="Quatre étapes : le métier de support, un geste précis qui est de classer une demande, un skill écrit avec un déclencheur et une sortie, puis une reprise possible par une personne ou par l'agent."
    accent={EM}
    items={[
      { label: "Ton métier", detail: "Le support client" },
      { label: "Un geste", detail: "Classer une demande" },
      { label: "Un skill", detail: "Déclencheur et sortie écrits", tools: ["Hermes Agent"] },
      { label: "Une reprise", detail: "Une personne ou l'agent" },
    ]}
    accentIndex={2}
  />;
}

export function DossierSkillReelMockup() {
  return <FileCard
    title="Le vrai contenu d'un skill"
    description="Exemple : un SKILL.md qui dit quand agir, quand s'arrêter et quoi ne jamais faire."
    legend="Les lignes surlignées portent le jugement de l'équipe, pas seulement des étapes."
    ariaLabel="Un fichier SKILL.md pour classer une demande de support avec le déclencheur, la méthode, la règle d'arrêt, l'interdit de rembourser, la personne qui valide et le dossier de tests."
    accent={EM}
    filename="SKILL.md"
    tool="Obsidian"
    lines={[
      { text: "# Classer une demande de support", tone: "heading" },
      { text: "Quand : un message client arrive" },
      { text: "Méthode : lire, chercher, préparer" },
      { text: "S'arrêter : produit inconnu" },
      { text: "Interdit : promettre un remboursement" },
      { text: "Valide : la responsable support" },
      { text: "Tests : tests/ (cinq cas)" },
    ]}
    annotations={[
      { line: 2, label: "L'agent trouve le skill" },
      { line: 4, label: "Quand demander de l'aide" },
      { line: 5, label: "Ce qu'il ne fait jamais" },
      { line: 7, label: "Le test protège la suite" },
    ]}
  />;
}

export function BriquesDeCompetenceDiagram() {
  return <Steps
    title="Un rapport ads, trois skills"
    description="Exemple : une agence prépare son rapport du lundi avec trois petits skills, puis toi."
    legend="Le budget reste hors des skills : c'est toi qui décides."
    ariaLabel="Quatre briques : lire les données publicitaires, repérer les écarts, écrire la synthèse du lundi, puis le responsable valide la recommandation qui part au client."
    accent={EM}
    items={[
      { label: "Lire", detail: "Les données de la semaine" },
      { label: "Repérer", detail: "Les écarts importants" },
      { label: "Écrire", detail: "La synthèse du lundi" },
      { label: "Valider", detail: "Le responsable choisit" },
    ]}
    accentIndex={3}
  />;
}
