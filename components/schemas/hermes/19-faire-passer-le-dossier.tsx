import { Fork, Steps, Workflow } from "../kit";

const EM = "#22d96e";

export function ParcoursProspectCompletDiagram() {
  return <Workflow
    title="Le prospect garde son histoire"
    description="Exemple : le dossier P-1042 garde son identifiant du clic sur la pub à la livraison."
    legend="Chaque outil ajoute ce qu'il sait, sans effacer l'origine."
    ariaLabel="Le dossier P-1042 passe par cinq moments : il découvre l'offre sur Instagram, fait sa demande par Gmail, échange sur Google Agenda, choisit et paie dans Stripe, puis reçoit son dossier dans Notion."
    accent={EM}
    actors={["Marketing", "Vente", "Rendez-vous", "Paiement", "Client"]}
    steps={[
      { actor: 0, label: "Découvre", tool: "Instagram" },
      { actor: 1, label: "Demande", tool: "Gmail", transfer: "P-1042" },
      { actor: 2, label: "Échange", tool: "Google Agenda", transfer: "P-1042" },
      { actor: 3, label: "Choisit", tool: "Stripe", transfer: "P-1042", humanValidation: true },
      { actor: 4, label: "Reçoit", tool: "Notion", transfer: "P-1042" },
    ]}
    accentIndex={3}
  />;
}

export function WorkflowMarketingDiagram() {
  return <Workflow
    title="La publication attend ton choix"
    description="De la veille au post : trois angles sont préparés, toi seul choisis celui qui part."
    legend="Seul le contenu validé arrive sur Instagram ou YouTube."
    ariaLabel="Perplexity cherche des sources, Notion garde les idées retenues, l'agent prépare trois angles, tu choisis l'angle, puis le contenu validé est publié sur Instagram."
    accent={EM}
    actors={["Recherche", "Idées", "Agent", "Toi", "Réseau"]}
    steps={[
      { actor: 0, label: "Sources", tool: "Perplexity" },
      { actor: 1, label: "Idées", tool: "Notion", transfer: "sources" },
      { actor: 2, label: "Trois angles", tool: "Hermes Agent", transfer: "idées" },
      { actor: 3, label: "Ton choix", humanValidation: true, transfer: "angles" },
      { actor: 4, label: "Publication", tool: "Instagram", transfer: "accord" },
    ]}
    accentIndex={3}
  />;
}

export function WorkflowAdsDiagram() {
  return <Workflow
    title="La campagne attend ton accord"
    description="De la recherche au lancement, avec un rapport chaque semaine après la mise en ligne."
    legend="La plateforme reçoit la campagne seulement après ton accord."
    ariaLabel="Perplexity rassemble la recherche, l'agent prépare des variantes, Figma finalise les visuels, tu donnes ton accord, puis Meta Ads reçoit la campagne."
    accent={EM}
    actors={["Recherche", "Agent", "Création", "Toi", "Plateforme"]}
    steps={[
      { actor: 0, label: "Recherche", tool: "Perplexity" },
      { actor: 1, label: "Variantes", tool: "Hermes Agent", transfer: "angles" },
      { actor: 2, label: "Visuels", tool: "Figma", transfer: "variantes" },
      { actor: 3, label: "Ton accord", humanValidation: true, transfer: "visuels" },
      { actor: 4, label: "Lancement", tool: "Meta Ads", transfer: "accord" },
    ]}
    accentIndex={3}
  />;
}

export function WorkflowCRMDevisSupportDiagram() {
  return <Fork
    title="Une fiche, trois décisions"
    description="La fiche prospect reste au centre, et chaque branche garde son outil."
    legend="Le prix et l'envoi du devis restent toujours ta décision."
    ariaLabel="Depuis la fiche prospect dans Notion, trois branches : un rendez-vous gardé dans Google Agenda, un devis dont tu valides le prix et l'envoi, et une demande de support dont l'agent prépare la réponse."
    accent={EM}
    situation="Fiche prospect Notion"
    outcomes={[
      { label: "Rendez-vous", condition: "Google Agenda garde la date" },
      { label: "Devis", condition: "Tu valides prix et envoi", recommended: true },
      { label: "Support", condition: "L'agent prépare la réponse" },
    ]}
  />;
}

export function WorkflowCrossPoleDiagramV2() {
  return <Steps
    title="Le même dossier, cinq ajouts"
    description="Exemple : P-1042 traverse cinq outils, chacun ajoute une information."
    legend="Aucun outil n'efface ce que le précédent a écrit."
    ariaLabel="Le dossier P-1042 traverse cinq étapes. La pub crée le dossier, la demande ajoute le besoin, l'échange ajoute le rendez-vous, le devis ajoute les pièces et le prix, le suivi ajoute la réponse support."
    accent={EM}
    items={[
      { label: "Pub", detail: "Crée le dossier P-1042" },
      { label: "Demande", detail: "Ajoute le besoin" },
      { label: "Échange", detail: "Ajoute le rendez-vous" },
      { label: "Devis", detail: "Ajoute pièces et prix" },
      { label: "Suivi", detail: "Ajoute la réponse support" },
    ]}
    accentIndex={0}
  />;
}
