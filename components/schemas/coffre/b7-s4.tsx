import { Cycle, FileCard, Funnel, Steps } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function BilanDuSystemeAnnoteDiagram() {
  return <FileCard
    title="Un bilan, une correction"
    description="Exemple : la revue du mois d'un cabinet dentaire, qui classe les faits avant d'agir."
    legend="Ne corrige pas tout : choisis ce qui aide vraiment le prochain passage."
    ariaLabel="Le bilan du mois sur les rappels de rendez-vous. Un rappel parti deux fois est une erreur à reproduire. Les relances à la main prennent trop de temps. Le rappel la veille au soir a mieux marché, à retester. Un patient absent lundi est du bruit. Une seule correction est choisie, avec sa preuve attendue."
    accent={EM}
    filename="bilan-du-mois.md"
    lines={[
      { text: "# Bilan : rappels de rendez-vous", tone: "heading" },
      { text: "Bloqué : un rappel parti deux fois" },
      { text: "Trop long : relances faites à la main" },
      { text: "Mieux que prévu : rappel la veille au soir" },
      { text: "Décision : garder le rappel par SMS" },
      { text: "Bruit : un patient absent lundi", tone: "muted" },
      { text: "" },
      { text: "Correction choisie : le rappel en double", tone: "heading" },
      { text: "Preuve : un seul rappel au prochain passage" },
    ]}
    annotations={[
      { line: 2, label: "Une erreur à reproduire" },
      { line: 4, label: "Une réussite à retester" },
      { line: 6, label: "Du bruit, on le laisse" },
      { line: 8, label: "Une seule correction à la fois" },
      { line: 9, label: "La preuve attendue" },
    ]}
  />;
}

export function ErreurVersTestDiagram() {
  return <Steps
    title="Une erreur rejouée jusqu'au test"
    description="Une erreur devient un apprentissage seulement quand tu la reproduis, puis la rejoues."
    legend="Écrire « attention » ne corrige rien : rejoue le cas."
    ariaLabel="Cinq étapes pour une erreur. Noter l'écart, la version, l'attendu et l'obtenu. Reproduire le plus petit cas possible. Corriger seulement la première différence. Rejouer le même cas après correction, étape mise en avant. Tester pour que l'erreur ne revienne pas."
    accent={EM}
    accentIndex={3}
    items={[
      { label: "Noter l'écart", detail: "Version, attendu, obtenu" },
      { label: "Reproduire", detail: "Le plus petit cas possible" },
      { label: "Corriger", detail: "Seulement la première différence" },
      { label: "Rejouer", detail: "Le même cas, après correction" },
      { label: "Tester", detail: "Pour que ça ne revienne pas", tools: ["GitHub"] },
    ]}
  />;
}

export function ReussiteVersCandidatDiagram() {
  return <Funnel
    title="Une réussite doit aussi attendre"
    description="Une réussite isolée passe plusieurs filtres avant de devenir une règle de ta méthode."
    legend="Une réussite isolée donne une piste, pas encore une recette."
    ariaLabel="Un entonnoir de cinq étages. Une réussite, un message qui marche mieux une fois. Beaucoup s'arrêtent là, car le moment ou le canal expliquait tout. Comparée avec la même mesure qu'au départ. Retestée dans un cas compatible. Réutilisée sur plusieurs usages cohérents. Enfin, une règle qui rejoint ta méthode."
    accent={EM}
    leakIndex={0}
    leakLabel="Le moment ou le canal expliquait tout"
    stages={[
      { label: "Une réussite", detail: "Un message marche mieux une fois", value: 100, valueLabel: "" },
      { label: "Comparée", detail: "Même mesure qu'au départ", value: 72, valueLabel: "" },
      { label: "Retestée", detail: "Dans un cas compatible", value: 52, valueLabel: "" },
      { label: "Réutilisée", detail: "Plusieurs usages cohérents", value: 36, valueLabel: "" },
      { label: "Règle", detail: "Elle rejoint ta méthode", value: 24, valueLabel: "" },
    ]}
  />;
}

export function RangerAuBonEndroitDiagram() {
  return <Steps
    title="Chaque apprentissage a sa place"
    description="Ce que tu apprends ne va pas toujours au même endroit : voici les sept destinations."
    legend="Une contrainte d'un seul client ne doit pas déformer tes autres projets."
    ariaLabel="Sept destinations. Mémoire, un fait stable avec sa date. SOP, une route qui revient. Skill, un choix entre plusieurs chemins. Modèle, un livrable validé. Test, une erreur qui revient. Journal, une décision durable. Projet, une contrainte d'un seul client, destination mise en avant."
    accent={EM}
    accentIndex={6}
    items={[
      { label: "Mémoire", detail: "Un fait stable, avec sa date" },
      { label: "SOP", detail: "Une route qui revient" },
      { label: "Skill", detail: "Un choix entre plusieurs chemins" },
      { label: "Modèle", detail: "Un livrable validé" },
      { label: "Test", detail: "Une erreur qui revient" },
      { label: "Journal", detail: "Une décision durable" },
      { label: "Projet", detail: "Une contrainte d'un seul client" },
    ]}
  />;
}

export function ParcoursCompletCoffreDiagram() {
  return <Cycle
    title="Le parcours revient au terrain"
    description="De la scène client au projet suivant, chaque tour rend le travail d'après plus clair."
    legend="La boucle se ferme sur le projet suivant, pas dans une bibliothèque."
    ariaLabel="Une boucle de cinq étapes. Client, une scène réelle, point d'entrée. Offre, ce que tu proposes. Cadrer, le produit à faire. Livrer, construire puis regarder ce qui se passe. Apprendre, ranger ce qui reste. Puis le projet suivant recommence, plus clair."
    accent={EM}
    entryIndex={0}
    centerLabel="Le projet suivant, plus clair"
    steps={[
      { label: "Client", detail: "Une scène réelle" },
      { label: "Offre", detail: "Ce que tu proposes" },
      { label: "Cadrer", detail: "Le produit à faire" },
      { label: "Livrer", detail: "Construire, puis regarder" },
      { label: "Apprendre", detail: "Ranger ce qui reste" },
    ]}
  />;
}

export const b7_s4_VISUALS = [
  { name: "BilanDuSystemeAnnote", kind: "maquette", chapter: "b7-s4", component: BilanDuSystemeAnnoteDiagram },
  { name: "ErreurVersTest", kind: "schema", chapter: "b7-s4", component: ErreurVersTestDiagram },
  { name: "ReussiteVersCandidat", kind: "schema", chapter: "b7-s4", component: ReussiteVersCandidatDiagram },
  { name: "RangerAuBonEndroit", kind: "schema", chapter: "b7-s4", component: RangerAuBonEndroitDiagram },
  { name: "ParcoursCompletCoffre", kind: "schema", chapter: "b7-s4", component: ParcoursCompletCoffreDiagram },
] as const satisfies readonly HandcraftedVisual[];
