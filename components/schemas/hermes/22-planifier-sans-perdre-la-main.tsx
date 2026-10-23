import { FileCard, Fork, Steps, Workflow } from "../kit";

export function CalendrierTachePlanifieeMockup() {
  return <FileCard title="Une routine complète dans le calendrier" description="L'horaire, le skill, les sources, la destination et l'arrêt restent visibles." ariaLabel="Une carte Veille marketing dans Google Agenda indique Lecture seule, Rapport Telegram et Aucune publication." filename="Veille marketing" tool="Google Agenda" lines={[
    { text: "Horaire : chaque matin à 07:00" },
    { text: "Skill : veille-marketing" },
    { text: "Sources : liste validée" },
    { text: "Lecture seule", tone: "heading" },
    { text: "Destination : Rapport Telegram" },
    { text: "Arrêt : aucune source récente" },
    { text: "Responsable : Lina" },
    { text: "Aucune publication", tone: "heading" },
  ]} annotations={[
    { line: 1, label: "Quand" },
    { line: 2, label: "Avec quoi" },
    { line: 7, label: "Qui regarde" },
  ]} />;
}

export function ManuelPuisPlanifieDiagram() {
  return <Steps title="La planification vient en dernier" description="Deux preuves tamponnent le permis avant l'horaire." ariaLabel="Essai manuel puis Cas qui casse doivent réussir avant Planifier. Planifier est mis en avant." items={[
    { label: "Essai manuel", detail: "Le chemin normal réussit", tools: ["Hermes Agent"] },
    { label: "Cas qui casse", detail: "L'erreur est contrôlée", tools: ["Hermes Agent"] },
    { label: "Planifier", detail: "L'horaire peut démarrer", tools: ["Google Agenda"] },
  ]} accentIndex={2} />;
}

export function TerminalCronEtHistoriqueMockup() {
  return <FileCard title="Créer, lancer et relire la tâche" description="Le terminal garde l'état final et la sortie livrée." ariaLabel="Un terminal Hermes cron montre Tâche active, Dernière exécution et Sortie livrée avec trois repères." filename="hermes cron" tool="Ghostty" lines={[
    { text: "$ hermes cron list" },
    { text: "veille-marketing     Tâche active", tone: "heading" },
    { text: "$ hermes cron run veille-marketing" },
    { text: "Dernière exécution : réussie" },
    { text: "Sortie livrée : Telegram", tone: "heading" },
  ]} annotations={[
    { line: 2, label: "Choisis la tâche" },
    { line: 3, label: "Lance un essai" },
    { line: 4, label: "Relis l'état" },
  ]} />;
}

export function VeillePlanifieeAvecFreinDiagram() {
  return <Workflow title="La veille avance, la publication attend" description="Le travail automatique s'arrête devant ton choix." ariaLabel="Perplexity fournit les Sources, Hermes prépare Trois idées, Telegram les livre, Ton choix valide puis Instagram publie." actors={["Recherche", "Agent", "Toi", "Réseau"]} steps={[
    { actor: 0, label: "Sources", tool: "Perplexity" },
    { actor: 1, label: "Trois idées", tool: "Hermes Agent", transfer: "sources" },
    { actor: 1, label: "Rapport", tool: "Telegram" },
    { actor: 2, label: "Ton choix", humanValidation: true, transfer: "rapport" },
    { actor: 3, label: "Publication", tool: "Instagram", transfer: "accord" },
  ]} accentIndex={3} />;
}

export function PauseNarretePasLeTrainDiagram() {
  return <Fork title="La pause ferme les nouveaux départs" description="Le travail déjà lancé continue jusqu'à son état final." ariaLabel="Nouveaux départs bloqués n'arrête pas Déjà lancé. Il faut Vérifier les livraisons." situation="Pause globale"
    outcomes={[
      { label: "Nouveaux départs bloqués", condition: "La barrière reste fermée", rejected: true },
      { label: "Déjà lancé", condition: "Le train rejoint son état final", recommended: true },
      { label: "Vérifier les livraisons", condition: "Relire avant de recommencer" },
    ]} />;
}
