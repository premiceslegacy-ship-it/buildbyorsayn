import { Chat, Steps, Workflow } from "../kit";

export function TelegramDevisAvecValidationMockup() {
  return <Chat title="Le bot prépare, tu décides" description="La conversation montre le destinataire, le brouillon et le geste humain." ariaLabel="Une conversation Telegram reçoit une demande, prépare un devis et attend Valider, Corriger ou Refuser." platform="Telegram" contact="Karim" messages={[
    { from: "person", text: "Peux-tu préparer le devis pour la cage d'escalier ?", time: "09:41" },
    { from: "agent", text: "Informations manquantes : surface et date souhaitée.", time: "09:42" },
    { from: "agent", text: "Brouillon prêt pour Karim. Aucun envoi effectué.", time: "09:43" },
  ]} backstageTitle="Tu décides ici" actions={[
    { label: "Demande reçue", tool: "Telegram" },
    { label: "Travail préparé", tool: "Hermes Agent" },
    { label: "Résumé du dossier", tool: "Notion" },
    { label: "Valider, Corriger ou Refuser", humanValidation: true },
  ]} />;
}

export function SousLaBulleDeMessageDiagram() {
  return <Chat title="Sous la bulle, un vrai dossier" description="Le message visible repose sur plusieurs couches de travail." ariaLabel="Un Message WhatsApp révèle la Préparation Hermes et le Dossier Notion. Dossier est mis en avant." platform="WhatsApp" contact="Conversation" messages={[
    { from: "person", text: "Message", time: "09:41" },
    { from: "agent", text: "Le dossier est en préparation.", time: "09:42" },
  ]} backstageTitle="Sous la bulle" actions={[
    { label: "Message", tool: "WhatsApp" },
    { label: "Préparation", tool: "Hermes Agent" },
    { label: "Dossier", tool: "Notion", humanValidation: true },
  ]} />;
}

export function TroisCanauxMemeValidationMockup() {
  return <Workflow title="Trois canaux, le même accord" description="La messagerie change, pas la décision humaine." ariaLabel="Telegram, WhatsApp et Slack convergent vers Ton accord." actors={["Telegram", "WhatsApp", "Slack", "Toi"]} steps={[
    { actor: 0, label: "Telegram", tool: "Telegram" },
    { actor: 1, label: "WhatsApp", tool: "WhatsApp" },
    { actor: 2, label: "Slack", tool: "Slack" },
    { actor: 3, label: "Ton accord", humanValidation: true, transfer: "action précise" },
  ]} accentIndex={3} />;
}

export function TicketQuatreEtatsDiagram() {
  return <Steps title="Le ticket garde son état" description="Un état écrit empêche de répéter une action incertaine." ariaLabel="Le ticket passe par Préparé, Validé, Envoyé et Refusé. Envoyé est mis en avant." items={[
    { label: "Préparé", detail: "Le brouillon existe" },
    { label: "Validé", detail: "Une personne accepte" },
    { label: "Envoyé", detail: "Le service confirme" },
    { label: "Refusé", detail: "La raison reste visible" },
  ]} accentIndex={2} />;
}
