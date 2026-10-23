import { FileCard, Rings, Steps, Workflow } from "../kit";

const EM = "#22d96e";

export function QuestionsAvantOutilsDiagram() {
  return <Rings
    title="L'outil attend son tour"
    description="Quatre décisions humaines entourent le choix technique."
    ariaLabel="La personne, le problème, l'action et la preuve entourent l'outil choisi ensuite."
    accent={EM}
    core="Outil ensuite"
    accentIndex={3}
    rings={[
      { label: "Personne", detail: "Qui avance ?" },
      { label: "Problème", detail: "Qu'est-ce qui bloque ?" },
      { label: "Action", detail: "Quel geste suit ?" },
      { label: "Preuve", detail: "Comment tu sauras ?" },
    ]}
  />;
}

export function ToiEtTonIADiagram() {
  return <Steps
    title="Un établi partagé"
    description="L'IA assemble, mais la personne garde le choix final."
    ariaLabel="L'IA prépare et construit avec Claude, ChatGPT et Gemini, puis la personne choisit et vérifie."
    accent={EM}
    accentIndex={3}
    items={[
      { label: "Préparer", detail: "Rassembler la matière", tools: ["Claude", "ChatGPT", "Gemini"] },
      { label: "Construire", detail: "Assembler une version" },
      { label: "Choisir", detail: "Comparer au brief" },
      { label: "Vérifier", detail: "Valider le résultat" },
    ]}
  />;
}

export function FormulaireSousControleDiagram() {
  return <Workflow
    title="La demande passe quatre portes"
    description="Sans accord, le formulaire revient vers la personne."
    ariaLabel="Une demande vérifie l'accord, se range, reçoit une confirmation Gmail et se relit."
    accent={EM}
    actors={["Formulaire", "Personne"]}
    accentIndex={4}
    steps={[
      { actor: 0, label: "Demande" },
      { actor: 1, label: "Accord", humanValidation: true },
      { actor: 0, label: "Ranger" },
      { actor: 0, label: "Confirmer", tool: "Gmail" },
      { actor: 1, label: "Relire", humanValidation: true },
    ]}
  />;
}

export function DossierProjetVivantDiagram() {
  return <FileCard
    title="Le projet quitte la conversation"
    description="Le dossier reste lisible quand quelqu'un le rouvre plus tard."
    ariaLabel="Un dossier de projet contient le brief, la marque, les choix et les tests, puis sert au projet suivant."
    accent={EM}
    filename="PROJET.md"
    tool="GitHub"
    lines={[
      { text: "# Brief", tone: "heading" },
      { text: "Marque" },
      { text: "Choix" },
      { text: "Tests" },
      { text: "Projet suivant", tone: "heading" },
    ]}
    annotations={[
      { line: 1, label: "Le point de départ" },
      { line: 5, label: "La reprise reste possible" },
    ]}
  />;
}
