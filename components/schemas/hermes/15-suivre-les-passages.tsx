import { FileCard, Fork, ToolMap, Workflow } from "../kit";

export function RelaisDuDossierDiagram() {
  return <Workflow title="Le dossier passe de main en main" description="Chaque zone de passage garde un responsable visible." ariaLabel="Le dossier voyage de Marketing à Vente, Production puis Finance avec une validation à chaque passage." actors={["Marketing", "Vente", "Production", "Finance"]} steps={[
    { actor: 0, label: "Marketing" },
    { actor: 1, label: "Vente", transfer: "dossier" },
    { actor: 2, label: "Production", transfer: "accepté" },
    { actor: 3, label: "Finance", humanValidation: true, transfer: "livré" },
  ]} accentIndex={3} />;
}

export function PasseportDuDossierDiagram() {
  return <FileCard title="Le passeport voyage avec le dossier" description="La version, la réception et les accords restent ensemble." ariaLabel="Un passeport de dossier contient Version, Reçu par, Accepté et Refusé car. Refusé car est mis en avant." filename="passeport P-1042" lines={[
    { text: "Version : 04" },
    { text: "Reçu par : Production" },
    { text: "Accepté : pièces complètes" },
    { text: "Refusé car : date impossible", tone: "heading" },
  ]} annotations={[
    { line: 1, label: "État du dossier" },
    { line: 2, label: "Responsable actuel" },
    { line: 4, label: "Raison visible" },
  ]} />;
}

export function CinqParcoursMetierDiagram() {
  return <ToolMap title="Cinq parcours, cinq validations" description="La logique est commune, mais le travail et les outils changent." ariaLabel="Contenu, Ads, CRM, Support et Devis utilisent des outils différents avec une station de validation humaine." groups={[
    { role: "Contenu", tools: [{ name: "Instagram", description: "Choix avant publication" }] },
    { role: "Ads", tools: [{ name: "Meta Ads", description: "Accord avant lancement" }] },
    { role: "CRM", tools: [{ name: "Notion", description: "Décision du commercial" }] },
    { role: "Support", tools: [{ name: "Gmail", description: "Demande reçue" }, { name: "WhatsApp", description: "Réponse validée" }] },
    { role: "Devis", tools: [{ name: "Stripe", description: "Prix validé" }] },
  ]} accentGroup={2} />;
}

export function RefusQuiAideDiagram() {
  return <Fork title="Un refus ouvre la reprise" description="La raison, le responsable et le point de reprise restent visibles." ariaLabel="Le refus indique Ce qui manque, Qui corrige et Où reprendre. Où reprendre est mis en avant." situation="Refusé"
    outcomes={[
      { label: "Ce qui manque", condition: "La pièce exacte" },
      { label: "Qui corrige", condition: "Le responsable nommé" },
      { label: "Où reprendre", condition: "L'étape précise", recommended: true },
    ]} />;
}
