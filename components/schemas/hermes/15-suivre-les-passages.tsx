import { FileCard, Fork, ToolMap, Workflow } from "../kit";

const EM = "#22d96e";

export function RelaisDuDossierDiagram() {
  return <Workflow
    title="Le dossier passe de main en main"
    description="Exemple : un onboarding client traverse quatre métiers, chacun avec son accord."
    legend="Cherche les flèches : c'est là que le travail attend, et que les oublis naissent."
    ariaLabel="Un dossier client passe du marketing à la vente, puis à la production, puis à la finance. À chaque passage, un document est remis, et la finance confirme l'acompte."
    accent={EM}
    actors={["Marketing", "Vente", "Production", "Finance"]}
    steps={[
      { actor: 0, label: "Prospect", tool: "Instagram" },
      { actor: 1, label: "Offre", tool: "Notion", transfer: "fiche" },
      { actor: 2, label: "Pièces", tool: "Figma", transfer: "dossier" },
      { actor: 3, label: "Acompte", tool: "Stripe", transfer: "dossier", humanValidation: true },
    ]}
    accentIndex={3}
  />;
}

export function PasseportDuDossierDiagram() {
  return <FileCard
    title="Le passeport du dossier"
    description="Exemple : la fiche qui voyage avec le dossier pour dire qui l'a, dans quel état."
    legend="Si la ligne du refus est vide, personne ne sait pourquoi le dossier est revenu."
    ariaLabel="Un passeport de dossier P-1042 indique la version 04, remis par la vente, reçu par la production, accepté car pièces complètes, et refusé car date impossible."
    accent={EM}
    filename="passeport-P-1042"
    lines={[
      { text: "Version : 04" },
      { text: "Remis par : Vente" },
      { text: "Reçu par : Production" },
      { text: "Accord : pièces complètes" },
      { text: "Refus : date impossible", tone: "heading" },
    ]}
    annotations={[
      { line: 1, label: "Quelle version" },
      { line: 3, label: "Qui l'a maintenant" },
      { line: 5, label: "Pourquoi il revient" },
    ]}
  />;
}

export function CinqParcoursMetierDiagram() {
  return <ToolMap
    title="Cinq parcours dans l'entreprise"
    description="Chaque métier transforme une entrée en une sortie que quelqu'un valide."
    legend="Même logique partout : une entrée, un outil, une personne qui décide."
    ariaLabel="Cinq parcours : le contenu, de la veille au post validé sur Instagram ; les publicités, de la recherche au rapport dans Meta Ads ; le CRM, du message à la prochaine action dans Notion ; le support, de la question à la réponse dans Gmail ; le devis, des pièces à la proposition validée dans Stripe."
    accent={EM}
    groups={[
      { role: "Contenu", tools: [{ name: "Instagram", description: "Veille vers post validé" }] },
      { role: "Publicités", tools: [{ name: "Meta Ads", description: "Recherche vers rapport" }] },
      { role: "CRM", tools: [{ name: "Notion", description: "Message vers action" }] },
      { role: "Support", tools: [{ name: "Gmail", description: "Question vers réponse" }] },
      { role: "Devis", tools: [{ name: "Stripe", description: "Pièces vers proposition" }] },
    ]}
    accentGroup={2}
  />;
}

export function RefusQuiAideDiagram() {
  return <Fork
    title="Un refus ouvre la reprise"
    description="Exemple : la production refuse une date, le commercial ne recommence pas tout."
    legend="Un refus utile contient la raison, une date possible et la décision attendue."
    ariaLabel="La production refuse une date. Le refus donne la raison, propose une date possible et indique la décision attendue, pour que le commercial reprenne sans tout recommencer."
    accent={EM}
    situation="La production refuse la date"
    outcomes={[
      { label: "La raison", condition: "Ce qui bloque vraiment" },
      { label: "Une date", condition: "Celle qui est possible" },
      { label: "La décision", condition: "Qui doit répondre", recommended: true },
    ]}
  />;
}
