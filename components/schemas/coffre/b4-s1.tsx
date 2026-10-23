import { Compare, FileCard, Rings, Steps, Workflow } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function PromptOuSkillDiagram() {
  return <Compare
    title="Un rôle ou une méthode"
    description="La même demande, une fois avec un rôle vague, une fois avec un skill qui écrit les choix."
    legend="Lis ligne par ligne : à gauche l'IA devine, à droite le skill a déjà tranché."
    ariaLabel="Comparaison entre un prompt « Sois un expert » et un skill. Le prompt donne un rôle, laisse deviner les sources, improvise les choix, vise un résultat flou et ne vérifie rien. Le skill dit quand il s'active, nomme les sources, écrit les décisions et les interdits, décrit le résultat attendu et ajoute des contrôles."
    accent={EM}
    beforeTitle="Prompt « Sois un expert »"
    afterTitle="Skill écrit"
    rows={[
      { before: "Un rôle à jouer", after: "Quand il s'active" },
      { before: "Sources devinées", after: "Sources à lire nommées" },
      { before: "Choix improvisés", after: "Décisions et interdits écrits" },
      { before: "Résultat flou", after: "Résultat attendu décrit" },
      { before: "Aucune vérification", after: "Contrôles avant de rendre" },
    ]}
  />;
}

export function DossierSkillReelDiagram() {
  return <Rings
    title="Un fichier principal, des appuis"
    description="Exemple réel : content-and-microcopy garde ses règles dans SKILL.md et renvoie à des références."
    legend="Du centre vers l'extérieur : ce que l'agent lit toujours, puis seulement au besoin."
    ariaLabel="Le dossier d'un skill a SKILL.md au centre. Autour, les instructions lues à chaque activation, puis les références lues quand la tâche le demande, puis les scripts et modèles ajoutés seulement s'ils servent le travail."
    accent={EM}
    core="SKILL.md"
    accentIndex={0}
    rings={[
      { label: "Instructions", detail: "Lues à chaque activation" },
      { label: "Références", detail: "Lues quand la tâche le demande" },
      { label: "Scripts, modèles", detail: "Ajoutés seulement s'ils servent" },
    ]}
  />;
}

export function SkillMdReelAnnoteMockup() {
  return <FileCard
    title="Le début d'un vrai SKILL.md"
    description="Les sept premières lignes du fichier content-and-microcopy, tel qu'il est utilisé."
    legend="L'en-tête entre les deux traits donne l'identité, le titre ouvre les instructions."
    ariaLabel="Un éditeur montre le début du fichier SKILL.md du skill content-and-microcopy : un en-tête YAML avec name, description et version 1.4.0, puis le titre et la ligne qui renvoie aux autres règles à lire. Quatre annotations nomment le nom technique, le déclenchement, la version et les règles à lire avant."
    accent={EM}
    filename="content-and-microcopy/SKILL.md"
    lines={[
      { text: "---", tone: "muted" },
      { text: "name: content-and-microcopy" },
      { text: "description: Use when writing content or microcopy." },
      { text: "version: 1.4.0" },
      { text: "---", tone: "muted" },
      { text: "# Content and Microcopy", tone: "heading" },
      { text: "Use with copywriting-systems and its references…" },
    ]}
    annotations={[
      { line: 2, label: "Son nom technique" },
      { line: 3, label: "Quand l'activer" },
      { line: 4, label: "La méthode qui a servi" },
      { line: 7, label: "Les règles à lire avant" },
    ]}
  />;
}

export function SopSkillAgentDiagram() {
  return <Steps
    title="Recette, livre, cuisinier"
    description="La procédure, le skill et l'agent ne jouent pas le même rôle dans le travail."
    legend="Comme en cuisine : la recette suit un ordre, le livre aide à choisir, le cuisinier agit."
    ariaLabel="Trois rôles. La SOP est une recette : un chemin stable dans un ordre précis, comme remettre un site au client. Le skill est le livre de cuisine : il aide à faire des choix selon le cas. L'agent est le cuisinier : il exécute avec des outils et des droits."
    accent={EM}
    accentIndex={1}
    items={[
      { label: "SOP", detail: "Un chemin stable, dans l'ordre" },
      { label: "Skill", detail: "Des choix selon le cas" },
      { label: "Agent", detail: "Exécute avec outils et droits" },
    ]}
  />;
}

export function DroitsHorsDuSkillDiagram() {
  return <Workflow
    title="La clé vient de toi"
    description="Le skill donne la manière de décider, mais seul toi peux ouvrir un accès à ton agent."
    legend="Sans l'accès que tu accordes, l'agent s'arrête, même si le skill décrit le geste."
    ariaLabel="Un relais en trois cartes. Le skill décrit la méthode. Toi, tu accordes un accès précis, avec une validation humaine. Ton agent agit ensuite seulement dans cette limite."
    accent={EM}
    actors={["Le skill", "Toi", "Ton agent"]}
    accentIndex={1}
    steps={[
      { actor: 0, label: "Décrit la méthode" },
      { actor: 1, label: "Accorde l'accès", transfer: "la méthode", humanValidation: true },
      { actor: 2, label: "Agit dans la limite", transfer: "un accès précis" },
    ]}
  />;
}

export const b4_s1_VISUALS = [
  { name: "PromptOuSkill", kind: "schema", chapter: "b4-s1", component: PromptOuSkillDiagram },
  { name: "DossierSkillReel", kind: "schema", chapter: "b4-s1", component: DossierSkillReelDiagram },
  { name: "SkillMdReelAnnote", kind: "maquette", chapter: "b4-s1", component: SkillMdReelAnnoteMockup },
  { name: "SopSkillAgent", kind: "schema", chapter: "b4-s1", component: SopSkillAgentDiagram },
  { name: "DroitsHorsDuSkill", kind: "schema", chapter: "b4-s1", component: DroitsHorsDuSkillDiagram },
] as const satisfies readonly HandcraftedVisual[];
