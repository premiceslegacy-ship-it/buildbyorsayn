import { FileCard, Funnel, Rings, Steps } from "../kit";

export function QuatreFichiersQuatreQuestionsDiagram() {
  return <Steps title="Quatre fichiers, quatre questions" description="Chaque feuille garde une responsabilité différente." ariaLabel="SOUL.md répond Qui il est, USER.md répond Qui tu es, MEMORY.md répond Ce qu'il apprend et AGENTS.md répond Ce projet." items={[
    { label: "Qui il est", detail: "SOUL.md", tools: ["Hermes Agent"] },
    { label: "Qui tu es", detail: "USER.md" },
    { label: "Ce qu'il apprend", detail: "MEMORY.md" },
    { label: "Ce projet", detail: "AGENTS.md" },
  ]} accentIndex={0} />;
}

export function SoulMdAnnoteMockup() {
  return <FileCard title="Un vrai SOUL.md" description="L'identité, la voix, les réflexes et les interdits restent séparés." ariaLabel="Un éditeur montre les vraies lignes du fichier SOUL.md avec quatre annotations." filename="SOUL.md" tool="Obsidian" lines={[
    { text: "# Identité", tone: "heading" },
    { text: "Tu es l'assistant de travail de Samuel." },
    { text: "# Ta manière de parler", tone: "heading" },
    { text: "Tu écris en français simple." },
    { text: "Tu vas droit au fait." },
    { text: "# Ta manière de travailler", tone: "heading" },
    { text: "Tu prépares avant toute action extérieure." },
    { text: "Tu cites la source utilisée." },
    { text: "# Ce que tu évites", tone: "heading" },
    { text: "Tu n'inventes jamais une information manquante." },
  ]} annotations={[
    { line: 1, label: "Rôle général" },
    { line: 3, label: "Voix" },
    { line: 6, label: "Réflexes" },
    { line: 9, label: "Interdits" },
  ]} />;
}

export function KnowledgeLayersDiagram() {
  return <Rings title="Quatre couches, quatre responsabilités" description="Les noms de fichiers rendent chaque niveau concret." ariaLabel="SOUL.md est au centre, puis USER.md, MEMORY.md et AGENTS.md organisent identité, personne, mémoire et projet." core="SOUL.md" rings={[
    { label: "USER.md", detail: "Qui tu es" },
    { label: "MEMORY.md", detail: "Ce qu'il apprend" },
    { label: "AGENTS.md", detail: "Ce projet" },
    { label: "Sources", detail: "Ce qui fait foi" },
  ]} accentIndex={2} />;
}

export function SacDeContexteDiagram() {
  return <Funnel title="Le contexte tient dans un sac" description="La tâche reçoit seulement ce dont elle a besoin." ariaLabel="Objectif, Sources et Règles entrent dans le contexte. Toute l'entreprise reste à l'extérieur." stages={[
    { label: "Toute l'entreprise", value: 100, valueLabel: "archive", detail: "reste à côté" },
    { label: "Sources", value: 72, valueLabel: "utile" },
    { label: "Règles", value: 56, valueLabel: "utile" },
    { label: "Objectif", value: 42, valueLabel: "mission" },
  ]} leakIndex={0} leakLabel="hors du sac" />;
}
