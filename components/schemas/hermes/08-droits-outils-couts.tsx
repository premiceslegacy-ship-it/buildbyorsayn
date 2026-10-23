import { Rings, Steps, ToolMap, Workflow } from "../kit";

const EM = "#22d96e";

export function AuthorityLayersDiagram() {
  return <Steps
    title="Écrire, bloquer, tester"
    description="Pour « ne publie jamais sans moi », la phrase ne suffit pas : il faut aussi le réglage et la preuve."
    legend="Tant que le test du refus n'a pas eu lieu, la limite reste une promesse."
    ariaLabel="Trois protections dans l'ordre : la consigne écrit la limite, le réglage retire le droit de publier au compte, le test du refus demande une publication et vérifie qu'elle est refusée. Le test du refus est mis en avant."
    accent={EM}
    items={[
      { label: "Consigne", detail: "« Ne publie jamais sans moi »" },
      { label: "Réglage", detail: "Le compte n'a pas le droit de publier" },
      { label: "Test du refus", detail: "Tu demandes de publier : refus" },
    ]}
    accentIndex={2}
  />;
}

export function TrousseauMinimalDiagram() {
  return <ToolMap
    title="Une clé pour une seule porte"
    description="Exemple : un bot de support lit la documentation, mais n'a ni Stripe, ni GitHub, ni toute ta messagerie."
    legend="La carte de ta chambre d'hôtel n'ouvre ni la cuisine ni la caisse."
    ariaLabel="Quatre portes de service. Support, avec Gmail, est la seule ouverte : le bot lit et prépare. Paiement avec Stripe, Code avec GitHub et Messagerie avec Telegram restent fermés."
    accent={EM}
    groups={[
      { role: "Support", tools: [{ name: "Gmail", description: "Lire et préparer" }] },
      { role: "Paiement", tools: [{ name: "Stripe", description: "Porte fermée" }] },
      { role: "Code", tools: [{ name: "GitHub", description: "Porte fermée" }] },
      { role: "Messagerie", tools: [{ name: "Telegram", description: "Porte fermée" }] },
    ]}
    accentGroup={0}
  />;
}

export function MainAvantLeMondeExterieurDiagram() {
  return <Workflow
    title="Ta main avant la publication"
    description="Ton agent recherche et rédige. Tu valides le texte, le compte et le moment avant que rien ne sorte."
    legend="Si le texte, le compte ou le moment change, ton accord est à refaire."
    ariaLabel="Ton agent recherche le sujet puis rédige un brouillon. Tu valides le texte, le compte et le moment. Seulement ensuite, Instagram publie. L'étape où tu valides est mise en avant."
    accent={EM}
    actors={["Ton agent", "Toi", "Le service"]}
    steps={[
      { actor: 0, label: "Recherche", tool: "Hermes Agent" },
      { actor: 0, label: "Rédaction", tool: "Hermes Agent", transfer: "sources" },
      { actor: 1, label: "Tu valides", humanValidation: true, transfer: "brouillon" },
      { actor: 2, label: "Publication", tool: "Instagram", transfer: "accord" },
    ]}
    accentIndex={2}
  />;
}

export function CompteurDeMissionDiagram() {
  return <Rings
    title="Le coût vient de toute la mission"
    description="La réponse finale n'est qu'une partie de la facture : la mission entière se compte."
    legend="Fixe une limite par appel, une pour toute la mission, et un arrêt."
    ariaLabel="Le total de la mission est au centre. Autour, quatre postes de coût : le modèle principal, la recherche avec Perplexity et Treg, les appels d'outils, et les sous-tâches déléguées. Les sous-tâches sont mises en avant."
    accent={EM}
    core="Total"
    rings={[
      { label: "Modèle", detail: "Le modèle principal" },
      { label: "Recherche", detail: "Perplexity et Treg" },
      { label: "Outils", detail: "Chaque appel externe" },
      { label: "Sous-tâches", detail: "Le travail délégué" },
    ]}
    accentIndex={3}
  />;
}
