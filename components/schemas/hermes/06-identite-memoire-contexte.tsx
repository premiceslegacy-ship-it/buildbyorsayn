import { Compare, FileCard, Rings, Steps } from "../kit";

const EM = "#22d96e";

export function QuatreFichiersQuatreQuestionsDiagram() {
  return <Steps
    title="Quatre fichiers, quatre questions"
    description="Chaque fichier répond à une seule question, ce qui garde l'ensemble court et facile à relire."
    legend="Chaque phrase va dans le fichier qui répond à sa question."
    ariaLabel="SOUL.md répond à qui est ton agent, USER.md à qui tu es, MEMORY.md à ce qu'il a appris, AGENTS.md à ce que demande le projet. SOUL.md est mis en avant."
    accent={EM}
    items={[
      { label: "SOUL.md", detail: "Qui est ton agent ?" },
      { label: "USER.md", detail: "Qui es-tu ?" },
      { label: "MEMORY.md", detail: "Qu'a-t-il appris ?" },
      { label: "AGENTS.md", detail: "Que demande ce projet ?" },
    ]}
    accentIndex={0}
  />;
}

export function SoulMdAnnoteMockup() {
  return <FileCard
    title="Un SOUL.md prêt à adapter"
    description="Quatre parties : son rôle, sa voix, ses réflexes de travail et ce qu'il doit éviter."
    legend="Une identité guide sa manière de répondre, elle ne donne aucun droit d'agir."
    ariaLabel="Le fichier SOUL.md contient quatre parties annotées : l'identité d'assistant opérationnel, la manière de parler en français simple, la manière de travailler avec validation et source, et ce qu'il évite, comme inventer une information manquante."
    accent={EM}
    filename="~/.hermes/SOUL.md"
    tool="Hermes Agent"
    lines={[
      { text: "# Identité", tone: "heading" },
      { text: "Tu es l'assistant opérationnel d'une petite entreprise de service." },
      { text: "## Ta manière de parler", tone: "heading" },
      { text: "Tu écris en français simple." },
      { text: "Tu vas droit au fait." },
      { text: "## Ta manière de travailler", tone: "heading" },
      { text: "Tu demandes une validation pour un prix ou un envoi." },
      { text: "Tu cites la source utilisée." },
      { text: "## Ce que tu évites", tone: "heading" },
      { text: "Tu n'inventes jamais une information manquante." },
    ]}
    annotations={[
      { line: 1, label: "Rôle général" },
      { line: 3, label: "Sa voix" },
      { line: 6, label: "Ses réflexes" },
      { line: 9, label: "Ses interdits" },
    ]}
  />;
}

export function KnowledgeLayersDiagram() {
  return <Rings
    title="Du plus stable au plus local"
    description="Au centre, l'identité suit ton agent partout. Au bord, AGENTS.md change avec chaque projet."
    legend="La mémoire se charge au début d'une session : relis ce qui y est écrit."
    ariaLabel="SOUL.md est au centre. Autour, USER.md parle de toi, MEMORY.md garde ce que l'agent a appris, et AGENTS.md, au bord, donne les règles du projet ouvert. MEMORY.md est mis en avant."
    accent={EM}
    core="SOUL.md"
    rings={[
      { label: "USER.md", detail: "Ton rôle, tes préférences" },
      { label: "MEMORY.md", detail: "Ce qu'il a appris" },
      { label: "AGENTS.md", detail: "Le projet ouvert" },
    ]}
    accentIndex={1}
  />;
}

export function SacDeContexteDiagram() {
  return <Compare
    title="Le contexte tient dans un sac"
    description="Exemple : pour un dossier de support, l'agent emporte la demande, la doc et les règles."
    legend="Tu prends ce qu'il faut pour la destination, pas toute la maison."
    ariaLabel="Pour un dossier de support, la comptabilité, les conversations privées et les autres projets restent à la maison. La demande du client, la documentation support et les règles de réponse entrent dans le sac."
    accent={EM}
    beforeTitle="Reste à la maison"
    afterTitle="Dans le sac"
    rows={[
      { before: "Ta comptabilité", after: "La demande du client" },
      { before: "Les conversations privées", after: "La documentation support" },
      { before: "Les autres projets", after: "Les règles de réponse" },
    ]}
  />;
}
