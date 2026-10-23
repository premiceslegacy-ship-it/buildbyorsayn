import { Fork, Steps, Workflow } from "../kit";

const EM = "#22d96e";

export function CinqObjetsPasUnSeulDiagram() {
  return <Steps
    title="Cinq mots, cinq usages"
    description="Une tâche, un workflow, un skill, un outil et une validation ne font pas le même travail."
    legend="Ces cinq mots ne se remplacent pas, chacun répond à une autre question."
    ariaLabel="Cinq notions distinctes : la tâche prépare une réponse, le workflow va du message au suivi, le skill est une méthode écrite, l'outil fait une opération comme Gmail qui lit un e-mail, la validation est ta décision avant l'envoi. Le workflow est mis en avant."
    accent={EM}
    items={[
      { label: "Tâche", detail: "Préparer une réponse" },
      { label: "Workflow", detail: "Du message au suivi" },
      { label: "Skill", detail: "Une méthode écrite" },
      { label: "Outil", detail: "Gmail lit un e-mail", tools: ["Gmail"] },
      { label: "Validation", detail: "Ta décision avant l'envoi" },
    ]}
    accentIndex={1}
  />;
}

export function MessageJusquaSuiteDiagram() {
  return <Workflow
    title="Le brouillon n'est pas la fin"
    description="Le workflow commence avant la tâche « prépare une réponse » et finit après ta validation."
    legend="Si le trajet s'arrête au brouillon, personne ne range la suite."
    ariaLabel="Un prospect écrit sur Telegram. Ton agent reconnaît la demande, prépare un brouillon avec les bonnes informations, tu valides, puis ton agent range la suite dans Notion. Cette dernière étape est mise en avant."
    accent={EM}
    actors={["Prospect", "Ton agent", "Toi"]}
    steps={[
      { actor: 0, label: "Message reçu", tool: "Telegram" },
      { actor: 1, label: "Demande lue", tool: "Hermes Agent", transfer: "message" },
      { actor: 1, label: "Brouillon prêt", transfer: "sources" },
      { actor: 2, label: "Tu valides", humanValidation: true, transfer: "brouillon" },
      { actor: 1, label: "Suite rangée", tool: "Notion", transfer: "accord" },
    ]}
    accentIndex={4}
  />;
}

export function LigneArriveeDuTravailDiagram() {
  return <Fork
    title="Une mission a une arrivée"
    description="« Aide-moi avec le marketing » ne finit jamais, trois idées tirées de cinq avis se vérifient."
    legend="Une bonne mission dit ce qui doit sortir et qui dira oui."
    ariaLabel="Deux missions possibles. Aide-moi avec le marketing est écartée car personne ne sait quand elle est finie. Trois idées de contenu tirées de cinq avis clients est conseillée car on peut compter les idées et retrouver les avis."
    accent={EM}
    situation="Tu confies une mission"
    outcomes={[
      { label: "Aide-moi", condition: "Personne ne sait quand c'est fini", rejected: true },
      { label: "Trois idées", condition: "Tirées de cinq avis clients", recommended: true },
    ]}
  />;
}
