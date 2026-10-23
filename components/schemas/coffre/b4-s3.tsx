import { Cycle, FileCard, Ladder, Steps, ToolMap } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function SecondCerveauTroisEtagesDiagram() {
  return <Ladder
    title="Trois étages, trois endroits"
    description="Méthodes, notes et données du jour ne changent pas au même rythme, donc ne vivent pas au même endroit."
    legend="Plus une information change vite, plus elle doit rester dans le logiciel qui fait foi."
    ariaLabel="Une échelle de trois marches, de ce qui change rarement à ce qui change chaque jour. Les méthodes vivent dans un skill. Les notes de ce que tu as appris vivent dans le second cerveau. Les données du jour, comme le statut d'une facture, vivent dans le système métier, mis en avant."
    accent={EM}
    lowLabel="Change rarement"
    highLabel="Change chaque jour"
    accentIndex={2}
    rungs={[
      { label: "Méthodes", detail: "Ta manière de travailler, en skill" },
      { label: "Notes", detail: "Ce que tu as appris" },
      { label: "Données du jour", detail: "Le statut d'une facture" },
    ]}
  />;
}

export function SystemeMetierVsSecondCerveauDiagram() {
  return <ToolMap
    title="Retrouver ne fait pas foi"
    description="Exemple : le paiement d'une facture vit dans Stripe, la méthode de relance vit dans Obsidian."
    legend="Le second cerveau pointe vers la source, il ne recopie jamais le statut du jour."
    ariaLabel="Deux rôles. Ce qui fait foi : Stripe garde le paiement reçu ou non, Supabase garde les données clients à jour. Ce qui aide à retrouver : Obsidian garde la méthode de relance avec sa date de revue, GitHub garde l'historique daté des skills."
    accent={EM}
    accentGroup={0}
    groups={[
      { role: "Fait foi aujourd'hui", tools: [
        { name: "Stripe", description: "Le paiement reçu ou non" },
        { name: "Supabase", description: "Les données clients à jour" },
      ] },
      { role: "Aide à retrouver", tools: [
        { name: "Obsidian", description: "La méthode de relance, datée" },
        { name: "GitHub", description: "L'historique des skills" },
      ] },
    ]}
  />;
}

export function TerrainAvantBibliothequeDiagram() {
  return <Steps
    title="Le terrain d'abord"
    description="La méthode s'écrit après un vrai travail vendu, livré et observé, jamais avant."
    legend="Cent règles écrites avant le premier projet cassent au premier vrai client."
    ariaLabel="Quatre étapes dans l'ordre : vendre un vrai travail, le livrer jusqu'au bout, observer ce qui revient, puis écrire la méthode qui mérite de rester. Observer est mis en avant."
    accent={EM}
    accentIndex={2}
    items={[
      { label: "Vendre", detail: "Un vrai travail, un vrai client" },
      { label: "Livrer", detail: "Le projet jusqu'au bout" },
      { label: "Observer", detail: "Ce qui revient d'un projet à l'autre" },
      { label: "Écrire", detail: "Ce qui mérite de rester" },
    ]}
  />;
}

export function BoucleSkillVivantDiagram() {
  return <Cycle
    title="Un skill qui apprend"
    description="Une erreur vue sur un projet devient une correction testée, puis une nouvelle version."
    legend="Une seule erreur reste dans le dossier du projet tant qu'elle ne revient pas."
    ariaLabel="Une boucle de cinq étapes : utiliser le skill sur un vrai projet, noter l'erreur dans le dossier du projet, la reproduire pour voir si elle revient, corriger et ajouter un test, puis versionner sur GitHub avec la source, la date et la raison. Le projet suivant reprend la boucle."
    accent={EM}
    entryIndex={0}
    centerLabel="Le projet suivant reteste le skill"
    steps={[
      { label: "Utiliser", detail: "Sur un vrai projet" },
      { label: "Noter", detail: "L'erreur, dans le projet" },
      { label: "Reproduire", detail: "Revient-elle vraiment ?" },
      { label: "Corriger", detail: "Puis ajouter un test" },
      { label: "Versionner", detail: "Source, date, raison", tool: "GitHub" },
    ]}
  />;
}

export function DecisionRangeeAnnoteeMockup() {
  return <FileCard
    title="Une décision complète"
    description="Exemple : un monteur vidéo range la règle née de deux projets où la musique couvrait la voix."
    legend="Avec son contexte et sa date, la règle peut être revue au lieu de vieillir en silence."
    ariaLabel="Une note Obsidian intitulée Musique sous la voix. Elle donne la situation, la source de deux projets, la décision de baisser la musique sous la voix, la raison, un cas contraire pour un clip sans voix off, le prochain contrôle avant livraison et une date de revue."
    accent={EM}
    filename="decisions/musique-sous-la-voix.md"
    tool="Obsidian"
    lines={[
      { text: "# Musique sous la voix", tone: "heading" },
      { text: "Situation : la musique couvre la voix" },
      { text: "Source : deux projets, passages chargés" },
      { text: "Décision : baisser la musique sous la voix" },
      { text: "Pourquoi : corrigé deux fois à la main" },
      { text: "Cas contraire : un clip sans voix off" },
      { text: "Prochain contrôle : écoute avant livraison" },
      { text: "Revue : 23 janvier 2027", tone: "muted" },
    ]}
    annotations={[
      { line: 2, label: "Le contexte" },
      { line: 3, label: "D'où vient la règle" },
      { line: 6, label: "Ce qui la rendrait fausse" },
      { line: 7, label: "Le contrôle suivant" },
      { line: 8, label: "Quand la revoir" },
    ]}
  />;
}

export const b4_s3_VISUALS = [
  { name: "SecondCerveauTroisEtages", kind: "schema", chapter: "b4-s3", component: SecondCerveauTroisEtagesDiagram },
  { name: "SystemeMetierVsSecondCerveau", kind: "schema", chapter: "b4-s3", component: SystemeMetierVsSecondCerveauDiagram },
  { name: "TerrainAvantBibliotheque", kind: "schema", chapter: "b4-s3", component: TerrainAvantBibliothequeDiagram },
  { name: "BoucleSkillVivant", kind: "schema", chapter: "b4-s3", component: BoucleSkillVivantDiagram },
  { name: "DecisionRangeeAnnotee", kind: "maquette", chapter: "b4-s3", component: DecisionRangeeAnnoteeMockup },
] as const satisfies readonly HandcraftedVisual[];
