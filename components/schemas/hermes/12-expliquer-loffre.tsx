import { Compare, Steps } from "../kit";

export function SceneTravailPreuveChoixDiagram() {
  return <Steps title="Une offre montre le travail" description="La scène, la préparation, la preuve et le choix restent visibles." ariaLabel="Quatre vignettes montrent Sa journée, Travail préparé, Preuve et Son choix. Son choix est mis en avant." items={[
    { label: "Sa journée", detail: "Le problème réel" },
    { label: "Travail préparé", detail: "Ce que tu fais" },
    { label: "Preuve", detail: "Ce qui est vérifiable" },
    { label: "Son choix", detail: "La personne décide" },
  ]} accentIndex={3} />;
}

export function OffreCRMAvantApresMockup() {
  return <Compare title="De la promesse vague à la fiche utile" description="L'écran montre ce que le prospect et l'équipe peuvent décider." ariaLabel="Une promesse Agent IA de qualification est comparée à une fiche CRM qui montre la situation, le manque et la prochaine action." beforeTitle="Agent IA de qualification" afterTitle="Fiche prospect" rows={[
    { before: "Automatise la qualification", after: "Situation : rénovation d'un commerce" },
    { before: "Gagne du temps", after: "Manque : surface et date" },
    { before: "Agent intelligent", after: "Prochaine action : Ce qu'il faut demander maintenant" },
  ]} />;
}

export function PreuveAuMemeNiveauDiagram() {
  return <Compare title="La preuve répond à la promesse" description="Chaque promesse demande une preuve du même niveau." ariaLabel="Dossier complet est équilibré par Deux dossiers relus. Moins de retours est équilibré par Corrections comptées." beforeTitle="Promesse" afterTitle="Preuve" rows={[
    { before: "Dossier complet", after: "Deux dossiers relus" },
    { before: "Moins de retours", after: "Corrections comptées" },
  ]} />;
}
