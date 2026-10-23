import { FileCard, Fork, Steps } from "../kit";

const EM = "#22d96e";

export function SousLeMotLaSceneDiagram() {
  return <Steps
    title="Derrière « premium », une scène"
    description="Exemple de Nadia, architecte : elle demandait un portfolio « premium ». Voici ce qui s'était vraiment passé."
    legend="Lis la scène dans l'ordre où elle s'est passée : le mot « premium » n'y apparaît nulle part."
    ariaLabel="Le mot premium s'ouvre sur une scène en quatre temps : un promoteur demande trois projets pendant un trajet en train, Nadia fouille son téléphone, envoie des liens séparés et craint de paraître désorganisée, alors qu'elle veut tout envoyer d'un coup."
    accent={EM}
    accentIndex={0}
    items={[
      { label: "Déclencheur", detail: "Trois projets demandés dans le train" },
      { label: "Geste", detail: "Elle fouille son téléphone" },
      { label: "Gêne", detail: "Des liens épars, l'air désordonné" },
      { label: "Changement", detail: "Tout envoyer en une fois" },
    ]}
  />;
}

export function DecisionHumaineDiagram() {
  return <Fork
    title="Une décision regarde des deux côtés"
    description="Exemple d'un restaurateur : il espère un progrès et craint une perte, au même moment."
    legend="Les deux cartes pèsent ensemble : ton offre doit répondre à l'une et à l'autre."
    ariaLabel="Un restaurateur qui pense à la réservation en ligne espère réserver sans décrocher le téléphone et craint de perdre le contact humain avec ses clients."
    accent={EM}
    situation="Un restaurateur pense à la réservation en ligne"
    outcomes={[
      { label: "Ce qu'il espère", condition: "Réserver sans décrocher pendant le service" },
      { label: "Ce qu'il craint", condition: "Perdre le contact avec ses habitués" },
    ]}
  />;
}

export function SixRessortsDansUneSceneDiagram() {
  return <Steps
    title="Six ressorts dans une même scène"
    description="Exemple : un restaurateur pense à la réservation en ligne. Chacune de ses phrases montre un ressort."
    legend="Ne coche pas les six : repère ceux que la personne dit vraiment, puis vérifie-les."
    ariaLabel="Six ressorts apparaissent dans les phrases d'un restaurateur : le progrès, remplir les tables sans décrocher ; l'identité, rester un restaurant de quartier ; les autres, l'équipe va-t-elle suivre ; la crédibilité, est-ce que ça marche chez un restaurant comme le sien ; l'inaction, encore des appels manqués samedi ; la sécurité, et si le système tombe en panne."
    accent={EM}
    accentIndex={-1}
    items={[
      { label: "Progrès", detail: "« Remplir les tables sans décrocher »" },
      { label: "Identité", detail: "« Je reste un resto de quartier »" },
      { label: "Les autres", detail: "« Mon équipe va suivre ? »" },
      { label: "Crédibilité", detail: "« Ça marche chez un resto comme moi ? »" },
      { label: "Inaction", detail: "« Encore des appels manqués samedi »" },
      { label: "Sécurité", detail: "« Et si le système tombe en panne ? »" },
    ]}
  />;
}

export function ConfianceVisibleDiagram() {
  return <Fork
    title="La confiance se montre"
    description="Dire « fais-moi confiance » ne rassure personne. Chaque crainte reçoit une chose à voir."
    legend="Lis chaque carte de haut en bas : la crainte, puis ce que tu montres pour y répondre."
    ariaLabel="Avant de signer, la cliente craint pour ses données, doute du livrable et redoute un changement brutal ; tu lui montres comment elle récupère ses fichiers, un exemple déjà remis et les étapes une par une."
    accent={EM}
    situation="Elle hésite avant de signer"
    outcomes={[
      { label: "Ses données ?", condition: "Montre comment elle les récupère" },
      { label: "Le livrable ?", condition: "Montre un exemple déjà remis" },
      { label: "Le changement ?", condition: "Montre les étapes une par une" },
    ]}
  />;
}

export function FaitMotQuestionDiagram() {
  return <FileCard
    title="Trois colonnes dans tes notes"
    description="Exemple : les notes d'appel de Nadia séparent ce qui s'est passé, ses mots exacts et tes hypothèses."
    legend="La dernière partie reste une question : relis l'appel avant d'en faire une conclusion."
    ariaLabel="Le fichier notes-nadia.md range les faits racontés, un promoteur qui demande trois projets et plusieurs liens envoyés, puis ses mots exacts, je veux un portfolio premium, et enfin la question à vérifier, un seul lien à envoyer."
    accent={EM}
    filename="notes-nadia.md"
    lines={[
      { text: "# Faits racontés", tone: "heading" },
      { text: "Train : trois projets demandés" },
      { text: "Plusieurs liens envoyés à la suite" },
      { text: "# Mots exacts", tone: "heading" },
      { text: "« Je veux un portfolio premium »" },
      { text: "# À vérifier", tone: "heading" },
      { text: "Un seul lien à envoyer ?" },
    ]}
    annotations={[
      { line: 2, label: "Ce qui s'est passé" },
      { line: 5, label: "Ses mots, sans reformuler" },
      { line: 7, label: "Ton idée, encore une question" },
    ]}
  />;
}
