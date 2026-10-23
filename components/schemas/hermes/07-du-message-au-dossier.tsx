import { Chat, Fork, Steps } from "../kit";

const EM = "#22d96e";

export function TelegramDevisAvecValidationMockup() {
  return <Chat
    title="Le bot prépare, tu décides"
    description="Un prospect veut un devis pour vendredi : le bot ouvre un dossier et demande ce qui manque."
    legend="Le bot ne promet jamais vendredi, c'est toi qui décides."
    ariaLabel="Sur Telegram, un prospect demande un devis pour vendredi. Le bot demande la surface et l'adresse sans rien promettre. En coulisse, il ouvre un dossier Notion, liste les manques, prépare un brouillon avec son destinataire et attend que tu valides, corriges ou refuses."
    accent={EM}
    platform="Telegram"
    contact="Nouveau prospect"
    messages={[
      { from: "person", text: "Tu peux me faire un devis pour vendredi ?", time: "09:41" },
      { from: "agent", text: "Je prépare ta demande. Il me manque la surface et l'adresse.", time: "09:42" },
      { from: "person", text: "40 m², à Villeurbanne.", time: "09:44" },
    ]}
    backstageTitle="En coulisse"
    actions={[
      { label: "Dossier ouvert", tool: "Notion" },
      { label: "Manques listés", tool: "Hermes Agent" },
      { label: "Brouillon et destinataire" },
      { label: "Valider, corriger, refuser", humanValidation: true },
    ]}
  />;
}

export function SousLaBulleDeMessageDiagram() {
  return <Steps
    title="Sous la bulle, un vrai dossier"
    description="Le message traverse la messagerie et la passerelle, puis ton agent en fait une fiche suivie."
    legend="Le travail commence quand la fiche existe, pas quand le bot répond."
    ariaLabel="La messagerie Telegram reçoit le message, la passerelle l'attache à la bonne conversation, ton agent lit la demande avec ses règles, puis une fiche Notion garde la personne, la demande, les pièces, les manques et la prochaine décision. La fiche est mise en avant."
    accent={EM}
    items={[
      { label: "Messagerie", detail: "Reçoit le message", tools: ["Telegram"] },
      { label: "Passerelle", detail: "Trouve la bonne conversation" },
      { label: "Ton agent", detail: "Lit avec ses règles", tools: ["Hermes Agent"] },
      { label: "Fiche", detail: "Demande, pièces, manques", tools: ["Notion"] },
    ]}
    accentIndex={3}
  />;
}

export function TroisCanauxMemeValidationMockup() {
  return <Chat
    title="Trois canaux, le même accord"
    description="Sur WhatsApp, tu valides par une réponse claire. Ailleurs, par des boutons ou un fil d'équipe."
    legend="Un message reçu ouvre un travail, il n'autorise pas l'envoi."
    ariaLabel="Sur WhatsApp, ton agent te montre la réponse prête et son destinataire. Tu réponds Valide, envoie ce texte. L'agent confirme l'envoi à ce seul destinataire. En coulisse, Telegram valide par trois boutons, WhatsApp par une réponse claire, Slack par un fil d'équipe, et l'accord porte toujours sur cette action précise."
    accent={EM}
    platform="WhatsApp"
    contact="Ton agent"
    messages={[
      { from: "agent", text: "Réponse prête pour le prospect de ce matin : « Nous pouvons passer jeudi à 9 h. »", time: "10:12" },
      { from: "person", text: "Valide, envoie ce texte.", time: "10:14" },
      { from: "agent", text: "Envoyé à ce seul destinataire.", time: "10:14" },
    ]}
    backstageTitle="Même accord partout"
    actions={[
      { label: "Trois boutons", tool: "Telegram" },
      { label: "Une réponse claire", tool: "WhatsApp" },
      { label: "Un fil d'équipe", tool: "Slack" },
      { label: "Accord sur cette action", humanValidation: true },
    ]}
  />;
}

export function TicketQuatreEtatsDiagram() {
  return <Fork
    title="Le ticket garde son état"
    description="Après une coupure, l'état écrit sur le ticket dit si tu peux reprendre ou si tu attends."
    legend="État inconnu ? Tu bloques la suite et tu demandes une vérification."
    ariaLabel="Après une coupure, quatre états possibles du ticket. Préparé : le brouillon attend ta validation. Validé : relis le service avant d'envoyer. Envoyé : ne recommence jamais. Refusé : la raison reste écrite."
    accent={EM}
    situation="Coupure après un clic"
    outcomes={[
      { label: "Préparé", condition: "Le brouillon attend ton accord" },
      { label: "Validé", condition: "Relis le service avant d'envoyer" },
      { label: "Envoyé", condition: "Ne recommence jamais", rejected: true },
      { label: "Refusé", condition: "La raison reste écrite" },
    ]}
  />;
}
