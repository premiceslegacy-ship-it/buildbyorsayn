import { Compare, Cycle, Funnel, Steps } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function DuRetourALaDecisionDiagram() {
  return <Compare
    title="Un retour relié à un passage"
    description="Le même retour, d'abord en impression, puis avec l'étape, les personnes et ce qui s'est passé."
    legend="Un retour devient utile quand tu peux le relier à une décision."
    ariaLabel="Trois retours bruts, formulaire trop long, parcours meilleur et fonction inutilisée, deviennent des retours situés : trois départs avant le champ budget, plus de dossiers validés mais autant de pièces manquantes, une fonction quittée avant la première action."
    accent={EM}
    beforeTitle="Retour brut"
    afterTitle="Retour situé"
    rows={[
      { before: "Le formulaire est trop long.", after: "Trois personnes quittent avant le champ budget." },
      { before: "Le nouveau parcours marche mieux.", after: "Plus de dossiers validés, autant de pièces manquantes." },
      { before: "Personne n'utilise cette fonction.", after: "Ouverte, puis quittée avant la première action." },
    ]}
  />;
}

export function EntonnoirAvecFuiteDiagram() {
  return <Funnel
    title="Regarde où les personnes sortent"
    description="Exemple illustratif d'un dossier de candidature : la chute principale arrive à l'ajout de la pièce."
    legend="Le chiffre localise la fuite. Il ne dit pas encore pourquoi elle existe."
    ariaLabel="Un entonnoir de candidature passe de 100 personnes qui arrivent à 74 qui commencent, 31 qui ajoutent leur pièce et 24 qui valident. La fuite principale se trouve entre commencer et ajouter la pièce."
    accent={EM}
    stages={[
      { label: "Arrivent", value: 100, valueLabel: "100", detail: "ouvrent le dossier" },
      { label: "Commencent", value: 74, valueLabel: "74", detail: "remplissent un champ" },
      { label: "Ajoutent", value: 31, valueLabel: "31", detail: "joignent la pièce" },
      { label: "Valident", value: 24, valueLabel: "24", detail: "terminent" },
    ]}
    leakIndex={1}
    leakLabel="Fuite principale"
    tool="PostHog"
  />;
}

export function ChiffrePuisSceneDiagram() {
  return <Steps
    title="Le chiffre localise, la scène explique"
    description="Après la chute repérée, tu retournes aux cas et aux personnes pour trouver une cause à tester."
    legend="Comme un voyant de voiture : il montre où regarder, pas la panne."
    ariaLabel="Quatre étapes : le chiffre montre où ça chute, tu regardes les cas autour, tu parles aux personnes qui sortent, puis tu formules une cause à tester, mise en avant."
    accent={EM}
    accentIndex={3}
    items={[
      { label: "Le chiffre", detail: "Montre où ça chute", tools: ["PostHog"] },
      { label: "Les cas", detail: "Regarde autour de la chute" },
      { label: "Les personnes", detail: "Parle à celles qui sortent" },
      { label: "Une cause", detail: "Une seule hypothèse à tester" },
    ]}
  />;
}

export function UneCorrectionUneMesureDiagram() {
  return <Cycle
    title="Corrige une cause puis remesure"
    description="Exemple d'une école : un brouillon enregistré est testé contre le niveau de départ, dans le même contexte."
    legend="Une réussite isolée ne devient pas une règle : tu cherches une répétition."
    ariaLabel="Une boucle relie le niveau de départ, une correction avec un brouillon enregistré, la mesure après sur des cas similaires, la vérification de la qualité des pièces et la décision de garder ou retirer."
    accent={EM}
    entryIndex={1}
    centerLabel="Même contexte"
    steps={[
      { label: "Avant", detail: "Écrire le niveau de départ" },
      { label: "Corriger", detail: "Un brouillon enregistré" },
      { label: "Après", detail: "Mêmes cas, même durée" },
      { label: "Qualité", detail: "Les pièces restent bonnes" },
      { label: "Décider", detail: "Garder ou retirer" },
    ]}
  />;
}

export const b5_s3_VISUALS = [
  { name: "DuRetourALaDecision", kind: "schema", chapter: "b5-s3", component: DuRetourALaDecisionDiagram },
  { name: "EntonnoirAvecFuite", kind: "schema", chapter: "b5-s3", component: EntonnoirAvecFuiteDiagram },
  { name: "ChiffrePuisScene", kind: "schema", chapter: "b5-s3", component: ChiffrePuisSceneDiagram },
  { name: "UneCorrectionUneMesure", kind: "schema", chapter: "b5-s3", component: UneCorrectionUneMesureDiagram },
] as const satisfies readonly HandcraftedVisual[];
