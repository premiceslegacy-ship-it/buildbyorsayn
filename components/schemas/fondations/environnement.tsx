import { Compare, Steps, Workflow } from "../kit";

const EM = "#22d96e";

export function ModeleContexteReponseDiagram() {
  return <Steps
    title="Une suite probable, pas une vérité cachée"
    description="Le modèle reçoit du contexte, propose puis te rend la main."
    ariaLabel="Le contexte produit plusieurs suites possibles, une réponse, puis une vérification humaine."
    accent={EM}
    accentIndex={3}
    items={[
      { label: "Contexte", detail: "Ce que tu fournis", tools: ["Claude", "ChatGPT", "Gemini"] },
      { label: "Suites possibles", detail: "Plusieurs chemins pâles" },
      { label: "Réponse", detail: "Une suite ressort" },
      { label: "À vérifier", detail: "Tu contrôles" },
    ]}
  />;
}

export function ValiseDuContexteDiagram() {
  return <Compare
    title="Une valise vaut mieux qu'un chariot"
    description="Le contexte choisi reste trouvable quand l'historique déborde."
    ariaLabel="Une valise contient le brief, le fichier cible et les règles utiles, contrairement à un chariot plein de bruit."
    accent={EM}
    beforeTitle="Trop de bruit"
    afterTitle="Valise utile"
    rows={[
      { before: "Toutes les conversations", after: "Brief" },
      { before: "Documents mélangés", after: "Fichier cible" },
      { before: "Règles perdues", after: "Règles utiles" },
    ]}
  />;
}

export function ComptoirAPIDiagram() {
  return <Workflow
    title="L'API tient le comptoir"
    description="Une commande précise part et revient avec son état."
    ariaLabel="Une demande traverse une API vers un service, puis revient comme réponse avec un statut."
    accent={EM}
    actors={["Client", "API", "Service"]}
    accentIndex={4}
    steps={[
      { actor: 0, label: "Demande", transfer: "commande" },
      { actor: 1, label: "API", transfer: "guichet" },
      { actor: 2, label: "Service", transfer: "prépare" },
      { actor: 1, label: "Réponse", transfer: "plateau" },
      { actor: 0, label: "Statut", humanValidation: true },
    ]}
  />;
}

export function RoleSeulMethodeCompleteDiagram() {
  return <Compare
    title="Un badge ne remplit pas l'établi"
    description="La méthode apporte la matière et le contrôle qui manquent au rôle."
    ariaLabel="Le rôle seul improvise, tandis que la méthode utilise des sources, des étapes et un test final."
    accent={EM}
    beforeTitle="Rôle seul"
    afterTitle="Méthode complète"
    rows={[
      { before: "Designer", after: "Sources" },
      { before: "Il improvise", after: "Étapes" },
      { before: "Table vide", after: "Test final" },
    ]}
  />;
}

export function QuiFaitQuoiIADiagram() {
  return <Workflow
    title="Quatre rôles, une seule décision"
    description="Chaque acteur garde une responsabilité différente."
    ariaLabel="Le modèle produit, MCP relie, l'agent organise et la personne décide."
    accent={EM}
    actors={["Modèle", "MCP", "Agent", "Humain"]}
    accentIndex={3}
    steps={[
      { actor: 0, label: "Produire", tool: "Claude" },
      { actor: 1, label: "Relier", tool: "OpenRouter" },
      { actor: 2, label: "Organiser", tool: "Hermes Agent" },
      { actor: 3, label: "Décider", tool: "Gemini", humanValidation: true },
    ]}
  />;
}
