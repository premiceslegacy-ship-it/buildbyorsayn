import { Chat, FileCard, Fork, Workflow } from "../kit";

export function FicheProspectQualifieMockup() {
  return <FileCard title="La fiche minimale qui aide à agir" description="Le manque, le responsable et la prochaine date restent visibles." ariaLabel="Une fiche prospect montre la personne, le besoin, le manque Prix à valider, le responsable et Prochaine action mardi." filename="prospect-1042" tool="Notion" lines={[
    { text: "Personne : Karim B." },
    { text: "Besoin : rénover un commerce" },
    { text: "Prix à valider", tone: "heading" },
    { text: "Responsable : Maya" },
    { text: "Prochaine action : mardi", tone: "heading" },
  ]} annotations={[
    { line: 2, label: "Ce qu'il veut" },
    { line: 3, label: "Ce qui manque" },
    { line: 4, label: "Qui reprend" },
  ]} />;
}

export function QuestionsQuiOuvrentUneRouteDiagram() {
  return <Fork title="Trois questions changent la route" description="Les détails secondaires restent sur le bas-côté." ariaLabel="Objectif, Pièce et Date ouvrent une route. Détail secondaire est écarté." situation="Quelle question change la suite ?" outcomes={[
    { label: "Objectif", condition: "La destination change", recommended: true },
    { label: "Pièce", condition: "Le dossier peut avancer", recommended: true },
    { label: "Date", condition: "La priorité devient claire", recommended: true },
    { label: "Détail secondaire", condition: "La route ne change pas", rejected: true },
  ]} />;
}

export function MessageVersFicheCRMDiagram() {
  return <Workflow title="Le message nourrit la fiche" description="La fiche aide à agir sans remplacer la source." ariaLabel="Le Message d'origine WhatsApp devient une Fiche prospect Notion, puis une Prochaine action. Le lien vers l'origine reste visible." actors={["Source", "Agent", "CRM"]} steps={[
    { actor: 0, label: "Message d'origine", tool: "WhatsApp" },
    { actor: 1, label: "Extrait les faits", tool: "Hermes Agent", transfer: "lien conservé" },
    { actor: 2, label: "Fiche prospect", tool: "Notion", transfer: "faits" },
    { actor: 2, label: "Prochaine action", tool: "Gmail" },
  ]} accentIndex={1} />;
}

export function RelanceDansWhatsAppMockup() {
  return <Chat title="La relance reste un brouillon" description="Le besoin, l'état et le prochain geste apparaissent avant l'envoi." ariaLabel="Une relance WhatsApp demande Relire mardi ou mercredi et attend Valider l'envoi." platform="WhatsApp" contact="Karim" messages={[
    { from: "person", text: "Je veux avancer sur la rénovation du commerce.", time: "14:12" },
    { from: "agent", text: "Le dossier attend encore la surface exacte.", time: "14:13" },
    { from: "agent", text: "Relire mardi ou mercredi ?", time: "14:13" },
  ]} backstageTitle="Validation interne" actions={[
    { label: "Besoin réel", tool: "WhatsApp" },
    { label: "État du dossier", tool: "Hermes Agent" },
    { label: "Prochain geste : Valider l'envoi", humanValidation: true },
  ]} />;
}
