import { Chat, Compare, FileCard, Ladder, Steps } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function InstallerOracleQuatreGestesDiagram() {
  return <Steps
    title="Quatre gestes, dans cet ordre"
    description="Le dossier du skill est rangé au bon endroit, vérifié dans la liste, puis chargé par une conversation neuve."
    legend="Chaque geste laisse un résultat que tu peux voir avant le suivant."
    ariaLabel="Quatre gestes pour installer le skill. Télécharger le dossier depuis le bouton du chapitre. Le ranger dans l'emplacement de skills de ton outil, par exemple Claude Code ou Codex. Vérifier qu'il apparaît dans la liste, étape mise en avant. Puis ouvrir une nouvelle conversation."
    accent={EM}
    accentIndex={2}
    items={[
      { label: "Télécharger", detail: "Le dossier, depuis le chapitre" },
      { label: "Ranger", detail: "Dans les skills de ton outil", tools: ["Claude Code", "Codex"] },
      { label: "Vérifier", detail: "Le nom apparaît dans la liste" },
      { label: "Relancer", detail: "Une nouvelle conversation" },
    ]}
  />;
}

export function EcranInstallationOracleDiagram() {
  return <Chat
    title="L'installation se constate"
    description="Exemple : une nouvelle session confirme le nom, la version et l'emplacement du skill avant le premier usage."
    legend="Si le nom n'apparaît pas, corrige l'emplacement avant d'aller plus loin."
    ariaLabel="Une conversation dans une nouvelle session. Tu demandes quels skills sont visibles. L'agent répond qu'il voit oracle-by-orsayn en version 1.0, rangé dans le dossier de skills du projet. Tu lui demandes de noter cette version dans le projet. En coulisse : le dossier est rangé dans les skills de Claude Code, le nom et la version sont lus dans la liste, la version est notée."
    accent={EM}
    platform="Neutre"
    contact="Nouvelle session"
    messages={[
      { from: "person", text: "Quels skills vois-tu pour ce projet ?", time: "10:02" },
      { from: "agent", text: "Je vois oracle-by-orsayn, version 1.0.", time: "10:02" },
      { from: "agent", text: "Il est rangé dans le dossier de skills du projet.", time: "10:03" },
      { from: "person", text: "Note cette version dans le projet.", time: "10:04" },
    ]}
    backstageTitle="Ce que tu constates"
    actions={[
      { label: "Dossier rangé dans les skills", tool: "Claude Code" },
      { label: "Nom et version lus dans la liste" },
      { label: "Version notée dans le projet" },
    ]}
  />;
}

export function PremierCadrageSeulementDiagram() {
  return <Compare
    title="Cadrer d'abord, coder plus tard"
    description="Le premier usage produit seulement le dossier projet, pour laisser le temps d'une vraie relecture."
    legend="Une sortie bien présentée peut encore cacher une hypothèse non confirmée."
    ariaLabel="Deux colonnes. Pas pour ce premier essai : l'architecture, le code, toute action externe. Ce premier essai : la scène métier et ses sources, le premier dossier projet, une relecture ligne par ligne."
    accent={EM}
    beforeTitle="Pas pour ce premier essai"
    afterTitle="Ce premier essai"
    rows={[
      { before: "L'architecture", after: "La scène métier et ses sources" },
      { before: "Le code", after: "Le premier dossier projet" },
      { before: "Toute action externe", after: "Une relecture ligne par ligne" },
    ]}
  />;
}

export function UneErreurNeDevientPasUneRegleDiagram() {
  return <Ladder
    title="Un cas ne fait pas règle"
    description="Un seul cas corrige le dossier du projet. Le skill change seulement quand la règle tient ailleurs."
    legend="Monte d'une marche seulement avec une preuve venue d'un autre projet."
    ariaLabel="Une échelle de quatre marches, du projet vers le skill. Un seul cas, mis en avant, corrige le dossier du projet. Une erreur qui revient doit d'abord être reproduite. Une erreur reproduite peut justifier un nouveau contrôle. Plusieurs réussites comparées peuvent proposer une nouvelle règle du skill."
    accent={EM}
    accentIndex={0}
    lowLabel="Le projet"
    highLabel="Le skill"
    rungs={[
      { label: "Un seul cas", detail: "Corrige le dossier du projet" },
      { label: "Erreur qui revient", detail: "Reproduis-la d'abord" },
      { label: "Nouveau contrôle", detail: "Si elle se reproduit ailleurs" },
      { label: "Nouvelle règle", detail: "Après plusieurs réussites comparées" },
    ]}
  />;
}

export function ReadbackOracleProjectDiagram() {
  return <FileCard
    title="Relire comme une personne extérieure"
    description="Exemple : le premier dossier de Yacine, pâtissier, avec chaque ligne marquée avant toute décision."
    legend="Cherche ce qui manque pour décider, pas seulement les fautes."
    ariaLabel="Le fichier ORSAYN-PROJECT.md d'un carnet de commandes de gâteaux. Deux lignes confirmées : Yacine est seul utilisateur, les clients remplissent un formulaire simple. Une ligne à vérifier : les allergies visibles partout. Une ligne inconnue : le délai minimum de commande. Les comptes clients sont hors projet. Chaque ligne nomme qui répond, et la prochaine action est la relecture avec Yacine."
    accent={EM}
    filename="ORSAYN-PROJECT.md"
    lines={[
      { text: "# Carnet de commandes, pâtisserie", tone: "heading" },
      { text: "Confirmé : Yacine seul utilisateur" },
      { text: "Confirmé : formulaire client simple" },
      { text: "À vérifier : allergies visibles" },
      { text: "Inconnu : délai minimum de commande" },
      { text: "Hors projet : comptes clients", tone: "muted" },
      { text: "Qui répond : Yacine" },
      { text: "Prochaine action : relire ensemble" },
    ]}
    annotations={[
      { line: 2, label: "Décision sûre" },
      { line: 4, label: "Demande une réponse" },
      { line: 5, label: "Personne ne sait encore" },
      { line: 7, label: "Qui peut trancher" },
    ]}
  />;
}

export const b6_s4_VISUALS = [
  { name: "InstallerOracleQuatreGestes", kind: "schema", chapter: "b6-s4", component: InstallerOracleQuatreGestesDiagram },
  { name: "EcranInstallationOracle", kind: "maquette", chapter: "b6-s4", component: EcranInstallationOracleDiagram },
  { name: "PremierCadrageSeulement", kind: "schema", chapter: "b6-s4", component: PremierCadrageSeulementDiagram },
  { name: "UneErreurNeDevientPasUneRegle", kind: "schema", chapter: "b6-s4", component: UneErreurNeDevientPasUneRegleDiagram },
  { name: "ReadbackOracleProject", kind: "maquette", chapter: "b6-s4", component: ReadbackOracleProjectDiagram },
] as const satisfies readonly HandcraftedVisual[];
