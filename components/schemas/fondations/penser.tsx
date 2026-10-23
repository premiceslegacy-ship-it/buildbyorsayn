import { FileCard, Steps, Workflow } from "../kit";

const EM = "#22d96e";

export function QuestionsAvantOutilsDiagram() {
  return <Steps
    title="L'outil arrive en dernier"
    description="Exemple : une coach reçoit les mêmes questions chaque soir. Quatre réponses avant de choisir un outil."
    legend="Si une case reste floue, tu n'es pas prêt à choisir l'outil ni les couleurs."
    ariaLabel="Avant l'outil, quatre réponses : la personne, une coach le soir ; le problème, les mêmes questions reviennent ; l'action, prendre rendez-vous ; la preuve, des rendez-vous pris sans message. L'outil vient en cinquième, mis en avant."
    accent={EM}
    accentIndex={4}
    items={[
      { label: "Personne", detail: "Une coach, le soir" },
      { label: "Problème", detail: "Les mêmes questions reviennent" },
      { label: "Action", detail: "Prendre rendez-vous" },
      { label: "Preuve", detail: "Rendez‑vous pris sans message" },
      { label: "Outil", detail: "Choisi en dernier" },
    ]}
  />;
}

export function ToiEtTonIADiagram() {
  return <Workflow
    title="Toi et ton IA, chacun son tour"
    description="Ton IA propose et construit. Toi, tu donnes le dossier, choisis la route et vérifies dans le vrai site."
    legend="Les cartes avec une main restent à toi : client, données et argent ne se délèguent pas."
    ariaLabel="Tu donnes le dossier, ton IA, Claude, propose trois routes, tu choisis la route, mise en avant, ton IA construit la version, puis tu vérifies la page dans le vrai site."
    accent={EM}
    actors={["Toi", "Ton IA"]}
    accentIndex={2}
    steps={[
      { actor: 0, label: "Dossier" },
      { actor: 1, label: "Trois routes", transfer: "le brief", tool: "Claude" },
      { actor: 0, label: "Choix", transfer: "les options", humanValidation: true },
      { actor: 1, label: "Version", transfer: "ta route" },
      { actor: 0, label: "Vérification", transfer: "la page", humanValidation: true },
    ]}
  />;
}

export function FormulaireSousControleDiagram() {
  return <Workflow
    title="Une demande, cinq étapes claires"
    description="Exemple : un formulaire de devis. Chaque étape dit ce qu'elle reçoit et qui reprend la main."
    legend="Sans la case d'accord cochée, la suite s'arrête et une personne reprend la demande."
    ariaLabel="Le client envoie sa demande, le formulaire vérifie la case d'accord, mise en avant, range le contact, envoie une confirmation par Gmail, puis tu relis l'état réel."
    accent={EM}
    actors={["Client", "Site", "Toi"]}
    accentIndex={1}
    steps={[
      { actor: 0, label: "Demande" },
      { actor: 1, label: "Accord ?", transfer: "la demande" },
      { actor: 1, label: "Rangement", transfer: "accord coché" },
      { actor: 1, label: "Confirmation", transfer: "le contact", tool: "Gmail" },
      { actor: 2, label: "Relecture", transfer: "l'e-mail", humanValidation: true },
    ]}
  />;
}

export function DossierProjetVivantDiagram() {
  return <FileCard
    title="Le projet quitte la conversation"
    description="Exemple : le brief du projet de Karim, plaquiste. Une autre personne peut le rouvrir et continuer."
    legend="Chaque règle porte son origine : un fait du terrain, une décision ou une idée à tester."
    ariaLabel="Le fichier BRIEF.md du projet de Karim contient le problème, réunir la demande et les photos avant le devis, le ton de la marque, le critère de fin, une demande test complète, et l'origine de la règle, vue sur le terrain."
    accent={EM}
    filename="BRIEF.md"
    tool="GitHub"
    lines={[
      { text: "# Problème", tone: "heading" },
      { text: "Réunir demande et photos avant devis" },
      { text: "# Marque", tone: "heading" },
      { text: "Ton direct, photos de chantier" },
      { text: "# Fini quand", tone: "heading" },
      { text: "Une demande test arrive complète" },
      { text: "Origine : vu sur le terrain", tone: "muted" },
    ]}
    annotations={[
      { line: 2, label: "Le problème, en une ligne" },
      { line: 5, label: "Comment savoir que c'est fini" },
      { line: 7, label: "D'où vient la règle" },
    ]}
  />;
}
