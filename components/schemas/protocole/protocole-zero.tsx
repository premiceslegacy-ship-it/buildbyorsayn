import { Compare, Cycle, FileCard, Fork, Funnel, Ladder, Rings, Steps, ToolMap, Workflow } from "../kit";
import type { HandcraftedVisual } from "../coffre/types";

const EM = "#22d96e";

function TacheSousLaLoupeDiagram() {
  return <Steps
    title="Une tâche sous la loupe"
    description="Tu pars d'un domaine trop large et tu resserres jusqu'à un objet que quelqu'un peut lire."
    legend="À chaque étape, tu retires du flou. À la fin, tu sais quoi livrer."
    ariaLabel="Quatre étapes resserrent le sujet. Domaine : le marketing. Personne : un plombier. Situation : les urgences du soir. Résultat : sa page d'offre, mise en avant."
    accent={EM}
    accentIndex={3}
    items={[
      { label: "Domaine", detail: "Le marketing" },
      { label: "Personne", detail: "Un plombier" },
      { label: "Situation", detail: "Urgences du soir" },
      { label: "Résultat", detail: "Sa page d'offre" },
    ]}
  />;
}

function CarteDesSourcesDiagram() {
  return <Rings
    title="Plusieurs sources, un même travail"
    description="Chaque source voit une partie de la tâche. Le terrain reste au plus près du vrai travail."
    legend="Plus une source est proche du centre, plus elle parle du travail réel."
    ariaLabel="Quatre cercles entourent la tâche. Au centre, le terrain, mis en avant : ce qui se passe vraiment. Puis les exemples de travail, le niveau attendu. Puis la documentation officielle, le fonctionnement. Tout autour, les vidéos et transcripts, à recouper."
    accent={EM}
    core="Ta tâche"
    accentIndex={0}
    rings={[
      { label: "Terrain", detail: "Ce qui se passe vraiment" },
      { label: "Exemples", detail: "Le niveau attendu" },
      { label: "Documentation", detail: "Comment ça fonctionne" },
      { label: "Vidéos", detail: "À recouper, jamais à croire" },
    ]}
  />;
}

function SourceVersFicheDiagram() {
  return <FileCard
    title="La matière devient une fiche"
    description="Exemple : six questions suffisent pour tenir une tâche sur une seule page."
    legend="Ta fiche reste provisoire : le premier cas réel va la corriger."
    ariaLabel="Une fiche d'une page pour la page d'offre d'un plombier d'urgence. Elle répond au résultat, pour qui, la situation, les étapes, les pièges et la preuve. Les lignes résultat, pièges et preuve sont annotées."
    accent={EM}
    filename="fiche-page-offre.md"
    tool="NotebookLM"
    lines={[
      { text: "# Page d'offre d'un plombier", tone: "heading" },
      { text: "Résultat : le client appelle" },
      { text: "Pour qui : un plombier d'urgence", tone: "muted" },
      { text: "Situation : une fuite, le soir", tone: "muted" },
      { text: "Étapes : scène, preuves, appel", tone: "muted" },
      { text: "Pièges : un délai intenable" },
      { text: "Preuve : un vrai appel reçu" },
    ]}
    annotations={[
      { line: 2, label: "Ce que la page doit obtenir" },
      { line: 6, label: "L'erreur qui coûterait cher" },
      { line: 7, label: "Ce que tu iras vérifier" },
    ]}
  />;
}

function FicheContreCasReelDiagram() {
  return <Cycle
    title="La fiche rencontre le réel"
    description="Ta fiche reste une hypothèse jusqu'au moment où un vrai cas l'oblige à changer."
    legend="Chaque cas réel rend ta fiche un peu plus juste. Ne la grave pas trop tôt."
    ariaLabel="Une boucle en quatre étapes. Ta fiche, point d'entrée mis en avant : une hypothèse. Un cas réel : un vrai plombier. L'écart : ce qui ne colle pas. La correction : une version deux. Puis la boucle repart avec un nouveau cas."
    accent={EM}
    entryIndex={0}
    centerLabel="Nouvelle version, nouveau cas"
    steps={[
      { label: "Ta fiche", detail: "Une hypothèse" },
      { label: "Un cas réel", detail: "Un vrai plombier" },
      { label: "L'écart", detail: "Ce qui ne colle pas" },
      { label: "La correction", detail: "Une version deux" },
    ]}
  />;
}

function PremierClientAvantSystemeDiagram() {
  return <Fork
    title="La conversation avant la machine"
    description="Une fois ta fiche prête, la route courte passe par une vraie personne, pas par l'organisation."
    legend="Une réponse, une vente, puis une livraison : tu organises seulement après."
    ariaLabel="Ta fiche est prête. Construire le système parfait est déconseillé : tu organises un travail que personne n'a demandé. Parler, proposer et livrer est conseillé : une vraie personne te répond."
    accent={EM}
    situation="Ta fiche est prête. Et maintenant ?"
    outcomes={[
      { label: "Construire le système", condition: "Un travail que personne n'a demandé", rejected: true },
      { label: "Parler, proposer, livrer", condition: "Une vraie personne te répond", recommended: true },
    ]}
  />;
}

function ParcoursDuTerrainDiagram() {
  return <Funnel
    title="Le parcours reste visible"
    description="Exemple : vingt contacts notés dans un simple tableau, du premier message à la livraison."
    legend="Le but n'est pas d'envoyer plus de messages : c'est de voir où ça bloque."
    ariaLabel="Exemple de parcours suivi dans un tableau : 20 contacts, 8 réponses, 4 appels, 2 offres, 1 livraison acceptée. La plus grosse perte arrive entre les contacts et les réponses."
    accent={EM}
    leakIndex={0}
    leakLabel="Ici, le parcours bloque"
    stages={[
      { label: "Contacts", value: 20, detail: "Le canal, la date" },
      { label: "Réponses", value: 8, detail: "Leur réponse" },
      { label: "Appels", value: 4, detail: "La prochaine étape" },
      { label: "Offres", value: 2, detail: "La décision" },
      { label: "Livraisons", value: 1, detail: "Acceptée" },
    ]}
  />;
}

function ToiEtTonIAEnSprintDiagram() {
  return <Workflow
    title="L'IA prépare, tu engages"
    description="Ton IA prépare la recherche et le brouillon. Toi, tu choisis la personne et tu décides l'envoi."
    legend="Le prix, la promesse et les actions sensibles restent entre tes mains."
    ariaLabel="Ton IA fait la recherche avec Claude, puis passe des pistes triées au brouillon. Toi, tu reçois le brouillon et tu choisis la personne. Puis tu relis le message et tu décides l'envoi, mis en avant."
    accent={EM}
    actors={["Ton IA", "Toi"]}
    accentIndex={3}
    steps={[
      { actor: 0, label: "Recherche", tool: "Claude" },
      { actor: 0, label: "Brouillon", transfer: "pistes" },
      { actor: 1, label: "Le choix", transfer: "brouillon", humanValidation: true },
      { actor: 1, label: "L'envoi", transfer: "message", humanValidation: true },
    ]}
  />;
}

function MargeReelleDiagram() {
  return <Compare
    title="Ce que la vente cache"
    description="Exemple : un formulaire de réservation vendu à un salon, puis trois soirées de corrections imprévues."
    legend="La vente est réelle. Le prochain test porte sur le brief et la limite des retours."
    ariaLabel="À gauche, ce que tu vois : le prix encaissé, une cliente contente, une vente de plus. À droite, ce que tu comptes : la préparation, trois soirées de corrections, le support et les outils."
    accent={EM}
    beforeTitle="Ce que tu vois"
    afterTitle="Ce que tu comptes"
    rows={[
      { before: "Le prix encaissé", after: "La préparation et la livraison" },
      { before: "Une cliente contente", after: "Trois soirées de corrections" },
      { before: "Une vente de plus", after: "Le support et les outils" },
    ]}
  />;
}

function ProjetQuiDisparaitOuResteDiagram() {
  return <Compare
    title="Deux fins pour un projet"
    description="Après la livraison, ce que tu as appris disparaît dans tes messages ou rejoint ta méthode."
    legend="Distiller, c'est garder une observation avec sa source, son contexte et sa limite."
    ariaLabel="À gauche, le projet oublié : les réponses dorment dans tes messages, les mêmes questions reviennent, tu repars de zéro. À droite, le projet distillé : une observation gardée avec sa source, son contexte et sa limite, rangée là où tu la retrouves."
    accent={EM}
    beforeTitle="Projet oublié"
    afterTitle="Projet distillé"
    rows={[
      { before: "Tout dort dans tes messages", after: "Une observation et sa source" },
      { before: "Les mêmes questions reviennent", after: "Son contexte et sa limite" },
      { before: "Tu repars de zéro", after: "Rangée au bon endroit" },
    ]}
  />;
}

function BonContenantDiagram() {
  return <Fork
    title="Chaque apprentissage à sa place"
    description="Une observation du terrain rejoint le contenant qui correspond à sa nature."
    legend="Un résultat isolé reste une observation : il ne devient pas une règle pour tous."
    ariaLabel="Une observation du terrain part vers quatre contenants. Une règle stable rejoint une SOP. Un choix avec plusieurs routes rejoint un skill. Un livrable réutilisable devient un modèle. Une erreur reproductible devient un test."
    accent={EM}
    situation="Une observation du terrain"
    outcomes={[
      { label: "SOP", condition: "Une règle stable" },
      { label: "Skill", condition: "Un choix à plusieurs routes" },
      { label: "Modèle", condition: "Un livrable réutilisable" },
      { label: "Test", condition: "Une erreur reproductible" },
    ]}
  />;
}

function PatchDeMethodeDiagram() {
  return <FileCard
    title="Une petite modification relue"
    description="Exemple : ton IA propose de changer une ligne de ta méthode, avec le cas qui la justifie."
    legend="Tu relis, tu testes, puis seulement tu gardes la nouvelle version."
    ariaLabel="Une proposition de modification d'un skill. Avant : retours sans limite. Après : deux séries de retours incluses. Source : un formulaire, trois soirées de corrections. Tests : cas normal, cas limite, détournement. Décision : à toi."
    accent={EM}
    filename="proposition-skill.md"
    tool="Claude Code"
    lines={[
      { text: "# Modification proposée", tone: "heading" },
      { text: "Avant : retours sans limite", tone: "muted" },
      { text: "Après : deux séries de retours" },
      { text: "Source : trois soirées de corrections" },
      { text: "Tests : normal, limite, détournement" },
      { text: "Décision : à toi", tone: "muted" },
    ]}
    annotations={[
      { line: 3, label: "Ce qui change, ligne par ligne" },
      { line: 4, label: "Le cas qui la justifie" },
      { line: 5, label: "Trois tests avant de garder" },
    ]}
  />;
}

function EscalierDuCapitalDiagram() {
  return <Ladder
    title="Chaque projet ajoute une marche"
    description="Le premier projet te donne une fiche. Les suivants la corrigent et la complètent."
    legend="Tu ne repars plus de zéro : le projet suivant commence sur la marche d'avant."
    ariaLabel="Une échelle de trois marches. Premier projet : une fiche. Deuxième projet : une étape corrigée. Troisième projet, mis en avant : un exemple et un test."
    accent={EM}
    accentIndex={2}
    lowLabel="Départ"
    highLabel="Ce qui reste"
    rungs={[
      { label: "Premier projet", detail: "Une fiche" },
      { label: "Deuxième projet", detail: "Une étape corrigée" },
      { label: "Troisième projet", detail: "Un exemple et un test" },
    ]}
  />;
}

function ChangerDOutilSansRetomberDiagram() {
  return <ToolMap
    title="Les outils passent, la méthode reste"
    description="Tu loues les modèles. Tes fiches, tes règles et tes tests passent de l'un à l'autre."
    legend="Si un modèle change, tu adaptes la méthode. Tu ne retombes pas à zéro."
    ariaLabel="À gauche, les modèles loués : Claude, ChatGPT et Gemini, remplaçables. À droite, mis en avant, ce que tu gardes : tes fiches, tes règles et tes tests."
    accent={EM}
    accentGroup={1}
    groups={[
      { role: "Modèles loués", tools: [
        { name: "Claude", description: "Remplaçable" },
        { name: "ChatGPT", description: "Remplaçable" },
        { name: "Gemini", description: "Remplaçable" },
      ] },
      { role: "Ce que tu gardes", tools: [
        { name: "Fiches", description: "Écrites" },
        { name: "Règles", description: "Stables" },
        { name: "Tests", description: "Rejouables" },
      ] },
    ]}
  />;
}

export const PROTOCOLE_ZERO_VISUALS = [
  { name: "TacheSousLaLoupe", kind: "schema", chapter: "protocole-zero", component: TacheSousLaLoupeDiagram },
  { name: "CarteDesSources", kind: "schema", chapter: "protocole-zero", component: CarteDesSourcesDiagram },
  { name: "SourceVersFiche", kind: "schema", chapter: "protocole-zero", component: SourceVersFicheDiagram },
  { name: "FicheContreCasReel", kind: "schema", chapter: "protocole-zero", component: FicheContreCasReelDiagram },
  { name: "PremierClientAvantSysteme", kind: "schema", chapter: "protocole-zero", component: PremierClientAvantSystemeDiagram },
  { name: "ParcoursDuTerrain", kind: "schema", chapter: "protocole-zero", component: ParcoursDuTerrainDiagram },
  { name: "ToiEtTonIAEnSprint", kind: "schema", chapter: "protocole-zero", component: ToiEtTonIAEnSprintDiagram },
  { name: "MargeReelle", kind: "schema", chapter: "protocole-zero", component: MargeReelleDiagram },
  { name: "ProjetQuiDisparaitOuReste", kind: "schema", chapter: "protocole-zero", component: ProjetQuiDisparaitOuResteDiagram },
  { name: "BonContenant", kind: "schema", chapter: "protocole-zero", component: BonContenantDiagram },
  { name: "PatchDeMethode", kind: "schema", chapter: "protocole-zero", component: PatchDeMethodeDiagram },
  { name: "EscalierDuCapital", kind: "schema", chapter: "protocole-zero", component: EscalierDuCapitalDiagram },
  { name: "ChangerDOutilSansRetomber", kind: "schema", chapter: "protocole-zero", component: ChangerDOutilSansRetomberDiagram },
] as const satisfies readonly HandcraftedVisual[];
