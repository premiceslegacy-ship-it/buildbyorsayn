import { Cycle, FileCard, Fork, WebPage, Workflow } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function QuiFaitQuoiProduitDiagram() {
  return <Workflow
    title="Qui fait quoi dans le produit"
    description="ORACLE tient la direction, deux sous-skills approfondissent leur métier, l'intégrateur relit l'ensemble."
    legend="Un expert peut réussir sa partie et casser une dépendance ailleurs."
    ariaLabel="Un relais entre quatre rôles. ORACLE fixe les décisions du projet. Le sous-skill visuel reçoit ces décisions et dessine ce que la personne voit. Le sous-skill backend reçoit les mêmes décisions et protège les données. L'intégrateur, mis en avant, reçoit les deux sorties, relit l'ensemble et décide."
    accent={EM}
    accentIndex={3}
    actors={["ORACLE", "Visuel", "Backend", "Intégrateur"]}
    steps={[
      { actor: 0, label: "Décisions" },
      { actor: 1, label: "Écran", transfer: "les décisions" },
      { actor: 2, label: "Données", transfer: "les décisions" },
      { actor: 3, label: "Relecture", transfer: "deux sorties", humanValidation: true },
    ]}
  />;
}

export function FormulaireDeuxMetiersDiagram() {
  return <WebPage
    title="Un formulaire, deux métiers"
    description="Exemple : la demande de rendez-vous du cabinet de Julie, kiné, vue par le visuel et par le backend."
    legend="Les deux métiers lisent le même contrat des rôles avant de travailler."
    ariaLabel="Une page de création de compte pour un cabinet de kiné. Le titre et l'ordre des champs relèvent du visuel. Les messages d'erreur aussi. Le choix du rôle suit le contrat commun : patient, accueil, praticien. Le bouton Créer mon compte déclenche le backend, qui vérifie les données et les droits."
    accent={EM}
    page={{
      url: "cabinet-kine.fr/compte",
      nav: "Cabinet",
      eyebrow: "Créer un compte",
      heading: "Demande ton rendez-vous en ligne",
      subtitle: "Ton nom, ton e-mail, puis le rôle demandé.",
      button: "Créer mon compte",
      imageLabel: "Rôle : patient, accueil, praticien",
      proofs: ["E-mail déjà utilisé", "Rôle non autorisé"],
    }}
    annotations={[
      { number: 1, target: "heading", label: "Visuel : ordre et libellés" },
      { number: 2, target: "proofs", label: "Visuel : messages d'erreur" },
      { number: 3, target: "image", label: "Contrat commun : trois rôles" },
      { number: 4, target: "button", label: "Backend : vérifie données et droits" },
    ]}
  />;
}

export function BoucleDelegationDiagram() {
  return <Cycle
    title="La délégation revient au produit"
    description="Le spécialiste ne garde jamais le dernier mot : son travail revient au projet avant la suite."
    legend="Note la version retenue et sa raison : la suivante sait quoi remplacer."
    ariaLabel="Une boucle en cinq étapes. Le projet formule la décision, point d'entrée mis en avant. Le spécialiste produit son travail et ses contrôles. L'intégrateur réunit et cherche les contradictions. Le projet accepte ou corrige. La version retenue est notée avec sa raison, puis la décision suivante commence."
    accent={EM}
    entryIndex={0}
    centerLabel="Décision suivante, sur la version notée"
    steps={[
      { label: "Décider", detail: "Le projet formule la décision" },
      { label: "Produire", detail: "Travail et contrôles remis" },
      { label: "Réunir", detail: "L'intégrateur cherche les écarts" },
      { label: "Trancher", detail: "Le projet accepte ou corrige" },
      { label: "Noter", detail: "La version retenue et sa raison" },
    ]}
  />;
}

export function ChoisirDirectSkillOuDelegationDiagram() {
  return <Fork
    title="Le plus petit mode suffisant"
    description="Trois questions choisissent le mode : expertise différente, risque qui change, sous-tâches séparables."
    legend="Plus d'agents veut dire plus de transmissions, pas un meilleur résultat."
    ariaLabel="Une tâche arrive. Trois chemins possibles. Direct, conseillé, quand la tâche est simple et sans risque nouveau. Skill, quand elle demande une méthode spécialisée. Délégation, quand le travail est ouvert et que les sous-tâches avancent sans se gêner."
    accent={EM}
    situation="Une tâche arrive dans le projet"
    outcomes={[
      { label: "Direct", condition: "Tâche simple, sans risque nouveau", recommended: true },
      { label: "Skill", condition: "Une méthode spécialisée suffit" },
      { label: "Délégation", condition: "Travail ouvert, sous-tâches séparées" },
    ]}
  />;
}

export function RevueDesRolesDiagram() {
  return <FileCard
    title="Chaque rôle testé sur l'écran"
    description="Exemple : la revue des trois rôles du cabinet de Julie, avec ce que chacun voit et ce qu'il ne voit pas."
    legend="Un refus se teste aussi sérieusement qu'une autorisation."
    ariaLabel="Un fichier de revue des rôles. Le patient voit ses rendez-vous mais pas les notes médicales. L'accueil voit les horaires mais pas les notes médicales. Le praticien voit ses rendez-vous mais pas les agendas des autres. Les annotations soulignent les trois refus testés."
    accent={EM}
    filename="revue-des-roles.md"
    tool="Supabase"
    lines={[
      { text: "# Revue des rôles, cabinet", tone: "heading" },
      { text: "Patient : ses rendez-vous, autorisé" },
      { text: "Patient : notes médicales, refusé" },
      { text: "Accueil : horaires, autorisé" },
      { text: "Accueil : notes médicales, refusé" },
      { text: "Praticien : son agenda, autorisé" },
      { text: "Praticien : autres agendas, refusé" },
    ]}
    annotations={[
      { line: 3, label: "Le patient ne lit rien d'autre" },
      { line: 5, label: "L'accueil sans les notes" },
      { line: 7, label: "Le praticien voit le sien" },
    ]}
  />;
}

export const b6_s3_VISUALS = [
  { name: "QuiFaitQuoiProduit", kind: "schema", chapter: "b6-s3", component: QuiFaitQuoiProduitDiagram },
  { name: "FormulaireDeuxMetiers", kind: "maquette", chapter: "b6-s3", component: FormulaireDeuxMetiersDiagram },
  { name: "BoucleDelegation", kind: "schema", chapter: "b6-s3", component: BoucleDelegationDiagram },
  { name: "ChoisirDirectSkillOuDelegation", kind: "schema", chapter: "b6-s3", component: ChoisirDirectSkillOuDelegationDiagram },
  { name: "RevueDesRoles", kind: "maquette", chapter: "b6-s3", component: RevueDesRolesDiagram },
] as const satisfies readonly HandcraftedVisual[];
