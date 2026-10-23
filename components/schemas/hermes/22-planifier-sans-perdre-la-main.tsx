import { FileCard, Fork, Steps, Workflow } from "../kit";

const EM = "#22d96e";

export function CalendrierTachePlanifieeMockup() {
  return <FileCard
    title="Une routine dans le calendrier"
    description="Exemple : la veille marketing de Lina, avec son horaire, sa destination et son arrêt."
    legend="Si une ligne manque, la tâche n'est pas prête à tourner seule."
    ariaLabel="Une carte Veille marketing dans Google Agenda : chaque matin à 7 heures, skill veille-marketing, sources validées, lecture seule, rapport sur Telegram, arrêt si aucune source récente, responsable Lina, aucune publication."
    accent={EM}
    filename="Veille marketing"
    tool="Google Agenda"
    lines={[
      { text: "Horaire : chaque matin, 07:00" },
      { text: "Skill : veille-marketing" },
      { text: "Sources : liste validée" },
      { text: "Droits : lecture seule", tone: "heading" },
      { text: "Livre : rapport sur Telegram" },
      { text: "Arrêt : aucune source récente" },
      { text: "Responsable : Lina" },
      { text: "Publication : aucune", tone: "heading" },
    ]}
    annotations={[
      { line: 1, label: "Quand" },
      { line: 2, label: "Avec quoi" },
      { line: 7, label: "Qui regarde" },
    ]}
  />;
}

export function ManuelPuisPlanifieDiagram() {
  return <Steps
    title="La planification vient en dernier"
    description="Une tâche automatique se réveille sans toi : elle doit d'abord avoir réussi à la main."
    legend="Pas de réussite à la main, pas d'horaire."
    ariaLabel="Trois étapes : un essai manuel sur un vrai cas autorisé, un cas qui casse comme une pièce manquante provoquée, puis la planification avec hermes cron."
    accent={EM}
    items={[
      { label: "Essai manuel", detail: "Un vrai cas autorisé", tools: ["Hermes Agent"] },
      { label: "Cas qui casse", detail: "Une pièce manquante" },
      { label: "Planifier", detail: "hermes cron, en dernier" },
    ]}
    accentIndex={2}
  />;
}

export function TerminalCronEtHistoriqueMockup() {
  return <FileCard
    title="Relire la tâche après un lancement"
    description="Exemple : ce que tu vérifies dans le terminal après le premier essai de la tâche."
    legend="Tu relis l'état et la sortie avant de la laisser tourner seule."
    ariaLabel="Un terminal ouvert avec hermes cron, puis trois repères à vérifier : la tâche active, la dernière exécution réussie et la sortie livrée sur Telegram."
    accent={EM}
    filename="hermes cron"
    tool="Ghostty"
    lines={[
      { text: "$ hermes cron" },
      { text: "Tâche : veille-marketing, active", tone: "heading" },
      { text: "Dernière exécution : réussie" },
      { text: "Sortie : livrée sur Telegram", tone: "heading" },
    ]}
    annotations={[
      { line: 2, label: "La tâche existe" },
      { line: 3, label: "Elle a tourné" },
      { line: 4, label: "Le rapport est arrivé" },
    ]}
  />;
}

export function VeillePlanifieeAvecFreinDiagram() {
  return <Workflow
    title="La veille avance, la publication attend"
    description="Chaque matin le rapport arrive tout seul. La publication, elle, reste ton geste."
    legend="Le travail automatique s'arrête au rapport. Après, c'est toi."
    ariaLabel="Perplexity fournit les sources, l'agent prépare trois idées, Telegram livre le rapport, tu choisis une idée, puis tu publies sur Instagram."
    accent={EM}
    actors={["Recherche", "Agent", "Livraison", "Toi", "Réseau"]}
    steps={[
      { actor: 0, label: "Sources", tool: "Perplexity" },
      { actor: 1, label: "Trois idées", tool: "Hermes Agent", transfer: "sources" },
      { actor: 2, label: "Rapport", tool: "Telegram", transfer: "idées" },
      { actor: 3, label: "Ton choix", humanValidation: true, transfer: "rapport" },
      { actor: 4, label: "Publication", tool: "Instagram", transfer: "accord" },
    ]}
    accentIndex={3}
  />;
}

export function PauseNarretePasLeTrainDiagram() {
  return <Fork
    title="La pause n'arrête pas le train"
    description="La pause globale ferme les nouveaux départs. Ce qui est lancé continue."
    legend="Après une pause, relis les livraisons avant de relancer quoi que ce soit."
    ariaLabel="Une pause globale bloque les nouveaux départs, laisse finir les tâches déjà lancées, et oblige à relire les livraisons en attente avant de recommencer."
    accent={EM}
    situation="Pause globale"
    outcomes={[
      { label: "Départs bloqués", condition: "Aucune nouvelle tâche", rejected: true },
      { label: "Déjà lancé", condition: "Finit son travail" },
      { label: "Livraisons", condition: "Tu les relis avant de relancer", recommended: true },
    ]}
  />;
}
