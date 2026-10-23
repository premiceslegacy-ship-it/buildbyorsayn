import { Compare, FileCard, Fork, Ladder, WebPage } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function IdeeFloueScenePreciseDiagram() {
  return <Compare
    title="De l'idée floue à la scène"
    description="Exemple d'un cabinet qui reçoit ses dossiers par e-mail : la même demande, racontée comme un usage."
    legend="Un projet devient constructible quand son usage se raconte sans technologie."
    ariaLabel="Une comparaison oppose une idée floue, un agent qui gère les dossiers pour mes clients afin de gagner du temps, à une scène précise : mardi matin avant la réunion, la gestionnaire ouvre le dossier du jour et trouve une synthèse prête avec les pièces manquantes."
    accent={EM}
    beforeTitle="Idée floue"
    afterTitle="Scène précise"
    rows={[
      { before: "Un agent qui gère les dossiers", after: "Mardi matin, avant la réunion" },
      { before: "Pour tous mes clients", after: "La gestionnaire ouvre le dossier du jour" },
      { before: "Pour gagner du temps", after: "La synthèse est prête, pièces manquantes listées" },
    ]}
  />;
}

export function ChoisirLeModeProduitDiagram() {
  return <Fork
    title="Cinq façons d'utiliser le produit"
    description="Le mode choisi change les comptes, les données, la facturation et la maintenance."
    legend="Choisis le mode qui ressemble à la façon dont le client achète et travaille."
    ariaLabel="Une question, comment le client achète et travaille, mène à cinq modes de produit : outil interne pour une seule équipe, instance dédiée avec une copie par client, application partagée entre plusieurs organisations, service intégré dans une offre plus large et cockpit pour piloter le service."
    accent={EM}
    situation="Comment le client achète et travaille"
    outcomes={[
      { label: "Interne", condition: "Une seule équipe s'en sert" },
      { label: "Dédié", condition: "Une copie par client" },
      { label: "Partagé", condition: "Plusieurs clients séparés" },
      { label: "Intégré", condition: "Caché dans une offre" },
      { label: "Cockpit", condition: "Ton équipe pilote" },
    ]}
  />;
}

export function OracleProjectAnnoteDiagram() {
  return <FileCard
    title="Le dossier garde les décisions"
    description="Exemple de dossier projet pour un cabinet : ce qui est décidé, ce qui reste dehors et ce qui attend une réponse."
    legend="Une autre personne doit pouvoir expliquer ce qui sera construit en le lisant."
    ariaLabel="Un fichier ORSAYN-PROJECT.md annoté montre la scène, le résultat, le mode outil interne, des données sensibles, ce qui reste hors du produit, une décision confirmée et une question à confirmer vendredi avec la responsable métier."
    accent={EM}
    filename="ORSAYN-PROJECT.md"
    lines={[
      { text: "# Préparer les dossiers du cabinet", tone: "heading" },
      { text: "Scène : mardi matin, avant le rendez-vous" },
      { text: "Résultat : synthèse et pièces manquantes" },
      { text: "Mode : outil interne, une seule équipe" },
      { text: "Données : documents clients sensibles" },
      { text: "Hors produit : aucun envoi au client" },
      { text: "## Décisions", tone: "heading" },
      { text: "La gestionnaire confirme le dossier complet" },
      { text: "## À confirmer", tone: "heading" },
      { text: "Qui peut lire les dossiers ? Vendredi", tone: "muted" },
    ]}
    annotations={[
      { line: 2, label: "La scène" },
      { line: 4, label: "Le mode du produit" },
      { line: 5, label: "Le risque à protéger" },
      { line: 6, label: "Ce qui reste dehors" },
      { line: 8, label: "Une décision prise" },
      { line: 10, label: "Une inconnue datée" },
    ]}
  />;
}

export function IADansLeProduitDiagram() {
  return <WebPage
    title="L'IA reste derrière le geste"
    description="L'écran du cabinet montre le dossier préparé, ses sources et la validation attendue, pas l'agent."
    legend="La personne voit son travail avancer, pas la technique qui travaille."
    ariaLabel="Un écran de dossier client annoté montre le résultat préparé, deux pièces manquantes, les documents sources cités, le bouton de validation et la mention que rien ne part au client sans accord."
    accent={EM}
    page={{
      url: "cabinet.app/dossiers",
      nav: "Dossiers du jour",
      eyebrow: "Synthèse préparée",
      heading: "Dossier Martin, deux pièces à récupérer",
      subtitle: "Bail expiré, relevé absent. Rien ne part au client sans toi.",
      button: "Relire et valider",
      screen: { title: "Dossier Martin", rows: [{ left: "Avis d'impôt", right: "reçu", state: "ok" }, { left: "Bail", right: "expiré", state: "warn" }, { left: "Relevé", right: "absent", state: "warn" }], footer: "Rien ne part au client sans ton accord" },
      proofs: ["Impôts", "Bail", "Relevé"],
    }}
    annotations={[
      { number: 1, target: "heading", label: "Le résultat préparé", why: "Le dossier annonce son résultat avant tout détail.", alt: "Un indicateur de complétude : quatre pièces sur six." },
      { number: 2, target: "subtitle", label: "La limite visible", why: "La phrase dit ce qui manque et ce qui ne part pas sans toi.", alt: "Une pastille Brouillon à côté du titre." },
      { number: 3, target: "button", label: "Ta validation", why: "L'action humaine est le bouton principal, pas l'automatisme.", alt: "Valider et Corriger côte à côte." },
      { number: 4, target: "proofs", label: "Les sources citées", why: "Chaque affirmation renvoie à un document que tu peux ouvrir.", alt: "Un lien direct vers la ligne du document." },
    ]}
  />;
}

export function DossierSelonLeRisqueDiagram() {
  return <Ladder
    title="Le dossier grandit avec le risque"
    description="Un petit outil tient en quelques décisions. Un portail médical demande accès, rôles et tests."
    legend="Crée les documents utiles au projet, jamais une bibliothèque par habitude."
    ariaLabel="Une échelle monte du petit outil qui renomme des fichiers, avec quelques décisions, à l'outil d'équipe avec accès et données notés, puis au portail médical avec rôles, accès et tests précis, mis en avant."
    accent={EM}
    accentIndex={2}
    lowLabel="Risque faible"
    highLabel="Risque fort"
    rungs={[
      { label: "Petit outil", detail: "Quelques décisions suffisent" },
      { label: "Outil d'équipe", detail: "Accès et données notés" },
      { label: "Portail médical", detail: "Rôles, accès et tests précis" },
    ]}
  />;
}

export const b6_s1_VISUALS = [
  { name: "IdeeFloueScenePrecise", kind: "schema", chapter: "b6-s1", component: IdeeFloueScenePreciseDiagram },
  { name: "ChoisirLeModeProduit", kind: "schema", chapter: "b6-s1", component: ChoisirLeModeProduitDiagram },
  { name: "OracleProjectAnnote", kind: "maquette", chapter: "b6-s1", component: OracleProjectAnnoteDiagram },
  { name: "IADansLeProduit", kind: "schema", chapter: "b6-s1", component: IADansLeProduitDiagram },
  { name: "DossierSelonLeRisque", kind: "schema", chapter: "b6-s1", component: DossierSelonLeRisqueDiagram },
] as const satisfies readonly HandcraftedVisual[];
