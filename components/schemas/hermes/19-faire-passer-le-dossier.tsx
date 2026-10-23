import { Fork, Steps, Workflow } from "../kit";

export function ParcoursProspectCompletDiagram() {
  return <Workflow title="Le prospect garde son histoire" description="Un même identifiant suit le dossier du premier contact à la livraison." ariaLabel="Le dossier P-1042 passe par Découvre, Demande, Échange, Choisit et Reçoit avec Instagram, Gmail, Notion, Google Agenda et Stripe." actors={["Marketing", "Vente", "Rendez-vous", "Paiement", "Client"]} steps={[
    { actor: 0, label: "Découvre", tool: "Instagram" },
    { actor: 1, label: "Demande", tool: "Gmail", transfer: "P-1042" },
    { actor: 2, label: "Échange", tool: "Google Agenda", transfer: "P-1042" },
    { actor: 3, label: "Choisit", tool: "Stripe", transfer: "P-1042", humanValidation: true },
    { actor: 4, label: "Reçoit", tool: "Notion", transfer: "P-1042" },
  ]} accentIndex={3} />;
}

export function WorkflowMarketingDiagram() {
  return <Workflow title="La publication attend ton choix" description="Les sources deviennent trois angles avant de rejoindre le réseau." ariaLabel="Perplexity fournit les Sources, Notion range les Idées, Hermes prépare Trois angles, Ton choix valide et Instagram publie." actors={["Recherche", "Préparation", "Toi", "Réseau"]} steps={[
    { actor: 0, label: "Sources", tool: "Perplexity" },
    { actor: 1, label: "Idées", tool: "Notion", transfer: "sources" },
    { actor: 1, label: "Trois angles", tool: "Hermes Agent" },
    { actor: 2, label: "Ton choix", humanValidation: true, transfer: "angles" },
    { actor: 3, label: "Publication", tool: "Instagram", transfer: "accord" },
    { actor: 3, label: "Vidéo", tool: "YouTube" },
  ]} accentIndex={3} />;
}

export function WorkflowAdsDiagram() {
  return <Workflow title="La campagne reste sur la table" description="Recherche, variantes, validation, lancement et rapport occupent cinq étapes."
    ariaLabel="Perplexity cherche, Figma crée les Variantes, Hermes prépare, Ta validation autorise puis Meta Ads et Google Ads lancent et rapportent." actors={["Recherche", "Création", "Toi", "Plateformes"]} steps={[
      { actor: 0, label: "Recherche", tool: "Perplexity" },
      { actor: 1, label: "Variantes", tool: "Figma", transfer: "angles" },
      { actor: 2, label: "Ta validation", tool: "Hermes Agent", humanValidation: true, transfer: "maquettes" },
      { actor: 3, label: "Lancement", tool: "Meta Ads", transfer: "accord" },
      { actor: 3, label: "Rapport", tool: "Google Ads" },
    ]} accentIndex={2} />;
}

export function WorkflowCRMDevisSupportDiagram() {
  return <Fork title="Une fiche, trois décisions" description="Le prospect reste central, mais chaque branche garde son outil." ariaLabel="La fiche Prospect dans Notion et WhatsApp se divise vers Rendez-vous, Devis et Support avec Google Agenda, Stripe et Gmail." situation="Prospect"
    outcomes={[
      { label: "Rendez-vous", condition: "Google Agenda" },
      { label: "Devis", condition: "Stripe", recommended: true },
      { label: "Support", condition: "Gmail" },
    ]} />;
}

export function WorkflowCrossPoleDiagramV2() {
  return <Steps title="Le prospect traverse cinq métiers" description="Le même dossier relie les étapes sans partager la même décision." ariaLabel="P-1042 traverse Pub, Demande, Échange, Devis et Suivi." items={[
    { label: "Pub", detail: "P-1042" },
    { label: "Demande", detail: "P-1042" },
    { label: "Échange", detail: "P-1042" },
    { label: "Devis", detail: "P-1042" },
    { label: "Suivi", detail: "P-1042" },
  ]} accentIndex={2} />;
}
