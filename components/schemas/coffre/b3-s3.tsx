import { Compare, FileCard, Fork, Ladder, Workflow } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function BesoinAvantFrameworkDiagram() {
  return <Ladder
    title="Le produit fixe le poids"
    description="Chaque marche ajoute une couche technique : réglages, mises à jour et endroits où ça casse."
    legend="Choisis la marche la plus basse qui couvre ton besoin critique."
    ariaLabel="Trois marches de poids technique : un site de contenu demande surtout des pages claires, un tableau de bord ajoute des interactions et des données, un espace client ajoute des comptes, des droits et des actions serveur. La première marche est mise en avant."
    accent={EM}
    lowLabel="Léger"
    highLabel="Lourd"
    accentIndex={0}
    rungs={[
      { label: "Site de contenu", detail: "Des pages et des articles clairs" },
      { label: "Tableau de bord", detail: "Interactions et données" },
      { label: "Espace client", detail: "Comptes, droits, serveur" },
    ]}
  />;
}

export function BibliothequeEtFrameworksDiagram() {
  return <Compare
    title="Bibliothèque ou framework"
    description="React construit des morceaux d'interface. Astro et Next.js donnent un cadre à tout le projet."
    legend="Aucun ne gagne partout : le bon choix dépend de ce que la personne doit faire."
    ariaLabel="À gauche, React, une bibliothèque : des composants d'interface, sans décider seule des pages ni des données. À droite, Astro et Next.js, des frameworks : Astro pour les sites riches en contenu, Next.js pour une application complète avec des fonctions serveur."
    accent={EM}
    beforeTitle="React, une bibliothèque"
    afterTitle="Astro et Next.js"
    rows={[
      { before: "Des composants d'interface", after: "Un cadre pour tout le projet" },
      { before: "Ne décide pas des pages", after: "Astro : sites de contenu" },
      { before: "Ni des données", after: "Next.js : application complète" },
    ]}
  />;
}

export function FicheArchitectureVisibleDiagram() {
  return <FileCard
    title="La fiche avant l'installation"
    description="Exemple d'une coach avec réservations : la fiche tient sur un écran et rend le choix discutable."
    legend="Compare les options sur le risque principal, pas sur leurs listes de fonctions."
    ariaLabel="Fiche technique d'un site de coach avec réservations : type de produit, site public et espace connecté ; pages ; données ; comptes ; hébergement ; maintenance ; risque principal, voir les réservations des autres ; choix, Next.js à confirmer par un test."
    accent={EM}
    filename="fiche-technique.md"
    tool="Next.js"
    lines={[
      { text: "# Fiche technique : coaching", tone: "heading" },
      { text: "Produit : site public et espace connecté" },
      { text: "Pages : programmes, tarifs, contact" },
      { text: "Données : créneaux et réservations" },
      { text: "Comptes : une cliente par compte" },
      { text: "Hébergement : Vercel" },
      { text: "Maintenance : moi, une heure par mois" },
      { text: "Risque : voir les réservations des autres" },
      { text: "Choix : Next.js, à confirmer par un test" },
    ]}
    annotations={[
      { line: 2, label: "Le type de produit d'abord" },
      { line: 5, label: "Les comptes changent tout" },
      { line: 8, label: "Le besoin le plus difficile" },
      { line: 9, label: "Un choix, et sa condition" },
    ]}
  />;
}

export function PlanPuisSessionPropreDiagram() {
  return <Workflow
    title="Penser, valider, puis construire"
    description="Une session prépare le plan sans toucher aux fichiers. Tu tranches. Une session neuve construit."
    legend="La session neuve reçoit le plan final, sans les vingt essais abandonnés."
    ariaLabel="Une première session lit le brief et compare les choix, puis écrit le plan. Tu valides les décisions difficiles à changer. Une nouvelle session reçoit la direction, construit une étape précise, puis la vérifie selon des critères clairs. Ta validation est mise en avant."
    accent={EM}
    actors={["1re session", "Toi", "Session neuve"]}
    accentIndex={2}
    steps={[
      { actor: 0, label: "Comparer", tool: "Claude Code" },
      { actor: 0, label: "Écrire le plan", transfer: "options" },
      { actor: 1, label: "Valider", transfer: "plan", humanValidation: true },
      { actor: 2, label: "Construire", tool: "Codex", transfer: "direction" },
      { actor: 2, label: "Vérifier", transfer: "étape" },
    ]}
  />;
}

export function TestCritiqueAvantChoixDiagram() {
  return <Fork
    title="Le test tranche"
    description="Exemple d'un portail : chaque option affronte la connexion, le refus d'accès et la lecture des données."
    legend="Construis le plus petit test qui pourrait faire échouer ton choix."
    ariaLabel="Une option est testée sur le risque principal. Si elle passe, tu la retiens avec ses limites. Si elle échoue, tu l'écartes même si elle te plaît. Si le résultat est flou, tu refais un test plus petit. Passer le test est le chemin conseillé."
    accent={EM}
    situation="Une option face au test critique"
    outcomes={[
      { label: "Elle passe", condition: "Tu la retiens, avec ses limites", recommended: true },
      { label: "Résultat flou", condition: "Tu refais un test plus petit" },
      { label: "Elle échoue", condition: "Tu l'écartes, même si elle plaît", rejected: true },
    ]}
  />;
}

export const b3_s3_VISUALS = [
  { name: "BesoinAvantFramework", kind: "schema", chapter: "b3-s3", component: BesoinAvantFrameworkDiagram },
  { name: "BibliothequeEtFrameworks", kind: "schema", chapter: "b3-s3", component: BibliothequeEtFrameworksDiagram },
  { name: "FicheArchitectureVisible", kind: "maquette", chapter: "b3-s3", component: FicheArchitectureVisibleDiagram },
  { name: "PlanPuisSessionPropre", kind: "schema", chapter: "b3-s3", component: PlanPuisSessionPropreDiagram },
  { name: "TestCritiqueAvantChoix", kind: "schema", chapter: "b3-s3", component: TestCritiqueAvantChoixDiagram },
] as const satisfies readonly HandcraftedVisual[];
