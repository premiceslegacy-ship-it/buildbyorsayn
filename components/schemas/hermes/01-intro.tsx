import { Ladder, Workflow } from "../kit";

const EM = "#22d96e";

export function PremierWorkflowVisibleDiagram() {
  return <Workflow
    title="Du message au suivi"
    description="Exemple : un prospect demande un devis sur Telegram, ton agent prépare et tu corriges le prix."
    legend="Ton agent prépare tout, mais rien ne part avant ta validation."
    ariaLabel="Un prospect envoie une demande de devis sur Telegram. Ton agent prépare la réponse, tu corriges le prix et tu valides, puis ton agent inscrit la prochaine action dans Notion."
    accent={EM}
    actors={["Prospect", "Ton agent", "Toi"]}
    steps={[
      { actor: 0, label: "Devis demandé", tool: "Telegram" },
      { actor: 1, label: "Brouillon prêt", tool: "Hermes Agent", transfer: "message" },
      { actor: 2, label: "Prix corrigé", humanValidation: true, transfer: "brouillon" },
      { actor: 1, label: "Suivi à jour", tool: "Notion", transfer: "accord" },
    ]}
    accentIndex={2}
  />;
}

export function OrdreDuPremierWorkflowDiagram() {
  return <Ladder
    title="Du plus simple au plus sensible"
    description="Tu installes, tu informes, tu connectes une seule porte, puis tu testes avant de planifier."
    legend="Tu passes à la marche suivante seulement quand celle-ci tient."
    ariaLabel="Quatre marches montent du plus simple au plus sensible : installer et vérifier une conversation, informer l'agent, connecter une seule porte d'entrée, puis tester avant de planifier. La première marche est mise en avant."
    accent={EM}
    rungs={[
      { label: "Installer", detail: "Une conversation normale marche" },
      { label: "Informer", detail: "Identité, mémoire, règles du projet" },
      { label: "Connecter", detail: "Une seule porte d'entrée" },
      { label: "Tester", detail: "Puis planifier ce qui tient" },
    ]}
    accentIndex={0}
    lowLabel="Simple"
    highLabel="Sensible"
  />;
}

export function ToiAgentOutilDiagram() {
  return <Workflow
    title="Trois rôles, une seule tâche"
    description="Exemple de support : tu fixes le résultat, l'agent prépare, l'outil transmet ce qu'on lui demande."
    legend="Chacun garde sa place, et la décision reste toujours de ton côté."
    ariaLabel="Tu fixes l'objectif. Ton agent prépare une réponse de support. Tu la valides, puis Gmail envoie la réponse validée."
    accent={EM}
    actors={["Toi", "Ton agent", "L'outil"]}
    steps={[
      { actor: 0, label: "Objectif fixé" },
      { actor: 1, label: "Brouillon prêt", tool: "Hermes Agent", transfer: "objectif" },
      { actor: 0, label: "Tu valides", humanValidation: true, transfer: "brouillon" },
      { actor: 2, label: "Envoi", tool: "Gmail", transfer: "accord" },
    ]}
    accentIndex={2}
  />;
}
