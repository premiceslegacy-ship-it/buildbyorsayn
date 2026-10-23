import { FileCard, Steps } from "../kit";

export function SkillCommeDossierOuvertDiagram() {
  return <FileCard title="Un skill est un dossier ouvert" description="La méthode, les références, les tests et les scripts restent séparés." ariaLabel="Un dossier de skill contient SKILL.md, Références, Tests et Scripts. Tests est mis en avant." filename="skill/" tool="GitHub" lines={[
    { text: "SKILL.md        méthode et déclencheur" },
    { text: "references/     sources utiles" },
    { text: "tests/          cas qui protègent la suite", tone: "heading" },
    { text: "scripts/        opérations répétables" },
  ]} annotations={[
    { line: 1, label: "SKILL.md" },
    { line: 2, label: "Références" },
    { line: 3, label: "Tests" },
    { line: 4, label: "Scripts" },
  ]} />;
}

export function SkillsSopDiagramV2() {
  return <Steps title="Du métier à la méthode réutilisable" description="Le savoir-faire devient assez petit pour être testé." ariaLabel="Métier devient Petit savoir-faire, puis Méthode écrite et Personne ou agent." items={[
    { label: "Métier", detail: "Le travail réel" },
    { label: "Petit savoir-faire", detail: "Un geste précis" },
    { label: "Méthode écrite", detail: "Un skill testable", tools: ["Hermes Agent"] },
    { label: "Personne ou agent", detail: "La même méthode" },
  ]} accentIndex={2} />;
}

export function DossierSkillReelMockup() {
  return <FileCard title="Le vrai contenu d'un skill" description="L'agent trouve le bon détail et le test protège la suite." ariaLabel="Un éditeur montre un vrai SKILL.md avec description, déclencheur, méthode, interdits et tests." filename="SKILL.md" tool="Ghostty" lines={[
    { text: "# Préparer un devis", tone: "heading" },
    { text: "Description : prépare un brouillon depuis les pièces reçues." },
    { text: "Quand l'utiliser : dossier de devis complet." },
    { text: "Méthode : lire, lister les manques, préparer." },
    { text: "Quand s'arrêter : prix ou mesure absente." },
    { text: "Qui valide : responsable du devis." },
    { text: "Tests : doublon, contradiction, faux ordre." },
  ]} annotations={[
    { line: 3, label: "L'agent trouve le skill" },
    { line: 4, label: "Il charge le détail utile" },
    { line: 7, label: "Le test protège la suite" },
  ]} />;
}

export function BriquesDeCompetenceDiagram() {
  return <Steps title="Quatre briques forment le workflow" description="Les jointures sont visibles et chaque geste reste testable." ariaLabel="Lire, Comparer, Préparer et Vérifier s'emboîtent comme quatre briques de compétence." items={[
    { label: "Lire", detail: "Prendre les sources" },
    { label: "Comparer", detail: "Faire ressortir les écarts" },
    { label: "Préparer", detail: "Produire un brouillon" },
    { label: "Vérifier", detail: "Contrôler avant la suite" },
  ]} accentIndex={3} />;
}
